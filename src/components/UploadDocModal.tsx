import React, { useState, useRef, useEffect } from 'react';
import { EntryPass } from '../types';
import { processUploadedFile, ProcessedUploadFile } from '../utils/imageCompressor';
import { isGoogleDriveDoc, validateGoogleDriveLink } from '../utils/passUtils';
import {
  X,
  UploadCloud,
  FileText,
  CheckCircle2,
  Eye,
  Loader2,
  Link2,
  ExternalLink,
  AlertCircle
} from 'lucide-react';

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
    fileType?: string;
  }) => void;
}

type UploadMode = 'file' | 'drive';

export const UploadDocModal: React.FC<UploadDocModalProps> = ({
  pass,
  isOpen,
  onClose,
  onSaveDoc
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadMode, setUploadMode] = useState<UploadMode>('file');
  const [selectedFile, setSelectedFile] = useState<ProcessedUploadFile | null>(null);
  const [driveLinkInput, setDriveLinkInput] = useState('');
  const [driveDocTitle, setDriveDocTitle] = useState('');
  const [driveError, setDriveError] = useState<string | null>(null);
  const [uploadedBy, setUploadedBy] = useState('CISF Gate Security In-Charge');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  useEffect(() => {
    if (isOpen && pass) {
      const existing = pass.approvedDocument;
      if (existing && isGoogleDriveDoc(existing.fileUrl, existing.fileType)) {
        setUploadMode('drive');
        setDriveLinkInput(existing.fileUrl);
        setDriveDocTitle(existing.fileName || '');
        setSelectedFile(null);
      } else {
        setUploadMode('file');
        setDriveLinkInput('');
        setDriveDocTitle('');
        setSelectedFile(null);
      }
      setDriveError(null);
      setIsSuccess(false);
    }
  }, [isOpen, pass]);

  if (!isOpen || !pass) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      const processed = await processUploadedFile(file);
      setSelectedFile(processed);
    } catch (err) {
      console.error('File processing error:', err);
      alert('Failed to process image/document. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAttachOfficialDoc = () => {
    const simulatedDocName = `Approved_CISF_Pass_${pass.passNumber.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
    setSelectedFile({
      fileName: simulatedDocName,
      fileSize: '1.2 MB',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      fileType: 'application/pdf',
      isImage: false
    });
  };

  const driveValidation = driveLinkInput.trim()
    ? validateGoogleDriveLink(driveLinkInput)
    : null;

  const canSave =
    uploadMode === 'file'
      ? !!selectedFile && !isProcessing
      : !!driveValidation?.valid;

  const handleSave = () => {
    if (uploadMode === 'file') {
      if (!selectedFile) return;

      onSaveDoc(pass.id, {
        fileName: selectedFile.fileName,
        fileSize: selectedFile.fileSize,
        fileUrl: selectedFile.fileUrl,
        uploadedAt: new Date().toLocaleString(),
        uploadedBy: uploadedBy.trim() || 'NMDC Security Cell',
        fileType: selectedFile.fileType
      });
    } else {
      const result = validateGoogleDriveLink(driveLinkInput);
      if (!result.valid) {
        setDriveError(result.error || 'Invalid Google Drive link.');
        return;
      }

      const defaultTitle = `Scanned_Pass_${pass.passNumber.replace(/[^a-zA-Z0-9]/g, '_')}_Drive`;
      onSaveDoc(pass.id, {
        fileName: driveDocTitle.trim() || defaultTitle,
        fileSize: result.isGoogleDrive ? 'Google Drive' : 'External Link',
        fileUrl: result.normalizedUrl,
        uploadedAt: new Date().toLocaleString(),
        uploadedBy: uploadedBy.trim() || 'NMDC Security Cell',
        fileType: 'google_drive'
      });
    }

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
              <span>Attach Approved Scanned Pass</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Pass #{pass.passNumber} • {pass.passHolderName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
            <button
              type="button"
              id="tab-upload-file"
              onClick={() => {
                setUploadMode('file');
                setDriveError(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                uploadMode === 'file'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UploadCloud className="w-4 h-4 text-blue-600" />
              <span>Upload File / JPEG</span>
            </button>
            <button
              type="button"
              id="tab-google-drive-link"
              onClick={() => setUploadMode('drive')}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition cursor-pointer ${
                uploadMode === 'drive'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Link2 className="w-4 h-4 text-emerald-600" />
              <span>Paste Google Drive Link</span>
            </button>
          </div>

          {uploadMode === 'file' ? (
            <>
              <p className="text-xs text-slate-600">
                Upload the approved pass document or scanned JPEG signed and stamped by NMDC Ltd / CISF Security Unit. The file will be stored directly in the database.
              </p>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                className="hidden"
              />

              {isProcessing ? (
                <div className="p-8 bg-blue-50/60 border border-blue-200 rounded-xl text-center space-y-2">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                  <p className="text-xs font-bold text-blue-900">Processing & Optimizing Image...</p>
                  <p className="text-[11px] text-blue-600">Scaling for database storage with crystal-clear readability</p>
                </div>
              ) : selectedFile ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedFile.isImage ? (
                        <div
                          onClick={() => setPreviewOpen(true)}
                          className="relative w-14 h-14 rounded-lg overflow-hidden border border-emerald-300 bg-white cursor-pointer group shrink-0 shadow-2xs"
                          title="Click to view full preview"
                        >
                          <img
                            src={selectedFile.fileUrl}
                            alt="Preview"
                            className="w-full h-full object-cover group-hover:scale-105 transition"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                      )}

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-900 block truncate max-w-[200px]">
                            {selectedFile.fileName}
                          </span>
                          {selectedFile.isImage && (
                            <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-200 text-emerald-800 rounded">
                              JPEG
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Size: <strong className="text-emerald-700">{selectedFile.fileSize}</strong>
                          {selectedFile.dimensions && ` • ${selectedFile.dimensions.width}×${selectedFile.dimensions.height}px`}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Ready to upload to database
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      {selectedFile.isImage && (
                        <button
                          type="button"
                          onClick={() => setPreviewOpen(true)}
                          className="text-xs text-emerald-700 hover:text-emerald-900 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                      >
                        Change File
                      </button>
                    </div>
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
                      Click to browse and upload approved pass file or JPEG
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Accepts JPEG, JPG, PNG photos, scans or PDF documents
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
            </>
          ) : (
            <div className="space-y-3.5">
              <p className="text-xs text-slate-600">
                Paste the shareable Google Drive link to your scanned signed pass PDF or image. Officers and users can open it directly from the pass record.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Drive Share Link <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Link2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    id="input-google-drive-link"
                    type="url"
                    value={driveLinkInput}
                    onChange={(e) => {
                      setDriveLinkInput(e.target.value);
                      setDriveError(null);
                    }}
                    placeholder="https://drive.google.com/file/d/..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                {driveError && (
                  <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{driveError}</span>
                  </p>
                )}
                {driveValidation && !driveValidation.valid && !driveError && (
                  <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{driveValidation.error}</span>
                  </p>
                )}
                {driveValidation?.valid && (
                  <div className="mt-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-[11px] font-semibold text-emerald-900 truncate">
                        {driveValidation.isGoogleDrive ? 'Valid Google Drive link detected' : 'Valid external document link detected'}
                      </span>
                    </div>
                    <a
                      href={driveValidation.normalizedUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0"
                    >
                      <span>Test Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Label (Optional)
                </label>
                <input
                  id="input-drive-doc-title"
                  type="text"
                  value={driveDocTitle}
                  onChange={(e) => setDriveDocTitle(e.target.value)}
                  placeholder={`Scanned_Pass_${pass.passNumber.replace(/[^a-zA-Z0-9]/g, '_')}_Drive`}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500"
                />
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
            Database record will update instantly
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
              id="btn-save-approved-doc"
              type="button"
              disabled={!canSave}
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg shadow-sm transition cursor-pointer"
            >
              {isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Saved to Database!</span>
                </>
              ) : (
                <>
                  {uploadMode === 'drive' ? <Link2 className="w-4 h-4" /> : <UploadCloud className="w-4 h-4" />}
                  <span>Save to Database</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Image Preview Modal */}
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
                alt="Document Preview"
                className="max-h-[70vh] w-auto object-contain rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
