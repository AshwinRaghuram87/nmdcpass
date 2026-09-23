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
          
          {printLayout === 'standard' ? (
            /* =========================================================================
               STANDARD OFFICIAL NMDC ENTRY PASS WITH ATTACHMENT 1 & ATTACHMENT 2
               ========================================================================= */
            <div className="space-y-8 print:space-y-0 text-black">
              
              {/* ------------------------- PAGE 1 (GATE PASS) ------------------------- */}
              {showAtt1 && (
                <div className="page-break-after bg-white p-8 sm:p-10 shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 font-serif leading-relaxed text-[11pt]">
                  
                  {/* Document Header - No NMDC LIMITED or Attachment No on top */}
                  <div className="text-center font-bold space-y-1 mb-4 pt-1">
                    <div className="text-base sm:text-lg tracking-wider uppercase font-black font-serif">
                      DONIMALAI IRON ORE MINE
                    </div>
                    <div className="text-sm sm:text-base tracking-wide font-black uppercase underline decoration-1 underline-offset-4">
                      GATEPASS
                    </div>
                    <div className="text-xs sm:text-sm font-semibold italic text-slate-800 font-serif">
                      (To be issued by the concerned Head of department)
                    </div>
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
               SEPARATE MATERIALS ENTRY PASS FORMAT (Exact PDF Page 1 & Page 2)
               ========================================================================= */
            <div className="space-y-6">
              {/* -------------------------------------------------------------
                  PAGE 1: MATERIAL ENTRY PASS & AUTHORIZATION
                  ------------------------------------------------------------- */}
              <div className="page-break-after bg-white p-8 sm:p-10 shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 font-serif leading-relaxed text-[11pt]">
                {/* Header */}
                <div className="text-center font-bold space-y-1 mb-5">
                  <div className="text-base sm:text-lg tracking-wider uppercase font-black font-serif">
                    DONIMALAI IRON ORE MINE
                  </div>
                  <div className="text-sm sm:text-base tracking-wide font-black uppercase underline decoration-1 underline-offset-4">
                    ENTRY PASS ({pass.materialCategory === 'Non-Returnable' ? 'Non -Returnable' : 'Returnable'})
                  </div>
                  <div className="text-xs sm:text-sm font-semibold italic text-slate-800 font-serif">
                    (To be issued by the concerned Head of Department)
                  </div>
                </div>

                {/* Top Details Table */}
                <table className="w-full border-collapse border border-black text-xs sm:text-[11pt] mb-3">
                  <tbody>
                    <tr className="border border-black">
                      <td className="w-[38%] p-2 font-bold border-r border-black align-top">
                        Name of department
                      </td>
                      <td className="p-2 font-bold align-top">
                        {departmentName}
                      </td>
                    </tr>
                    <tr className="border border-black">
                      <td className="p-2 font-bold border-r border-black align-top">
                        Gate Pass No. & Date
                      </td>
                      <td className="p-2 align-top">
                        <span className="font-bold">{gatePassNo}</span>
                        <span className="ml-4 font-semibold">Dt. -{gatePassDate}</span>
                      </td>
                    </tr>
                    <tr className="border border-black">
                      <td className="p-2 border-r border-black align-top">
                        <span className="font-bold mr-1">1.</span>
                        <span className="font-semibold">Name of Contractor/firm</span>
                      </td>
                      <td className="p-2 font-bold align-top">
                        {contractorName}
                      </td>
                    </tr>
                    <tr className="border border-black">
                      <td className="p-2 border-r border-black align-top">
                        <span className="font-bold mr-1">2.</span>
                        <div className="inline font-semibold">
                          Name of work and<br />
                          Reason for entry / exit
                        </div>
                      </td>
                      <td className="p-2 align-top">
                        {nameOfWork}
                      </td>
                    </tr>
                    <tr className="border border-black">
                      <td className="p-2 border-r border-black align-top">
                        <span className="font-bold mr-1">3</span>
                        <span className="font-semibold">Work Site/Location</span>
                      </td>
                      <td className="p-2 font-bold align-top">
                        {workSiteLocation}
                      </td>
                    </tr>
                    <tr className="border border-black">
                      <td className="p-2 border-r border-black align-top">
                        <span className="font-bold mr-1">4</span>
                        <span className="font-semibold">Work order No./LOI/Authority Letter</span>
                      </td>
                      <td className="p-2 align-top whitespace-pre-line text-[10pt] leading-tight">
                        {defaultWorkOrder}
                      </td>
                    </tr>
                    <tr className="border border-black">
                      <td className="p-2 border-r border-black align-top">
                        <span className="font-bold mr-1">5</span>
                        <span className="font-semibold">Validity of Gate Pass (Date &Time)</span>
                      </td>
                      <td className="p-2 font-bold align-top">
                        {gatePassDate} to {validToDate}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Vehicle Table 1 */}
                <table className="w-full border-collapse border border-black text-xs sm:text-[11pt] mb-3 text-center">
                  <thead>
                    <tr className="border border-black">
                      <th className="w-[12%] p-2 border-r border-black font-bold">Sl.No.</th>
                      <th className="w-[26%] p-2 border-r border-black font-bold">Type of vehicle</th>
                      <th className="w-[26%] p-2 border-r border-black font-bold">Regn. No.</th>
                      <th className="p-2 font-bold">Attachment/Stepney if Any</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleList.map((v) => (
                      <tr key={v.slNo} className="border border-black">
                        <td className="p-2 border-r border-black font-bold">{v.slNo}</td>
                        <td className="p-2 border-r border-black">{v.type}</td>
                        <td className="p-2 border-r border-black font-bold tracking-wider">{v.regnNo}</td>
                        <td className="p-2 text-slate-700">{v.stepney}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Vehicle Permission Text */}
                <div className="text-xs sm:text-[10.5pt] mb-2 font-medium">
                  The following vehicle(s)/ may please be allowed to ENTRY ({pass.materialCategory === 'Non-Returnable' ? 'Non Returnable' : 'Returnable'}) the check post for the above purpose.
                </div>

                {/* Second Table: Vehicle Condition & Material Items with blue nested header */}
                <table className="w-full border-collapse border border-black text-xs sm:text-[10pt] mb-3">
                  <thead>
                    <tr className="border border-black text-center font-bold">
                      <th className="w-[8%] p-1.5 border-r border-black align-middle">Sl.No.</th>
                      <th className="w-[16%] p-1.5 border-r border-black align-middle">Type of<br />vehicle</th>
                      <th className="w-[18%] p-1.5 border-r border-black align-middle">Regn.<br />No.</th>
                      <th className="w-[14%] p-1.5 border-r border-black align-middle">
                        Condition<br />
                        <span className="font-semibold text-[9pt]">Loaded /empty</span>
                      </th>
                      <th className="p-1.5 font-bold align-middle">
                        {pass.materialCategory === 'Non-Returnable' ? 'Non Returnable Items' : 'Returnable Items'}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border border-black">
                      <td className="p-2 border-r border-black text-center font-bold align-middle">
                        1
                      </td>
                      <td className="p-2 border-r border-black text-center align-middle font-medium">
                        {pass.vehicleType || 'Mahindra Bolero'}
                      </td>
                      <td className="p-2 border-r border-black text-center align-middle font-bold tracking-wider text-[9pt] leading-tight whitespace-pre-line">
                        {vehicleList.length > 1 
                          ? vehicleList.map(v => v.regnNo).join('\nAND\n') 
                          : (vehicleList[0]?.regnNo || 'KA-35b 3096\nAND\nKA-35b 9203')}
                      </td>
                      <td className="p-2 border-r border-black text-center align-middle font-semibold">
                        Loaded
                      </td>
                      <td className="p-0 align-top">
                        {/* Nested Sub-Table for Material Particulars */}
                        <table className="w-full border-collapse border-0 text-xs sm:text-[10pt]">
                          <thead>
                            <tr className="bg-[#85c1e9] border-b border-black text-center font-bold text-black">
                              <th className="w-[14%] p-1.5 border-r border-black">S/N</th>
                              <th className="p-1.5 border-r border-black">PERTICULARS</th>
                              <th className="w-[34%] p-1.5">QTY/METERS</th>
                            </tr>
                          </thead>
                          <tbody>
                            {itemsList.map((item, idx) => (
                              <tr key={item.id || idx} className="border-b border-black last:border-b-0 font-bold text-black">
                                <td className="p-1.5 border-r border-black text-center">{idx + 1}</td>
                                <td className="p-1.5 border-r border-black text-left pl-2 font-bold">{item.itemName}</td>
                                <td className="p-1.5 text-center font-bold">{item.quantity} {item.unit || 'TRUCKS'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Gate Pass Issued By Table (Checked By & Signed By HOD) */}
                <div className="text-xs sm:text-[10.5pt] mb-3">
                  <div className="font-bold mb-1 italic">Gate pass issued by:</div>
                  <table className="w-full border-collapse border border-black text-xs sm:text-[10.5pt]">
                    <thead>
                      <tr className="border-b border-black">
                        <th className="w-[20%] p-2 border-r border-black font-bold text-left">Name</th>
                        <th className="w-[55%] p-2 border-r border-black font-bold text-left">Name and Designation</th>
                        <th className="p-2 font-bold text-left">Signature</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="p-2 border-r border-black font-bold align-top">Checked By</td>
                        <td className="p-2 border-r border-black align-top">
                          <div className="font-bold">Mr Mayur Kant Tripathi</div>
                          <div className="text-slate-800">Dy.G.M (Electrical)/C&IT)</div>
                        </td>
                        <td className="p-2 align-bottom h-14">
                          <div className="text-emerald-700 font-mono text-[8pt] italic font-semibold">
                            {pass.citApprovedDate ? `✓ Verified on ${pass.citApprovedDate}` : ''}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-black font-bold align-top">Signed By</td>
                        <td className="p-0 border-r border-black align-top">
                          <div className="flex h-full min-h-[56px]">
                            <div className="w-[70%] p-2 border-r border-black flex flex-col justify-center">
                              <div className="font-bold">Mr Sreekanth Babu B</div>
                              <div className="text-slate-800">Dy.G.M (C&IT)</div>
                            </div>
                            <div className="w-[30%] p-2 font-bold flex items-center justify-center text-center">
                              H.O.D
                            </div>
                          </div>
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

                {/* Triplicate Copy Footer */}
                <div className="border border-black p-2 mt-4 text-center font-bold tracking-widest text-xs sm:text-[11pt] uppercase flex justify-around">
                  <span>OFFICE COPY</span>
                  <span>|</span>
                  <span>CUSTOMER COPY</span>
                  <span>|</span>
                  <span>CISF COPY</span>
                </div>
              </div>

              {/* -------------------------------------------------------------
                  PAGE 2: INSTRUCTIONS TO THE PASS HOLDERS
                  ------------------------------------------------------------- */}
              {includeInstructions && (
                <div className="page-break-before bg-white p-8 sm:p-10 shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 font-serif leading-relaxed text-[11pt] mt-6 print:mt-0">
                  <div className="text-center font-bold mb-6">
                    <div className="text-sm sm:text-base tracking-wide font-black uppercase underline decoration-1 underline-offset-4">
                      INSTRUCTIONS TO THE PASS HOLDERS:
                    </div>
                  </div>

                  <ol className="space-y-4 text-xs sm:text-[10.5pt] text-justify leading-relaxed list-none p-0">
                    <li className="flex gap-2">
                      <span className="font-bold w-5 shrink-0">1.</span>
                      <span>Pass holder(s) must carry their own photo identity Cards issued by the concerned authorities like Election Commission, Employer (in the case of employees), and Head of Institutions/firms etc.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold w-5 shrink-0">2.</span>
                      <span>Pass holder(s) should not proceed for any location, installations etc. other than specified in the Gate Pass.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold w-5 shrink-0">3.</span>
                      <span>It is the responsibility pass holders to observe and abide all statutory / safety rules/ guide lines etc. as applicable in the mine/OSCL Plant/Pellet Plant to avoid any untoward incident. Corporation will not be responsible for any injury, loss, damage etc. caused to the pass holder(s) due to negligence or oversight on their part and they are liable to pay to Corporation if any loss or damage caused to the Corporation.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold w-5 shrink-0">4.</span>
                      <span>The employees engaged by contractors for carrying out contract works in mine area should undergo M V Training and IME (Initial Medical Examination)/PME (Periodical Medical Examination) invariably as per statutes and they should wear all safety appliances as applicable.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold w-5 shrink-0">5.</span>
                      <span>The vehicle(s) entering inside the check post should be road-worthy and the Driver(s) / operator(s) must have adequate experience and valid Driving Licence issued by the concerned Authorities. (The original documents like RC Book, Licence etc. are required to be produced for checking at check post.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold w-5 shrink-0">6.</span>
                      <span>No person(s) are not allowed to travel on the dump body /uncovered rear portion /carrier of vehicles like Tippers/Trucks/ Tractors /Pick up vans etc. inside the check post.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold w-5 shrink-0">7.</span>
                      <span>Two wheeler are restricted to valley store/Time office (Loading Plant) and it is totally prohibited beyond old VTC / Valley store area and Time office (Loading Plant).</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold w-5 shrink-0">8.</span>
                      <span>Taking video graph / photograph etc. is strictly prohibited inside the check post.</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold w-5 shrink-0">9.</span>
                      <span>Use of mobile phone is prohibited while operating vehicles or equipment.</span>
                    </li>
                  </ol>

                  <div className="mt-12 space-y-6">
                    <div className="text-center font-bold underline tracking-wide text-xs sm:text-[11pt] uppercase">
                      DECLARATION BY PASS HOLDER
                    </div>
                    <div className="text-xs sm:text-[10.5pt]">
                      All the above instructions are noted for strict compliance.
                    </div>

                    <div className="pt-16 flex flex-col items-end space-y-3">
                      <div>Signature: _________________</div>
                      <div className="font-semibold text-slate-800 pr-4">Name of Pass holder.</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* =========================================================================
               GATE ID BADGE LAYOUT (Compact Security Card Format)
               ========================================================================= */
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-300 shadow-sm max-w-xl mx-auto space-y-4 text-slate-900">
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
