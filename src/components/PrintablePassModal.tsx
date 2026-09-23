import React, { useState } from 'react';
import { EntryPass, PassEmployee, EmployeeCarriedItem } from '../types';
import { formatGatePassNumber } from '../utils/passUtils';
import { 
  X, 
  Printer, 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Check, 
  Briefcase,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PrintablePassModalProps {
  pass: EntryPass | null;
  onClose: () => void;
}

export const PrintablePassModal: React.FC<PrintablePassModalProps> = ({ pass, onClose }) => {
  // Print layout: 'standard' (Attachment 1 & 2), 'materials' (Material Consignment Pass), 'badge' (Gate Badge)
  const [printLayout, setPrintLayout] = useState<'standard' | 'materials' | 'badge'>(
    pass?.passType === 'Materials' ? 'materials' : 'standard'
  );
  const [includeInstructions, setIncludeInstructions] = useState(true);
  
  // Section filter for preview & printing: 'all' | 'att1' | 'att2'
  const [activeAttachmentFilter, setActiveAttachmentFilter] = useState<'all' | 'att1' | 'att2'>('all');

  // Build complete list of employees covered under this pass
  const employeesList: PassEmployee[] = (pass?.employees && pass.employees.length > 0)
    ? pass.employees
    : [
        {
          id: 'emp-1',
          name: pass?.passHolderName || 'B Shivamurthy',
          designation: pass?.passHolderDesignation || 'Senior Technician',
          idNumber: pass?.passHolderIdProof || '447193919163',
          contactNumber: pass?.passHolderContact || '+91 98450 12345',
          fatherName: 'Basappa',
          sex: 'M',
          age: '59',
          dob: '14.05.1967',
          address: 'Main Road, Sandur, Bellary 583119',
          allowedToCarry: true,
          carriedItems: [
            { slNo: 1, itemName: 'Laptop (Dell Latitude)', nos: '1 Nos', serialNumber: 'DL-884920' },
            { slNo: 2, itemName: 'Optical Power Meter & Toolkit', nos: '1 Set', serialNumber: 'OPM-441' }
          ]
        }
      ];

  // State for carried items per employee in the modal
  const [allowedToCarryMap, setAllowedToCarryMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    employeesList.forEach((emp, idx) => {
      const key = emp.id || String(idx);
      map[key] = emp.allowedToCarry ?? (idx === 0);
    });
    return map;
  });

  const [carriedItemsMap, setCarriedItemsMap] = useState<Record<string, EmployeeCarriedItem[]>>(() => {
    const map: Record<string, EmployeeCarriedItem[]> = {};
    employeesList.forEach((emp, idx) => {
      const key = emp.id || String(idx);
      if (emp.carriedItems && emp.carriedItems.length > 0) {
        map[key] = emp.carriedItems;
      } else {
        map[key] = [
          { slNo: 1, itemName: 'Laptop (Dell Latitude)', nos: '1 Nos', serialNumber: 'DL-884920' },
          { slNo: 2, itemName: 'Optical Power Meter & Toolkit', nos: '1 Set', serialNumber: 'OPM-441' }
        ];
      }
    });
    return map;
  });

  const [editingEmpCarriedId, setEditingEmpCarriedId] = useState<string | null>(null);

  if (!pass) return null;

  // Toggle Allowed to Carry for an employee
  const toggleAllowedToCarry = (empKey: string) => {
    setAllowedToCarryMap((prev) => ({
      ...prev,
      [empKey]: !prev[empKey]
    }));
  };

  // Carried Items handlers
  const handleAddCarriedItem = (empKey: string) => {
    const current = carriedItemsMap[empKey] || [];
    setCarriedItemsMap({
      ...carriedItemsMap,
      [empKey]: [
        ...current,
        {
          id: `citem-${Date.now()}`,
          slNo: current.length + 1,
          itemName: '',
          nos: '1 Nos',
          serialNumber: ''
        }
      ]
    });
  };

  const handleUpdateCarriedItem = (
    empKey: string,
    index: number,
    field: keyof EmployeeCarriedItem,
    val: any
  ) => {
    const current = [...(carriedItemsMap[empKey] || [])];
    if (current[index]) {
      current[index] = { ...current[index], [field]: val };
      setCarriedItemsMap({ ...carriedItemsMap, [empKey]: current });
    }
  };

  const handleRemoveCarriedItem = (empKey: string, index: number) => {
    const current = (carriedItemsMap[empKey] || []).filter((_, i) => i !== index);
    setCarriedItemsMap({ ...carriedItemsMap, [empKey]: current });
  };

  // Format date helper: "18/09/2026"
  const formatDateSlashes = (isoDate?: string) => {
    if (!isoDate) return '18/09/2026';
    try {
      const parts = isoDate.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    } catch (e) {}
    return isoDate;
  };

  // Format date dot helper: "17.09.2026"
  const formatDateDots = (isoDate?: string) => {
    if (!isoDate) return '17.09.2026';
    try {
      const parts = isoDate.split('-');
      if (parts.length === 3) {
        return `${parts[2]}.${parts[1]}.${parts[0]}`;
      }
    } catch (e) {}
    return isoDate;
  };

  const calculateAgeFromDob = (dob?: string): string => {
    if (!dob) return '35';
    try {
      const parts = dob.split(/[./-]/);
      if (parts.length === 3) {
        const year = parseInt(parts[2], 10);
        if (!isNaN(year)) {
          return String(new Date().getFullYear() - year);
        }
      }
    } catch (e) {}
    return '35';
  };

  // Values matching the official standard form
  const contractorName = pass.contractorFirm || 'M/s Amnex Infotechnologies Pvt.Ltd';
  const departmentName = pass.departmentOrProject || 'C&IT DEPARTMENT';
  const gatePassNo = formatGatePassNumber(pass.passNumber);
  const gatePassDate = formatDateSlashes(pass.validFrom);
  const validToDate = formatDateSlashes(pass.validTo);
  const validFromDots = formatDateDots(pass.validFrom);
  const validToDots = formatDateDots(pass.validTo);
  const nameOfWork = pass.nameOfWork || 'UMLMSS Project Work Implementations.';
  const workSiteLocation = pass.gateNumber || 'Admin Building, DIOM, KIOM, PPT';
  
  const defaultWorkOrder = pass.workOrderNo || 
`Letters of Awards of Contract(LAC) Vide
HO(contract)/NMDC/UMLMSS/2025/275/395
HO(contract)/NMDC/UMLMSS/2025/275/396
HO(contract)/NMDC/UMLMSS/2025/275/397`;

  const lacWNoText = 'NMDC/UMLMSS/2025/275 - 395/396\nAnd 397.';

  // Vehicles list for Material consignment layout
  const primaryVehicleNumber = pass.vehicleNumber || 'KA35 B3096';
  const primaryVehicleType = pass.vehicleType || 'Truck';
  const rawVehicles = pass.vehicleNumber 
    ? pass.vehicleNumber.split(/[,/\n]+/).map(v => v.trim()).filter(Boolean)
    : [];

  const vehicleList = rawVehicles.length > 0 
    ? rawVehicles.map((reg, idx) => ({
        slNo: `${idx + 1}.`,
        type: pass.vehicleType || 'Truck',
        regnNo: reg,
        stepney: idx === 0 ? (pass.stepneyAttachment || '---------------------') : ''
      }))
    : [
        {
          slNo: '1.',
          type: primaryVehicleType,
          regnNo: primaryVehicleNumber,
          stepney: pass.stepneyAttachment || '---------------------'
        },
        {
          slNo: '2.',
          type: 'Truck',
          regnNo: 'KA35 B9203',
          stepney: ''
        }
      ];

  const itemsList = (pass.materialItems && pass.materialItems.length > 0)
    ? pass.materialItems
    : [
        {
          id: '1',
          itemName: 'M SANDS',
          quantity: 2,
          unit: 'TRUCKS',
          isBoq: true
        },
        {
          id: '2',
          itemName: '40 MM AGREGADE',
          quantity: 2,
          unit: 'TRUCKS',
          isBoq: true
        }
      ];

  const handlePrint = () => {
    window.print();
  };

  const showAtt1 = activeAttachmentFilter === 'all' || activeAttachmentFilter === 'att1';
  const showAtt2 = activeAttachmentFilter === 'all' || activeAttachmentFilter === 'att2';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-slate-900/80 backdrop-blur-xs overflow-y-auto print:p-0 print:m-0 print:bg-white print:overflow-visible">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-300 overflow-hidden my-auto print:m-0 print:w-full print:max-w-none print:border-none print:shadow-none animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Screen Control Bar (Hidden on print) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 print:hidden border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white">Official Gate Pass & Application Print</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-900/70 text-blue-300 border border-blue-700">
                  Official NMDC Format
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Donimalai Iron Ore Mine • Gate Pass (with separate HOD/In-Charge column) & {employeesList.length} Individual Application Forms
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Format selector */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              {pass.passType === 'Materials' ? (
                <button
                  type="button"
                  onClick={() => setPrintLayout('materials')}
                  className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${
                    printLayout === 'materials' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Material Entry Pass
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setPrintLayout('standard')}
                  className={`px-3 py-1 rounded font-semibold transition cursor-pointer ${
                    printLayout === 'standard' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Official Pass & Forms
                </button>
              )}
              {pass.passType === 'Materials' && (
                <button
                  type="button"
                  onClick={() => setPrintLayout('standard')}
                  className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                    printLayout === 'standard' 
                      ? 'bg-blue-600 text-white shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Employee Forms View
                </button>
              )}
              <button
                type="button"
                onClick={() => setPrintLayout('badge')}
                className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                  printLayout === 'badge' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Gate Badge
              </button>
            </div>

            {printLayout === 'standard' && (
              <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveAttachmentFilter('all')}
                  className={`px-2 py-1 rounded font-semibold transition cursor-pointer ${
                    activeAttachmentFilter === 'all' 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Print all pages"
                >
                  All ({2 + employeesList.length} pgs)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAttachmentFilter('att1')}
                  className={`px-2 py-1 rounded font-semibold transition cursor-pointer ${
                    activeAttachmentFilter === 'att1' 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Attachment No. 1: Gate Pass & Instructions"
                >
                  Gate Pass
                </button>
                <button
                  type="button"
                  onClick={() => setActiveAttachmentFilter('att2')}
                  className={`px-2 py-1 rounded font-semibold transition cursor-pointer ${
                    activeAttachmentFilter === 'att2' 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Attachment No. 2: Employee Application Forms"
                >
                  Applications ({employeesList.length})
                </button>
              </div>
            )}

            {(printLayout === 'standard' || printLayout === 'materials') && (
              <label className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeInstructions}
                  onChange={(e) => setIncludeInstructions(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                />
                <span>Include Page 2 Instructions</span>
              </label>
            )}

            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>

            {/* Close modal */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-4 sm:p-8 bg-slate-100 overflow-y-auto max-h-[85vh] print:p-0 print:m-0 print:max-h-none print:overflow-visible print:bg-white">
          <style>{`
            @media print {
              @page {
                size: A4;
                margin: 10mm;
              }
              body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
              }
              .print-page-container {
                page-break-after: always;
                break-after: page;
                height: 297mm;
                box-sizing: border-box;
                overflow: hidden;
              }
            }
          `}</style>
          
          {printLayout === 'standard' ? (
            /* =========================================================================
               STANDARD OFFICIAL NMDC ENTRY PASS WITH ATTACHMENT 1 & ATTACHMENT 2
               ========================================================================= */
            <div className="space-y-8 print:space-y-0 text-black">
              
              {/* ------------------------- PAGE 1 (GATE PASS) ------------------------- */}
              {showAtt1 && (
                <div className="page-break-after print-page-container bg-white p-8 sm:p-10 shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 font-serif leading-relaxed text-[11pt]">
                  
                  {/* Exact PDF Header with Logo */}
                  <div className="border border-black flex mb-2">
                    <div className="w-[15%] border-r border-black p-1 flex items-center justify-center">
                      <img 
                        src="/nmdc_logo.jpg" 
                        alt="NMDC Logo" 
                        className="max-h-16 w-auto object-contain"
                      />
                    </div>
                    <div className="w-[65%] border-r border-black flex flex-col text-center font-bold">
                      <div className="border-b border-black py-0.5 text-[11pt] uppercase tracking-wider font-black">
                        DONIMALAI COMPLEX
                      </div>
                      <div className="border-b border-black py-0.5 text-[7.5pt] px-1 uppercase leading-tight font-bold">
                        INTEGRATED MANAGEMENT SYSTEM<br/>
                        <span className="text-[6.5pt] font-bold font-sans">(ISO 9001:2015, ISO 14001:2015, OHSAS 45001:2018, SA 8000:2014)</span>
                      </div>
                      <div className="border-b border-black py-0.5 text-[9pt] uppercase tracking-tight font-black">
                        STANDARD OPERATING PROCEDURE (SOP)
                      </div>
                      <div className="py-0.5 text-[8.5pt] font-bold leading-tight flex flex-col justify-center flex-1">
                        <div>Gate Pass Entry at CISF Check Post</div>
                        <div className="font-black uppercase">Employee Gate Pass</div>
                      </div>
                    </div>
                    <div className="w-[20%] flex flex-col text-[7.5pt] font-bold p-1 justify-center border-l-0">
                      <div className="border-b border-black pb-0.5 mb-0.5">Revision No. 00</div>
                      <div className="border-b border-black pb-0.5 mb-0.5">Issue No: 01</div>
                      <div>Date: 16.09.2026</div>
                    </div>
                  </div>

                  <div className="flex justify-between text-[8pt] font-bold italic mb-1">
                    <div>(To be issued by the concerned Head of Department)</div>
                    <div className="not-italic uppercase">Annexure-I</div>
                  </div>

                  {/* Top Details Table with Separate Column for Number */}
                  <table className="w-full border-collapse border border-black text-xs sm:text-[11pt] mb-3">
                    <tbody>
                      {/* Name of department */}
                      <tr className="border border-black">
                        <td colSpan={2} className="w-[42%] p-2 font-bold border-r border-black align-top">
                          Name of department
                        </td>
                        <td className="p-2 font-bold align-top">
                          {departmentName}
                        </td>
                      </tr>

                      {/* Gate Pass No. & Date */}
                      <tr className="border border-black">
                        <td colSpan={2} className="p-2 font-bold border-r border-black align-top">
                          Gate Pass No. & Date
                        </td>
                        <td className="p-2 align-top">
                          <span className="font-bold">{gatePassNo}</span>
                          <span className="ml-3 font-semibold">- Dated :{gatePassDate}</span>
                        </td>
                      </tr>

                      {/* Row 1: Name of Contractor / Firm */}
                      <tr className="border border-black">
                        <td className="w-[8%] p-2 border-r border-black font-bold text-center align-top">
                          1
                        </td>
                        <td className="w-[34%] p-2 border-r border-black font-semibold align-top">
                          Name of Contractor / Firm
                        </td>
                        <td className="p-2 font-bold align-top">
                          {contractorName}
                        </td>
                      </tr>

                      {/* Row 2: Name of work and Reason for entry / exit */}
                      <tr className="border border-black">
                        <td className="p-2 border-r border-black font-bold text-center align-top">
                          2
                        </td>
                        <td className="p-2 border-r border-black font-semibold align-top">
                          <div>Name of work and Reason</div>
                          <div>for entry / exit</div>
                        </td>
                        <td className="p-2 font-bold align-top">
                          {nameOfWork}
                        </td>
                      </tr>

                      {/* Row 3: Work Site / Location */}
                      <tr className="border border-black">
                        <td className="p-2 border-r border-black font-bold text-center align-top">
                          3
                        </td>
                        <td className="p-2 border-r border-black font-semibold align-top">
                          Work Site / Location
                        </td>
                        <td className="p-2 font-bold align-top">
                          {workSiteLocation}
                        </td>
                      </tr>

                      {/* Row 4: Work order No / LOI/Authority Letter */}
                      <tr className="border border-black">
                        <td className="p-2 border-r border-black font-bold text-center align-top">
                          4
                        </td>
                        <td className="p-2 border-r border-black font-semibold align-top">
                          <div>Work order No /</div>
                          <div>LOI/Authority Letter</div>
                        </td>
                        <td className="p-2 font-medium align-top whitespace-pre-line text-[10pt] leading-tight">
                          {defaultWorkOrder}
                        </td>
                      </tr>

                      {/* Row 5: Validity of Gate Pass */}
                      <tr className="border border-black">
                        <td className="p-2 border-r border-black font-bold text-center align-top">
                          5
                        </td>
                        <td className="p-2 border-r border-black font-semibold align-top">
                          Validity of Gate Pass
                        </td>
                        <td className="p-2 font-bold align-top">
                          From:{gatePassDate} to:{validToDate}
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Employees Introduction Statement */}
                  <p className="text-xs sm:text-[10.5pt] my-2.5 font-serif text-slate-900">
                    The following person may please be allowed to entry / exit the check post for the above purpose
                  </p>

                  {/* Summary Table: Lists All Covered Employees */}
                  <table className="w-full border-collapse border border-black text-xs sm:text-[10.5pt] mb-4 text-center">
                    <thead>
                      <tr className="border border-black">
                        <th className="w-[10%] p-2 border-r border-black font-bold">
                          <div>Sl</div>
                          <div>No</div>
                        </th>
                        <th className="p-2 border-r border-black font-bold">
                          Name of the person
                        </th>
                        <th className="w-[28%] p-2 border-r border-black font-bold">
                          <div>Aadhar</div>
                          <div>Number</div>
                        </th>
                        <th className="w-[12%] p-2 border-r border-black font-bold">
                          Sex
                        </th>
                        <th className="w-[12%] p-2 font-bold">
                          Age
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeesList.map((emp, idx) => (
                        <tr key={emp.id || idx} className="border border-black">
                          <td className="p-2 border-r border-black font-bold">
                            {String(idx + 1).padStart(2, '0')}
                          </td>
                          <td className="p-2 border-r border-black font-bold text-center">
                            {emp.name}
                          </td>
                          <td className="p-2 border-r border-black font-mono tracking-wider">
                            {emp.idNumber || '----------------'}
                          </td>
                          <td className="p-2 border-r border-black font-medium">
                            {emp.sex ? emp.sex.charAt(0).toUpperCase() : 'M'}
                          </td>
                          <td className="p-2 font-medium">
                            {emp.age || (emp.dob ? calculateAgeFromDob(emp.dob) : '35')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Gate Pass Issued By Authorization Table with SEPARATE COLUMN for HOD & Engineer In Charge */}
                  <div className="text-xs sm:text-[10.5pt] mb-3">
                    <div className="font-bold mb-1">Gate pass issued by</div>
                    <table className="w-full border-collapse border border-black text-xs sm:text-[10.5pt]">
                      <thead>
                        <tr className="border-b border-black">
                          <th className="w-[22%] p-2 border-r border-black font-bold text-left">Name</th>
                          <th className="p-2 border-r border-black font-bold text-left">Name and Designation</th>
                          <th className="w-[24%] p-2 border-r border-black font-bold text-center">HOD / Engineer In Charge</th>
                          <th className="w-[20%] p-2 font-bold text-left">Signature</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-black">
                          <td className="p-2 border-r border-black font-bold align-top">
                            Checked By
                          </td>
                          <td className="p-2 border-r border-black align-top">
                            <div className="font-bold">Mr Mayur Kant Tripathi</div>
                            <div className="text-slate-800">Dy.G.M (Electrical)/C&IT)</div>
                          </td>
                          <td className="p-2 border-r border-black align-middle text-center text-slate-400">
                            —
                          </td>
                          <td className="p-2 align-bottom h-14">
                            <div className="text-emerald-700 font-mono text-[8pt] italic font-semibold">
                              {pass.citApprovedDate ? `✓ Verified on ${pass.citApprovedDate}` : ''}
                            </div>
                          </td>
                        </tr>
                        <tr className="border-b border-black">
                          <td className="p-2 border-r border-black font-bold align-top">
                            Recommended by
                          </td>
                          <td className="p-2 border-r border-black align-top">
                            <div className="font-bold">Mr.A.V.L.Ramakrishna</div>
                            <div className="text-slate-800">Dy.G.M (C&IT)</div>
                          </td>
                          <td className="p-2 border-r border-black align-middle text-center font-bold text-slate-900">
                            Engineer-in-Charge
                          </td>
                          <td className="p-2 align-bottom h-14">
                            <div className="text-emerald-700 font-mono text-[8pt] italic font-semibold">
                              {pass.recommendedDate ? `✓ Recommended on ${pass.recommendedDate}` : ''}
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td className="p-2 border-r border-black font-bold align-top">
                            Signed By
                          </td>
                          <td className="p-2 border-r border-black align-top">
                            <div className="font-bold">Mr Sreekanth Babu B</div>
                            <div className="text-slate-800">Dy.G.M (C&IT)</div>
                          </td>
                          <td className="p-2 border-r border-black align-middle text-center font-bold text-slate-900">
                            H.O.D
                          </td>
                          <td className="p-2 align-bottom h-14">
                            <div className="text-emerald-700 font-mono text-[8pt] italic font-semibold">
                              {pass.cisfSignatureDate ? `✓ Signed on ${pass.cisfSignatureDate}` : ''}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Clean space for CISF seal and signature at the end of page */}
                  <div className="h-10 sm:h-12 w-full" aria-hidden="true"></div>

                  {/* Triplicate Copy Designation Footer */}
                  <div className="border border-black p-2 mt-2 text-center font-bold tracking-widest text-xs sm:text-[11pt] uppercase flex justify-around">
                    <span>OFFICE COPY</span>
                    <span>|</span>
                    <span>CUSTOMER COPY</span>
                    <span>|</span>
                    <span>CISF COPY</span>
                  </div>
                </div>
              )}

              {/* ------------------------- PAGE 2 (INSTRUCTIONS) ------------------------- */}
              {showAtt1 && includeInstructions && (
                <div className="page-break-after bg-white p-8 sm:p-10 shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 font-serif leading-relaxed text-[11pt] text-slate-900">
                  
                  {/* Header without NMDC Limited or Attachment No */}
                  <div className="text-center font-bold mb-6 pt-2">
                    <h2 className="text-sm sm:text-base font-black uppercase underline decoration-1 underline-offset-4 tracking-wider">
                      INSTRUCTIONS TO THE PASS HOLDERS:
                    </h2>
                  </div>

                  <ol className="space-y-3.5 text-justify list-none pl-0 text-xs sm:text-[10.5pt]">
                    <li className="flex items-start gap-2">
                      <span className="font-bold min-w-5">1.</span>
                      <span>
                        Pass holder(s) must carry their own photo identity Cards issued by the concerned authorities like Election Commission, Employer (in the case of employees), and Head of Institutions/firms etc.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="font-bold min-w-5">2.</span>
                      <span>
                        Pass holder(s) should not proceed for any location, installations etc. other than specified in the Gate Pass.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="font-bold min-w-5">3.</span>
                      <span>
                        It is the responsibility pass holders to observe and abide all statutory / safety rules/ guide lines etc. as applicable in the mine/OSCL Plant/Pellet Plant to avoid any untoward incident. Corporation will not be responsible for any injury, loss, damage etc. caused to the pass holder(s) due to negligence or oversight on their part and they are liable to pay to Corporation if any loss or damage caused to the Corporation.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="font-bold min-w-5">4.</span>
                      <span>
                        The employees engaged by contractors for carrying out contract works in mine area should undergo M V Training and IME (Initial Medical Examination)/PME (Periodical Medical Examination) invariably as per statutes and they should wear all safety appliances as applicable.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="font-bold min-w-5">5.</span>
                      <span>
                        The vehicle(s) entering inside the check post should be road-worthy and the Driver(s) / operator(s) must have adequate experience and valid Driving Licence issued by the concerned Authorities. (The original documents like RC Book, Licence etc. are required to be produced for checking at check post).
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="font-bold min-w-5">6.</span>
                      <span>
                        No person(s) are not allowed to travel on the dump body /uncovered rear portion /carrier of vehicles like Tippers/Trucks/ Tractors /Pick up vans etc. inside the check post.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="font-bold min-w-5">7.</span>
                      <span>
                        Two wheeler are restricted to valley store/Time office (Loading Plant) and it is totally prohibited beyond old VTC / Valley store area and Time office (Loading Plant).
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="font-bold min-w-5">8.</span>
                      <span>
                        Taking video graph / photograph etc. is strictly prohibited inside the check post.
                      </span>
                    </li>

                    <li className="flex items-start gap-2">
                      <span className="font-bold min-w-5">9.</span>
                      <span>
                        Use of mobile phone is prohibited while operating vehicles or equipment.
                      </span>
                    </li>
                  </ol>

                  {/* Declaration by Pass Holder */}
                  <div className="mt-8 pt-6 border-t border-slate-300">
                    <div className="text-center font-bold text-xs sm:text-[11pt] uppercase tracking-wider mb-6">
                      DECLARATION BY PASS HOLDER
                    </div>

                    <p className="text-xs sm:text-[10.5pt] mb-10">
                      All the above instructions are noted for strict compliance.
                    </p>

                    <div className="flex flex-col items-end space-y-2 mt-8 pr-4">
                      <div className="text-xs sm:text-[10.5pt]">
                        Signature: <span className="inline-block border-b border-black w-52 ml-2"></span>
                      </div>
                      <div className="text-xs sm:text-[10.5pt] pt-2 text-right">
                        Name of Pass holder: <strong className="ml-1">{employeesList[0]?.name || pass.passHolderName || 'B Shivamurthy'}</strong>
                      </div>
                      {pass.passHolderContact && (
                        <div className="text-[10pt] text-slate-600">
                          Contact: {pass.passHolderContact}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Instructions page intentionally does NOT have the Office Copy / Customer Copy / CISF Copy footer per user request */}
                  <div className="h-12 w-full" aria-hidden="true"></div>
                </div>
              )}

              {/* ------------------------- INDIVIDUAL APPLICATION FORMS FOR EVERY EMPLOYEE ------------------------- */}
              {showAtt2 && employeesList.map((emp, empIdx) => {
                const empKey = emp.id || String(empIdx);
                const isAllowedToCarry = !!allowedToCarryMap[empKey];
                const carriedItems = carriedItemsMap[empKey] || [];
                const isEditingCarried = editingEmpCarriedId === empKey;

                return (
                  <div 
                    key={`att2-emp-${empKey}`}
                    className="page-break-after bg-white p-8 sm:p-10 shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 font-serif leading-relaxed text-[11pt] text-slate-900"
                  >
                    {/* On-screen control bar for Allowed to carry (Hidden on Print) */}
                    <div className="print:hidden mb-4 bg-slate-50 border border-slate-200 p-2.5 rounded-xl flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-700">
                          Employee #{empIdx + 1}: {emp.name}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ({emp.designation || 'Skilled Labour'})
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 px-2.5 py-1 rounded-lg cursor-pointer hover:bg-slate-50">
                          <input
                            type="checkbox"
                            checked={isAllowedToCarry}
                            onChange={() => toggleAllowedToCarry(empKey)}
                            className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                          />
                          <span>"Allowed to carry" Section</span>
                        </label>

                        {isAllowedToCarry && (
                          <button
                            type="button"
                            onClick={() => setEditingEmpCarriedId(isEditingCarried ? null : empKey)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-lg hover:bg-blue-100 cursor-pointer"
                          >
                            <Briefcase className="w-3.5 h-3.5" />
                            <span>Edit Carried Items ({carriedItems.length})</span>
                            {isEditingCarried ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Interactive Carried Items Editor Box (Hidden on Print) */}
                    {isAllowedToCarry && isEditingCarried && (
                      <div className="print:hidden mb-6 p-3 bg-blue-50/60 rounded-xl border border-blue-200 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-900">
                            Carried Items for {emp.name} (Reflects in the table below)
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddCarriedItem(empKey)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-blue-600 hover:bg-blue-700 px-2.5 py-1 rounded cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Item</span>
                          </button>
                        </div>

                        <div className="space-y-1.5">
                          <div className="grid grid-cols-[45px_1fr_80px_120px_28px] gap-1.5 text-[10px] font-bold text-slate-500 uppercase px-1">
                            <span>Sl No</span>
                            <span>Item Name</span>
                            <span>Nos</span>
                            <span>Sl Number</span>
                            <span></span>
                          </div>
                          {carriedItems.map((cItem, cIdx) => (
                            <div key={cIdx} className="grid grid-cols-[45px_1fr_80px_120px_28px] gap-1.5 items-center">
                              <input
                                type="text"
                                value={cItem.slNo ?? (cIdx + 1)}
                                onChange={(e) => handleUpdateCarriedItem(empKey, cIdx, 'slNo', e.target.value)}
                                className="px-1.5 py-1 text-center bg-white border border-slate-300 rounded text-xs font-bold"
                              />
                              <input
                                type="text"
                                placeholder="Item name & model"
                                value={cItem.itemName}
                                onChange={(e) => handleUpdateCarriedItem(empKey, cIdx, 'itemName', e.target.value)}
                                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                              />
                              <input
                                type="text"
                                placeholder="1 Nos"
                                value={cItem.nos}
                                onChange={(e) => handleUpdateCarriedItem(empKey, cIdx, 'nos', e.target.value)}
                                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs text-center"
                              />
                              <input
                                type="text"
                                placeholder="Serial / Ref No"
                                value={cItem.serialNumber || ''}
                                onChange={(e) => handleUpdateCarriedItem(empKey, cIdx, 'serialNumber', e.target.value)}
                                className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveCarriedItem(empKey, cIdx)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Application Form Title - No NMDC LIMITED or Attachment No on top */}
                    <div className="text-center font-bold mb-6 pt-2">
                      <h2 className="text-sm sm:text-base font-black uppercase underline decoration-1 underline-offset-4 tracking-wider">
                        APPLICATION FORM FOR ISSUING GATE PASS TO CONTRACTOR
                      </h2>
                    </div>

                    {/* Form Details */}
                    <div className="space-y-3 text-xs sm:text-[11pt] mb-6 pl-1">
                      <div className="grid grid-cols-[200px_1fr] items-baseline">
                        <span className="font-bold">Name of Contractor/Firm</span>
                        <span className="font-bold">: {contractorName}</span>
                      </div>

                      <div className="grid grid-cols-[200px_1fr] items-baseline">
                        <span className="font-bold">LAC/W O No</span>
                        <div className="font-semibold whitespace-pre-line">
                          : {lacWNoText}
                        </div>
                      </div>

                      <div className="grid grid-cols-[200px_1fr] items-baseline">
                        <span className="font-bold">Location of Work Site</span>
                        <span className="font-bold">: {workSiteLocation}</span>
                      </div>

                      <div className="grid grid-cols-[200px_1fr] items-baseline">
                        <span className="font-bold">Name of Employee</span>
                        <span className="font-bold text-slate-950 underline decoration-dotted">: {emp.name}</span>
                      </div>

                      <div className="grid grid-cols-[200px_1fr] items-baseline">
                        <span className="font-bold">Father Name</span>
                        <span className="font-bold">: {emp.fatherName || 'Parasappa'}</span>
                      </div>

                      <div className="grid grid-cols-[200px_1fr] items-baseline">
                        <span className="font-bold">Sex & Date of Birth</span>
                        <span className="font-bold">
                          : {emp.sex ? (emp.sex.toUpperCase() === 'F' ? 'Female' : 'Male') : 'Male'} & {emp.dob || (emp.age ? `Age: ${emp.age}` : '01.01.1993')}
                        </span>
                      </div>

                      <div className="grid grid-cols-[200px_1fr] items-baseline">
                        <span className="font-bold">Designation</span>
                        <span className="font-bold">: {emp.designation || 'Skilled Labour'}</span>
                      </div>

                      <div className="grid grid-cols-[200px_1fr] items-baseline">
                        <span className="font-bold">Present Address</span>
                        <span className="font-medium">: {emp.address || '4th Ward, Chapparadahalli, Taranagar, Bellary 583119'}</span>
                      </div>
                    </div>

                    {/* Allowed to carry Table (If enabled) */}
                    {isAllowedToCarry && carriedItems.length > 0 && (
                      <div className="mb-6 space-y-1.5">
                        <div className="font-bold underline text-xs sm:text-[11pt]">
                          Allowed to carry :
                        </div>
                        <table className="w-full border-collapse border border-black text-xs sm:text-[10pt]">
                          <thead>
                            <tr className="border border-black bg-slate-50 print:bg-transparent">
                              <th className="w-[10%] p-1.5 border-r border-black font-bold text-center">Sl. No.</th>
                              <th className="p-1.5 border-r border-black font-bold text-left">Item Name</th>
                              <th className="w-[18%] p-1.5 border-r border-black font-bold text-center">Nos</th>
                              <th className="w-[26%] p-1.5 font-bold text-center">Sl Number</th>
                            </tr>
                          </thead>
                          <tbody>
                            {carriedItems.map((item, cIdx) => (
                              <tr key={cIdx} className="border border-black">
                                <td className="p-1.5 border-r border-black font-bold text-center">
                                  {item.slNo ?? (cIdx + 1)}
                                </td>
                                <td className="p-1.5 border-r border-black font-medium">
                                  {item.itemName}
                                </td>
                                <td className="p-1.5 border-r border-black font-bold text-center">
                                  {item.nos}
                                </td>
                                <td className="p-1.5 font-mono text-[9pt] text-center">
                                  {item.serialNumber || '—'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Signature of Contractor */}
                    <div className="mb-6 pt-1">
                      <div className="font-bold underline text-xs sm:text-[11pt]">
                        Signature of Contractor/Authorized Signatory.
                      </div>
                    </div>

                    {/* Issuing Department Declaration */}
                    <div className="mb-6 space-y-1.5">
                      <div className="font-bold underline text-xs sm:text-[11pt]">
                        ISSUING DEPARTMENT.
                      </div>
                      <p className="text-xs sm:text-[11pt] font-medium leading-relaxed">
                        Temporary Gate Pass may please be issued to the above person for a period from <span className="font-bold">{validFromDots}</span> to <span className="font-bold">{validToDots}</span> (Sundays and Holidays)
                      </p>
                    </div>

                    {/* Gate pass issued by Table - ONLY SREEKANTH BABU NAME AS EXPLICITLY REQUESTED */}
                    <div className="text-xs sm:text-[10.5pt] mb-6">
                      <div className="font-bold mb-1">Gate pass issued by:</div>
                      <table className="w-full border-collapse border border-black text-xs sm:text-[10.5pt]">
                        <thead>
                          <tr className="border-b border-black">
                            <th className="w-[28%] p-2 border-r border-black font-bold text-left">Name</th>
                            <th className="p-2 border-r border-black font-bold text-left">Name and Designation</th>
                            <th className="w-[28%] p-2 font-bold text-left">Signature</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="p-2 border-r border-black font-bold align-top">
                              Signed By
                            </td>
                            <td className="p-2 border-r border-black align-top">
                              <div className="font-bold">Mr Sreekanth Babu B</div>
                              <div className="text-slate-800">Dy.G.M (C&IT)</div>
                              <div className="text-slate-700 italic">H.O.D</div>
                            </td>
                            <td className="p-2 align-bottom h-16">
                              <div className="text-emerald-700 font-mono text-[8pt] italic font-semibold">
                                {pass.cisfSignatureDate ? `✓ Signed on ${pass.cisfSignatureDate}` : ''}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Space and Triplicate Copy Footer */}
                    <div className="h-6 sm:h-8 w-full" aria-hidden="true"></div>
                    <div className="border border-black p-2 mt-4 text-center font-bold tracking-widest text-xs sm:text-[11pt] uppercase flex justify-around">
                      <span>OFFICE COPY</span>
                      <span>|</span>
                      <span>CUSTOMER COPY</span>
                      <span>|</span>
                      <span>CISF COPY</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : printLayout === 'materials' ? (
            /* =========================================================================
               SEPARATE MATERIALS ENTRY PASS FORMAT (Exact PDF Replica)
               ========================================================================= */
            <div className="space-y-6">
              {/* -------------------------------------------------------------
                  PAGE 1: MATERIAL ENTRY PASS & AUTHORIZATION
                  ------------------------------------------------------------- */}
              <div className="print-page-container bg-white p-6 sm:p-8 shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 font-serif leading-tight text-[9.5pt]">
                {/* Exact PDF Header */}
                <div className="border border-black flex mb-2">
                  <div className="w-[15%] border-r border-black p-1 flex items-center justify-center">
                    <img 
                      src="/nmdc_logo.jpg" 
                      alt="NMDC Logo" 
                      className="max-h-16 w-auto object-contain"
                    />
                  </div>
                  <div className="w-[65%] border-r border-black flex flex-col text-center font-bold">
                    <div className="border-b border-black py-0.5 text-[11pt] uppercase tracking-wider font-black">
                      DONIMALAI COMPLEX
                    </div>
                    <div className="border-b border-black py-0.5 text-[7.5pt] px-1 uppercase leading-tight font-bold">
                      INTEGRATED MANAGEMENT SYSTEM<br/>
                      <span className="text-[6.5pt] font-bold font-sans">(ISO 9001:2015, ISO 14001:2015, OHSAS 45001:2018, SA 8000:2014)</span>
                    </div>
                    <div className="border-b border-black py-0.5 text-[9pt] uppercase tracking-tight font-black">
                      STANDARD OPERATING PROCEDURE (SOP)
                    </div>
                    <div className="py-0.5 text-[8.5pt] font-bold leading-tight flex flex-col justify-center flex-1">
                      <div>Material Gate Pass Entry at CISF Check Post</div>
                      <div className="font-black uppercase">{pass.materialCategory === 'Non-Returnable' ? 'Non-Returnable' : 'Returnable'} Material Gate Pass</div>
                    </div>
                  </div>
                  <div className="w-[20%] flex flex-col text-[7.5pt] font-bold p-1 justify-center border-l-0">
                    <div className="border-b border-black pb-0.5 mb-0.5">Revision No. 00</div>
                    <div className="border-b border-black pb-0.5 mb-0.5">Issue No: 01</div>
                    <div>Date: 16.09.2026</div>
                  </div>
                </div>

                <div className="flex justify-between text-[8pt] font-bold italic mb-1">
                  <div>(To be issued by the concerned Head of Department)</div>
                  <div className="not-italic uppercase">Annexure-I</div>
                </div>

                {/* Top Details Table */}
                <table className="w-full border-collapse border border-black text-[7.5pt] mb-1">
                  <tbody>
                    <tr className="border-b border-black">
                      <td className="w-[45%] py-0.5 px-2 font-bold border-r border-black">
                        Name of Department
                      </td>
                      <td className="py-0.5 px-2 font-bold uppercase">
                        {departmentName}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="py-0.5 px-2 font-bold border-r border-black">
                        Gatepass No & Date
                      </td>
                      <td className="py-0.5 px-2">
                        <div className="flex justify-between items-center w-full">
                          <span className="font-bold">{gatePassNo}</span>
                          <span className="font-semibold pr-8">{gatePassDate} No</span>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="py-0.5 px-2 border-r border-black">
                        <span className="font-bold mr-2">1.</span>
                        <span className="font-semibold">Name of Contractor/Firm</span>
                      </td>
                      <td className="py-0.5 px-2 font-bold uppercase">
                        {contractorName}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="py-0.5 px-2 border-r border-black">
                        <span className="font-bold mr-2">2.</span>
                        <span className="font-semibold">Name of Work/Purpose</span>
                      </td>
                      <td className="py-0.5 px-2 font-bold">
                        {nameOfWork}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="py-0.5 px-2 border-r border-black">
                        <span className="font-bold mr-2">3.</span>
                        <span className="font-semibold">Work Site/Location</span>
                      </td>
                      <td className="py-0.5 px-2 font-bold uppercase">
                        {workSiteLocation}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="py-0.5 px-2 border-r border-black">
                        <span className="font-bold mr-2">4.</span>
                        <span className="font-semibold">Workorder No/LOI/Authority Letter</span>
                      </td>
                      <td className="py-0.5 px-2 text-[7pt] leading-tight whitespace-pre-line">
                        {defaultWorkOrder}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="py-0.5 px-2 border-r border-black">
                        <span className="font-bold mr-2">5.</span>
                        <span className="font-semibold">Validity of Gatepass</span>
                      </td>
                      <td className="py-0.5 px-2 font-bold">
                        {gatePassDate} to {validToDate}
                      </td>
                    </tr>
                    <tr className="border-b border-black">
                      <td className="py-0.5 px-2 border-r border-black">
                        <span className="font-bold mr-2">6.</span>
                        <span className="font-semibold">No. Of Persons Allowed</span>
                      </td>
                      <td className="py-0.5 px-2 font-bold">
                        {String(employeesList.length).padStart(2, '0')}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Details of Persons */}
                <div className="font-bold text-[8pt] mb-0.5">Details of Persons:</div>
                <table className="w-full border-collapse border border-black text-[7pt] mb-1">
                  <thead>
                    <tr className="border-b border-black text-left font-bold">
                      <th className="w-[5%] border-r border-black p-0.5">Sl.<br/>No</th>
                      <th className="w-[30%] border-r border-black p-0.5 pl-1">Name</th>
                      <th className="w-[8%] border-r border-black p-0.5">Sex</th>
                      <th className="w-[7%] border-r border-black p-0.5 text-center">Age</th>
                      {employeesList.length > 1 && (
                        <>
                          <th className="w-[5%] border-r border-black p-0.5">Sl.No</th>
                          <th className="w-[30%] border-r border-black p-0.5 pl-1">Name</th>
                          <th className="w-[8%] border-r border-black p-0.5">Sex</th>
                          <th className="w-[7%] p-0.5 text-center">Age</th>
                        </>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {employeesList.length > 1 ? (
                      [...Array(Math.ceil(employeesList.length / 2))].map((_, i) => {
                        const p1 = employeesList[i * 2];
                        const p2 = employeesList[i * 2 + 1];
                        return (
                          <tr key={i} className="border-b border-black last:border-b-0 h-4">
                            <td className="border-r border-black p-0.5 text-center font-bold">{i * 2 + 1}.</td>
                            <td className="border-r border-black p-0.5 pl-1 font-bold uppercase">{p1?.name || ""}</td>
                            <td className="border-r border-black p-0.5 uppercase">{p1?.sex || ""}</td>
                            <td className="border-r border-black p-0.5 text-center font-bold">{p1?.age || ""}</td>
                            <td className="border-r border-black p-0.5 text-center font-bold">{i * 2 + 2}.</td>
                            <td className="border-r border-black p-0.5 pl-1 font-bold uppercase">{p2?.name || ""}</td>
                            <td className="border-r border-black p-0.5 uppercase">{p2?.sex || ""}</td>
                            <td className="p-0.5 text-center font-bold">{p2?.age || ""}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr className="h-4">
                        <td className="border-r border-black p-0.5 text-center font-bold">1.</td>
                        <td className="border-r border-black p-0.5 pl-1 font-bold uppercase">{employeesList[0]?.name || ""}</td>
                        <td className="border-r border-black p-0.5 uppercase">{employeesList[0]?.sex || ""}</td>
                        <td className="border-r border-black p-0.5 text-center font-bold">{employeesList[0]?.age || ""}</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Details of Vehicle */}
                <div className="font-bold text-[8pt] mb-0.5">Details of Vehicle:</div>
                <table className="w-full border-collapse border border-black text-[7pt] text-center mb-1">
                  <thead>
                    <tr className="border-b border-black font-bold">
                      <th className="w-[5%] border-r border-black p-0.5">Sl.<br/>No</th>
                      <th className="w-[35%] border-r border-black p-0.5">Type of Vehicle</th>
                      <th className="w-[20%] border-r border-black p-0.5">Registration No</th>
                      <th className="w-[20%] border-r border-black p-0.5 leading-tight">Condition<br/>Loaded/Empty</th>
                      <th className="w-[20%] p-0.5 leading-tight">Attachment<br/>Stepney if any</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleList.length > 0 ? (
                      vehicleList.map((v, i) => (
                        <tr key={i} className="border-b border-black last:border-b-0 h-5">
                          <td className="border-r border-black p-0.5 font-bold">{i + 1}</td>
                          <td className="border-r border-black p-0.5 font-bold uppercase">{v.type}</td>
                          <td className="border-r border-black p-0.5 font-black uppercase tracking-wider">{v.regnNo}</td>
                          <td className="border-r border-black p-0.5 font-bold uppercase">Loaded</td>
                          <td className="p-0.5 text-[6.5pt] uppercase">{v.stepney || "NIL"}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="h-5">
                        <td className="border-r border-black p-0.5 font-bold">1</td>
                        <td className="border-r border-black p-0.5 font-bold">{pass.vehicleType || "Mahindra Bolero"}</td>
                        <td className="border-r border-black p-0.5 font-black uppercase tracking-wider">{pass.vehicleNumber || "KA 35 P 4102"}</td>
                        <td className="border-r border-black p-0.5 font-bold uppercase">Loaded</td>
                        <td className="p-0.5 text-[6.5pt] uppercase">NIL</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Wrapper for Items + Signatures to handle conditional page breaking */}
                <div className="break-inside-avoid print:break-inside-avoid">
                  {/* List of Items Grid Table */}
                  <div className="text-[7pt] font-black italic mb-0.5">
                    List of Items , Tools and Tackles carried along with the above persons if any , for more items attach separate list
                  </div>
                  <table className="w-full border-collapse border border-black text-[7.5pt] mb-1.5">
                    <thead>
                      <tr className="border-b border-black font-bold">
                        <th className="w-[4%] border-r border-black p-0.5">Sl<br/>No</th>
                        <th className="border-r border-black p-0.5 text-left pl-1.5">Name, Nomenclature of item</th>
                        <th className="w-[8%] border-r border-black p-0.5">Unit</th>
                        <th className="w-[6%] border-r border-black p-0.5">Qty</th>
                        {itemsList.length > 4 && (
                          <>
                            <th className="w-[4%] border-r border-black p-0.5">Sl<br/>No</th>
                            <th className="w-[36%] border-r border-black p-0.5 text-left pl-1.5">Name, Nomenclature of item</th>
                            <th className="w-[8%] border-r border-black p-0.5">Unit</th>
                            <th className="w-[6%] p-0.5">Qty</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {itemsList.length > 4 ? (
                        [...Array(Math.ceil(itemsList.length / 2))].map((_, i) => {
                          const item1 = itemsList[i * 2];
                          const item2 = itemsList[i * 2 + 1];
                          return (
                            <tr key={i} className="border-b border-black last:border-b-0 h-5">
                              <td className="border-r border-black p-0.5 text-center font-bold">{i * 2 + 1}</td>
                              <td className="border-r border-black p-0.5 pl-1.5 font-bold overflow-hidden whitespace-nowrap text-ellipsis max-w-0">{item1?.itemName || ""}</td>
                              <td className="border-r border-black p-0.5 text-center uppercase">{item1?.unit || ""}</td>
                              <td className="border-r border-black p-0.5 text-center font-bold">{item1?.quantity || ""}</td>
                              <td className="border-r border-black p-0.5 text-center font-bold">{i * 2 + 2}</td>
                              <td className="border-r border-black p-0.5 pl-1.5 font-bold overflow-hidden whitespace-nowrap text-ellipsis max-w-0">{item2?.itemName || ""}</td>
                              <td className="border-r border-black p-0.5 text-center uppercase">{item2?.unit || ""}</td>
                              <td className="p-0.5 text-center font-bold">{item2?.quantity || ""}</td>
                            </tr>
                          );
                        })
                      ) : (
                        itemsList.map((item, i) => (
                          <tr key={i} className="border-b border-black last:border-b-0 h-5">
                            <td className="border-r border-black p-0.5 text-center font-bold">{i + 1}</td>
                            <td className="border-r border-black p-0.5 pl-1.5 font-bold">{item.itemName}</td>
                            <td className="border-r border-black p-0.5 text-center uppercase">{item.unit || ""}</td>
                            <td className="p-0.5 text-center font-bold">{item.quantity || ""}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>

                  {/* Gate Pass Authorization Table */}
                  <table className="w-full border-collapse border border-black text-[7.5pt] mb-2">
                    <tbody>
                      <tr className="border-b border-black h-4">
                        <td className="w-[28%] border-r border-black px-2 font-bold py-0.5">Gate pass</td>
                        <td className="w-[24%] border-r border-black px-2 font-bold py-0.5">Checked By</td>
                        <td className="w-[24%] border-r border-black px-2 font-bold py-0.5">Recommended By</td>
                        <td className="w-[24%] px-2 font-bold py-0.5">Issued By</td>
                      </tr>
                      <tr className="border-b border-black h-12">
                        <td className="border-r border-black px-2 font-bold align-top pt-1">Signature</td>
                        <td className="border-r border-black relative text-center">
                          <div className="text-emerald-700 font-mono text-[7pt] italic font-semibold rotate-[-3deg] opacity-80 leading-none">
                            {pass.citApprovedDate ? `Verified: ${pass.citApprovedDate}` : ''}
                          </div>
                        </td>
                        <td className="border-r border-black relative text-center">
                          <div className="text-emerald-700 font-mono text-[7pt] italic font-semibold rotate-[-3deg] opacity-80 leading-none">
                            {pass.recommendedDate ? `Rec: ${pass.recommendedDate}` : ''}
                          </div>
                        </td>
                        <td className="relative text-center">
                          <div className="text-emerald-700 font-mono text-[7pt] italic font-semibold rotate-[-3deg] opacity-80 leading-none">
                            {pass.cisfSignatureDate ? `Signed: ${pass.cisfSignatureDate}` : ''}
                          </div>
                        </td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black px-2 font-bold py-0.5">Name</td>
                        <td className="border-r border-black px-2 font-black py-0.5 uppercase leading-tight">Mr. Mayur Kant Tripathi</td>
                        <td className="border-r border-black px-2 font-black py-0.5 uppercase leading-tight">A.V.L Ramakrishna</td>
                        <td className="px-2 font-black py-0.5 uppercase leading-tight">Sreekanth Babu B</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black px-2 font-bold py-0.5">Designation</td>
                        <td className="border-r border-black px-2 font-bold py-0.5 uppercase leading-tight">DGM(Electrical) /(C&IT)</td>
                        <td className="border-r border-black px-2 font-bold py-0.5 uppercase leading-tight">DGM(C&IT)</td>
                        <td className="px-2 font-bold py-0.5 uppercase leading-tight">DGM(C&IT)/HOD</td>
                      </tr>
                      <tr className="border-b border-black">
                        <td className="border-r border-black px-2 font-bold py-0.5 uppercase tracking-tighter leading-none">Contact No/Mobile</td>
                        <td className="border-r border-black px-2 font-bold py-0.5">8148594570</td>
                        <td className="border-r border-black px-2 font-bold py-0.5">9754233182</td>
                        <td className="px-2 font-bold py-0.5">9032639870</td>
                      </tr>
                      <tr className="border-b-0">
                        <td className="border-r border-black px-2 font-bold py-0.5">Department</td>
                        <td className="border-r border-black px-2 font-bold py-0.5 uppercase">C&IT</td>
                        <td className="border-r border-black px-2 font-bold py-0.5 uppercase">C&IT</td>
                        <td className="px-2 font-bold py-0.5 uppercase">C&IT</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Triplicate Copy Footer Partitioned (Signature area is ABOVE these boxes) */}
                  <table className="w-full border-collapse border border-black text-center text-[5pt] font-black uppercase tracking-wider mt-2">
                    <tbody>
                      <tr>
                        <td className="w-1/3 border-r border-black p-0 h-4 align-middle">
                          (1) OFFICE COPY
                        </td>
                        <td className="w-1/3 border-r border-black p-0 h-4 align-middle">
                          (2) CUSTOMER COPY
                        </td>
                        <td className="w-1/3 p-0 h-4 align-middle">
                          (3) CISF COPY
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  PAGE 2: INSTRUCTIONS TO THE PASS HOLDER(S)
                  ------------------------------------------------------------- */}
              {includeInstructions && (
                <div className="page-break-before print-page-container bg-white p-8 sm:p-12 shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 font-serif text-[10.5pt] mt-6 print:mt-0 leading-snug">
                  <div className="text-left font-black mb-6 uppercase underline tracking-tight">
                    INSTRUCTIONS TO THE PASS HOLDER(S)
                  </div>

                  <div className="space-y-4 text-justify">
                    <div className="flex gap-2">
                      <span className="shrink-0 font-bold">(01)</span>
                      <span>Pass holder(s) shall carry a valid photo identity card issued by the concerned authority / employer and produce it for verification whenever required.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="shrink-0 font-bold">(02)</span>
                      <span>Pass holder(s) shall proceed only to the location(s) and for the purpose specified in the Gate Pass.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="shrink-0 font-bold">(03)</span>
                      <span>Vehicles entering the premises shall be roadworthy. Drivers / operators shall possess valid driving licences and other applicable documents. Relevant documents shall be produced for verification at the security / CISF check post whenever required.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="shrink-0 font-bold">(04)</span>
                      <span>Photography, videography or recording inside restricted / prohibited areas is strictly prohibited unless specifically authorized.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="shrink-0 font-bold">(05)</span>
                      <span>Use of mobile phones while driving or operating vehicles / equipment is strictly prohibited.</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="shrink-0 font-bold">(06)</span>
                      <span>The Gate Pass is non-transferable and shall be used only during its specified validity period. The pass shall be surrendered / returned to the concerned authority on expiry or completion of the permitted work.</span>
                    </div>
                  </div>

                  <div className="mt-12 space-y-6">
                    <div className="font-black uppercase tracking-tight">
                      DECLARATION BY PASS HOLDER
                    </div>
                    <div className="text-[10pt]">
                      I / We have read and understood the above instructions and undertake to comply with them strictly.
                    </div>

                    <div className="pt-8 space-y-6 flex flex-col items-end">
                      <div className="w-full flex justify-end items-center gap-2">
                        <span className="font-bold">Signature:</span>
                        <div className="border-b border-black w-64 h-5"></div>
                      </div>
                      <div className="w-full flex justify-end items-center gap-2">
                        <span className="font-bold">Name of Pass Holder:</span>
                        <div className="border-b border-black w-64 h-5"></div>
                      </div>
                      <div className="w-full flex justify-end items-center gap-2">
                        <span className="font-bold">Date:</span>
                        <div className="border-b border-black w-64 h-5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* -------------------------------------------------------------
                  PAGE 3: REQUEST FOR PASS FOR BOQ ITEMS (Non-Returnable Only)
                  ------------------------------------------------------------- */}
              {pass.materialCategory === 'Non-Returnable' && (
                <div className="page-break-before print-page-container bg-white p-8 sm:p-10 shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 font-serif text-[10pt] mt-6 print:mt-0 min-h-[1050px]">
                  <div className="text-center mb-8">
                    <h2 className="text-[15pt] font-black uppercase underline underline-offset-4 tracking-tight">Request for Pass for BOQ Items</h2>
                    <h3 className="text-[13pt] font-bold mt-1">Amnex Infotechnologies</h3>
                  </div>

                  <table className="w-full border-collapse border border-black text-[9pt]">
                    <thead>
                      <tr className="bg-slate-50 print:bg-transparent font-bold">
                        <th className="border border-black p-2 w-[8%] text-center">SL No</th>
                        <th className="border border-black p-2 w-[14%] text-left">BOQ Number</th>
                        <th className="border border-black p-2 w-[14%] text-left">BOQ Item</th>
                        <th className="border border-black p-2 text-left">Name of the Item</th>
                        <th className="border border-black p-2 w-[12%] text-left">OEM</th>
                        <th className="border border-black p-2 w-[16%] text-left">OEM Model and Make</th>
                        <th className="border border-black p-2 w-[8%] text-center">Qty</th>
                      </tr>
                    </thead>
                    <tbody>
                      {itemsList.map((item, idx) => (
                        <tr key={idx} className="h-10">
                          <td className="border border-black p-2 text-center font-bold">{idx + 1}</td>
                          <td className="border border-black p-2 uppercase font-mono text-[8pt]">{item.boqNumber || "---"}</td>
                          <td className="border border-black p-2 uppercase font-mono text-[8pt]">{item.boqItemNumber || "---"}</td>
                          <td className="border border-black p-2 font-bold uppercase">{item.itemName}</td>
                          <td className="border border-black p-2 uppercase">{item.oem || "---"}</td>
                          <td className="border border-black p-2 uppercase">{item.oemModel || "---"}</td>
                          <td className="border border-black p-2 text-center font-bold">{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-20 flex justify-start px-10">
                    <div className="text-center">
                      <div className="h-16 w-52 border-b border-black mb-2 flex items-end justify-center">
                        <span className="text-[7pt] text-slate-400 italic mb-1">Amnex Authorized Signatory</span>
                      </div>
                      <div className="font-black text-[11pt] uppercase">Requested By</div>
                      <div className="text-[9pt] font-bold">Amnex Infotechnologies</div>
                    </div>
                  </div>
                  
                  <div className="mt-20 text-[9pt] italic text-slate-600">
                    * This is a supplemental document for Non-Returnable material gate passes containing BOQ specific details for project audit and inventory tracking.
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* =========================================================================
               GATE ID BADGE LAYOUT (Compact Security Card Format)
               ========================================================================= */
            <div className="print-page-container bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm max-w-xl mx-auto space-y-4 text-slate-900">
              <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500">NMDC , Donimalai</div>
                  <h1 className="text-lg font-black uppercase text-slate-900">Security Gate Entry Pass</h1>
                  <div className="text-xs font-semibold text-blue-700">Vendor: Amnex Infotechnologies Pvt. Ltd.</div>
                </div>
                <div className="text-right border border-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                  <span className="text-[8px] block font-bold text-emerald-900">SECURITY</span>
                  <span className="text-[10px] font-black text-emerald-800">CISF UNIT</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 block">Pass No:</span>
                  <span className="font-mono font-bold text-slate-900">{pass.passNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Type:</span>
                  <span className="font-bold text-blue-700">{pass.passType} ({pass.materialCategory || 'General'})</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Designated Gate:</span>
                  <span className="font-bold text-slate-900">{pass.gateNumber}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block">Validity:</span>
                  <span className="font-bold text-rose-700">{pass.validFrom} to {pass.validTo}</span>
                </div>
              </div>

              <div className="border border-slate-200 rounded-lg p-3 text-xs">
                <div className="font-bold text-slate-800 text-sm mb-1">{employeesList[0]?.name || pass.passHolderName}</div>
                <div className="text-slate-600">{employeesList[0]?.designation || pass.passHolderDesignation || 'Authorized Representative'} • {departmentName}</div>
                {pass.vehicleNumber && (
                  <div className="mt-2 text-xs font-mono font-bold bg-amber-50 border border-amber-200 p-2 rounded text-amber-900">
                    Vehicle: {pass.vehicleNumber} ({pass.vehicleType || 'Truck'})
                  </div>
                )}
              </div>

              {employeesList.length > 1 && (
                <div className="border border-slate-200 rounded-lg p-3 text-xs">
                  <div className="font-bold text-slate-800 mb-1">Other Personnel Covered ({employeesList.length}):</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {employeesList.map((emp, i) => (
                      <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-[11px] font-semibold">
                        {emp.name} ({emp.designation || 'Staff'})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t border-slate-300 pt-3 flex justify-between text-[10px] text-slate-500">
                <span>Issued by C&IT / CISF Check Post</span>
                <span>Carry Photo ID at all times</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
