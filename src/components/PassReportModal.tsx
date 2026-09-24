import React, { useState, useRef } from 'react';
import { EntryPass } from '../types';
import { 
  X, 
  FileText, 
  Download, 
  ShieldCheck, 
  RotateCcw, 
  Package, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Tag, 
  HardHat, 
  Users, 
  Truck,
  Layers,
  ArrowRight
} from 'lucide-react';
import * as XLSX from 'xlsx';

interface PassReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  passes: EntryPass[];
}

export const PassReportModal: React.FC<PassReportModalProps> = ({
  isOpen,
  onClose,
  passes
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'returnable' | 'non-returnable' | 'general'>('all');

  if (!isOpen) return null;

  // Classify passes
  const materialPasses = passes.filter((p) => p.passType === 'Materials');
  const returnablePasses = materialPasses.filter((p) => p.materialCategory === 'Returnable');
  const nonReturnablePasses = materialPasses.filter((p) => p.materialCategory === 'Non-Returnable');
  const generalPasses = passes.filter((p) => p.passType !== 'Materials');

  // Stats
  const returnablePendingCount = returnablePasses.filter((p) => p.materialReturnStatus === 'Pending Return').length;
  const returnableReturnedCount = returnablePasses.filter((p) => p.materialReturnStatus === 'Returned').length;

  const currentDisplayPasses = 
    activeTab === 'returnable' ? returnablePasses :
    activeTab === 'non-returnable' ? nonReturnablePasses :
    activeTab === 'general' ? generalPasses :
    passes;

  const printContainerRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    const container = printContainerRef.current;
    if (!container) {
      window.print();
      return;
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      document.body.removeChild(iframe);
      window.print();
      return;
    }

    doc.open();
    doc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>NMDC Donimalai Audit Report</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm;
            }
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              box-sizing: border-box !important;
            }
            body {
              font-family: serif;
              color: #000;
              background: #fff;
              margin: 0;
              padding: 10mm;
              width: 210mm;
            }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 6px; font-size: 9pt; }
            th { background: #f1f5f9; font-weight: bold; }
            .print-page-container {
              width: 190mm !important;
              height: 277mm !important;
              min-height: 277mm !important;
              margin: 0 auto !important;
              background: #fff !important;
              page-break-after: always !important;
              break-after: page !important;
              position: relative !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              box-sizing: border-box !important;
              overflow: hidden !important;
            }
          </style>
        </head>
        <body>
    `);

    const pageContainers = container.querySelectorAll('.print-page-container');
    if (pageContainers.length > 0) {
      pageContainers.forEach((el) => {
        const clone = el.cloneNode(true) as HTMLElement;
        clone.style.pageBreakAfter = 'always';
        clone.style.breakAfter = 'page';
        doc.write(clone.outerHTML);
      });
    } else {
      doc.write(container.innerHTML);
    }

    doc.write(`
        </body>
      </html>
    `);
    doc.close();

    iframe.contentWindow?.focus();
    setTimeout(() => {
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1000);
    }, 500);
  };

  const handleExportSectionExcel = () => {
    // Multi-sheet workbook report
    const workbook = XLSX.utils.book_new();

    // Sheet 1: Summary Sheet
    const summaryData = [
      ['NMDC Donimalai - Entry Pass & Material Movement Audit Report'],
      ['Generated On', new Date().toLocaleString()],
      ['Admin in-Charge', 'Ashwin R. (Amnex Infotechnologies)'],
      ['Client Organization', 'NMDC, Donimalai (Navratna PSU)'],
      ['Security Agency', 'Central Industrial Security Force (CISF)'],
      [],
      ['Category', 'Total Issued', 'Details'],
      ['Total Passes Issued', passes.length, 'All categories (Materials, Contractor, Employee, Vehicle)'],
      ['Returnable Material Passes (RGP)', returnablePasses.length, `${returnablePendingCount} Pending Return, ${returnableReturnedCount} Returned`],
      ['Non-Returnable Material Passes (NRGP)', nonReturnablePasses.length, 'Permanent site deliveries & consumables'],
      ['General Personnel & Vehicle Passes', generalPasses.length, 'Contractor, Employee & Site Vehicles'],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Executive_Summary');

    // Helper formatter
    const mapPassesToRows = (passList: EntryPass[]) => passList.map((p) => ({
      'Pass Number': p.passNumber,
      'Pass Type': p.passType,
      'Holder Name': p.passHolderName,
      'Designation': p.passHolderDesignation || '',
      'Gate': p.gateNumber,
      'Department': p.departmentOrProject,
      'Procedure Stage': p.procedureStage,
      'Validity Period': `${p.validFrom} to ${p.validTo}`,
      'Material Category': p.materialCategory || 'N/A',
      'Return Status': p.materialReturnStatus || 'N/A',
      'Expected Return Date': p.expectedReturnDate || 'N/A',
      'Bill / Invoice Number': p.billNumber || p.challanInvoiceNumber || 'N/A',
      'Items Detail': p.materialItems?.map(m => `${m.itemName} (${m.quantity} ${m.unit}) [${m.isBoq ? 'BOQ:' + m.boqItemNumber : 'Non-BOQ'}]`).join('; ') || 'N/A',
      'Personnel Count': p.employees.length,
      'Vehicle Number': p.vehicleNumber || 'N/A',
      'Gate Status': p.status,
      'Remarks / Follow-up': p.followUpNotes || ''
    }));

    // Sheet 2: Returnable (RGP)
    const returnableRows = mapPassesToRows(returnablePasses);
    const returnableSheet = XLSX.utils.json_to_sheet(returnableRows);
    XLSX.utils.book_append_sheet(workbook, returnableSheet, 'Returnable_RGP');

    // Sheet 3: Non-Returnable (NRGP)
    const nonReturnableRows = mapPassesToRows(nonReturnablePasses);
    const nonReturnableSheet = XLSX.utils.json_to_sheet(nonReturnableRows);
    XLSX.utils.book_append_sheet(workbook, nonReturnableSheet, 'Non_Returnable_NRGP');

    // Sheet 4: Personnel & Vehicle Passes
    const generalRows = mapPassesToRows(generalPasses);
    const generalSheet = XLSX.utils.json_to_sheet(generalRows);
    XLSX.utils.book_append_sheet(workbook, generalSheet, 'Personnel_Vehicles');

    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `NMDC_Donimalai_Passes_Report_${dateStr}.xlsx`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden my-4 print:m-0 print:border-none print:shadow-none animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[92vh] print:max-h-none">
        
        {/* Top Header Controls (Hidden in print) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white">
                Passes Issued Audit & Material Movement Report
              </h2>
              <p className="text-[11px] text-slate-400">
                NMDC, Donimalai • Dedicated Returnable (RGP) vs Non-Returnable (NRGP) Breakdown
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportSectionExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
              title="Download formatted multi-sheet Excel report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Excel Report</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-2xs"
              title="Export A4 PDF report"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export A4 PDF</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Filters (Hidden in print) */}
        <div className="bg-slate-50 px-5 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              All Passes ({passes.length})
            </button>
            <button
              onClick={() => setActiveTab('returnable')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'returnable'
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300'
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Returnable (RGP) ({returnablePasses.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('non-returnable')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'non-returnable'
                  ? 'bg-emerald-700 text-white shadow-2xs'
                  : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100 border border-emerald-300'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Non-Returnable (NRGP) ({nonReturnablePasses.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('general')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                activeTab === 'general'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Personnel & Vehicles ({generalPasses.length})</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Admin: <span className="font-bold text-slate-800">Ashwin R.</span> • Client: <span className="font-bold text-blue-700">NMDC , Donimalai</span>
          </div>
        </div>

        {/* Printable & Scrollable Report Content */}
        <div ref={printContainerRef} className="p-6 overflow-y-auto flex-1 print:p-0 print:overflow-visible text-slate-900 space-y-6">
          
          {/* Printable Letterhead Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-black uppercase tracking-widest text-slate-500">
                  National Mineral Development Corporation Ltd (NMDC)
                </div>
                <h1 className="text-2xl font-black text-slate-900 uppercase mt-0.5 tracking-tight">
                  NMDC, Donimalai — Pass & Material Follow-Up Report
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-1 font-medium">
                  <span>Vendor: <strong className="text-slate-900">Amnex Infotechnologies Pvt. Ltd.</strong></span>
                  <span>•</span>
                  <span>System Admin: <strong className="text-slate-900">Ashwin R.</strong></span>
                  <span>•</span>
                  <span>Generated Date: <strong className="text-slate-900">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</strong></span>
                </div>
              </div>

              <div className="text-right">
                <div className="border-2 border-slate-900 bg-slate-50 px-3 py-1.5 rounded-lg text-center">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Access Monitored By</div>
                  <div className="text-xs font-black text-slate-900 tracking-tight">CISF UNIT NMDC</div>
                </div>
              </div>
            </div>
          </div>

          {/* Metric Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
            <div className="p-3 bg-slate-100 rounded-xl border border-slate-300">
              <span className="text-[10px] font-bold uppercase text-slate-500 block">Total Issued Passes</span>
              <span className="text-xl font-black text-slate-900 mt-0.5 block">{passes.length}</span>
              <span className="text-[11px] text-slate-500">All types combined</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-amber-900">Returnable (RGP)</span>
                <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-1.5 py-0.2 rounded">RGP</span>
              </div>
              <span className="text-xl font-black text-amber-950 mt-0.5 block">{returnablePasses.length}</span>
              <div className="text-[11px] text-amber-800 font-semibold flex items-center justify-between mt-0.5">
                <span>{returnablePendingCount} Pending Return</span>
                <span>• {returnableReturnedCount} Returned</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-emerald-900">Non-Returnable (NRGP)</span>
                <span className="text-[10px] font-bold bg-emerald-200/80 text-emerald-900 px-1.5 py-0.2 rounded">NRGP</span>
              </div>
              <span className="text-xl font-black text-emerald-950 mt-0.5 block">{nonReturnablePasses.length}</span>
              <span className="text-[11px] text-emerald-700 font-medium">Permanent site supply</span>
            </div>

            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
              <span className="text-[10px] font-bold uppercase text-blue-900 block">Personnel & Vehicle</span>
              <span className="text-xl font-black text-blue-950 mt-0.5 block">{generalPasses.length}</span>
              <span className="text-[11px] text-blue-700 font-medium">Employee, Contractor, Vehicle</span>
            </div>
          </div>

          {/* Section 1: RETURNABLE MATERIAL PASSES (RGP) */}
          {(activeTab === 'all' || activeTab === 'returnable') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-amber-500 pb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-amber-500 text-white flex items-center justify-center">
                    <RotateCcw className="w-3 h-3" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wide text-amber-950">
                    1. Returnable Gate Passes (RGP) Details & Verification Status
                  </h3>
                </div>
                <span className="text-xs font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded border border-amber-300">
                  Total: {returnablePasses.length} | Pending: {returnablePendingCount} | Returned: {returnableReturnedCount}
                </span>
              </div>

              {returnablePasses.length === 0 ? (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No Returnable Material Passes (RGP) registered in database.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-300 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-amber-100/90 text-amber-950 font-bold border-b border-amber-300 text-[11px] uppercase">
                        <th className="p-2.5">Pass #</th>
                        <th className="p-2.5">Authorized Carrier</th>
                        <th className="p-2.5">Gate & Dept</th>
                        <th className="p-2.5">Material Items & BOQ</th>
                        <th className="p-2.5">Return Due Date</th>
                        <th className="p-2.5">Return Status</th>
                        <th className="p-2.5">Procedure Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px]">
                      {returnablePasses.map((p) => (
                        <tr key={p.id} className="hover:bg-amber-50/50">
                          <td className="p-2.5 font-mono font-bold text-slate-900">{p.passNumber}</td>
                          <td className="p-2.5">
                            <span className="font-semibold text-slate-900 block">{p.passHolderName}</span>
                            <span className="text-[10px] text-slate-500">{p.passHolderContact || p.passHolderDesignation || 'Carrier'}</span>
                          </td>
                          <td className="p-2.5">
                            <span className="font-bold text-slate-800 block">{p.gateNumber}</span>
                            <span className="text-[10px] text-blue-700 font-semibold">{p.departmentOrProject}</span>
                          </td>
                          <td className="p-2.5 max-w-xs">
                            {p.materialItems && p.materialItems.length > 0 ? (
                              <div className="space-y-0.5">
                                {p.materialItems.map((m, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5">
                                    <span className="font-semibold text-slate-900">• {m.itemName}</span>
                                    <span className="text-slate-600">({m.quantity} {m.unit})</span>
                                    {m.isBoq && (
                                      <span className="text-[9px] font-bold px-1 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                                        {m.boqItemNumber || 'BOQ'}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-500">Material list attached in challan</span>
                            )}
                          </td>
                          <td className="p-2.5">
                            <span className="font-bold text-slate-800 block">{p.expectedReturnDate || p.validTo}</span>
                            <span className="text-[10px] text-slate-500">Issued: {p.validFrom}</span>
                          </td>
                          <td className="p-2.5">
                            {p.materialReturnStatus === 'Returned' ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                <span>Returned</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300 animate-pulse">
                                <Clock className="w-3 h-3 text-rose-700" />
                                <span>Pending Return</span>
                              </span>
                            )}
                          </td>
                          <td className="p-2.5">
                            <span className="font-semibold text-slate-800">{p.procedureStage}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Section 2: NON-RETURNABLE MATERIAL PASSES (NRGP) */}
          {(activeTab === 'all' || activeTab === 'non-returnable') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-emerald-600 pb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-emerald-600 text-white flex items-center justify-center">
                    <Package className="w-3 h-3" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wide text-emerald-950">
                    2. Non-Returnable Gate Passes (NRGP) - Permanent Delivery & Inward Details
                  </h3>
                </div>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                  Total Non-Returnable: {nonReturnablePasses.length}
                </span>
              </div>

              {nonReturnablePasses.length === 0 ? (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No Non-Returnable Material Passes (NRGP) registered in database.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-300 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-emerald-100/90 text-emerald-950 font-bold border-b border-emerald-300 text-[11px] uppercase">
                        <th className="p-2.5">Pass #</th>
                        <th className="p-2.5">Authorized Carrier</th>
                        <th className="p-2.5">Gate & Dept</th>
                        <th className="p-2.5">Material Items & BOQ</th>
                        <th className="p-2.5">Bill / Challan Ref</th>
                        <th className="p-2.5">Delivery Status</th>
                        <th className="p-2.5">Procedure Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px]">
                      {nonReturnablePasses.map((p) => (
                        <tr key={p.id} className="hover:bg-emerald-50/50">
                          <td className="p-2.5 font-mono font-bold text-slate-900">{p.passNumber}</td>
                          <td className="p-2.5">
                            <span className="font-semibold text-slate-900 block">{p.passHolderName}</span>
                            <span className="text-[10px] text-slate-500">{p.passHolderContact || p.passHolderDesignation || 'Carrier'}</span>
                          </td>
                          <td className="p-2.5">
                            <span className="font-bold text-slate-800 block">{p.gateNumber}</span>
                            <span className="text-[10px] text-blue-700 font-semibold">{p.departmentOrProject}</span>
                          </td>
                          <td className="p-2.5 max-w-xs">
                            {p.materialItems && p.materialItems.length > 0 ? (
                              <div className="space-y-0.5">
                                {p.materialItems.map((m, idx) => (
                                  <div key={idx} className="flex items-center gap-1.5">
                                    <span className="font-semibold text-slate-900">• {m.itemName}</span>
                                    <span className="text-slate-600">({m.quantity} {m.unit})</span>
                                    {m.isBoq && (
                                      <span className="text-[9px] font-bold px-1 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
                                        {m.boqItemNumber || 'BOQ'}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-slate-500">Items detailed in invoice</span>
                            )}
                          </td>
                          <td className="p-2.5 font-mono font-medium text-slate-700">
                            {p.billNumber || p.challanInvoiceNumber || 'On Record'}
                          </td>
                          <td className="p-2.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                              <span>Delivered (NRGP)</span>
                            </span>
                          </td>
                          <td className="p-2.5">
                            <span className="font-semibold text-slate-800">{p.procedureStage}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Section 3: GENERAL PERSONNEL & VEHICLE PASSES */}
          {(activeTab === 'all' || activeTab === 'general') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b-2 border-blue-600 pb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded bg-blue-600 text-white flex items-center justify-center">
                    <Users className="w-3 h-3" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-wide text-blue-950">
                    3. Personnel & Vehicle Passes (Contractor, Employee, Vehicle)
                  </h3>
                </div>
                <span className="text-xs font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                  Total Personnel & Vehicles: {generalPasses.length}
                </span>
              </div>

              {generalPasses.length === 0 ? (
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  No Personnel or Vehicle passes registered in database.
                </div>
              ) : (
                <div className="overflow-x-auto border border-slate-300 rounded-lg">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-blue-100/90 text-blue-950 font-bold border-b border-blue-300 text-[11px] uppercase">
                        <th className="p-2.5">Pass # & Type</th>
                        <th className="p-2.5">Holder Name & Role</th>
                        <th className="p-2.5">Gate & Dept</th>
                        <th className="p-2.5">Personnel Included</th>
                        <th className="p-2.5">Vehicle Reg #</th>
                        <th className="p-2.5">Validity Period</th>
                        <th className="p-2.5">Procedure Stage</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px]">
                      {generalPasses.map((p) => (
                        <tr key={p.id} className="hover:bg-blue-50/50">
                          <td className="p-2.5">
                            <span className="font-mono font-bold text-slate-900 block">{p.passNumber}</span>
                            <span className="text-[10px] font-bold text-blue-700">{p.passType} Pass</span>
                          </td>
                          <td className="p-2.5">
                            <span className="font-semibold text-slate-900 block">{p.passHolderName}</span>
                            <span className="text-[10px] text-slate-500">{p.passHolderDesignation || 'Authorized Person'}</span>
                          </td>
                          <td className="p-2.5">
                            <span className="font-bold text-slate-800 block">{p.gateNumber}</span>
                            <span className="text-[10px] text-blue-700 font-semibold">{p.departmentOrProject}</span>
                          </td>
                          <td className="p-2.5">
                            <span className="font-semibold text-slate-900">{p.employees.length} Personnel</span>
                            {p.employees.length > 0 && (
                              <div className="text-[10px] text-slate-500 truncate max-w-[200px]">
                                {p.employees.map(e => e.name).join(', ')}
                              </div>
                            )}
                          </td>
                          <td className="p-2.5 font-mono font-bold text-slate-800">
                            {p.vehicleNumber || '—'}
                          </td>
                          <td className="p-2.5">
                            <span className="text-slate-800 font-medium block">{p.validFrom} to {p.validTo}</span>
                            <span className={`text-[10px] font-bold ${p.validityStatus === 'Active' ? 'text-emerald-700' : 'text-rose-700'}`}>
                              {p.validityStatus}
                            </span>
                          </td>
                          <td className="p-2.5">
                            <span className="font-semibold text-slate-800">{p.procedureStage}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Verification Sign-Off Footer for Official Submission / Printing */}
          <div className="pt-6 border-t-2 border-slate-900 mt-6 grid grid-cols-3 gap-6 text-center text-xs">
            <div className="border-t border-slate-400 pt-2">
              <span className="font-bold text-slate-900 block">Ashwin R.</span>
              <span className="text-[10px] text-slate-500 block">Admin & Site In-Charge</span>
              <span className="text-[10px] text-slate-700 font-medium">Amnex Infotechnologies Pvt. Ltd.</span>
            </div>

            <div className="border-t border-slate-400 pt-2">
              <span className="font-bold text-slate-900 block">Department Head (C&IT)</span>
              <span className="text-[10px] text-slate-500 block">Authorizing Authority</span>
              <span className="text-[10px] text-blue-800 font-semibold">NMDC, Donimalai</span>
            </div>

            <div className="border-t border-slate-400 pt-2">
              <span className="font-bold text-slate-900 block">Security In-Charge / Inspector</span>
              <span className="text-[10px] text-slate-500 block">Gate Verification & Physical Stamp</span>
              <span className="text-[10px] text-emerald-800 font-semibold">CISF UNIT NMDC</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
