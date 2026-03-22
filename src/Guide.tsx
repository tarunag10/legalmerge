export default function Guide({ onNavigate }: { onNavigate: (page: 'home' | 'guide') => void }) {
  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-gray-900">LegalMerge</span>
          </button>
          <button
            onClick={() => onNavigate('home')}
            className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-all"
          >
            Open App
          </button>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-10">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-3">Documentation</p>
        <h1 className="text-4xl font-semibold text-gray-900 mb-4">How to Use LegalMerge</h1>
        <p className="text-lg text-gray-500 max-w-2xl">
          A complete guide to generating personalized documents from your Word templates and spreadsheet data.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20 space-y-8">

        {/* Overview Card */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] p-8 md:p-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What is LegalMerge?</h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            LegalMerge is a <strong>mail merge tool</strong> that runs entirely in your browser. It takes a
            Word document template with placeholders and a CSV/spreadsheet with data, then generates
            one personalized document per row of data. Perfect for:
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ['Client letters & notices', 'Generate personalized letters for each client from a single template.'],
              ['Legal filings & contracts', 'Fill in party names, dates, and case numbers automatically.'],
              ['Invoices & statements', 'Create per-client invoices from a spreadsheet of billing data.'],
              ['Certificates & awards', 'Produce named certificates from a participant list.'],
            ].map(([title, desc]) => (
              <div key={title} className="bg-gray-50 rounded-2xl p-4">
                <p className="font-medium text-gray-900 text-sm">{title}</p>
                <p className="text-gray-500 text-sm mt-1">{desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <p className="text-emerald-800 text-sm">
              <strong>Privacy first:</strong> Your files never leave your computer. All processing happens locally in your browser using localStorage. Nothing is uploaded to any server.
            </p>
          </div>
        </div>

        {/* The 4-Step Process */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] p-8 md:p-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">The 4-Step Process</h2>
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { step: '1', label: 'Upload Template', desc: 'Upload your .docx file with placeholders' },
              { step: '2', label: 'Add Data', desc: 'Upload a CSV or TSV file with your data' },
              { step: '3', label: 'Generate', desc: 'Review your selections and generate documents' },
              { step: '4', label: 'Download', desc: 'Download individually or as a ZIP bundle' },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-lg font-semibold mx-auto mb-3">
                  {s.step}
                </div>
                <p className="font-medium text-gray-900 text-sm">{s.label}</p>
                <p className="text-gray-500 text-xs mt-1">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Step 1: Preparing Your Template */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-sm font-semibold">1</div>
            <h2 className="text-xl font-semibold text-gray-900">Step 1: Prepare Your Template</h2>
          </div>

          <h3 className="font-semibold text-gray-900 mb-3">What are placeholders?</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Placeholders are special markers in your Word document that get replaced with actual data.
            They use the double curly brace format:
          </p>

          <div className="bg-gray-950 rounded-2xl p-5 mb-6 font-mono text-sm">
            <p className="text-gray-400 mb-2">{'//'} In your .docx file, write placeholders like:</p>
            <p className="text-white">Dear <span className="text-amber-400">{'{{ClientName}}'}</span>,</p>
            <p className="text-white mt-1">Re: Case No. <span className="text-amber-400">{'{{CaseNumber}}'}</span></p>
            <p className="text-white mt-1">Date: <span className="text-amber-400">{'{{Date}}'}</span></p>
            <p className="text-white mt-3">This letter confirms that <span className="text-amber-400">{'{{ClientName}}'}</span> of</p>
            <p className="text-white"><span className="text-amber-400">{'{{Address}}'}</span> has retained our services regarding</p>
            <p className="text-white">the matter of <span className="text-amber-400">{'{{Subject}}'}</span>.</p>
          </div>

          <h3 className="font-semibold text-gray-900 mb-3">Placeholder rules</h3>
          <div className="space-y-2 mb-6">
            {[
              ['Must match exactly', 'The placeholder name in your template must match the column header in your CSV exactly (case-insensitive).'],
              ['Double curly braces', 'Always wrap placeholders in {{ and }}. Single braces will not work.'],
              ['Spaces are OK', '{{Client Name}} works fine — matching is done on the full text between the braces.'],
              ['Reuse freely', 'You can use the same placeholder multiple times in one document (e.g., {{ClientName}} in the header and body).'],
            ].map(([title, desc]) => (
              <div key={title} className="flex gap-3 items-start">
                <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-500 text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-gray-900 mb-3">Uploading your template</h3>
          <ol className="space-y-2 text-gray-600 text-sm list-decimal list-inside">
            <li>Click the upload area or drag your <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">.docx</code> file onto it.</li>
            <li>Give your template a name (auto-filled from the filename).</li>
            <li>Optionally list your placeholder names (comma-separated) for reference, e.g. <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800">ClientName, CaseNumber, Date</code></li>
            <li>Click <strong>"Save Template"</strong>. Your template is stored locally in your browser.</li>
            <li>Select the template by clicking on it, then click <strong>"Continue"</strong>.</li>
          </ol>

          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-amber-800 text-sm">
              <strong>Tip:</strong> Only <code className="bg-amber-100 px-1 rounded">.docx</code> files are supported (not <code className="bg-amber-100 px-1 rounded">.doc</code> or PDF). If your template is in another format, save it as .docx from Word first.
            </p>
          </div>
        </div>

        {/* Step 2: Preparing Your Data */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-sm font-semibold">2</div>
            <h2 className="text-xl font-semibold text-gray-900">Step 2: Prepare Your Data</h2>
          </div>

          <h3 className="font-semibold text-gray-900 mb-3">Required format</h3>
          <p className="text-gray-600 leading-relaxed mb-4">
            Your data file should be a <strong>CSV</strong> (comma-separated) or <strong>TSV</strong> (tab-separated) file.
            The first row must be column headers that match your template placeholders.
          </p>

          <h3 className="font-semibold text-gray-900 mb-3">Example: matching template to data</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Template placeholders</p>
              <div className="bg-gray-950 rounded-xl p-4 font-mono text-sm space-y-1">
                <p className="text-amber-400">{'{{ClientName}}'}</p>
                <p className="text-amber-400">{'{{CaseNumber}}'}</p>
                <p className="text-amber-400">{'{{Date}}'}</p>
                <p className="text-amber-400">{'{{Address}}'}</p>
                <p className="text-amber-400">{'{{Subject}}'}</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">CSV column headers (must match)</p>
              <div className="bg-gray-950 rounded-xl p-4 font-mono text-sm space-y-1">
                <p className="text-emerald-400">ClientName</p>
                <p className="text-emerald-400">CaseNumber</p>
                <p className="text-emerald-400">Date</p>
                <p className="text-emerald-400">Address</p>
                <p className="text-emerald-400">Subject</p>
              </div>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-3">Sample CSV file</h3>
          <div className="bg-gray-950 rounded-2xl p-5 font-mono text-sm overflow-x-auto mb-6">
            <table className="text-white">
              <thead>
                <tr className="text-emerald-400">
                  <td className="pr-4">ClientName</td>
                  <td className="pr-4">,</td>
                  <td className="pr-4">CaseNumber</td>
                  <td className="pr-4">,</td>
                  <td className="pr-4">Date</td>
                  <td className="pr-4">,</td>
                  <td className="pr-4">Address</td>
                  <td className="pr-4">,</td>
                  <td>Subject</td>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr>
                  <td className="pr-4">John Doe</td>
                  <td className="pr-4">,</td>
                  <td className="pr-4">2024-001</td>
                  <td className="pr-4">,</td>
                  <td className="pr-4">March 15 2024</td>
                  <td className="pr-4">,</td>
                  <td className="pr-4">123 Main St</td>
                  <td className="pr-4">,</td>
                  <td>Property Dispute</td>
                </tr>
                <tr>
                  <td className="pr-4">Jane Smith</td>
                  <td className="pr-4">,</td>
                  <td className="pr-4">2024-002</td>
                  <td className="pr-4">,</td>
                  <td className="pr-4">March 20 2024</td>
                  <td className="pr-4">,</td>
                  <td className="pr-4">456 Oak Ave</td>
                  <td className="pr-4">,</td>
                  <td>Contract Review</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="font-semibold text-gray-900 mb-3">How to export CSV from Excel or Google Sheets</h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="font-medium text-gray-900 text-sm mb-2">Microsoft Excel</p>
              <ol className="text-gray-600 text-sm space-y-1 list-decimal list-inside">
                <li>Open your spreadsheet</li>
                <li>File &rarr; Save As</li>
                <li>Choose format: <strong>CSV (Comma delimited)</strong></li>
                <li>Click Save</li>
              </ol>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="font-medium text-gray-900 text-sm mb-2">Google Sheets</p>
              <ol className="text-gray-600 text-sm space-y-1 list-decimal list-inside">
                <li>Open your spreadsheet</li>
                <li>File &rarr; Download</li>
                <li>Select <strong>Comma Separated Values (.csv)</strong></li>
                <li>File downloads automatically</li>
              </ol>
            </div>
          </div>

          <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <p className="text-amber-800 text-sm">
              <strong>Tip:</strong> Make sure your CSV has no extra blank rows at the bottom. Each non-empty row after the header will generate one document.
            </p>
          </div>
        </div>

        {/* Step 3: Generate */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-sm font-semibold">3</div>
            <h2 className="text-xl font-semibold text-gray-900">Step 3: Review & Generate</h2>
          </div>

          <p className="text-gray-600 leading-relaxed mb-4">
            Before generating, the app shows you a summary of your selections:
          </p>
          <ul className="space-y-2 text-gray-600 text-sm mb-6">
            <li className="flex gap-2">
              <span className="text-gray-400">&bull;</span>
              <span>The <strong>template name</strong> you selected in Step 1</span>
            </li>
            <li className="flex gap-2">
              <span className="text-gray-400">&bull;</span>
              <span>The <strong>data source name</strong> and how many rows (= documents) it will produce</span>
            </li>
          </ul>
          <p className="text-gray-600 text-sm mb-4">
            Click <strong>"Generate N Documents"</strong> to start. The process is instant since everything runs locally.
          </p>

          <h3 className="font-semibold text-gray-900 mb-3">How the merge works</h3>
          <div className="bg-gray-50 rounded-2xl p-5 space-y-3 text-sm text-gray-600">
            <p>For each row in your data file, LegalMerge:</p>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Takes a copy of your template</li>
              <li>Finds every <code className="bg-white px-1.5 py-0.5 rounded text-gray-800 border border-gray-200">{'{{Placeholder}}'}</code> in the document</li>
              <li>Replaces it with the matching column value from that row</li>
              <li>Names the output file based on the "Name" or "Client" column (or falls back to <code className="bg-white px-1.5 py-0.5 rounded text-gray-800 border border-gray-200">Document_1.docx</code>)</li>
            </ol>
          </div>
        </div>

        {/* Step 4: Download */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gray-900 text-white rounded-2xl flex items-center justify-center text-sm font-semibold">4</div>
            <h2 className="text-xl font-semibold text-gray-900">Step 4: Download Your Documents</h2>
          </div>

          <p className="text-gray-600 leading-relaxed mb-4">
            After generation, you'll see a list of all created documents. You have two download options:
          </p>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="font-medium text-gray-900 text-sm mb-2">Download All (.zip)</p>
              <p className="text-gray-500 text-sm">
                Bundles every generated document into a single ZIP file. Best for large batches.
              </p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-5">
              <p className="font-medium text-gray-900 text-sm mb-2">Individual .docx</p>
              <p className="text-gray-500 text-sm">
                Click the ".docx" button next to any document to download it individually.
              </p>
            </div>
          </div>

          <h3 className="font-semibold text-gray-900 mb-3">File naming</h3>
          <p className="text-gray-600 text-sm mb-2">
            LegalMerge automatically names your output files using these rules:
          </p>
          <div className="bg-gray-950 rounded-2xl p-5 font-mono text-sm space-y-1 mb-4">
            <p className="text-gray-400">{'//'} If your data has a "Name" or "Client" column:</p>
            <p className="text-white">John_Doe_1.docx</p>
            <p className="text-white">Jane_Smith_2.docx</p>
            <p className="text-white">Acme_Corp_3.docx</p>
            <p className="text-gray-400 mt-3">{'//'} If no name/client column is found:</p>
            <p className="text-white">Document_1.docx</p>
            <p className="text-white">Document_2.docx</p>
          </div>
        </div>

        {/* Full Example Walkthrough */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] p-8 md:p-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Complete Example: Client Engagement Letters</h2>

          <div className="space-y-6">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">1. Template (engagement_letter.docx)</p>
              <div className="bg-gray-950 rounded-2xl p-5 font-mono text-sm text-white leading-relaxed">
                <p>[Your Firm Name]</p>
                <p>[Your Firm Address]</p>
                <p className="mt-2"><span className="text-amber-400">{'{{Date}}'}</span></p>
                <p className="mt-2"><span className="text-amber-400">{'{{ClientName}}'}</span></p>
                <p><span className="text-amber-400">{'{{Address}}'}</span></p>
                <p className="mt-2">Dear <span className="text-amber-400">{'{{ClientName}}'}</span>,</p>
                <p className="mt-2">RE: <span className="text-amber-400">{'{{Subject}}'}</span> (Case No. <span className="text-amber-400">{'{{CaseNumber}}'}</span>)</p>
                <p className="mt-2">We are pleased to confirm that our firm has been retained to</p>
                <p>represent you in the above-referenced matter. Our retainer</p>
                <p>fee is <span className="text-amber-400">{'{{RetainerAmount}}'}</span>.</p>
                <p className="mt-2">Please do not hesitate to contact us.</p>
                <p className="mt-2">Sincerely,</p>
                <p>[Attorney Name]</p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">2. Data file (clients.csv)</p>
              <div className="bg-gray-950 rounded-2xl p-5 font-mono text-xs overflow-x-auto">
                <table className="text-white whitespace-nowrap">
                  <thead><tr className="text-emerald-400">
                    <td className="pr-3">ClientName</td><td className="pr-3">,</td>
                    <td className="pr-3">CaseNumber</td><td className="pr-3">,</td>
                    <td className="pr-3">Date</td><td className="pr-3">,</td>
                    <td className="pr-3">Address</td><td className="pr-3">,</td>
                    <td className="pr-3">Subject</td><td className="pr-3">,</td>
                    <td>RetainerAmount</td>
                  </tr></thead>
                  <tbody className="text-gray-300">
                    <tr>
                      <td className="pr-3">John Doe</td><td className="pr-3">,</td>
                      <td className="pr-3">2024-001</td><td className="pr-3">,</td>
                      <td className="pr-3">March 15 2024</td><td className="pr-3">,</td>
                      <td className="pr-3">123 Main St</td><td className="pr-3">,</td>
                      <td className="pr-3">Property Dispute</td><td className="pr-3">,</td>
                      <td>$5,000</td>
                    </tr>
                    <tr>
                      <td className="pr-3">Jane Smith</td><td className="pr-3">,</td>
                      <td className="pr-3">2024-002</td><td className="pr-3">,</td>
                      <td className="pr-3">March 20 2024</td><td className="pr-3">,</td>
                      <td className="pr-3">456 Oak Ave</td><td className="pr-3">,</td>
                      <td className="pr-3">Contract Review</td><td className="pr-3">,</td>
                      <td>$3,500</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">3. Generated output: John_Doe_1.docx</p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-sm text-emerald-900 leading-relaxed">
                <p>[Your Firm Name]</p>
                <p>[Your Firm Address]</p>
                <p className="mt-2"><strong>March 15 2024</strong></p>
                <p className="mt-2"><strong>John Doe</strong></p>
                <p><strong>123 Main St</strong></p>
                <p className="mt-2">Dear <strong>John Doe</strong>,</p>
                <p className="mt-2">RE: <strong>Property Dispute</strong> (Case No. <strong>2024-001</strong>)</p>
                <p className="mt-2">We are pleased to confirm that our firm has been retained to represent you in the above-referenced matter. Our retainer fee is <strong>$5,000</strong>.</p>
                <p className="mt-2">Please do not hesitate to contact us.</p>
                <p className="mt-2">Sincerely,</p>
                <p>[Attorney Name]</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] p-8 md:p-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-5">
            {[
              {
                q: 'Is my data secure?',
                a: 'Yes. LegalMerge runs 100% in your browser. Your files are processed locally and stored in your browser\'s localStorage. Nothing is ever sent to a server.',
              },
              {
                q: 'What file formats are supported?',
                a: 'Templates must be .docx (Microsoft Word) files. Data files can be .csv (comma-separated) or .tsv (tab-separated) text files.',
              },
              {
                q: 'What happens if a placeholder has no matching column?',
                a: 'Unmatched placeholders (e.g., {{MissingField}}) will remain as-is in the generated document. Double-check that your CSV headers match your template placeholders.',
              },
              {
                q: 'Is there a limit on how many documents I can generate?',
                a: 'There\'s no hard limit. However, very large data files (thousands of rows) may take longer since everything runs in your browser. For best results, keep batches under 500 rows.',
              },
              {
                q: 'Can I use this with .doc files or PDFs?',
                a: 'Not directly. You\'ll need to convert them to .docx first. In Microsoft Word, open the file and use File > Save As > .docx format.',
              },
              {
                q: 'Will my saved templates persist?',
                a: 'Templates and data files are saved in your browser\'s localStorage. They persist across sessions on the same browser. Clearing your browser data will remove them.',
              },
            ].map(({ q, a }) => (
              <div key={q} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                <p className="font-medium text-gray-900 text-sm">{q}</p>
                <p className="text-gray-500 text-sm mt-1">{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <button
            onClick={() => { onNavigate('home'); window.scrollTo(0, 0); }}
            className="px-8 py-4 bg-gray-900 text-white rounded-2xl font-medium hover:bg-gray-800 transition-all hover:scale-[1.01] shadow-lg"
          >
            Start Using LegalMerge
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-400 text-sm">
        <p>LegalMerge &bull; 100% Client-Side &bull; Your Data Never Leaves Your Browser</p>
        <p className="mt-2 text-gray-300">Created by Tarun Agarwal</p>
      </footer>
    </div>
  );
}
