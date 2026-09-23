import React, { useState } from 'react';
import { EntryPass } from '../types';
import { 
  X, 
  Printer, 
  FileText, 
  ShieldCheck, 
  Layers, 
  Check, 
  Edit3, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface PrintablePassModalProps {
  pass: EntryPass | null;
  onClose: () => void;
}

export const PrintablePassModal: React.FC<PrintablePassModalProps> = ({ pass, onClose }) => {
  if (!pass) return null;

  // View mode: 'standard' (The official 2-page NMDC format from image) vs 'badge' (Compact Gate Badge)
  const [printLayout, setPrintLayout] = useState<'standard' | 'badge'>('standard');
  const [includeInstructions, setIncludeInstructions] = useState(true);

  // Editable standard form overrides with smart defaults
  const isReturnable = pass.materialCategory === 'Returnable';
  const passTypeLabel = isReturnable ? 'Returnable' : 'Non -Returnable';

  // Format date helper: "16 /09/ 2026"
  const formatDateSlashes = (isoDate?: string) => {
    if (!isoDate) return '    /    / 2026';
    try {
      const parts = isoDate.split('-');
      if (parts.length === 3) {
        return `${parts[2]} /${parts[1]}/ ${parts[0]}`;
      }
    } catch (e) {}
    return isoDate;
  };

  const formatShortDate = (isoDate?: string) => {
    if (!isoDate) return '16-09-2026';
    try {
      const parts = isoDate.split('-');
      if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    } catch (e) {}
    return isoDate;
  };

  // Safe defaults matching the exact standard form
  const contractorName = pass.contractorFirm || 'M/s Amnex Info Technologies Ltd.';
  const departmentName = pass.departmentOrProject || 'C&IT Department';
  const gatePassNo = pass.passNumber ? `NMDC/C&IT/ ${pass.passNumber.replace('AMN-NMDC-', '')}` : 'NMDC/C&IT/ 2026/01';
  const gatePassDate = formatDateSlashes(pass.validFrom);
  const nameOfWork = pass.nameOfWork || 'Implementation of Unified Mine Logistics Management and Surveillance system (UMLMSS)';
  const workSiteLocation = pass.gateNumber || 'KIOM/DIOM/PPT';
  
  const defaultWorkOrder = 
    pass.workOrderNo || 
    `Letters of Awards of Contract(LAC) Dated 27/04/2026 Vide\nHO(contract)/NMDC/UMLMSS/2025/275/395\nHO(contract)/NMDC/UMLMSS/2025/275/396\nHO(contract)/NMDC/UMLMSS/2025/275/397`;

  const validityString = `${formatShortDate(pass.validFrom)} to ${formatShortDate(pass.validTo)}`;

  // Vehicles list
  const primaryVehicleNumber = pass.vehicleNumber || 'KA35 B3096';
  const primaryVehicleType = pass.vehicleType || 'Truck';

  // Additional vehicles or fallback list
  const vehicleList = [
    {
      slNo: '1.',
      type: primaryVehicleType,
      regnNo: primaryVehicleNumber,
      stepney: pass.stepneyAttachment || '---------------------'
    },
    {
      slNo: '2',
      type: 'Truck',
      regnNo: 'KA35 B9203',
      stepney: ''
    }
  ];

  // Material particulars items
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
                <span className="font-bold text-sm text-white">Official NMDC Entry Pass Printout</span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-900/70 text-blue-300 border border-blue-700">
                  Standard Format
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Donimalai Iron Ore Mine • 2-Page Standard Official Document & Instructions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Layout switch */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setPrintLayout('standard')}
                className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                  printLayout === 'standard' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Standard Official (2-Page)
              </button>
              <button
                type="button"
                onClick={() => setPrintLayout('badge')}
                className={`px-2.5 py-1 rounded font-semibold transition cursor-pointer ${
                  printLayout === 'badge' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                Gate ID Badge
              </button>
            </div>

            {printLayout === 'standard' && (
              <label className="flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeInstructions}
                  onChange={(e) => setIncludeInstructions(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-0"
                />
                <span>Include Page 2 (Instructions)</span>
              </label>
            )}

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-4 sm:p-8 bg-slate-100 overflow-y-auto max-h-[85vh] print:p-0 print:m-0 print:max-h-none print:overflow-visible print:bg-white">
          
          {printLayout === 'standard' ? (
            /* =========================================================================
               STANDARD OFFICIAL 2-PAGE NMDC ENTRY PASS (Exact Replica of Document)
               ========================================================================= */
            <div className="space-y-8 print:space-y-0 text-black">
              
              {/* ------------------------- PAGE 1 ------------------------- */}
              <div className="page-break-after bg-white p-8 sm:p-10 shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 font-serif leading-relaxed text-[11pt]">
                
                {/* Document Header */}
                <div className="text-center font-bold space-y-1 mb-5">
                  <div className="text-base sm:text-lg tracking-wider uppercase font-black font-serif">
                    DONIMALAI IRON ORE MINE
                  </div>
                  <div className="text-sm sm:text-base tracking-wide font-black uppercase underline decoration-1 underline-offset-4">
                    ENTRY PASS ({passTypeLabel})
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
                      <td className="p-2 align-top whitespace-pre-line text-[10pt]">
                        {defaultWorkOrder}
                      </td>
                    </tr>
                    <tr className="border border-black">
                      <td className="p-2 border-r border-black align-top">
                        <span className="font-bold mr-1">5</span>
                        <span className="font-semibold">Validity of Gate Pass (Date &Time)</span>
                      </td>
                      <td className="p-2 font-bold align-top">
                        {validityString}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Vehicle Table 1 */}
                <table className="w-full border-collapse border border-black text-xs sm:text-[11pt] mb-3 text-center">
                  <thead>
                    <tr className="border border-black">
                      <th className="w-[12%] p-2 border-r border-black font-bold">Sl.No.</th>
                      <th className="w-[26%] p-2 border-r border-black font-bold">Type of<br />vehicle</th>
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

                {/* Sub-header instruction */}
                <p className="text-xs sm:text-[10pt] mb-3 font-serif">
                  The following vehicle(s)/ may please be allowed to ENTRY ({passTypeLabel}) the check post for the above purpose.
                </p>

                {/* Nested Material & Loaded Condition Table */}
                <div className="border border-black mb-4">
                  <table className="w-full border-collapse text-xs sm:text-[10.5pt] text-center">
                    <thead>
                      <tr className="border-b border-black">
                        <th className="w-[8%] p-2 border-r border-black font-bold">Sl.No.</th>
                        <th className="w-[18%] p-2 border-r border-black font-bold">Type of vehicle</th>
                        <th className="w-[18%] p-2 border-r border-black font-bold">Regn.<br />No.</th>
                        <th className="w-[16%] p-2 border-r border-black font-bold">Condition<br />Loaded /empty</th>
                        <th className="p-2 font-bold">{passTypeLabel} Items</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-r border-black font-bold align-middle">1</td>
                        <td className="p-2 border-r border-black align-middle font-medium">
                          {pass.vehicleType || 'Mahindra\nBolero'}
                        </td>
                        <td className="p-2 border-r border-black align-middle font-bold text-[10pt]">
                          {primaryVehicleNumber}
                          <br />
                          AND
                          <br />
                          KA-35b 9203
                        </td>
                        <td className="p-2 border-r border-black align-middle font-medium">
                          {pass.vehicleCondition || 'Loaded'}
                        </td>
                        <td className="p-2 align-middle">
                          {/* Inner Table for Items & Quantities with Cyan/Blue tint like official document */}
                          <table className="w-full border-collapse border border-black text-xs sm:text-[10pt] text-center">
                            <thead>
                              <tr className="border-b border-black bg-cyan-100/80 print:bg-cyan-100">
                                <th className="w-[15%] p-1 border-r border-black font-bold">S/N</th>
                                <th className="p-1 border-r border-black font-bold uppercase tracking-wider">PERTICULARS</th>
                                <th className="w-[32%] p-1 font-bold uppercase tracking-wider">QTY/METERS</th>
                              </tr>
                            </thead>
                            <tbody>
                              {itemsList.map((item, idx) => (
                                <tr key={item.id || idx} className="border-b border-black last:border-b-0">
                                  <td className="p-1 border-r border-black font-bold">{idx + 1}</td>
                                  <td className="p-1 border-r border-black font-semibold text-left pl-2">
                                    {item.itemName}
                                    {item.specification ? ` - ${item.specification}` : ''}
                                  </td>
                                  <td className="p-1 font-bold">{item.quantity} {item.unit}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Gate Pass Issued By Signatures Block */}
                <div className="text-xs sm:text-[10.5pt] mb-4">
                  <div className="font-bold italic mb-1">Gate pass issued by:</div>
                  <table className="w-full border-collapse border border-black text-xs sm:text-[10.5pt]">
                    <thead>
                      <tr className="border-b border-black">
                        <th className="w-[20%] p-2 border-r border-black font-bold text-center">Name</th>
                        <th className="w-[45%] p-2 border-r border-black font-bold text-center">Name and Designation</th>
                        <th className="p-2 font-bold text-center">Signature</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-black">
                        <td className="p-2 border-r border-black font-bold text-center align-middle">
                          Checked By
                        </td>
                        <td className="p-2 border-r border-black align-middle">
                          <div className="font-bold text-slate-900">Mr Mayur Kant Tripathi</div>
                          <div className="text-[10pt]">Dy.G.M (Electrical)/C&IT)</div>
                        </td>
                        <td className="p-2 text-center align-bottom h-14">
                          <div className="text-slate-400 font-mono text-[9pt] italic">
                            {pass.citApprovedDate ? `✓ Approved on ${pass.citApprovedDate}` : ''}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="p-2 border-r border-black font-bold text-center align-middle">
                          Signed By
                        </td>
                        <td className="p-2 border-r border-black align-middle">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-bold text-slate-900">Mr Sreekanth Babu B</div>
                              <div className="text-[10pt]">Dy.G.M (C&IT)</div>
                            </div>
                            <div className="font-bold text-xs uppercase px-2 py-0.5 border border-black bg-slate-50">
                              H.O.D
                            </div>
                          </div>
                        </td>
                        <td className="p-2 text-center align-bottom h-14">
                          <div className="text-slate-400 font-mono text-[9pt] italic">
                            {pass.citApprovalDate ? `✓ Signed on ${pass.citApprovalDate}` : ''}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Triplicate Copy Designation Footer */}
                <div className="border border-black p-2 mt-4 text-center font-bold tracking-widest text-xs sm:text-[11pt] uppercase flex justify-around">
                  <span>OFFICE COPY</span>
                  <span>|</span>
                  <span>CUSTOMER COPY</span>
                  <span>|</span>
                  <span>CISF COPY</span>
                </div>
              </div>

              {/* ------------------------- PAGE 2: INSTRUCTIONS ------------------------- */}
              {includeInstructions && (
                <div className="bg-white p-8 sm:p-10 shadow-md border border-slate-300 print:shadow-none print:border-none print:p-0 font-serif leading-relaxed text-[11pt] text-slate-900">
                  
                  <div className="text-center font-bold mb-6">
                    <h2 className="text-sm sm:text-base font-black uppercase underline decoration-1 underline-offset-4 tracking-wider">
                      INSTRUCTIONS TO THE PASS HOLDERS:
                    </h2>
                  </div>

                  <ol className="space-y-4 text-justify list-none pl-0 text-xs sm:text-[10.5pt]">
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
                        The vehicle(s) entering inside the check post should be road-worthy and the Driver(s) / operator(s) must have adequate experience and valid Driving Licence issued by the concerned Authorities. (The original documents like RC Book, Licence etc. are required to be produced for checking at check post.
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
                  <div className="mt-10 pt-6 border-t border-slate-300">
                    <div className="text-center font-bold text-xs sm:text-[11pt] uppercase tracking-wider mb-8">
                      DECLARATION BY PASS HOLDER
                    </div>

                    <p className="text-xs sm:text-[10.5pt] mb-12">
                      All the above instructions are noted for strict compliance.
                    </p>

                    <div className="flex flex-col items-end space-y-2 mt-8 pr-4">
                      <div className="text-xs sm:text-[10.5pt]">
                        Signature: <span className="inline-block border-b border-black w-48 ml-2"></span>
                      </div>
                      <div className="text-xs sm:text-[10.5pt] pt-2 text-right">
                        Name of Pass holder: <strong className="ml-1">{pass.passHolderName || 'Ashwin R.'}</strong>
                      </div>
                      {pass.passHolderContact && (
                        <div className="text-[10pt] text-slate-600">
                          Contact: {pass.passHolderContact}
                        </div>
                      )}
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
                <div className="font-bold text-slate-800 text-sm mb-1">{pass.passHolderName}</div>
                <div className="text-slate-600">{pass.passHolderDesignation || 'Authorized Representative'} • {departmentName}</div>
                {pass.vehicleNumber && (
                  <div className="mt-2 text-xs font-mono font-bold bg-amber-50 border border-amber-200 p-2 rounded text-amber-900">
                    Vehicle: {pass.vehicleNumber} ({pass.vehicleType || 'Truck'})
                  </div>
                )}
              </div>

              {pass.materialItems && pass.materialItems.length > 0 && (
                <div className="border border-slate-200 rounded-lg p-3 text-xs">
                  <div className="font-bold text-slate-800 mb-1">Materials Specified:</div>
                  <ul className="list-disc pl-4 space-y-0.5 text-slate-700">
                    {pass.materialItems.map((m, idx) => (
                      <li key={idx}>
                        <strong>{m.itemName}</strong> - {m.quantity} {m.unit}
                      </li>
                    ))}
                  </ul>
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
