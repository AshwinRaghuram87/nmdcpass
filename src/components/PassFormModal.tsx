import React, { useState, useRef, useEffect } from 'react';
import { 
  EntryPass, 
  PassType, 
  MaterialReturnType, 
  PassEmployee, 
  EmployeeCarriedItem,
  MaterialItem,
  PassStatus,
  ApprovedDocument,
  ProcedureStage,
  DESIGNATED_GATES,
  DesignatedGate
} from '../types';
import { getNextPassNumber } from '../utils/passUtils';
import { 
  X, 
  Plus, 
  Trash2, 
  UploadCloud, 
  FileCheck, 
  ShieldCheck, 
  Calendar, 
  Users, 
  Truck, 
  Package, 
  HardHat, 
  RotateCcw,
  Receipt,
  Tag,
  Layers,
  FileText,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface PassFormModalProps {
  pass: EntryPass | null; // null for create, object for edit
  isOpen: boolean;
  onClose: () => void;
  onSave: (passData: Partial<EntryPass>) => void;
  existingPasses?: EntryPass[];
}

export const PassFormModal: React.FC<PassFormModalProps> = ({
  pass,
  isOpen,
  onClose,
  onSave,
  existingPasses = []
}) => {
  const isEditing = !!pass;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const billFileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [passNumber, setPassNumber] = useState(
    pass?.passNumber || getNextPassNumber(existingPasses)
  );
  const [passType, setPassType] = useState<PassType>(pass?.passType || 'Employee');
  const [passHolderName, setPassHolderName] = useState(pass?.passHolderName || '');
  const [passHolderDesignation, setPassHolderDesignation] = useState(pass?.passHolderDesignation || '');
  const [passHolderContact, setPassHolderContact] = useState(pass?.passHolderContact || '');
  const [passHolderIdProof, setPassHolderIdProof] = useState(pass?.passHolderIdProof || '');
  const [departmentOrProject, setDepartmentOrProject] = useState(
    pass?.departmentOrProject || 'C&IT'
  );
  const [gateNumber, setGateNumber] = useState<string>(
    pass?.gateNumber || 'KIOM/DIOM/PPT'
  );
  const [procedureStage, setProcedureStage] = useState<ProcedureStage>(
    pass?.procedureStage || 'Pass Prepared'
  );
  const [validFrom, setValidFrom] = useState(
    pass?.validFrom || new Date().toISOString().split('T')[0]
  );
  const [validTo, setValidTo] = useState(
    pass?.validTo || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<PassStatus>(pass?.status || 'Approved');
  const [followUpNotes, setFollowUpNotes] = useState(pass?.followUpNotes || '');

  // Employees list state
  const [employees, setEmployees] = useState<PassEmployee[]>(
    pass?.employees && pass.employees.length > 0
      ? pass.employees
      : [
          {
            id: `emp-${Date.now()}`,
            name: '',
            designation: 'Skilled Labour',
            idNumber: '',
            contactNumber: '',
            fatherName: '',
            sex: 'M',
            age: '',
            dob: '',
            address: ''
          }
        ]
  );
  const [expandedEmpId, setExpandedEmpId] = useState<string | null>(null);

  // Vehicle specific
  const [vehicleNumber, setVehicleNumber] = useState(pass?.vehicleNumber || '');
  const [vehicleType, setVehicleType] = useState(pass?.vehicleType || 'Commercial / Utility Van');
  const [driverLicenseNumber, setDriverLicenseNumber] = useState(pass?.driverLicenseNumber || '');

  // Material specific
  const [materialCategory, setMaterialCategory] = useState<MaterialReturnType>(
    pass?.materialCategory || 'Returnable'
  );
  const [expectedReturnDate, setExpectedReturnDate] = useState(
    pass?.expectedReturnDate || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [challanInvoiceNumber, setChallanInvoiceNumber] = useState(
    pass?.challanInvoiceNumber || `AMN/DC/${new Date().getFullYear()}/001`
  );
  const [billNumber, setBillNumber] = useState(
    pass?.billNumber || ''
  );
  const [billDocument, setBillDocument] = useState<ApprovedDocument | null>(
    pass?.billDocument || null
  );

  const [materialItems, setMaterialItems] = useState<MaterialItem[]>(
    pass?.materialItems && pass.materialItems.length > 0
      ? pass.materialItems
      : [
          {
            id: `item-${Date.now()}`,
            itemName: '',
            specification: '',
            isBoq: true,
            boqItemNumber: 'BOQ-4.1',
            billNumber: '',
            quantity: 1,
            unit: 'Nos',
            serialNumber: '',
            remarks: ''
          }
        ]
  );

  // Document attachment
  const [approvedDocFile, setApprovedDocFile] = useState<ApprovedDocument | null>(
    pass?.approvedDocument || null
  );

  // Official Standard NMDC Print Form Fields
  const [contractorFirm, setContractorFirm] = useState(
    pass?.contractorFirm || 'M/s Amnex Info Technologies Ltd.'
  );
  const [nameOfWork, setNameOfWork] = useState(
    pass?.nameOfWork || 'Implementation of Unified Mine Logistics Management and Surveillance system (UMLMSS)'
  );
  const [workOrderNo, setWorkOrderNo] = useState(
    pass?.workOrderNo || 'Letters of Awards of Contract(LAC) Dated 27/04/2026 Vide\nHO(contract)/NMDC/UMLMSS/2025/275/395\nHO(contract)/NMDC/UMLMSS/2025/275/396\nHO(contract)/NMDC/UMLMSS/2025/275/397'
  );
  const [stepneyAttachment, setStepneyAttachment] = useState(
    pass?.stepneyAttachment || '---------------------'
  );
  const [vehicleCondition, setVehicleCondition] = useState<'Loaded' | 'Empty'>(
    pass?.vehicleCondition || 'Loaded'
  );
  const [recommendedBy, setRecommendedBy] = useState(
    pass?.recommendedBy || 'Mr. AVL Ramakrishna, Dy. GM( C&IT) , Engineer-in-Charge'
  );

  // Re-sync when modal opens or target pass changes
  useEffect(() => {
    if (isOpen) {
      if (pass) {
        setPassNumber(pass.passNumber);
        setPassType(pass.passType);
        setPassHolderName(pass.passHolderName || '');
        setPassHolderDesignation(pass.passHolderDesignation || '');
        setPassHolderContact(pass.passHolderContact || '');
        setPassHolderIdProof(pass.passHolderIdProof || '');
        setDepartmentOrProject(pass.departmentOrProject || 'C&IT');
        setGateNumber(pass.gateNumber || 'KIOM/DIOM/PPT');
        setProcedureStage(pass.procedureStage || 'Pass Prepared');
        setValidFrom(pass.validFrom);
        setValidTo(pass.validTo);
        setStatus(pass.status);
        setFollowUpNotes(pass.followUpNotes || '');
        setVehicleNumber(pass.vehicleNumber || '');
        setVehicleType(pass.vehicleType || 'Commercial / Utility Van');
        setRecommendedBy(pass.recommendedBy || 'Mr. AVL Ramakrishna, Dy. GM( C&IT) , Engineer-in-Charge');
        if (pass.employees && pass.employees.length > 0) {
          setEmployees(pass.employees);
        } else if (pass.passHolderName) {
          setEmployees([
            {
              id: `emp-${Date.now()}`,
              name: pass.passHolderName,
              designation: pass.passHolderDesignation || 'Skilled Labour',
              idNumber: pass.passHolderIdProof || '',
              contactNumber: pass.passHolderContact || '',
              fatherName: '',
              sex: 'M',
              age: '',
              dob: '',
              address: ''
            }
          ]);
        }
      } else {
        // Generating new pass starting from NMDC/C&IT/15
        setPassNumber(getNextPassNumber(existingPasses));
      }
    }
  }, [isOpen, pass, existingPasses]);

  // Handle pass type change
  const handlePassTypeChange = (type: PassType) => {
    setPassType(type);
    if (!isEditing) {
      // Ensure pass number starts from NMDC/C&IT/15
      if (!passNumber || passNumber.startsWith('AMN-NMDC-')) {
        setPassNumber(getNextPassNumber(existingPasses));
      }
      if (type === 'Contractor') {
        setGateNumber('DIOM');
      } else if (type === 'Materials') {
        setGateNumber('PPT');
      } else if (type === 'Vehicle') {
        setGateNumber('KIOM');
      } else {
        setGateNumber('Admin Building');
      }
    }
  };

  // Employee management
  const handleAddEmployee = () => {
    const newId = `emp-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setEmployees([
      ...employees,
      {
        id: newId,
        name: '',
        designation: 'Skilled Labour',
        idNumber: '',
        contactNumber: '',
        fatherName: '',
        sex: 'M',
        age: '',
        dob: '',
        address: ''
      }
    ]);
    setExpandedEmpId(newId);
  };

  const handleUpdateEmployee = (index: number, field: keyof PassEmployee, value: any) => {
    const updated = [...employees];
    updated[index] = { ...updated[index], [field]: value };
    setEmployees(updated);
  };

  const handleRemoveEmployee = (index: number) => {
    if (employees.length <= 1) return;
    setEmployees(employees.filter((_, i) => i !== index));
  };

  const handleToggleAllowedToCarry = (empIndex: number, checked: boolean) => {
    const updated = [...employees];
    const current = updated[empIndex];
    const defaultItems: EmployeeCarriedItem[] = [
      { slNo: 1, itemName: 'Laptop (Dell Latitude)', nos: '1 Nos', serialNumber: '' },
      { slNo: 2, itemName: 'Toolkit / Accessories', nos: '1 Set', serialNumber: '' }
    ];
    updated[empIndex] = {
      ...current,
      allowedToCarry: checked,
      carriedItems: checked 
        ? (current.carriedItems && current.carriedItems.length > 0 ? current.carriedItems : defaultItems)
        : current.carriedItems
    };
    setEmployees(updated);
  };

  const handleAddCarriedItem = (empIndex: number) => {
    const updated = [...employees];
    const current = updated[empIndex];
    const items = current.carriedItems || [];
    updated[empIndex] = {
      ...current,
      carriedItems: [
        ...items,
        {
          id: `item-${Date.now()}`,
          slNo: items.length + 1,
          itemName: '',
          nos: '1 Nos',
          serialNumber: ''
        }
      ]
    };
    setEmployees(updated);
  };

  const handleUpdateCarriedItem = (
    empIndex: number,
    itemIndex: number,
    field: keyof EmployeeCarriedItem,
    value: any
  ) => {
    const updated = [...employees];
    const current = updated[empIndex];
    const items = [...(current.carriedItems || [])];
    items[itemIndex] = { ...items[itemIndex], [field]: value };
    updated[empIndex] = { ...current, carriedItems: items };
    setEmployees(updated);
  };

  const handleRemoveCarriedItem = (empIndex: number, itemIndex: number) => {
    const updated = [...employees];
    const current = updated[empIndex];
    const items = (current.carriedItems || []).filter((_, i) => i !== itemIndex);
    updated[empIndex] = { ...current, carriedItems: items };
    setEmployees(updated);
  };

  // Material item management
  const handleAddMaterialItem = () => {
    setMaterialItems([
      ...materialItems,
      {
        id: `mat-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        itemName: '',
        specification: '',
        isBoq: true,
        boqItemNumber: `BOQ-${materialItems.length + 1}.1`,
        boqNumber: '',
        oem: '',
        oemModel: '',
        billNumber: billNumber || challanInvoiceNumber || '',
        quantity: 1,
        unit: 'Nos',
        serialNumber: '',
        remarks: ''
      }
    ]);
  };

  const handleUpdateMaterialItem = (
    index: number, 
    field: keyof MaterialItem, 
    value: string | number | boolean
  ) => {
    const updated = [...materialItems];
    updated[index] = { ...updated[index], [field]: value };
    setMaterialItems(updated);
  };

  const handleRemoveMaterialItem = (index: number) => {
    if (materialItems.length <= 1) return;
    setMaterialItems(materialItems.filter((_, i) => i !== index));
  };

  // File upload handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      setApprovedDocFile({
        fileName: file.name,
        fileSize: sizeStr,
        fileUrl: uploadEvt.target?.result as string,
        uploadedAt: new Date().toLocaleString(),
        uploadedBy: 'NMDC Security Cell Incharge'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleBillFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const sizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      setBillDocument({
        fileName: file.name,
        fileSize: sizeStr,
        fileUrl: uploadEvt.target?.result as string,
        uploadedAt: new Date().toLocaleString(),
        uploadedBy: 'Amnex Billing Admin'
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Determine validity status
    const now = new Date();
    const expiry = new Date(validTo);
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    let validityStatus: 'Active' | 'Expiring Soon' | 'Expired' = 'Active';
    if (diffDays < 0) {
      validityStatus = 'Expired';
    } else if (diffDays <= 5) {
      validityStatus = 'Expiring Soon';
    }

    const payload: Partial<EntryPass> = {
      passNumber,
      passType,
      passHolderName,
      passHolderDesignation,
      passHolderContact,
      passHolderIdProof,
      departmentOrProject: departmentOrProject.trim() || 'C&IT',
      gateNumber,
      procedureStage,
      validFrom,
      validTo,
      validityStatus,
      status: procedureStage === 'Pass Obtained' ? 'Approved' : (procedureStage === 'Pass Prepared' ? 'Pending Approval' : status),
      cisfVerified: procedureStage === 'Pass Obtained' ? true : (pass?.cisfVerified || false),
      preparedDate: pass?.preparedDate || new Date().toISOString().split('T')[0],
      citApprovalDate: (procedureStage === 'Submitted to CISF' || procedureStage === 'Pass Obtained') ? (pass?.citApprovalDate || new Date().toISOString().split('T')[0]) : pass?.citApprovalDate,
      cisfSignatureDate: procedureStage === 'Pass Obtained' ? (pass?.cisfSignatureDate || new Date().toISOString().split('T')[0]) : pass?.cisfSignatureDate,
      passObtainedDate: procedureStage === 'Pass Obtained' ? (pass?.passObtainedDate || new Date().toISOString().split('T')[0]) : pass?.passObtainedDate,
      employees: employees.filter(e => e.name.trim() !== ''),
      followUpNotes,
      approvedDocument: approvedDocFile || undefined,
      contractorFirm,
      nameOfWork,
      workOrderNo,
      stepneyAttachment,
      vehicleCondition,
      recommendedBy,
    };

    if (passType === 'Vehicle') {
      payload.vehicleNumber = vehicleNumber;
      payload.vehicleType = vehicleType;
      payload.driverLicenseNumber = driverLicenseNumber;
    }

    if (passType === 'Materials') {
      payload.vehicleNumber = vehicleNumber;
      payload.vehicleType = vehicleType;
      payload.materialCategory = materialCategory;
      payload.challanInvoiceNumber = challanInvoiceNumber;
      payload.expectedReturnDate = materialCategory === 'Returnable' ? expectedReturnDate : undefined;
      payload.materialReturnStatus = materialCategory === 'Returnable' 
        ? (pass?.materialReturnStatus || 'Pending Return')
        : undefined;
      payload.billNumber = billNumber.trim() || undefined;
      payload.billDocument = billDocument || undefined;
      payload.materialItems = materialItems.filter(m => m.itemName.trim() !== '');
    }

    onSave(payload);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isEditing ? 'Edit Entry Pass Record' : 'Register New CISF Gate Entry Pass'}
              </h2>
              <p className="text-xs text-slate-400">
                Amnex Infotechnologies • Client: NMDC Ltd • Gate Access Follow-Up
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Pass Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pass Classification Type <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'Employee', label: 'Employee', icon: Users, desc: 'Staff & Engineers' },
                { id: 'Contractor', label: 'Contractor', icon: HardHat, desc: 'Workforce & Labor' },
                { id: 'Vehicle', label: 'Vehicle', icon: Truck, desc: 'Logistics / Fleet' },
                { id: 'Materials', label: 'Materials', icon: Package, desc: 'RGP / NRGP Supplies' },
              ].map((item) => {
                const Icon = item.icon;
                const isSelected = passType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handlePassTypeChange(item.id as PassType)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="font-bold text-xs text-slate-900">{item.label}</span>
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                    </div>
                    <span className="text-[11px] text-slate-500">{item.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Identification */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pass Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={passNumber}
                onChange={(e) => setPassNumber(e.target.value)}
                placeholder="e.g. NMDC/C&IT/15"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Work Site / Designated CISF Gate <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setGateNumber('KIOM/DIOM/PPT')}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border transition cursor-pointer ${
                    gateNumber === 'KIOM/DIOM/PPT'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                  }`}
                  title="Select all three work site check posts: KIOM / DIOM / PPT"
                >
                  ✓ All Sites (KIOM/DIOM/PPT)
                </button>
              </div>
              <select
                value={gateNumber}
                onChange={(e) => setGateNumber(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden cursor-pointer"
              >
                <option value="KIOM/DIOM/PPT">
                  All Work Sites: KIOM / DIOM / PPT
                </option>
                <option value="DIOM">DIOM Gate</option>
                <option value="KIOM">KIOM Gate</option>
                <option value="PPT">PPT Gate</option>
                <option value="Admin Building">Admin Building Gate</option>
              </select>
            </div>
          </div>

          {/* Official Pass Procedure Stage (Amnex -> C&IT -> CISF -> Obtained) */}
          <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-blue-950 uppercase tracking-wider">
                Official Approval & Issuance Procedure Stage
              </label>
              <span className="text-[11px] font-semibold text-blue-700">
                Amnex → NMDC C&IT → CISF → Obtained
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { 
                  id: 'Pass Prepared', 
                  step: '1', 
                  label: 'Pass Prepared', 
                  sub: 'By Amnex Team', 
                  color: 'slate' 
                },
                { 
                  id: 'Submitted to C&IT', 
                  step: '2', 
                  label: 'Submitted to C&IT', 
                  sub: 'Pending C&IT Approval', 
                  color: 'amber' 
                },
                { 
                  id: 'Submitted to CISF', 
                  step: '3', 
                  label: 'Submitted to CISF', 
                  sub: 'For Signature & Verification', 
                  color: 'blue' 
                },
                { 
                  id: 'Pass Obtained', 
                  step: '4', 
                  label: 'Pass Obtained', 
                  sub: 'Signed & Issued', 
                  color: 'emerald' 
                },
              ].map((s) => {
                const isCurrent = procedureStage === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setProcedureStage(s.id as ProcedureStage)}
                    className={`p-2 rounded-lg border text-left transition cursor-pointer flex flex-col justify-between ${
                      isCurrent
                        ? 'border-blue-600 bg-white ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-slate-200 bg-white/70 hover:bg-white hover:border-slate-300 opacity-80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 font-bold">
                        Step {s.step}
                      </span>
                      {isCurrent && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 leading-snug">{s.label}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{s.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pass Holder Information */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Pass Holder (Authorized Lead / Supervisor)</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Pass Holder Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={passHolderName}
                  onChange={(e) => setPassHolderName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar Verma"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={passHolderDesignation}
                  onChange={(e) => setPassHolderDesignation(e.target.value)}
                  placeholder="e.g. Project Lead / Site Incharge"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={passHolderContact}
                  onChange={(e) => setPassHolderContact(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">
                  Aadhaar / Amnex ID Proof
                </label>
                <input
                  type="text"
                  value={passHolderIdProof}
                  onChange={(e) => setPassHolderIdProof(e.target.value)}
                  placeholder="e.g. AADHAAR 4521-xxxx-9988"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="sm:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-medium text-slate-700">
                    Department (Default: C&IT) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                    Default: C&IT Only
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={departmentOrProject}
                  onChange={(e) => setDepartmentOrProject(e.target.value)}
                  placeholder="C&IT"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* List of Employees Covered Under This Pass */}
          <div className="border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>List of Employees / Personnel Covered ({employees.length})</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Specify staff, gang workers or technicians allowed under this pass
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddEmployee}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Person</span>
              </button>
            </div>

            <div className="space-y-2.5">
              {employees.map((emp, index) => {
                const isExpanded = expandedEmpId === (emp.id || String(index));
                const empIdentifier = emp.id || String(index);

                return (
                  <div key={empIdentifier} className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden transition">
                    <div className="flex flex-col sm:flex-row items-center gap-2 p-2.5">
                      <span className="text-[10px] font-mono font-bold text-slate-500 w-5 text-center">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Personnel Full Name *"
                        value={emp.name}
                        onChange={(e) => handleUpdateEmployee(index, 'name', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Role / Designation"
                        value={emp.designation}
                        onChange={(e) => handleUpdateEmployee(index, 'designation', e.target.value)}
                        className="w-full sm:w-36 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="Aadhaar / ID Proof"
                        value={emp.idNumber}
                        onChange={(e) => handleUpdateEmployee(index, 'idNumber', e.target.value)}
                        className="w-full sm:w-36 px-2.5 py-1.5 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800 focus:outline-hidden focus:border-blue-500"
                      />
                      
                      {/* Attachment No. 2 Details Toggle */}
                      <button
                        type="button"
                        onClick={() => setExpandedEmpId(isExpanded ? null : empIdentifier)}
                        className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 border transition cursor-pointer ${
                          isExpanded 
                            ? 'bg-blue-50 border-blue-200 text-blue-700' 
                            : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                        }`}
                        title="Edit Attachment No. 2 details (Father name, Sex, DOB, Address)"
                      >
                        <span>Details</span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemoveEmployee(index)}
                        disabled={employees.length <= 1}
                        className="p-1.5 text-slate-400 hover:text-rose-600 disabled:opacity-30 rounded transition cursor-pointer"
                        title="Remove personnel"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Expandable Section for Attachment No. 2 Application Form Details */}
                    {isExpanded && (
                      <div className="px-3 pb-3 pt-1 border-t border-slate-200 bg-white/60 space-y-2.5 animate-in fade-in duration-100">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <span className="flex items-center gap-1 text-indigo-700">
                            <FileText className="w-3.5 h-3.5" />
                            <span>Attachment No. 2 (Application Form) Details</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            Used in official individual application forms
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Father's Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Parasappa"
                              value={emp.fatherName || ''}
                              onChange={(e) => handleUpdateEmployee(index, 'fatherName', e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Sex</label>
                            <select
                              value={emp.sex || 'M'}
                              onChange={(e) => handleUpdateEmployee(index, 'sex', e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-hidden focus:border-blue-500 cursor-pointer"
                            >
                              <option value="M">Male (M)</option>
                              <option value="F">Female (F)</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Age</label>
                            <input
                              type="text"
                              placeholder="e.g. 33"
                              value={emp.age || ''}
                              onChange={(e) => handleUpdateEmployee(index, 'age', e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
                            />
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Date of Birth</label>
                            <input
                              type="text"
                              placeholder="e.g. 01.01.1993"
                              value={emp.dob || ''}
                              onChange={(e) => handleUpdateEmployee(index, 'dob', e.target.value)}
                              className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Present Address</label>
                          <input
                            type="text"
                            placeholder="e.g. 4th Ward, Chapparadahalli, Taranagar, Bellary 583119"
                            value={emp.address || ''}
                            onChange={(e) => handleUpdateEmployee(index, 'address', e.target.value)}
                            className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
                          />
                        </div>

                        {/* Allowed to carry section */}
                        <div className="pt-2 border-t border-slate-200/80">
                          <div className="flex items-center justify-between mb-2">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={!!emp.allowedToCarry}
                                onChange={(e) => handleToggleAllowedToCarry(index, e.target.checked)}
                                className="rounded text-blue-600 focus:ring-0 cursor-pointer"
                              />
                              <span className="text-xs font-bold text-slate-800">
                                Allowed to Carry Items (Tools / Equipment / Laptop)
                              </span>
                            </label>

                            {emp.allowedToCarry && (
                              <button
                                type="button"
                                onClick={() => handleAddCarriedItem(index)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-[11px] font-semibold border border-blue-200 cursor-pointer"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add Item</span>
                              </button>
                            )}
                          </div>

                          {emp.allowedToCarry && (
                            <div className="space-y-1.5 bg-slate-100/70 p-2 rounded-lg border border-slate-200">
                              <div className="grid grid-cols-[45px_1fr_80px_110px_28px] gap-1.5 text-[10px] font-bold text-slate-500 uppercase px-1">
                                <span>Sl No</span>
                                <span>Item Name</span>
                                <span>Nos</span>
                                <span>Sl Number</span>
                                <span></span>
                              </div>
                              {(emp.carriedItems && emp.carriedItems.length > 0 ? emp.carriedItems : [
                                { slNo: 1, itemName: 'Laptop (Dell Latitude)', nos: '1 Nos', serialNumber: '' }
                              ]).map((cItem, cIdx) => (
                                <div key={cIdx} className="grid grid-cols-[45px_1fr_80px_110px_28px] gap-1.5 items-center">
                                  <input
                                    type="text"
                                    placeholder="1"
                                    value={cItem.slNo ?? (cIdx + 1)}
                                    onChange={(e) => handleUpdateCarriedItem(index, cIdx, 'slNo', e.target.value)}
                                    className="px-1.5 py-1 text-center bg-white border border-slate-200 rounded text-xs text-slate-800 font-semibold"
                                  />
                                  <input
                                    type="text"
                                    placeholder="e.g. Laptop / Toolkit"
                                    value={cItem.itemName}
                                    onChange={(e) => handleUpdateCarriedItem(index, cIdx, 'itemName', e.target.value)}
                                    className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800"
                                  />
                                  <input
                                    type="text"
                                    placeholder="e.g. 1 Nos"
                                    value={cItem.nos}
                                    onChange={(e) => handleUpdateCarriedItem(index, cIdx, 'nos', e.target.value)}
                                    className="px-2 py-1 bg-white border border-slate-200 rounded text-xs text-slate-800 text-center"
                                  />
                                  <input
                                    type="text"
                                    placeholder="e.g. DL-8849"
                                    value={cItem.serialNumber || ''}
                                    onChange={(e) => handleUpdateCarriedItem(index, cIdx, 'serialNumber', e.target.value)}
                                    className="px-2 py-1 bg-white border border-slate-200 rounded text-xs font-mono text-slate-800"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveCarriedItem(index, cIdx)}
                                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
                                    title="Delete item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* If Vehicle Pass: Registration & License */}
          {passType === 'Vehicle' && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Vehicle & Transport Authorization</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Vehicle Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={vehicleNumber}
                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. CG-17-AB-4521"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Vehicle Type
                  </label>
                  <input
                    type="text"
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    placeholder="e.g. Utility Bolero / Truck"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Driver's License No.
                  </label>
                  <input
                    type="text"
                    value={driverLicenseNumber}
                    onChange={(e) => setDriverLicenseNumber(e.target.value)}
                    placeholder="e.g. DL-CG-17-2021-xxxx"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* If Materials Pass: Expanded RGP vs NRGP, BOQ and Bill fields */}
          {passType === 'Materials' && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-indigo-600" />
                  <span>Materials Pass: Returnable (RGP) vs Non-Returnable (NRGP)</span>
                </h3>

                {/* Returnable or Non-Returnable Radio Toggle */}
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setMaterialCategory('Returnable')}
                    className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                      materialCategory === 'Returnable'
                        ? 'bg-amber-500 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>RGP (Returnable)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMaterialCategory('Non-Returnable')}
                    className={`px-3 py-1 rounded text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                      materialCategory === 'Non-Returnable'
                        ? 'bg-emerald-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Layers className="w-3 h-3" />
                    <span>NRGP (Non-Returnable)</span>
                  </button>
                </div>
              </div>

              {/* Material Transport Vehicle Details */}
              <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Transport Vehicle Details (For Gate Check Post)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Vehicle Registration Number(s)
                    </label>
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. KA-35-B-3096 / KA-35-B-9203"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Type of Vehicle
                    </label>
                    <input
                      type="text"
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      placeholder="e.g. Truck / Mahindra Bolero / Tipper"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Pass Bill & Challan Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Delivery Challan Number
                  </label>
                  <input
                    type="text"
                    value={challanInvoiceNumber}
                    onChange={(e) => setChallanInvoiceNumber(e.target.value)}
                    placeholder="e.g. AMN/DC/2025/RGP-889"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-slate-600 mb-1">
                    Tax Invoice / Bill Number
                  </label>
                  <input
                    type="text"
                    value={billNumber}
                    onChange={(e) => setBillNumber(e.target.value)}
                    placeholder="e.g. AMN-GST-INV-2025-0891"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                {materialCategory === 'Returnable' ? (
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Expected Return Deadline <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      value={expectedReturnDate}
                      onChange={(e) => setExpectedReturnDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] font-medium text-slate-600 mb-1">
                      Destination Status
                    </label>
                    <div className="px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold">
                      Permanent NMDC Consignment
                    </div>
                  </div>
                )}
              </div>

              {/* Bill Document Upload in Form */}
              <div className="bg-indigo-50/60 p-3 rounded-lg border border-indigo-200">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-indigo-700" />
                    <span className="text-xs font-bold text-indigo-950">Attach Consignment Bill / Tax Invoice</span>
                  </div>
                  <input
                    type="file"
                    ref={billFileInputRef}
                    onChange={handleBillFileUpload}
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => billFileInputRef.current?.click()}
                    className="text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-white px-2.5 py-1 rounded border border-indigo-300 shadow-2xs cursor-pointer"
                  >
                    {billDocument ? 'Replace Bill File' : 'Browse Bill File'}
                  </button>
                </div>

                {billDocument ? (
                  <div className="text-xs text-indigo-900 font-medium flex items-center justify-between">
                    <span>Attached: <strong>{billDocument.fileName}</strong> ({billDocument.fileSize})</span>
                    <button
                      type="button"
                      onClick={() => setBillDocument(null)}
                      className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500">
                    Upload official signed Tax Invoice or Delivery Challan copy for verification.
                  </p>
                )}
              </div>

              {/* Material Items list */}
              <div className="space-y-3 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800">
                      Material Consignment Items ({materialItems.length} Items)
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Particulars of material items, quantity, unit, and consignment bill details
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddMaterialItem}
                    className="inline-flex items-center gap-1 text-xs text-indigo-700 hover:text-indigo-900 font-semibold px-2 py-1 bg-white rounded border border-indigo-200 shadow-2xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {materialItems.map((itm, idx) => (
                    <div key={itm.id || idx} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-700">Item #{idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterialItem(idx)}
                          disabled={materialItems.length <= 1}
                          className="text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                        {/* Item Name */}
                        <div className="sm:col-span-6">
                          <input
                            type="text"
                            required
                            placeholder="Particulars of Material / Item Name *"
                            value={itm.itemName}
                            onChange={(e) => handleUpdateMaterialItem(idx, 'itemName', e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                          />
                        </div>

                        {/* Qty & Unit */}
                        <div className="sm:col-span-3 flex gap-1">
                          <input
                            type="number"
                            placeholder="Qty"
                            value={itm.quantity}
                            onChange={(e) => handleUpdateMaterialItem(idx, 'quantity', parseInt(e.target.value) || 1)}
                            className="w-16 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-center"
                          />
                          <input
                            type="text"
                            placeholder="Unit (e.g. TRUCKS, Nos)"
                            value={itm.unit}
                            onChange={(e) => handleUpdateMaterialItem(idx, 'unit', e.target.value)}
                            className="flex-1 px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                          />
                        </div>

                        {/* Serial Number */}
                        <div className="sm:col-span-3">
                          <input
                            type="text"
                            placeholder="Serial No / Tag"
                            value={itm.serialNumber || ''}
                            onChange={(e) => handleUpdateMaterialItem(idx, 'serialNumber', e.target.value)}
                            className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                          />
                        </div>
                      </div>

                      {/* BOQ & OEM Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                        <input
                          type="text"
                          placeholder="BOQ Number"
                          value={itm.boqNumber || ''}
                          onChange={(e) => handleUpdateMaterialItem(idx, 'boqNumber', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                        />
                        <input
                          type="text"
                          placeholder="BOQ Item #"
                          value={itm.boqItemNumber || ''}
                          onChange={(e) => handleUpdateMaterialItem(idx, 'boqItemNumber', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                        />
                        <input
                          type="text"
                          placeholder="OEM (Manufacturer)"
                          value={itm.oem || ''}
                          onChange={(e) => handleUpdateMaterialItem(idx, 'oem', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                        />
                        <input
                          type="text"
                          placeholder="OEM Model / Make"
                          value={itm.oemModel || ''}
                          onChange={(e) => handleUpdateMaterialItem(idx, 'oemModel', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs"
                        />
                      </div>

                      {/* Bill details and Remarks row */}
                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1 border-t border-slate-100 items-center">
                        {/* Item Bill Number */}
                        <div className="sm:col-span-6">
                          <input
                            type="text"
                            placeholder="Challan / Bill # (if specific to this item)"
                            value={itm.billNumber || ''}
                            onChange={(e) => handleUpdateMaterialItem(idx, 'billNumber', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-mono"
                          />
                        </div>

                        {/* Specification / Remarks */}
                        <div className="sm:col-span-6">
                          <input
                            type="text"
                            placeholder="Specification or Remarks"
                            value={itm.remarks || itm.specification || ''}
                            onChange={(e) => handleUpdateMaterialItem(idx, 'remarks', e.target.value)}
                            className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Validity Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Validity: Valid From <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={validFrom}
                onChange={(e) => setValidFrom(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Validity: Valid To (Expiry Date) <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={validTo}
                onChange={(e) => setValidTo(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          {/* Approved Pass Document Upload Section */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
              Upload Approved Pass Document (Official Signed & Received Copy)
            </label>
            <p className="text-[11px] text-slate-500 mb-3">
              Attach the approved pass copy so officers and users can download it using the direct link.
            </p>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
              className="hidden"
            />

            {approvedDocFile ? (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center gap-2 truncate">
                  <FileCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-slate-800 block truncate max-w-xs">
                      {approvedDocFile.fileName}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      {approvedDocFile.fileSize} • Uploaded {approvedDocFile.uploadedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-blue-600 hover:underline font-medium cursor-pointer"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={() => setApprovedDocFile(null)}
                    className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 px-3 border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-xl flex flex-col items-center justify-center gap-1.5 text-slate-600 hover:text-blue-600 bg-white transition cursor-pointer"
              >
                <UploadCloud className="w-6 h-6 text-slate-400" />
                <span className="text-xs font-semibold">Click to browse or drop approved pass file</span>
                <span className="text-[10px] text-slate-400">Supported: PDF, JPG, PNG up to 10MB</span>
              </button>
            )}
          </div>

          {/* Follow-up Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Follow-Up & CISF Security Notes
            </label>
            <textarea
              rows={2}
              value={followUpNotes}
              onChange={(e) => setFollowUpNotes(e.target.value)}
              placeholder="e.g. Police verification verified, safety induction completed, returnable tools inspected..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Official Standard NMDC Donimalai Mine Print Configuration */}
          <div className="border border-blue-200 bg-blue-50/50 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-700" />
                <span>Official NMDC Standard Print Details (Donimalai Mine 2-Page Format)</span>
              </h3>
              <span className="text-[10px] font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                Print Format
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  1. Contractor / Firm Name
                </label>
                <input
                  type="text"
                  value={contractorFirm}
                  onChange={(e) => setContractorFirm(e.target.value)}
                  placeholder="M/s Amnex Info Technologies Ltd."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Vehicle Condition (Loaded / Empty)
                </label>
                <select
                  value={vehicleCondition}
                  onChange={(e) => setVehicleCondition(e.target.value as 'Loaded' | 'Empty')}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                >
                  <option value="Loaded">Loaded</option>
                  <option value="Empty">Empty</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  2. Name of Work and Reason for Entry / Exit
                </label>
                <input
                  type="text"
                  value={nameOfWork}
                  onChange={(e) => setNameOfWork(e.target.value)}
                  placeholder="Implementation of Unified Mine Logistics Management and Surveillance system (UMLMSS)"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  4. Work Order No. / LOI / Authority Letter
                </label>
                <textarea
                  rows={3}
                  value={workOrderNo}
                  onChange={(e) => setWorkOrderNo(e.target.value)}
                  placeholder="Letters of Awards of Contract(LAC) Dated 27/04/2026..."
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 font-mono focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-slate-700 mb-1">
                  Recommended By (For Material Passes)
                </label>
                <input
                  type="text"
                  value={recommendedBy}
                  onChange={(e) => setRecommendedBy(e.target.value)}
                  placeholder="Mr. AVL Ramakrishna, Dy. GM( C&IT) , Engineer-in-Charge"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-500"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block">
                  Appears after Checked By and before Signed By on official Material Passes.
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              id="btn-submit-pass-form"
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-xs transition cursor-pointer"
            >
              {isEditing ? 'Save Changes' : 'Register Pass'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
