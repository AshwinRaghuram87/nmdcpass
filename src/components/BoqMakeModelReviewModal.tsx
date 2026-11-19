import React, { useState, useMemo } from 'react';
import { EntryPass, MaterialItem } from '../types';
import {
  BOQ_ANNEXURE_ITEMS,
  BOQ_ANNEXURE_SECTIONS,
  BOQ_ANNEXURE_PDF_URL,
  BoqAnnexureItem,
  BoqAnnexureSectionId,
  verifyItemMakeAndModel
} from '../utils/boqAnnexureData';
import { isBoqMaterialItem } from '../utils/boqUtils';
import {
  X,
  ClipboardCheck,
  FileText,
  ExternalLink,
  Download,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Search,
  Sparkles,
  Layers
} from 'lucide-react';

interface BoqMakeModelReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pass?: EntryPass | null;
  focusedItem?: MaterialItem | null;
  onApplyMakeModel?: (oem: string, modelName: string, entry?: BoqAnnexureItem) => void;
}

export const BoqMakeModelReviewModal: React.FC<BoqMakeModelReviewModalProps> = ({
  isOpen,
  onClose,
  pass,
  focusedItem,
  onApplyMakeModel,
}) => {
  const [activeTab, setActiveTab] = useState<'verify' | 'pdf'>('verify');
  const [searchQuery, setSearchQuery] = useState(
    focusedItem?.itemName?.trim() || ''
  );
  const [selectedSection, setSelectedSection] = useState<'ALL' | BoqAnnexureSectionId>('ALL');

  const boqItemsToReview: MaterialItem[] = useMemo(() => {
    if (focusedItem) return [focusedItem];
    if (!pass || !Array.isArray(pass.materialItems)) return [];
    return pass.materialItems.filter((m) => isBoqMaterialItem(m, pass));
  }, [pass, focusedItem]);

  const filteredAnnexureItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return BOQ_ANNEXURE_ITEMS.filter((entry) => {
      if (selectedSection !== 'ALL' && entry.section !== selectedSection) {
        return false;
      }
      if (!q) return true;
      return (
        entry.code.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        entry.category.toLowerCase().includes(q) ||
        entry.oemName.toLowerCase().includes(q) ||
        entry.modelName.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, selectedSection]);

  if (!isOpen) return null;

  const renderStatusBadge = (status: ReturnType<typeof verifyItemMakeAndModel>['status']) => {
    if (status === 'verified') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
          <span>Make &amp; Model Verified</span>
        </span>
      );
    }
    if (status === 'mismatch') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
          <AlertTriangle className="w-3 h-3 text-rose-600" />
          <span>Mismatch — Check Annexure 2</span>
        </span>
      );
    }
    if (status === 'unfilled') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
          <HelpCircle className="w-3 h-3 text-amber-700" />
          <span>Make / Model Incomplete</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-300">
        <Search className="w-3 h-3 text-slate-500" />
        <span>Verify Manually Below</span>
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-4 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shrink-0">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  BOQ Make &amp; Model Review — Unpriced BoQ (Annexure 2)
                </h2>
                {pass && (
                  <span className="font-mono text-[11px] font-bold text-indigo-300 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-700">
                    {pass.passNumber}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                4.1.1 Unpriced Bill of Quantity (BoQ) - Annexure 2 • Approved OEM &amp; Model Reference (NMDC-UMLMSS)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={BOQ_ANNEXURE_PDF_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition"
              title="Open original Unpriced BoQ Annexure 2 PDF in a new tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open PDF</span>
            </a>
            <a
              href={BOQ_ANNEXURE_PDF_URL}
              download="NMDC_UMLMSS_Unpriced_BoQ_Annexure2.pdf"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
              title="Download Unpriced BoQ Annexure 2 PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 shrink-0">
          <div className="inline-flex p-0.5 bg-slate-200/80 rounded-lg border border-slate-300/70">
            <button
              type="button"
              onClick={() => setActiveTab('verify')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'verify'
                  ? 'bg-white text-indigo-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ClipboardCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Verify Make &amp; Model ({boqItemsToReview.length} Pass Item{boqItemsToReview.length === 1 ? '' : 's'})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pdf')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                activeTab === 'pdf'
                  ? 'bg-white text-indigo-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-rose-600" />
              <span>Original Annexure 2 PDF (4 Pages)</span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500">
            Source: <strong>NMDC-UMLMSS Unpriced BoQ (Annexure 2) — 94 Official Items</strong>
          </span>
        </div>

        {/* Body */}
        {activeTab === 'pdf' ? (
          <div className="flex-1 bg-slate-100 p-3 flex flex-col min-h-[65vh]">
            <iframe
              src={BOQ_ANNEXURE_PDF_URL}
              title="NMDC UMLMSS Unpriced BoQ Annexure 2"
              className="w-full flex-1 min-h-[65vh] rounded-xl border border-slate-300 bg-white shadow-inner"
            />
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Pass BOQ Items Verification Cards */}
            {boqItemsToReview.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Make &amp; Model Verification for {pass ? `Pass ${pass.passNumber}` : 'Selected BOQ Item'}</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Compare entered OEM &amp; Model against approved Annexure 2 specifications
                  </span>
                </div>

                <div className="space-y-3">
                  {boqItemsToReview.map((item, idx) => {
                    const verification = verifyItemMakeAndModel(item);

                    return (
                      <div
                        key={item.id || idx}
                        className={`rounded-xl border p-3.5 shadow-2xs space-y-3 ${
                          verification.status === 'verified'
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : verification.status === 'mismatch'
                              ? 'bg-rose-50/40 border-rose-200'
                              : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-mono text-[11px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                                {item.boqItemNumber || item.boqNumber || `Item #${idx + 1}`}
                              </span>
                              <span className="text-xs font-bold text-slate-900">
                                {item.itemName || 'Unnamed BOQ Item'}
                              </span>
                              <span className="text-[11px] font-semibold text-slate-500">
                                ({item.quantity} {item.unit})
                              </span>
                            </div>
                          </div>
                          {renderStatusBadge(verification.status)}
                        </div>

                        {/* Entered vs Approved Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          {/* Left: Entered on Pass */}
                          <div className="bg-white rounded-lg border border-slate-200 p-2.5 space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Entered on Gate Pass
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <span className="text-[10px] text-slate-400 block">OEM (Make)</span>
                                <span className={`font-bold ${item.oem ? 'text-slate-900' : 'text-amber-700 italic'}`}>
                                  {item.oem || 'Not specified'}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] text-slate-400 block">Model / Make</span>
                                <span className={`font-bold font-mono text-[11px] ${item.oemModel ? 'text-slate-900' : 'text-amber-700 italic font-sans'}`}>
                                  {item.oemModel || 'Not specified'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Approved per Annexure 2 */}
                          <div className="bg-indigo-50/50 rounded-lg border border-indigo-200 p-2.5 space-y-1.5">
                            <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                              Approved per Unpriced BoQ (Annexure 2)
                            </div>
                            {verification.matchedEntries.length > 0 ? (
                              <div className="space-y-1.5">
                                {verification.matchedEntries.map((entry) => (
                                  <div
                                    key={entry.id}
                                    className="flex flex-wrap items-center justify-between gap-2 bg-white/90 px-2 py-1.5 rounded border border-indigo-100"
                                  >
                                    <div className="min-w-0">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-mono text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1 rounded">
                                          {entry.code}
                                        </span>
                                        <span className="font-bold text-slate-900 text-xs">
                                          {entry.oemName}
                                        </span>
                                        <span className="text-slate-400">•</span>
                                        <span className="font-mono font-bold text-indigo-900 text-[11px]">
                                          {entry.modelName}
                                        </span>
                                      </div>
                                      <div className="text-[10px] text-slate-500 mt-0.5">
                                        {entry.sectionTitle} • Qty: KIOM {entry.kiom}, DIOM {entry.diom}, Pellet {entry.pelletPlant} (Total {entry.totalQty} {entry.uom})
                                      </div>
                                    </div>
                                    {onApplyMakeModel && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          onApplyMakeModel(entry.oemName, entry.modelName, entry);
                                          onClose();
                                        }}
                                        className="inline-flex items-center gap-1 px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-bold transition cursor-pointer shrink-0"
                                      >
                                        <Sparkles className="w-3 h-3" />
                                        <span>Apply</span>
                                      </button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-[11px] text-slate-600">
                                No automatic match found for &ldquo;{item.itemName}&rdquo;. Search the full Annexure 2 reference table below or view the PDF tab.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Complete 94-Item Searchable Annexure 2 Reference Table */}
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-2xs">
              <div className="p-3.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Full Annexure 2 Approved Make &amp; Model Reference ({filteredAnnexureItems.length} of {BOQ_ANNEXURE_ITEMS.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Search any BOQ item, OEM name, or Model number from NMDC-UMLMSS Annexure 2
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value as 'ALL' | BoqAnnexureSectionId)}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="ALL">All Sections (A–E)</option>
                    {BOQ_ANNEXURE_SECTIONS.map((sec) => (
                      <option key={sec.id} value={sec.id}>
                        {sec.title}
                      </option>
                    ))}
                  </select>

                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search item, OEM, model..."
                      className="pl-8 pr-3 py-1.5 w-56 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-indigo-500"
                    />
                  </div>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto max-h-[340px] overflow-y-auto">
                <table className="w-full text-left text-[11px] border-collapse">
                  <thead className="sticky top-0 z-10 bg-slate-900 text-slate-200 text-[10px] uppercase tracking-wider">
                    <tr>
                      <th className="py-2 px-2.5 w-14">Code</th>
                      <th className="py-2 px-2.5">Item Description</th>
                      <th className="py-2 px-2.5 whitespace-nowrap">OEM Name</th>
                      <th className="py-2 px-2.5">Approved Model Name</th>
                      <th className="py-2 px-2 text-right whitespace-nowrap">KIOM</th>
                      <th className="py-2 px-2 text-right whitespace-nowrap">DIOM</th>
                      <th className="py-2 px-2 text-right whitespace-nowrap">Pellet</th>
                      <th className="py-2 px-2.5 text-right whitespace-nowrap">Total Qty</th>
                      {onApplyMakeModel && <th className="py-2 px-2.5 text-right">Use</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAnnexureItems.map((entry) => (
                      <tr key={entry.id} className="hover:bg-indigo-50/40">
                        <td className="py-1.5 px-2.5 font-mono font-bold text-indigo-800 whitespace-nowrap">
                          {entry.code}
                        </td>
                        <td className="py-1.5 px-2.5 text-slate-800 font-medium">
                          <div>{entry.description}</div>
                          <span className="text-[10px] text-slate-400">{entry.sectionTitle} • {entry.category}</span>
                        </td>
                        <td className="py-1.5 px-2.5 font-bold text-slate-900 whitespace-nowrap">
                          {entry.oemName}
                        </td>
                        <td className="py-1.5 px-2.5 font-mono font-semibold text-indigo-950">
                          {entry.modelName}
                        </td>
                        <td className="py-1.5 px-2 text-right text-slate-600 tabular-nums">{entry.kiom}</td>
                        <td className="py-1.5 px-2 text-right text-slate-600 tabular-nums">{entry.diom}</td>
                        <td className="py-1.5 px-2 text-right text-slate-600 tabular-nums">{entry.pelletPlant}</td>
                        <td className="py-1.5 px-2.5 text-right font-bold text-slate-900 whitespace-nowrap tabular-nums">
                          {entry.totalQty} {entry.uom}
                        </td>
                        {onApplyMakeModel && (
                          <td className="py-1.5 px-2.5 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                onApplyMakeModel(entry.oemName, entry.modelName, entry);
                                onClose();
                              }}
                              className="px-2 py-0.5 rounded bg-indigo-50 hover:bg-indigo-600 text-indigo-700 hover:text-white border border-indigo-200 text-[10px] font-bold transition cursor-pointer"
                            >
                              Apply
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                    {filteredAnnexureItems.length === 0 && (
                      <tr>
                        <td colSpan={onApplyMakeModel ? 9 : 8} className="py-6 text-center text-slate-400">
                          No matching items in Annexure 2. Try clearing the search filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <span className="text-[11px] text-slate-500">
            Reference Document: <strong className="text-slate-700">4.1.1 Unpriced Bill of Quantity (BoQ) - Annexure 2 (Make &amp; Model)</strong>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
          >
            Close Review
          </button>
        </div>
      </div>
    </div>
  );
};
