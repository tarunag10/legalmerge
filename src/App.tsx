import { useState, useEffect } from 'react';
import JSZip from 'jszip';

// Types
interface Template {
  id: string;
  name: string;
  originalName: string;
  content: string;
  placeholderNames: string[];
  createdAt: number;
}

interface DataFile {
  id: string;
  name: string;
  rows: Record<string, string>[];
  columns: string[];
  createdAt: number;
}

interface GeneratedDoc {
  fileName: string;
  content: string;
  previewText: string;
}

// Helper functions
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] || result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function downloadBase64(base64: string, fileName: string) {
  const bytes = atob(base64);
  const numbers = new Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) numbers[i] = bytes.charCodeAt(i);
  const array = new Uint8Array(numbers);
  const blob = new Blob([array], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

// Local storage helpers
function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    console.error('Storage save error');
  }
}

function loadFromStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) as T : null;
  } catch {
    return null;
  }
}

export default function App({ onNavigate }: { onNavigate: (page: 'home' | 'guide') => void }) {
  // State
  const [step, setStep] = useState(1);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [dataFiles, setDataFiles] = useState<DataFile[]>([]);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const [dataFileId, setDataFileId] = useState<string | null>(null);
  const [docs, setDocs] = useState<GeneratedDoc[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<{ columns: string[]; rows: Record<string, string>[] } | null>(null);
  const [placeholders, setPlaceholders] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedTemplates = loadFromStorage<Template[]>('legalmerge_templates');
    const savedDataFiles = loadFromStorage<DataFile[]>('legalmerge_datafiles');
    if (savedTemplates) setTemplates(savedTemplates);
    if (savedDataFiles) setDataFiles(savedDataFiles);
  }, []);

  // Save templates to localStorage
  const saveTemplates = (newTemplates: Template[]) => {
    setTemplates(newTemplates);
    saveToStorage('legalmerge_templates', newTemplates);
  };

  // Save data files to localStorage
  const saveDataFiles = (newDataFiles: DataFile[]) => {
    setDataFiles(newDataFiles);
    saveToStorage('legalmerge_datafiles', newDataFiles);
  };

  // Handlers
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setTemplateName(f.name.replace(/\.[^/.]+$/, '')); }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim() || !file) return;
    const base64 = await fileToBase64(file);
    const ph = placeholders.split(',').map(p => p.trim()).filter(p => p);
    const newTemplate: Template = {
      id: generateId(),
      name: templateName,
      originalName: file.name,
      content: base64,
      placeholderNames: ph,
      createdAt: Date.now(),
    };
    saveTemplates([newTemplate, ...templates]);
    setFile(null);
    setTemplateName('');
    setPlaceholders('');
  };

  const handleDeleteTemplate = (id: string) => {
    saveTemplates(templates.filter(t => t.id !== id));
    if (templateId === id) setTemplateId(null);
  };

  const parseCSV = (text: string) => {
    const lines = text.split('\n').filter(l => l.trim());
    if (lines.length < 2) return;
    const delim = lines[0].includes('\t') ? '\t' : ',';
    const cols = lines[0].split(delim).map(c => c.trim().replace(/^["']|["']$/g, ''));
    const rows: Record<string, string>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(delim).map(v => v.trim().replace(/^["']|["']$/g, ''));
      const row: Record<string, string> = {};
      cols.forEach((c, j) => row[c] = vals[j] || '');
      rows.push(row);
    }
    setParsedData({ columns: cols, rows });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => parseCSV(ev.target?.result as string);
    reader.readAsText(f);
  };

  const handleSaveData = () => {
    if (!parsedData?.rows.length) return;
    const newDataFile: DataFile = {
      id: generateId(),
      name: `Data_${Date.now()}`,
      rows: parsedData.rows,
      columns: parsedData.columns,
      createdAt: Date.now(),
    };
    saveDataFiles([newDataFile, ...dataFiles]);
    setParsedData(null);
  };

  const handleDeleteDataFile = (id: string) => {
    saveDataFiles(dataFiles.filter(f => f.id !== id));
    if (dataFileId === id) setDataFileId(null);
  };

  const handleGenerate = () => {
    const template = templates.find(t => t.id === templateId);
    const dataFile = dataFiles.find(f => f.id === dataFileId);
    if (!template || !dataFile) return;

    const generated: GeneratedDoc[] = dataFile.rows.map((row, i) => {
      let content = template.content;

      // Replace placeholders
      for (const [key, value] of Object.entries(row)) {
        const regex = new RegExp(`\\{\\{${key.trim()}\\}\\}`, 'gi');
        content = content.replace(regex, value);
      }

      // Generate filename
      const nameField = Object.keys(row).find(k =>
        k.toLowerCase().includes('name') || k.toLowerCase().includes('client')
      );
      const fileName = nameField && row[nameField]
        ? `${row[nameField].replace(/[^a-zA-Z0-9]/g, '_')}_${i + 1}.docx`
        : `Document_${i + 1}.docx`;

      const previewText = Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(' | ');

      return { fileName, content, previewText };
    });

    setDocs(generated);
    setStep(4);
  };

  const downloadAsZip = async () => {
    setIsDownloading(true);
    try {
      const zip = new JSZip();
      docs.forEach(d => {
        const bytes = atob(d.content);
        const nums = new Array(bytes.length);
        for (let i = 0; i < bytes.length; i++) nums[i] = bytes.charCodeAt(i);
        zip.file(d.fileName, new Uint8Array(nums));
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'documents.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900">LegalMerge</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('guide')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors font-medium"
            >
              How to Use
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="max-w-5xl mx-auto px-6 pt-16 pb-8">
        <h1 className="text-4xl font-semibold text-gray-900 text-center mb-3">
          Generate documents with<br /><span className="text-gray-400">effortless precision</span>
        </h1>
        <p className="text-lg text-gray-500 text-center max-w-2xl mx-auto">
          Transform your Word templates and Excel data into polished, personalized documents in seconds.
        </p>
      </div>

      {/* Progress */}
      <div className="max-w-2xl mx-auto px-6 mb-12">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <button
                onClick={() => {
                  if (s < step || (s === 2 && templateId) || (s === 3 && templateId && dataFileId)) setStep(s);
                }}
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  step === s ? 'bg-gray-900 text-white shadow-xl scale-110' :
                  step > s ? 'bg-gray-200 text-gray-900' : 'bg-gray-100 text-gray-400'
                }`}
              >
                {step > s ? '\u2713' : s}
              </button>
              {s < 4 && <div className={`w-16 h-0.5 mx-2 rounded-full transition-colors ${step > s ? 'bg-gray-900' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-3">
          {['Template', 'Data', 'Generate', 'Download'].map((l, i) => (
            <span key={l} className={`text-xs font-medium ${step === i + 1 ? 'text-gray-900' : 'text-gray-400'}`}>{l}</span>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] p-8 md:p-12">

          {/* Step 1: Template */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Upload your template</h2>
                  <p className="text-gray-500">Start with your Word document</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center transition-all duration-300 hover:border-gray-400 hover:bg-gray-50">
                    <input type="file" accept=".docx" onChange={handleFileSelect} className="hidden" id="docx" />
                    <label htmlFor="docx" className="cursor-pointer">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-700">{file ? file.name : 'Click to upload'}</p>
                      <p className="text-sm text-gray-400 mt-1">.docx files supported</p>
                    </label>
                  </div>

                  {file && (
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4 animate-slideUp">
                      <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="Template name"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all"
                      />
                      <input
                        type="text"
                        value={placeholders}
                        onChange={(e) => setPlaceholders(e.target.value)}
                        placeholder="Placeholders: name, address, date"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900/20 focus:border-gray-900 transition-all"
                      />
                      <p className="text-xs text-gray-400">Use {'{{placeholder}}'} in your document</p>
                      <button
                        onClick={handleSaveTemplate}
                        disabled={!templateName.trim()}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        Save Template
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Saved Templates</h3>
                  {templates.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No templates yet</p>
                      <p className="text-sm mt-1">Upload your first template</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {templates.map((t) => (
                        <div
                          key={t.id}
                          onClick={() => setTemplateId(t.id)}
                          className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                            templateId === t.id ? 'bg-gray-900 text-white shadow-xl' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{t.name}</p>
                              <p className={`text-sm ${templateId === t.id ? 'text-gray-400' : 'text-gray-500'}`}>
                                {t.placeholderNames.join(', ') || 'No placeholders'}
                              </p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteTemplate(t.id); }}
                              className={`text-sm ${templateId === t.id ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-red-500'}`}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {templateId && (
                <button
                  onClick={() => setStep(2)}
                  className="mt-8 w-full py-4 bg-gray-900 text-white rounded-2xl font-medium hover:bg-gray-800 transition-all hover:scale-[1.01] shadow-lg"
                >
                  Continue
                </button>
              )}
            </div>
          )}

          {/* Step 2: Data */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Add your data</h2>
                  <p className="text-gray-500">Upload CSV or Excel data</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center transition-all duration-300 hover:border-gray-400 hover:bg-gray-50">
                    <input type="file" accept=".csv,.tsv,.txt" onChange={handleFileUpload} className="hidden" id="csv" />
                    <label htmlFor="csv" className="cursor-pointer">
                      <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <p className="font-medium text-gray-700">Upload CSV/TSV</p>
                      <p className="text-sm text-gray-400 mt-1">or paste data below</p>
                    </label>
                  </div>

                  {parsedData && (
                    <div className="bg-gray-50 rounded-2xl p-6 animate-slideUp">
                      <p className="font-medium text-gray-700 mb-3">{parsedData.rows.length} rows &bull; {parsedData.columns.length} columns</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {parsedData.columns.map((c, i) => (
                          <span key={i} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-600">{c}</span>
                        ))}
                      </div>
                      <button
                        onClick={handleSaveData}
                        className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all"
                      >
                        Save Data
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Saved Data Files</h3>
                  {dataFiles.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 bg-gray-50 rounded-2xl">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p>No data files yet</p>
                      <p className="text-sm mt-1">Upload your first data file</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {dataFiles.map((f) => (
                        <div
                          key={f.id}
                          onClick={() => setDataFileId(f.id)}
                          className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                            dataFileId === f.id ? 'bg-gray-900 text-white shadow-xl' : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{f.name}</p>
                              <p className={`text-sm ${dataFileId === f.id ? 'text-gray-400' : 'text-gray-500'}`}>
                                {f.rows.length} rows &bull; {f.columns.slice(0, 3).join(', ')}{f.columns.length > 3 ? '...' : ''}
                              </p>
                            </div>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleDeleteDataFile(f.id); }}
                              className={`text-sm ${dataFileId === f.id ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-red-500'}`}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!dataFileId}
                  className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] shadow-lg"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Generate */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Review & Generate</h2>
                  <p className="text-gray-500">Almost ready</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Template</p>
                    <p className="font-semibold text-gray-900">{templates.find(t => t.id === templateId)?.name}</p>
                  </div>
                  <div className="bg-white rounded-xl p-4">
                    <p className="text-sm text-gray-500 mb-1">Data Source</p>
                    <p className="font-semibold text-gray-900">{dataFiles.find(f => f.id === dataFileId)?.name}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                <p className="text-amber-800 text-sm">Make sure your CSV columns match the placeholders in your template</p>
              </div>

              <button
                onClick={handleGenerate}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-medium hover:bg-gray-800 transition-all hover:scale-[1.01] shadow-lg flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate {dataFiles.find(f => f.id === dataFileId)?.rows.length || 0} Documents
              </button>
            </div>
          )}

          {/* Step 4: Results */}
          {step === 4 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">Your documents</h2>
                  <p className="text-gray-500">{docs.length} ready to download</p>
                </div>
              </div>

              <div className="flex gap-3 mb-6">
                <button
                  onClick={downloadAsZip}
                  disabled={isDownloading}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  {isDownloading ? 'Creating ZIP...' : 'Download All (.zip)'}
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {docs.map((d, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                        <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{d.fileName}</p>
                        <p className="text-xs text-gray-500 truncate max-w-xs">{d.previewText}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => downloadBase64(d.content, d.fileName)}
                      className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                    >
                      .docx
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => { setStep(1); setTemplateId(null); setDataFileId(null); setDocs([]); }}
                className="mt-8 w-full py-4 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-all"
              >
                Start Over
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        <p>LegalMerge &bull; 100% Client-Side &bull; Your Data Never Leaves Your Browser</p>
        <p className="mt-2 text-gray-300">Created by Tarun Agarwal</p>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
      `}</style>
    </div>
  );
}
