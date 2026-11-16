import React, { useState, useRef } from 'react';
import { EntryPass, ApprovedDocument } from '../types';
import { processUploadedFile, ProcessedUploadFile } from '../utils/imageCompressor';
import { X, UploadCloud, FileCheck, FileText, Receipt, CheckCircle2, Eye, Loader2 } from 'lucide-react';

interface UploadBillModalProps {
  pass: EntryPass | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveBill: (passId: string, billNumber: string, billDoc: ApprovedDocument) => void;
}

export const UploadBillModal: React.FC<UploadBillModalProps> = ({
  pass,
  isOpen,
  onClose,
  onSaveBill
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [billNumber, setBillNumber] = useState(
    pass?.billNumber || pass?.challanInvoiceNumber || `AMN-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [selectedFile, setSelectedFile] = useState<ProcessedUploadFile | null>(
    pass?.billDocument
      ? {
          fileName: pass.billDocument.fileName,
          fileSize: pass.billDocument.fileSize || 'Attached',
          fileUrl: pass.billDocument.fileUrl,
          fileType: pass.billDocument.fileType || 'image/jpeg',
          isImage: pass.billDocument.fileUrl.startsWith('data:image/') || /\.(jpe?g|png|webp)$/i.test(pass.billDocument.fileName)
        }
      : null
  );
  const [uploadedBy, setUploadedBy] = useState('Amnex Billing & NMDC Materials In-Charge');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  if (!isOpen || !pass) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const processed = await processUploadedFile(file);
      setSelectedFile(processed);
    } catch (err) {
      console.error('Bill upload processing error:', err);
      alert('Failed to process image/bill. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAttachSampleBill = () => {
    const safeBill = billNumber.trim() || 'GST_INV_2025';
    setSelectedFile({
      fileName: `Tax_Invoice_Bill_${safeBill.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      fileSize: '1.4 MB',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileType: 'application/pdf',
      isImage: false
    });
  };

  const handleSave = () => {
    if (!selectedFile) return;

    const billDoc: ApprovedDocument = {
      fileName: selectedFile.fileName,
      fileSize: selectedFile.fileSize,
      fileUrl: selectedFile.fileUrl,
      uploadedAt: new Date().toLocaleString(),
      uploadedBy: uploadedBy.trim() || 'Billing Administrator',
      fileType: selectedFile.fileType || 'application/pdf'
    };

    onSaveBill(pass.id, billNumber.trim(), billDoc);

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Upload Material Bill / Tax Invoice</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pass #{pass.passNumber} • Consignment for {pass.departmentOrProject || 'C&IT'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Consignment Bill / Tax Invoice / DC Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              placeholder="e.g. AMN/INV/2025/089"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Attach Signed Bill / Invoice JPEG or PDF <span className="text-rose-500">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              className="hidden"
            />

            {isProcessing ? (
              <div className="p-8 bg-indigo-50/60 border border-indigo-200 rounded-xl text-center space-y-2">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
                <p className="text-xs font-bold text-indigo-950">Processing & Optimizing Image...</p>
                <p className="text-[11px] text-indigo-700">Optimizing for fast database upload</p>
              </div>
            ) : selectedFile ? (
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedFile.isImage ? (
                    <div 
                      onClick={() => setPreviewOpen(true)}
                      className="relative w-14 h-14 rounded-lg overflow-hidden border border-indigo-300 bg-white cursor-pointer group shrink-0 shadow-2xs"
                      title="Click to preview full image"
                    >
                      <img 
                        src={selectedFile.fileUrl} 
                        alt="Bill Preview" 
                        className="w-full h-full object-cover group-hover:scale-105 transition"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-900 block truncate max-w-[220px]">
                        {selectedFile.fileName}
                      </span>
                      {selectedFile.isImage && (
                        <span className="px-1.5 py-0.2 text-[10px] font-bold bg-indigo-200 text-indigo-800 rounded">
                          JPEG
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      Size: <strong className="text-indigo-800">{selectedFile.fileSize}</strong>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Ready to store in database
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {selectedFile.isImage && (
                    <button
                      type="button"
                      onClick={() => setPreviewOpen(true)}
                      className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold px-2.5 py-1 bg-white rounded-md border border-indigo-200 shadow-2xs hover:bg-indigo-50 transition cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-indigo-50/20"
              >
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Click to upload Bill JPEG or PDF Invoice Scan</p>
                <p className="text-[11px] text-slate-500 mt-1">Supports JPEG, JPG, PNG photos or PDF</p>
              </div>
            )}

            {/* Quick Attach Sample Bill */}
            {!selectedFile && !isProcessing && (
              <div className="mt-2 text-right">
                <button
                  type="button"
                  onClick={handleAttachSampleBill}
                  className="text-xs text-indigo-600 hover:text-indigo-800 underline font-medium cursor-pointer"
                >
                  Attach official NMDC signed GST tax invoice sample
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Authorized Uploader
            </label>
            <input
              type="text"
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden"
            />
          </div>

          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bill document and JPEG uploaded to database successfully!</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            id="btn-confirm-save-bill"
            onClick={handleSave}
            disabled={!selectedFile || !billNumber.trim() || isProcessing}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            <span>Save & Upload to Database</span>
          </button>
        </div>
      </div>

      {/* Lightbox Preview Modal */}
      {previewOpen && selectedFile && selectedFile.isImage && (
        <div 
          className="fixed inset-0 z-60 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setPreviewOpen(false)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-slate-900 rounded-2xl overflow-hidden p-2 border border-slate-700 shadow-2xl flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between text-white p-3 border-b border-slate-800">
              <span className="text-xs font-bold truncate max-w-md">{selectedFile.fileName}</span>
              <button 
                onClick={() => setPreviewOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2 overflow-auto max-h-[75vh] flex items-center justify-center">
              <img 
                src={selectedFile.fileUrl} 
                alt="Bill Document Preview" 
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
