import React, { useState, useRef } from 'react';
import { EntryPass } from '../types';
import { X, UploadCloud, FileCheck, FileText, Download, CheckCircle2 } from 'lucide-react';

interface UploadDocModalProps {
  pass: EntryPass | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveDoc: (passId: string, doc: {
    fileName: string;
    fileSize: string;
    fileUrl: string;
    uploadedAt: string;
    uploadedBy: string;
  }) => void;
}

export const UploadDocModal: React.FC<UploadDocModalProps> = ({
  pass,
  isOpen,
  onClose,
  onSaveDoc
}) => {
  if (!isOpen || !pass) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<{
    fileName: string;
    fileSize: string;
    fileUrl: string;
  } | null>(null);
  const [uploadedBy, setUploadedBy] = useState('CISF Gate Security In-Charge');
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

  const handleAttachOfficialDoc = () => {
    // Generate an official sample approved pass document data URL
    const simulatedDocName = `Approved_CISF_Pass_${pass.passNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    setSelectedFile({
      fileName: simulatedDocName,
      fileSize: '1.2 MB',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    });
  };

  const handleSave = () => {
    if (!selectedFile) return;

    onSaveDoc(pass.id, {
      fileName: selectedFile.fileName,
      fileSize: selectedFile.fileSize,
      fileUrl: selectedFile.fileUrl,
      uploadedAt: new Date().toLocaleString(),
      uploadedBy: uploadedBy.trim() || 'NMDC Security Cell'
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-blue-400" />
              <span>Upload Approved Pass Document</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pass #{pass.passNumber} • {pass.passHolderName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            Upload the approved pass document signed and stamped by NMDC Ltd / CISF Security Unit. Staff and security personnel can download it using the direct link.
          </p>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
            className="hidden"
          />

          {selectedFile ? (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block truncate max-w-[200px]">
                      {selectedFile.fileName}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Size: {selectedFile.fileSize}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl p-6 text-center bg-slate-50 hover:bg-white transition cursor-pointer"
              >
                <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">
                  Click to browse and upload approved pass file
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Accepts PDF, scanned image (JPG, PNG) or Word document
                </p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleAttachOfficialDoc}
                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                >
                  Or attach pre-formatted NMDC-CISF signed pass document copy
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Approving Authority / Officer Name
            </label>
            <input
              type="text"
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
              placeholder="e.g. CISF Gate Duty Officer / NMDC Security"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Link will be active immediately
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!selectedFile}
              onClick={handleSave}
              className="inline-flex items-center gap-1 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Uploaded!</span>
                </>
              ) : (
                <span>Save & Activate Link</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
