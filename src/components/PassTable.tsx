import React, { useState } from 'react';
import { 
  EntryPass, 
  PassType, 
  MaterialReturnType, 
  PassStatus, 
  UserRole,
  MaterialItem,
  ProcedureStage
} from '../types';
import { 
  Eye, 
  Edit3, 
  Trash2, 
  Download, 
  UploadCloud, 
  FileCheck, 
  Printer, 
  RotateCcw, 
  CheckCircle, 
  CheckCircle2,
  Clock, 
  AlertCircle, 
  Users, 
  Truck, 
  Package, 
  HardHat, 
  LogIn, 
  LogOut,
  ChevronDown,
  ChevronUp,
  Receipt,
  FileText,
  Lock,
  Layers,
  Tag,
  Shield,
  ArrowRight,
  Plus,
  FileSpreadsheet
} from 'lucide-react';

interface PassTableProps {
  passes: EntryPass[];
  userRole: UserRole;
  onViewPass: (pass: EntryPass) => void;
  onEditPass: (pass: EntryPass) => void;
  onDeletePass: (passId: string) => void;
  onPrintPass: (pass: EntryPass) => void;
  onUploadDocClick: (pass: EntryPass) => void;
  onUploadBillClick?: (pass: EntryPass) => void;
  onToggleGateStatus: (pass: EntryPass) => void;
  onToggleMaterialReturn: (pass: EntryPass) => void;
  onAdvanceProcedureStage?: (pass: EntryPass, nextStage: ProcedureStage) => void;
  onOpenNewPassModal?: () => void;
  onOpenExcelModal?: () => void;
}

export const PassTable: React.FC<PassTableProps> = ({
  passes,
  userRole,
  onViewPass,
  onEditPass,
  onDeletePass,
  onPrintPass,
  onUploadDocClick,
  onUploadBillClick,
  onToggleGateStatus,
  onToggleMaterialReturn,
  onAdvanceProcedureStage,
  onOpenNewPassModal,
  onOpenExcelModal
}) => {
  const isAdmin = userRole === 'admin';
  const [expandedPassId, setExpandedPassId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedPassId(expandedPassId === id ? null : id);
  };

  const getPassTypeBadge = (type: PassType, materialCategory?: MaterialReturnType) => {
    switch (type) {
      case 'Employee':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <Users className="w-3 h-3 text-blue-500" />
            <span>Employee</span>
          </span>
        );
      case 'Contractor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
            <HardHat className="w-3 h-3 text-amber-600" />
            <span>Contractor</span>
          </span>
        );
      case 'Vehicle':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Truck className="w-3 h-3 text-emerald-600" />
            <span>Vehicle</span>
          </span>
        );
      case 'Materials':
        if (materialCategory === 'Returnable') {
          return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <RotateCcw className="w-3 h-3 text-amber-700" />
              <span>RGP (Returnable)</span>
            </span>
          );
        }
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-900 border border-indigo-300">
            <Layers className="w-3 h-3 text-indigo-700" />
            <span>NRGP (Non-Returnable)</span>
          </span>
        );
    }
  };

  const getValidityBadge = (status: 'Active' | 'Expiring Soon' | 'Expired') => {
    switch (status) {
      case 'Active':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle className="w-3 h-3 text-emerald-500" />
            <span>Active</span>
          </span>
        );
      case 'Expiring Soon':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-300 animate-pulse">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Expiring Soon</span>
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-rose-50 text-rose-700 border border-rose-200">
            <AlertCircle className="w-3 h-3 text-rose-500" />
            <span>Expired</span>
          </span>
        );
    }
  };

  const getGateStatusBadge = (status: PassStatus) => {
    switch (status) {
      case 'In-Premises':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
            <span>In-Premises</span>
          </span>
        );
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
            <span>Approved</span>
          </span>
        );
      case 'Exited':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-300">
            <span>Exited</span>
          </span>
        );
      case 'Expired':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800 border border-rose-200">
            <span>Gate Access Blocked</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getProcedureStageDisplay = (pass: EntryPass) => {
    const stage = pass.procedureStage || 'Pass Prepared';
    switch (stage) {
      case 'Pass Prepared':
        return (
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-500"></span>
              <span>1. Pass Prepared (Amnex)</span>
            </span>
            <div className="text-[10px] text-slate-500">Ready for C&IT submission</div>
            {isAdmin && onAdvanceProcedureStage && (
              <button
                id={`btn-submit-cit-${pass.id}`}
                onClick={() => onAdvanceProcedureStage(pass, 'Submitted to C&IT')}
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition cursor-pointer"
                title="Submit pass for approval from C&IT"
              >
                <span>Submit to C&IT</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      case 'Submitted to C&IT':
        return (
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
              <Clock className="w-2.5 h-2.5 text-amber-700" />
              <span>2. Submitted to C&IT</span>
            </span>
            <div className="text-[10px] text-amber-800">Pending NMDC C&IT Approval</div>
            {isAdmin && onAdvanceProcedureStage && (
              <button
                id={`btn-approve-cit-${pass.id}`}
                onClick={() => onAdvanceProcedureStage(pass, 'Submitted to CISF')}
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300 transition cursor-pointer"
                title="Approve by C&IT and submit to CISF for signature"
              >
                <span>Approve & Send to CISF</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        );
      case 'Submitted to CISF':
        return (
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-300">
              <Shield className="w-2.5 h-2.5 text-blue-700" />
              <span>3. Submitted to CISF</span>
            </span>
            <div className="text-[10px] text-blue-800">For CISF Signature ({pass.gateNumber.split(' ')[0]})</div>
            {isAdmin && onAdvanceProcedureStage && (
              <button
                id={`btn-obtain-pass-${pass.id}`}
                onClick={() => onAdvanceProcedureStage(pass, 'Pass Obtained')}
                className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xs transition cursor-pointer"
                title="CISF signed - mark pass obtained"
              >
                <CheckCircle2 className="w-3 h-3" />
                <span>Mark Pass Obtained</span>
              </button>
            )}
          </div>
        );
      case 'Pass Obtained':
        return (
          <div className="space-y-0.5">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 border border-emerald-300">
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-700" />
              <span>4. Pass Obtained</span>
            </span>
            <div className="text-[10px] text-emerald-800 font-medium">Signed & Obtained</div>
            {pass.passObtainedDate && (
              <div className="text-[9px] text-slate-400">Date: {pass.passObtainedDate}</div>
            )}
          </div>
        );
    }
  };

  const triggerDownload = (url: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (passes.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-2xs">
        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3.5 border border-blue-100">
          <FileText className="w-7 h-7" />
        </div>
        <h3 className="text-base font-bold text-slate-800">Clean Database Ready</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
          All test data has been deleted. You can now register genuine entry passes or upload your official Excel / CSV pass register.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {isAdmin && onOpenNewPassModal && (
            <button
              onClick={onOpenNewPassModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create First Entry Pass</span>
            </button>
          )}
          {isAdmin && onOpenExcelModal && (
            <button
              onClick={onOpenExcelModal}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white shadow-xs transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Upload Excel Sheet</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-900 text-slate-200 font-semibold uppercase tracking-wider text-[11px] border-b border-slate-800">
              <th className="py-3 px-3.5 whitespace-nowrap">Pass # & Type</th>
              <th className="py-3 px-3.5">Holder & Personnel</th>
              <th className="py-3 px-3.5">Department & Gate</th>
              <th className="py-3 px-3.5 min-w-[170px]">Procedure Pipeline (Amnex → C&IT → CISF)</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Validity Period</th>
              <th className="py-3 px-3.5 min-w-[220px]">Material Details & BOQ / Bill</th>
              <th className="py-3 px-3.5 min-w-[180px]">Approved Document</th>
              <th className="py-3 px-3.5 whitespace-nowrap">Gate Status</th>
              <th className="py-3 px-3.5 text-right whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {passes.map((pass) => {
              const isMaterial = pass.passType === 'Materials';
              const isExpanded = expandedPassId === pass.id;
              const hasBill = !!pass.billDocument || !!pass.billNumber;

              return (
                <React.Fragment key={pass.id}>
                  <tr 
                    id={`pass-row-${pass.id}`}
                    className={`hover:bg-blue-50/30 transition ${
                      pass.validityStatus === 'Expired' ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    {/* Pass # & Type */}
                    <td className="py-3 px-3.5 align-top">
                      <div className="font-mono font-bold text-slate-900 text-xs flex items-center gap-1">
                        <span>{pass.passNumber}</span>
                      </div>
                      <div className="mt-1">
                        {getPassTypeBadge(pass.passType, pass.materialCategory)}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        CISF Unit: <span className="font-medium text-slate-700">{pass.gateNumber.split(' ')[0]} {pass.gateNumber.split(' ')[1]}</span>
                      </div>
                    </td>

                    {/* Holder & Personnel */}
                    <td className="py-3 px-3.5 align-top max-w-[200px]">
                      <div className="font-semibold text-slate-900 text-xs">
                        {pass.passHolderName}
                      </div>
                      {pass.passHolderDesignation && (
                        <div className="text-[11px] text-slate-500">
                          {pass.passHolderDesignation}
                        </div>
                      )}
                      
                      {/* Employee Gang count */}
                      <div className="mt-1.5 flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50/80 px-2 py-0.5 rounded border border-blue-100 inline-flex font-medium">
                        <Users className="w-3 h-3 text-blue-600" />
                        <span>{pass.employees.length} personnel authorized</span>
                      </div>

                      {pass.employees.length > 0 && (
                        <div className="text-[10px] text-slate-500 mt-1 truncate" title={pass.employees.map(e => e.name).join(', ')}>
                          {pass.employees.map(e => e.name).slice(0, 2).join(', ')}
                          {pass.employees.length > 2 ? ` +${pass.employees.length - 2} more` : ''}
                        </div>
                      )}

                      {/* Vehicle if applicable */}
                      {pass.passType === 'Vehicle' && pass.vehicleNumber && (
                        <div className="mt-1.5 text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block">
                          Reg: {pass.vehicleNumber}
                        </div>
                      )}
                    </td>

                    {/* Project & Gate */}
                    <td className="py-3 px-3.5 align-top max-w-[180px]">
                      <div className="text-slate-900 font-medium text-xs leading-tight">
                        {pass.departmentOrProject}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        {pass.gateNumber}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        Client: NMDC Ltd • Amnex
                      </div>
                    </td>

                    {/* Procedure Pipeline Stage (Amnex -> C&IT -> CISF -> Obtained) */}
                    <td className="py-3 px-3.5 align-top min-w-[170px]">
                      {getProcedureStageDisplay(pass)}
                    </td>

                    {/* Validity Period */}
                    <td className="py-3 px-3.5 align-top whitespace-nowrap">
                      <div className="text-slate-900 font-medium">
                        {pass.validFrom}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        to <span className="font-semibold text-slate-800">{pass.validTo}</span>
                      </div>
                      <div className="mt-1">
                        {getValidityBadge(pass.validityStatus)}
                      </div>
                    </td>

                    {/* Material Details & BOQ / Bill */}
                    <td className="py-3 px-3.5 align-top">
                      {isMaterial ? (
                        <div className="space-y-1.5">
                          {/* RGP vs NRGP Badge & Status */}
                          <div className="flex flex-wrap items-center gap-1.5">
                            {pass.materialCategory === 'Returnable' ? (
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                                pass.materialReturnStatus === 'Returned'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                              }`}>
                                <RotateCcw className="w-2.5 h-2.5" />
                                <span>{pass.materialReturnStatus || 'Pending Return'}</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <span>Delivered to NMDC Stores (NRGP)</span>
                              </span>
                            )}

                            {pass.materialCategory === 'Returnable' && pass.expectedReturnDate && (
                              <span className="text-[10px] text-amber-900 font-semibold block">
                                Due: {pass.expectedReturnDate}
                              </span>
                            )}
                          </div>

                          {/* Items summary */}
                          {pass.materialItems && pass.materialItems.length > 0 && (
                            <div>
                              <div className="text-xs font-semibold text-slate-800">
                                {pass.materialItems[0].itemName}
                                {pass.materialItems.length > 1 && (
                                  <span className="text-slate-500 font-normal ml-1">
                                    (+{pass.materialItems.length - 1} more items)
                                  </span>
                                )}
                              </div>
                              
                              {/* BOQ Item & Bill Number Tags */}
                              <div className="mt-1 flex flex-wrap items-center gap-1">
                                {pass.materialItems[0].isBoq ? (
                                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 border border-indigo-200">
                                    <Tag className="w-2.5 h-2.5 text-indigo-600" />
                                    <span>BOQ: {pass.materialItems[0].boqItemNumber || 'Yes'}</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                    Non-BOQ
                                  </span>
                                )}

                                {(pass.billNumber || pass.materialItems[0].billNumber) && (
                                  <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                    Bill: {pass.billNumber || pass.materialItems[0].billNumber}
                                  </span>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Bill Document & Actions */}
                          <div className="pt-1 flex flex-wrap items-center gap-1.5">
                            {pass.billDocument ? (
                              <button
                                onClick={() => triggerDownload(pass.billDocument!.fileUrl, pass.billDocument!.fileName)}
                                title={`Download Tax Invoice: ${pass.billDocument.fileName}`}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-200 rounded text-[11px] font-semibold transition cursor-pointer"
                              >
                                <Receipt className="w-3 h-3 text-indigo-600" />
                                <span>Download Bill Link</span>
                              </button>
                            ) : (
                              isAdmin ? (
                                <button
                                  onClick={() => onUploadBillClick && onUploadBillClick(pass)}
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 rounded text-[10px] font-medium transition cursor-pointer"
                                  title="Upload Bill / Invoice copy"
                                >
                                  <UploadCloud className="w-3 h-3" />
                                  <span>Upload Bill</span>
                                </button>
                              ) : (
                                <span className="text-[10px] text-slate-400 italic">Bill copy pending</span>
                              )
                            )}

                            {/* Expand Items Drawer Toggle */}
                            <button
                              onClick={() => toggleExpand(pass.id)}
                              className="inline-flex items-center gap-0.5 text-[10px] text-blue-600 hover:text-blue-800 font-medium px-1.5 py-0.5 hover:bg-blue-50 rounded transition cursor-pointer"
                            >
                              <span>{isExpanded ? 'Hide Items' : 'View All Items'}</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">Not a material pass</span>
                      )}
                    </td>

                    {/* Approved Document */}
                    <td className="py-3 px-3.5 align-top">
                      {pass.approvedDocument ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-emerald-800 font-semibold text-xs">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span className="truncate max-w-[140px]" title={pass.approvedDocument.fileName}>
                              {pass.approvedDocument.fileName}
                            </span>
                          </div>
                          
                          {/* Direct Download Link - Available for both Admin and User */}
                          <button
                            id={`btn-download-pass-${pass.id}`}
                            onClick={() => triggerDownload(pass.approvedDocument!.fileUrl, pass.approvedDocument!.fileName)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold shadow-2xs transition cursor-pointer"
                            title="Download approved signed gate pass link"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download Pass Link</span>
                          </button>

                          {isAdmin && (
                            <div className="pt-0.5">
                              <button
                                onClick={() => onUploadDocClick(pass)}
                                className="text-[10px] text-slate-500 hover:text-blue-700 underline cursor-pointer"
                              >
                                Replace signed file
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 inline-block font-medium">
                            Pending Signed Copy
                          </span>
                          {isAdmin ? (
                            <div>
                              <button
                                id={`btn-upload-doc-${pass.id}`}
                                onClick={() => onUploadDocClick(pass)}
                                className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition cursor-pointer border border-blue-200"
                              >
                                <UploadCloud className="w-3 h-3" />
                                <span>Upload Signed Pass</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 block">
                              Admin upload required
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* CISF Gate Status */}
                    <td className="py-3 px-3.5 align-top">
                      <div>
                        {getGateStatusBadge(pass.status)}
                        <div className="text-[10px] text-slate-500 mt-1 truncate max-w-[130px]" title={pass.lastGateActivity}>
                          {pass.lastGateActivity || 'Gate check pending'}
                        </div>
                        
                        {/* Gate Action Toggle (Admin can toggle gate status, user sees read-only) */}
                        {isAdmin ? (
                          <button
                            onClick={() => onToggleGateStatus(pass)}
                            className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-slate-700 hover:text-blue-700 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded transition cursor-pointer border border-slate-200"
                            title={pass.status === 'In-Premises' ? 'Mark exit at CISF gate' : 'Mark entry at CISF gate'}
                          >
                            {pass.status === 'In-Premises' ? (
                              <>
                                <LogOut className="w-3 h-3 text-rose-500" />
                                <span>Log Exit</span>
                              </>
                            ) : (
                              <>
                                <LogIn className="w-3 h-3 text-emerald-600" />
                                <span>Log Entry</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 mt-1 block">CISF Monitored</span>
                        )}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-3.5 align-top text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        {/* View Button - Both Roles */}
                        <button
                          id={`btn-view-${pass.id}`}
                          onClick={() => onViewPass(pass)}
                          title="View Complete Pass Record & Details"
                          className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition cursor-pointer"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Print Badge Button - Both Roles */}
                        <button
                          id={`btn-print-${pass.id}`}
                          onClick={() => onPrintPass(pass)}
                          title="Generate Printable CISF Security Gate Pass Badge"
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition cursor-pointer"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* Edit & Delete - Admin Only */}
                        {isAdmin ? (
                          <>
                            <button
                              id={`btn-edit-${pass.id}`}
                              onClick={() => onEditPass(pass)}
                              title="Edit Pass Details"
                              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            <button
                              id={`btn-delete-${pass.id}`}
                              onClick={() => onDeletePass(pass.id)}
                              title="Delete Pass Record"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="p-1.5 text-slate-300" title="Upload/Edit restricted to Admin">
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>

                  {/* Expanded Material Items Drawer */}
                  {isExpanded && isMaterial && pass.materialItems && (
                    <tr className="bg-slate-50/80 border-b border-slate-200">
                      <td colSpan={9} className="p-4">
                        <div className="bg-white rounded-lg border border-slate-200 p-3 shadow-2xs">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-indigo-600" />
                              <span className="font-bold text-xs text-slate-800">
                                Detailed Items List for {pass.passNumber} ({pass.materialCategory === 'Returnable' ? 'RGP' : 'NRGP'})
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-500">
                              Challan / Bill Ref: <strong>{pass.billNumber || pass.challanInvoiceNumber || 'N/A'}</strong>
                            </span>
                          </div>

                          <table className="w-full text-left text-xs border border-slate-100 rounded overflow-hidden">
                            <thead>
                              <tr className="bg-slate-100 text-slate-700 text-[11px] font-semibold">
                                <th className="py-1.5 px-2.5">Item Description & Specification</th>
                                <th className="py-1.5 px-2.5">BOQ Classification</th>
                                <th className="py-1.5 px-2.5">Quantity & Unit</th>
                                <th className="py-1.5 px-2.5">Bill Number</th>
                                <th className="py-1.5 px-2.5">Serial / Asset #</th>
                                <th className="py-1.5 px-2.5">Remarks</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                              {pass.materialItems.map((item, idx) => (
                                <tr key={item.id || idx} className="hover:bg-slate-50">
                                  <td className="py-1.5 px-2.5 font-medium text-slate-900">
                                    {item.itemName}
                                    {item.specification && (
                                      <span className="text-[11px] text-slate-500 block">{item.specification}</span>
                                    )}
                                  </td>
                                  <td className="py-1.5 px-2.5">
                                    {item.isBoq ? (
                                      <span className="inline-flex items-center gap-1 font-bold text-indigo-800 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded text-[10px]">
                                        <Tag className="w-2.5 h-2.5" />
                                        <span>BOQ Item ({item.boqItemNumber || 'Ref'})</span>
                                      </span>
                                    ) : (
                                      <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-medium">
                                        Non-BOQ
                                      </span>
                                    )}
                                  </td>
                                  <td className="py-1.5 px-2.5 font-semibold text-slate-800">
                                    {item.quantity} {item.unit}
                                  </td>
                                  <td className="py-1.5 px-2.5 font-mono text-[11px] text-slate-700">
                                    {item.billNumber || pass.billNumber || '-'}
                                  </td>
                                  <td className="py-1.5 px-2.5 font-mono text-[11px] text-slate-600">
                                    {item.serialNumber || '-'}
                                  </td>
                                  <td className="py-1.5 px-2.5 text-slate-500 text-[11px]">
                                    {item.remarks || '-'}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
