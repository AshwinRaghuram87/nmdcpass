import React from 'react';
import { EntryPass } from '../types';
import { X, Printer, ShieldCheck, QrCode, CheckCircle2 } from 'lucide-react';

interface PrintablePassModalProps {
  pass: EntryPass | null;
  onClose: () => void;
}

export const PrintablePassModal: React.FC<PrintablePassModalProps> = ({ pass, onClose }) => {
  if (!pass) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden my-6 print:m-0 print:border-none print:shadow-none animate-in fade-in zoom-in-95 duration-150">
        {/* Top Screen Control Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white px-5 py-3 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Official Gate Pass Badge Preview</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Badge</span>
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Pass Card Container */}
        <div className="p-8 bg-white text-slate-900 space-y-5 print:p-4">
          {/* Official Pass Badge Header */}
          <div className="border-b-2 border-slate-900 pb-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
                  National Mineral Development Corporation Ltd (NMDC)
                </div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase mt-0.5">
                  Security Gate Entry Pass
                </h1>
                <div className="text-xs font-semibold text-blue-700 mt-0.5">
                  Vendor: Amnex Infotechnologies Pvt. Ltd.
                </div>
              </div>

              <div className="text-right">
                <div className="inline-block border-2 border-emerald-700 bg-emerald-50 px-2.5 py-1 rounded text-center">
                  <span className="block text-[9px] uppercase font-bold text-emerald-900 tracking-wider">
                    Security Monitored By
                  </span>
                  <span className="text-xs font-black text-emerald-800 tracking-tight">
                    CISF UNIT NMDC
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Pass Meta Grid */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-100 rounded-lg border border-slate-300 text-xs">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-semibold">Pass Number:</span>
              <span className="font-mono font-bold text-sm text-slate-900">{pass.passNumber}</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-semibold">Pass Type:</span>
              <span className="font-bold text-blue-800">{pass.passType} Pass</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase font-semibold">Designated Gate:</span>
              <span className="font-semibold text-slate-800">{pass.gateNumber}</span>
            </div>
          </div>

          {/* Primary Holder Info & QR code */}
          <div className="flex items-start justify-between gap-4 border border-slate-200 rounded-xl p-4 bg-slate-50/50">
            <div className="space-y-1.5 flex-1">
              <div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase block">Pass Holder Name:</span>
                <span className="text-base font-bold text-slate-900">{pass.passHolderName}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px] block">Role / Designation:</span>
                  <span className="font-medium text-slate-800">{pass.passHolderDesignation || 'Authorized Representative'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">Identity Proof Ref:</span>
                  <span className="font-mono text-slate-800">{pass.passHolderIdProof || 'Company ID'}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-500 text-[11px] block">Project / Department:</span>
                  <span className="font-semibold text-slate-800">{pass.departmentOrProject}</span>
                </div>
              </div>
            </div>

            {/* Visual Security QR and Validity Stamp */}
            <div className="flex flex-col items-center justify-center p-3 bg-white border border-slate-300 rounded-lg text-center flex-shrink-0">
              <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center rounded">
                <QrCode className="w-12 h-12" />
              </div>
              <span className="font-mono text-[9px] text-slate-500 mt-1">CISF VERIFIED</span>
            </div>
          </div>

          {/* Validity Period Ribbon */}
          <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs font-bold text-blue-900">
            <div>
              <span className="text-[10px] font-semibold text-blue-700 uppercase block">Valid From:</span>
              <span>{pass.validFrom}</span>
            </div>
            <div className="text-center font-black text-slate-400">
              ════►
            </div>
            <div className="text-right">
              <span className="text-[10px] font-semibold text-blue-700 uppercase block">Valid Until:</span>
              <span className="text-sm font-black text-rose-700">{pass.validTo}</span>
            </div>
          </div>

          {/* List of Covered Employees (for Contractor/Employee Passes) */}
          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-800 border-b border-slate-200 uppercase tracking-wider flex justify-between">
              <span>List of Authorized Personnel ({pass.employees.length})</span>
              <span className="text-[10px] font-normal text-slate-500">Must Carry Govt Photo ID</span>
            </div>
            <div className="max-h-40 overflow-y-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-500">
                    <th className="py-1 px-2.5">#</th>
                    <th className="py-1 px-2.5">Name</th>
                    <th className="py-1 px-2.5">Designation</th>
                    <th className="py-1 px-2.5">ID / Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pass.employees.map((emp, i) => (
                    <tr key={emp.id || i}>
                      <td className="py-1 px-2.5 font-mono text-[10px] text-slate-400">{i + 1}</td>
                      <td className="py-1 px-2.5 font-semibold text-slate-800">{emp.name}</td>
                      <td className="py-1 px-2.5 text-slate-600">{emp.designation}</td>
                      <td className="py-1 px-2.5 font-mono text-[10px] text-slate-500">{emp.idNumber}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vehicle / Material Specific Block */}
          {pass.passType === 'Materials' && (
            <div className="border-2 border-indigo-200 bg-indigo-50/40 rounded-lg p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-950 uppercase tracking-wider text-[11px]">
                  Material Gate Pass Classification:
                </span>
                <span className={`px-2.5 py-0.5 rounded font-black text-xs ${
                  pass.materialCategory === 'Returnable'
                    ? 'bg-amber-100 text-amber-900 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                }`}>
                  {pass.materialCategory === 'Returnable' ? 'RETURNABLE GATE PASS (RGP)' : 'NON-RETURNABLE GATE PASS (NRGP)'}
                </span>
              </div>
              <div className="text-[11px] text-slate-700">
                Challan Ref: <strong>{pass.challanInvoiceNumber || 'N/A'}</strong>
                {pass.materialCategory === 'Returnable' && (
                  <span className="ml-3 font-semibold text-amber-800">
                    Expected Return Date: {pass.expectedReturnDate}
                  </span>
                )}
              </div>
              {pass.materialItems && pass.materialItems.length > 0 && (
                <div className="text-[10px] text-slate-600 pt-1 border-t border-indigo-100">
                  Items: {pass.materialItems.map(m => `${m.itemName} (${m.quantity} ${m.unit})`).join(', ')}
                </div>
              )}
            </div>
          )}

          {pass.passType === 'Vehicle' && (
            <div className="border border-emerald-200 bg-emerald-50/40 rounded-lg p-3 text-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Vehicle Number:</span>
                <span className="font-mono text-base font-black text-slate-900">{pass.vehicleNumber}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Vehicle Type:</span>
                <span className="font-medium text-slate-800">{pass.vehicleType}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Driver License:</span>
                <span className="font-mono text-slate-800">{pass.driverLicenseNumber}</span>
              </div>
            </div>
          )}

          {/* Official 3-Tier Procedure Endorsements & CISF Stamp Box */}
          <div className="pt-4 border-t-2 border-slate-900 grid grid-cols-3 gap-4 text-center text-xs">
            <div className="space-y-6">
              <div className="text-blue-700 font-mono text-[10px] font-semibold">
                ✓ Prepared by Amnex
                {pass.preparedDate && <span className="block text-[9px] text-slate-500">{pass.preparedDate}</span>}
              </div>
              <div className="border-t border-slate-400 pt-1">
                <span className="font-bold text-slate-800 block text-[11px]">Amnex Site In-Charge</span>
                <span className="text-[9px] text-slate-500">Amnex Infotechnologies Pvt. Ltd.</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`font-mono text-[10px] font-semibold ${
                ['Submitted to CISF', 'Pass Obtained'].includes(pass.procedureStage || '')
                  ? 'text-emerald-700'
                  : 'text-amber-700'
              }`}>
                {['Submitted to CISF', 'Pass Obtained'].includes(pass.procedureStage || '') 
                  ? '✓ Approved by C&IT' 
                  : '⏳ C&IT Review in Progress'}
                {pass.citApprovedDate && <span className="block text-[9px] text-slate-500">{pass.citApprovedDate}</span>}
              </div>
              <div className="border-t border-slate-400 pt-1">
                <span className="font-bold text-slate-800 block text-[11px]">NMDC C&IT Department</span>
                <span className="text-[9px] text-slate-500">Head / Approving Authority</span>
              </div>
            </div>

            <div className="space-y-6">
              <div className={`font-mono text-[10px] font-bold ${
                pass.procedureStage === 'Pass Obtained' ? 'text-emerald-700' : 'text-slate-500'
              }`}>
                {pass.procedureStage === 'Pass Obtained' 
                  ? '✓ CISF SECURITY ENDORSED' 
                  : 'CISF GATE ENDORSEMENT'}
                <span className="block text-[9px] font-normal text-slate-600">{pass.gateNumber}</span>
              </div>
              <div className="border-t border-slate-400 pt-1">
                <span className="font-bold text-slate-900 block text-[11px]">CISF Gate In-Charge</span>
                <span className="text-[9px] text-slate-500">Central Industrial Security Force</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
