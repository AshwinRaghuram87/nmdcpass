import React, { useState, useRef } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  FileCheck
} from 'lucide-react';
import { parseExcelOrCsv, downloadSampleTemplate, ParsedRowResult } from '../utils/excelHelper';
import { EntryPass } from '../types';

interface ExcelUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportPasses: (passes: EntryPass[]) => void;
}

export const ExcelUploadModal: React.FC<ExcelUploadModalProps> = ({
  isOpen,
  onClose,
  onImportPasses
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [parsedRows, setParsedRows] = useState<ParsedRowResult[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileProcess = async (file: File) => {
    setSelectedFile(file);
    setIsLoading(true);
    setErrorMessage(null);
    setParsedRows([]);

    try {
      const results = await parseExcelOrCsv(file);
      setParsedRows(results);
      if (results.length === 0) {
        setErrorMessage('The uploaded Excel file contained no valid data rows.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to parse Excel file. Please ensure it has valid columns.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const validRows = parsedRows.filter(r => r.isValid);
  const invalidRows = parsedRows.filter(r => !r.isValid);

  const handleConfirmImport = () => {
    if (validRows.length === 0) return;
    const passesToImport: EntryPass[] = validRows.map(r => r.pass as EntryPass);
    onImportPasses(passesToImport);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Upload Entry Passes via Excel (.xlsx / .csv)
              </h2>
              <p className="text-xs text-slate-400">
                Bulk register Employee, Contractor, Vehicle & Material passes for Amnex at NMDC Ltd
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Instructions and Template Download */}
          <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-emerald-900">
                Official Excel Template Available
              </h4>
              <p className="text-[11px] text-emerald-700 mt-0.5 max-w-md">
                Download the standardized sheet with pre-configured headers for Pass Number, Pass Type, Pass Holder, List of Employees, Validity, and Returnable/Non-Returnable materials.
              </p>
            </div>

            <button
              onClick={downloadSampleTemplate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold shadow-xs transition cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Upload Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${
              isDragOver
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".xlsx,.xls,.csv"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {selectedFile ? selectedFile.name : 'Click to select or drag & drop Excel/CSV file here'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports Microsoft Excel (.xlsx, .xls) and Comma-Separated Values (.csv)
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="py-6 text-center text-xs text-slate-500">
              <div className="inline-block w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mb-2" />
              <p>Analyzing spreadsheet columns and validating pass records...</p>
            </div>
          )}

          {/* Parsed Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Spreadsheet Preview ({parsedRows.length} Rows Detected)
                </h4>
                <div className="flex items-center gap-2 text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {validRows.length} Ready to Import
                  </span>
                  {invalidRows.length > 0 && (
                    <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {invalidRows.length} With Issues
                    </span>
                  )}
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-56">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                    <tr>
                      <th className="py-2 px-3">Row</th>
                      <th className="py-2 px-3">Pass No.</th>
                      <th className="py-2 px-3">Type</th>
                      <th className="py-2 px-3">Pass Holder</th>
                      <th className="py-2 px-3">Employees</th>
                      <th className="py-2 px-3">Validity</th>
                      <th className="py-2 px-3">Category/Item</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {parsedRows.map((r) => (
                      <tr key={r.rowNumber} className={r.isValid ? 'hover:bg-slate-50/50' : 'bg-rose-50/40'}>
                        <td className="py-2 px-3 font-mono text-slate-400">{r.rowNumber}</td>
                        <td className="py-2 px-3 font-mono font-bold text-slate-900">{r.pass.passNumber}</td>
                        <td className="py-2 px-3">{r.pass.passType}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{r.pass.passHolderName}</td>
                        <td className="py-2 px-3 text-slate-600">
                          {r.pass.employees?.length || 0} person(s)
                        </td>
                        <td className="py-2 px-3 text-slate-600 whitespace-nowrap">
                          {r.pass.validFrom} to {r.pass.validTo}
                        </td>
                        <td className="py-2 px-3">
                          {r.pass.passType === 'Materials' ? (
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              r.pass.materialCategory === 'Returnable'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {r.pass.materialCategory}
                            </span>
                          ) : r.pass.vehicleNumber ? (
                            <span className="font-mono text-[11px] text-slate-800">{r.pass.vehicleNumber}</span>
                          ) : (
                            <span className="text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-2 px-3">
                          {r.isValid ? (
                            <span className="text-emerald-600 font-semibold text-[11px]">Valid</span>
                          ) : (
                            <span className="text-rose-600 text-[10px] font-medium" title={r.errors.join(', ')}>
                              {r.errors[0]}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {validRows.length > 0 ? `${validRows.length} valid passes will be added to the live register.` : ''}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={validRows.length === 0}
              onClick={handleConfirmImport}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
            >
              Import {validRows.length} Passes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
