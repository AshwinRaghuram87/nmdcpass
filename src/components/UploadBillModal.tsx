import React, { useState, useRef } from 'react';
import { EntryPass, ApprovedDocument } from '../types';
import { X, UploadCloud, FileCheck, FileText, Receipt, CheckCircle2 } from 'lucide-react';

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
  if (!isOpen || !pass) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [billNumber, setBillNumber] = useState(
    pass.billNumber || pass.challanInvoiceNumber || `AMN-INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [selectedFile, setSelectedFile] = useState<{
    fileName: string;
    fileSize: string;
    fileUrl: string;
  } | null>(pass.billDocument ? {
    fileName: pass.billDocument.fileName,
    fileSize: pass.billDocument.fileSize || 'Attached',
    fileUrl: pass.billDocument.fileUrl
  } : null);
  const [uploadedBy, setUploadedBy] = useState('Amnex Billing & NMDC Materials In-Charge');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      setSelectedFile({
        fileName: file.name,
        fileSize: sizeStr,
        fileUrl: uploadEvt.target?.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAttachSampleBill = () => {
    const safeBill = billNumber.trim() || 'GST_INV_2025';
    setSelectedFile({
      fileName: `Tax_Invoice_Bill_${safeBill.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`,
      fileSize: '1.4 MB',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
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
      fileType: 'application/pdf'
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
              <h3 className="font-bold text-base text-white">
                Upload Material Bill & Tax Invoice
              </h3>
              <p className="text-xs text-slate-400">
                Gate Pass: <span className="text-indigo-400 font-mono font-semibold">{pass.passNumber}</span>
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

        {/* Form Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Bill / Tax Invoice / Delivery Challan Number <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              placeholder="e.g., AMN-GST-INV-2025-0891 or DC-889"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 font-mono font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Reflects in BOQ reconciliation and NMDC Stores Acceptance.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Uploaded By Authority
            </label>
            <input
              type="text"
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
              placeholder="e.g. Amnex Billing & NMDC Materials In-Charge"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* File Upload Zone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Attach Signed Bill / Invoice Document <span className="text-rose-500">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              className="hidden"
            />

            {selectedFile ? (
              <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-slate-900 block truncate max-w-[260px]">
                      {selectedFile.fileName}
                    </span>
                    <span className="text-xs text-slate-500">
                      Size: {selectedFile.fileSize}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-indigo-700 hover:text-indigo-900 font-semibold px-2.5 py-1 bg-white rounded-md border border-indigo-200 shadow-2xs hover:bg-indigo-50 transition cursor-pointer"
                >
                  Change
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-6 text-center cursor-pointer transition bg-slate-50/50 hover:bg-indigo-50/20"
              >
                <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Click to upload Bill PDF or Invoice Scan</p>
                <p className="text-[11px] text-slate-500 mt-1">Supports PDF, PNG, JPG up to 25MB</p>
              </div>
            )}

            {/* Quick Attach Sample Bill */}
            {!selectedFile && (
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

          {isSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Bill document attached and linked successfully!</span>
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
            disabled={!selectedFile || !billNumber.trim()}
            className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <FileCheck className="w-4 h-4" />
            <span>Save & Link Bill</span>
          </button>
        </div>
      </div>
    </div>
  );
};
