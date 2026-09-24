import React, { useState, useEffect, useMemo } from 'react';
import { EntryPass, PassType, MaterialReturnType, UserProfile, UserRole, ApprovedDocument, ProcedureStage } from './types';
import { loadStoredPasses, saveStoredPasses, clearAllPasses, fetchPassesFromCloud } from './utils/storage';
import { exportPassesToExcel } from './utils/excelHelper';
import { Header } from './components/Header';
import { StatsCards } from './components/StatsCards';
import { PassFilters } from './components/PassFilters';
import { PassTable } from './components/PassTable';
import { PassDetailModal } from './components/PassDetailModal';
import { PassFormModal } from './components/PassFormModal';
import { ExcelUploadModal } from './components/ExcelUploadModal';
import { UploadDocModal } from './components/UploadDocModal';
import { UploadBillModal } from './components/UploadBillModal';
import { PrintablePassModal } from './components/PrintablePassModal';
import { PassReportModal } from './components/PassReportModal';
import { RoleSwitcherModal } from './components/RoleSwitcherModal';
import { getActiveUserProfile, setActiveUserProfile } from './utils/userProfiles';
import { getNextPassNumber } from './utils/passUtils';
import { ShieldCheck, AlertTriangle, CheckCircle, Package, Receipt, RotateCcw } from 'lucide-react';

export default function App() {
  const [passes, setPasses] = useState<EntryPass[]>(() => loadStoredPasses());

  // Active User Profile: Defaults to Admin (Ashwin R.) or User (username: 'user')
  const [currentProfile, setCurrentProfile] = useState<UserProfile>(() => getActiveUserProfile());
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  // Cloud Database state (Neon Postgres / Vercel KV)
  const [cloudStatus, setCloudStatus] = useState<{
    connected: boolean;
    source: string;
    loading: boolean;
    hasLoadedInitially: boolean;
  }>({
    connected: false,
    source: 'checking...',
    loading: true,
    hasLoadedInitially: false
  });

  // Pull latest passes from Neon Postgres on load
  const loadCloudPasses = async () => {
    setCloudStatus(prev => ({ ...prev, loading: true }));
    try {
      const res = await fetchPassesFromCloud();
      if (res && res.connected) {
        setCloudStatus({
          connected: true,
          source: res.source,
          loading: false,
          hasLoadedInitially: true
        });
        if (Array.isArray(res.passes) && res.passes.length > 0) {
          setPasses(res.passes);
        }
      } else {
        setCloudStatus({
          connected: false,
          source: res.source || 'local_fallback',
          loading: false,
          hasLoadedInitially: true
        });
      }
    } catch (e) {
      setCloudStatus(prev => ({ ...prev, connected: false, loading: false, hasLoadedInitially: true }));
    }
  };

  useEffect(() => {
    loadCloudPasses();
  }, []);

  // Sync to local storage & Cloud DB on changes only after initial load has finished
  useEffect(() => {
    if (!cloudStatus.hasLoadedInitially) return;
    saveStoredPasses(passes).then((success) => {
      if (success && !cloudStatus.connected) {
        setCloudStatus(prev => ({ ...prev, connected: true }));
      }
    });
  }, [passes, cloudStatus.hasLoadedInitially]);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [materialSearchQuery, setMaterialSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('ALL');
  const [procedureStageFilter, setProcedureStageFilter] = useState('ALL'); // 'ALL' | ProcedureStage | 'PENDING_PROCEDURE'
  const [gateFilter, setGateFilter] = useState('ALL'); // 'ALL' | DesignatedGate
  const [validityFilter, setValidityFilter] = useState('ALL');
  const [gateStatusFilter, setGateStatusFilter] = useState('ALL');
  const [materialReturnFilter, setMaterialReturnFilter] = useState('ALL'); // 'ALL' | 'Returnable' | 'Non-Returnable'
  const [boqFilter, setBoqFilter] = useState('ALL'); // 'ALL' | 'BOQ' | 'NON_BOQ'
  const [billFilter, setBillFilter] = useState('ALL'); // 'ALL' | 'HAS_BILL' | 'NO_BILL'
  const [docStatusFilter, setDocStatusFilter] = useState('ALL');

  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingPass, setEditingPass] = useState<EntryPass | null>(null);
  const [viewingPass, setViewingPass] = useState<EntryPass | null>(null);
  const [printingPass, setPrintingPass] = useState<EntryPass | null>(null);
  const [uploadDocPass, setUploadDocPass] = useState<EntryPass | null>(null);
  const [uploadBillPass, setUploadBillPass] = useState<EntryPass | null>(null);
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Flash notification helper
  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Filtered passes calculation
  const filteredPasses = useMemo(() => {
    return passes.filter((pass) => {
      // Type filter
      if (selectedType !== 'ALL' && pass.passType !== selectedType) {
        return false;
      }

      // Procedure stage filter (Workflow: Pass Prepared -> Submitted to C&IT -> Submitted to CISF -> Pass Obtained)
      if (procedureStageFilter !== 'ALL') {
        if (procedureStageFilter === 'PENDING_PROCEDURE') {
          if (pass.procedureStage === 'Pass Obtained') return false;
        } else if (pass.procedureStage !== procedureStageFilter) {
          return false;
        }
      }

      // Designated Gate Filter (DIOM, KIOM, Admin Building, PPT, KIOM/DIOM/PPT)
      if (gateFilter !== 'ALL') {
        if (gateFilter === 'KIOM/DIOM/PPT') {
          if (pass.gateNumber !== 'KIOM/DIOM/PPT') return false;
        } else {
          // If filtering by a specific gate like DIOM, also match passes authorized for all sites KIOM/DIOM/PPT
          if (pass.gateNumber !== gateFilter && !pass.gateNumber?.includes(gateFilter)) {
            return false;
          }
        }
      }

      // Validity filter
      if (validityFilter !== 'ALL' && pass.validityStatus !== validityFilter) {
        return false;
      }

      // Gate status filter
      if (gateStatusFilter !== 'ALL' && pass.status !== gateStatusFilter) {
        return false;
      }

      // Material Returnable (RGP vs NRGP) filter
      if (materialReturnFilter !== 'ALL') {
        if (pass.passType !== 'Materials' || pass.materialCategory !== materialReturnFilter) {
          return false;
        }
      }

      // BOQ Filter
      if (boqFilter !== 'ALL') {
        if (pass.passType !== 'Materials') return false;
        const hasBoq = pass.materialItems?.some((m) => m.isBoq);
        if (boqFilter === 'BOQ' && !hasBoq) return false;
        if (boqFilter === 'NON_BOQ' && hasBoq) return false;
      }

      // Bill Filter
      if (billFilter !== 'ALL') {
        const hasBill = !!pass.billDocument || !!pass.billNumber;
        if (billFilter === 'HAS_BILL' && !hasBill) return false;
        if (billFilter === 'NO_BILL' && hasBill) return false;
      }

      // Document status filter
      if (docStatusFilter === 'HAS_DOC' && !pass.approvedDocument) {
        return false;
      }
      if (docStatusFilter === 'NO_DOC' && !!pass.approvedDocument) {
        return false;
      }

      // General Search Query (Pass #, Holder, Employees, Vehicle)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const passNum = pass.passNumber.toLowerCase();
        const holder = pass.passHolderName.toLowerCase();
        const dept = pass.departmentOrProject.toLowerCase();
        const vehicle = pass.vehicleNumber ? pass.vehicleNumber.toLowerCase() : '';
        const empMatches = pass.employees.some(
          (e) => e.name.toLowerCase().includes(q) || e.idNumber.toLowerCase().includes(q)
        );

        if (
          !passNum.includes(q) &&
          !holder.includes(q) &&
          !dept.includes(q) &&
          !vehicle.includes(q) &&
          !empMatches
        ) {
          return false;
        }
      }

      // Dedicated Material Search (Item Name, BOQ #, Bill #, Serial #)
      if (materialSearchQuery.trim()) {
        const mq = materialSearchQuery.toLowerCase();
        if (pass.passType !== 'Materials') return false;

        const passBill = pass.billNumber ? pass.billNumber.toLowerCase() : '';
        const passChallan = pass.challanInvoiceNumber ? pass.challanInvoiceNumber.toLowerCase() : '';

        const itemMatches = pass.materialItems?.some((m) => {
          const nameMatches = m.itemName.toLowerCase().includes(mq);
          const specMatches = m.specification ? m.specification.toLowerCase().includes(mq) : false;
          const boqMatches = m.boqItemNumber ? m.boqItemNumber.toLowerCase().includes(mq) : false;
          const itemBillMatches = m.billNumber ? m.billNumber.toLowerCase().includes(mq) : false;
          const serialMatches = m.serialNumber ? m.serialNumber.toLowerCase().includes(mq) : false;
          const remarksMatches = m.remarks ? m.remarks.toLowerCase().includes(mq) : false;

          return (
            nameMatches ||
            specMatches ||
            boqMatches ||
            itemBillMatches ||
            serialMatches ||
            remarksMatches
          );
        });

        if (!itemMatches && !passBill.includes(mq) && !passChallan.includes(mq)) {
          return false;
        }
      }

      return true;
    });
  }, [
    passes, 
    selectedType, 
    procedureStageFilter,
    gateFilter,
    validityFilter, 
    gateStatusFilter, 
    materialReturnFilter, 
    boqFilter,
    billFilter,
    docStatusFilter, 
    searchQuery,
    materialSearchQuery
  ]);

  // Category counts
  const counts = useMemo(() => {
    return {
      all: passes.length,
      employee: passes.filter((p) => p.passType === 'Employee').length,
      contractor: passes.filter((p) => p.passType === 'Contractor').length,
      vehicle: passes.filter((p) => p.passType === 'Vehicle').length,
      materials: passes.filter((p) => p.passType === 'Materials').length,
      rgp: passes.filter((p) => p.passType === 'Materials' && p.materialCategory === 'Returnable').length,
      nrgp: passes.filter((p) => p.passType === 'Materials' && p.materialCategory === 'Non-Returnable').length,
    };
  }, [passes]);

  // Urgent follow-up alerts count
  const pendingReturnables = passes.filter(
    (p) => p.passType === 'Materials' && p.materialCategory === 'Returnable' && p.materialReturnStatus === 'Pending Return'
  );
  const expiringSoonCount = passes.filter((p) => p.validityStatus === 'Expiring Soon').length;

  // Handlers
  const handleSavePass = (passData: Partial<EntryPass>) => {
    if (editingPass) {
      // Update existing
      setPasses((prev) =>
        prev.map((p) => (p.id === editingPass.id ? ({ ...p, ...passData } as EntryPass) : p))
      );
      showToast(`Entry pass ${passData.passNumber || editingPass.passNumber} updated successfully.`);
    } else {
      // Create new
      const newPass: EntryPass = {
        id: `pass-${Date.now()}`,
        passNumber: passData.passNumber || getNextPassNumber(passes),
        passType: passData.passType || 'Employee',
        passHolderName: passData.passHolderName || 'Authorized Holder',
        passHolderDesignation: passData.passHolderDesignation,
        passHolderContact: passData.passHolderContact,
        passHolderIdProof: passData.passHolderIdProof,
        departmentOrProject: passData.departmentOrProject || 'C&IT',
        validFrom: passData.validFrom || new Date().toISOString().split('T')[0],
        validTo: passData.validTo || new Date().toISOString().split('T')[0],
        validityStatus: passData.validityStatus || 'Active',
        status: passData.status || 'Pending Approval',
        gateNumber: passData.gateNumber || 'DIOM',
        procedureStage: passData.procedureStage || 'Pass Prepared',
        preparedBy: passData.preparedBy || 'Amnex Infotechnologies Pvt. Ltd.',
        preparedDate: passData.preparedDate || new Date().toISOString().split('T')[0],
        employees: passData.employees || [],
        vehicleNumber: passData.vehicleNumber,
        vehicleType: passData.vehicleType,
        driverLicenseNumber: passData.driverLicenseNumber,
        materialCategory: passData.materialCategory,
        materialItems: passData.materialItems,
        expectedReturnDate: passData.expectedReturnDate,
        materialReturnStatus: passData.materialReturnStatus,
        challanInvoiceNumber: passData.challanInvoiceNumber,
        billNumber: passData.billNumber,
        billDocument: passData.billDocument,
        approvedDocument: passData.approvedDocument,
        cisfVerified: true,
        cisfVerifierName: 'CISF Gate Duty Officer',
        followUpNotes: passData.followUpNotes || 'Newly registered entry pass',
        lastGateActivity: 'Pass record created',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0],
      };
      setPasses((prev) => [newPass, ...prev]);
      showToast(`New pass ${newPass.passNumber} registered with CISF gate system.`);
    }

    setIsFormModalOpen(false);
    setEditingPass(null);
  };

  const handleDeletePass = (passId: string) => {
    const p = passes.find((x) => x.id === passId);
    if (!p) return;
    if (window.confirm(`Are you sure you want to delete pass #${p.passNumber} for ${p.passHolderName}?`)) {
      setPasses((prev) => prev.filter((x) => x.id !== passId));
      showToast(`Pass #${p.passNumber} removed from database.`);
    }
  };

  const handleToggleGateStatus = (pass: EntryPass) => {
    const nextStatus = pass.status === 'In-Premises' ? 'Exited' : 'In-Premises';
    const activity = nextStatus === 'In-Premises'
      ? `Gate Entry recorded at ${new Date().toLocaleTimeString()} by CISF Officer`
      : `Gate Exit recorded at ${new Date().toLocaleTimeString()} by CISF Officer`;

    setPasses((prev) =>
      prev.map((p) =>
        p.id === pass.id
          ? {
              ...p,
              status: nextStatus,
              lastGateActivity: activity,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : p
      )
    );

    if (viewingPass && viewingPass.id === pass.id) {
      setViewingPass((prev) => (prev ? { ...prev, status: nextStatus, lastGateActivity: activity } : null));
    }

    showToast(`Gate status for ${pass.passNumber} updated to "${nextStatus}".`);
  };

  const handleToggleMaterialReturn = (pass: EntryPass) => {
    const nextReturnStatus = pass.materialReturnStatus === 'Returned' ? 'Pending Return' : 'Returned';
    const logText = nextReturnStatus === 'Returned'
      ? `Return verified at CISF Gate on ${new Date().toLocaleDateString()}`
      : `Material marked pending return`;

    setPasses((prev) =>
      prev.map((p) =>
        p.id === pass.id
          ? {
              ...p,
              materialReturnStatus: nextReturnStatus,
              followUpNotes: `${p.followUpNotes || ''} [${logText}]`,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : p
      )
    );

    if (viewingPass && viewingPass.id === pass.id) {
      setViewingPass((prev) => (prev ? { ...prev, materialReturnStatus: nextReturnStatus } : null));
    }

    showToast(`Material pass #${pass.passNumber} marked as ${nextReturnStatus}.`);
  };

  const handleAdvanceProcedureStage = (pass: EntryPass, nextStage: ProcedureStage) => {
    const today = new Date().toISOString().split('T')[0];
    let updatedFields: Partial<EntryPass> = {
      procedureStage: nextStage,
      updatedAt: today,
    };

    if (nextStage === 'Submitted to C&IT') {
      updatedFields = {
        ...updatedFields,
        citSubmittedDate: today,
        status: 'Pending Approval',
        lastGateActivity: `Submitted to NMDC C&IT Department for approval by ${currentProfile.name}`,
      };
    } else if (nextStage === 'Submitted to CISF') {
      updatedFields = {
        ...updatedFields,
        citApprovalDate: today,
        cisfSubmittedDate: today,
        status: 'Pending Approval',
        lastGateActivity: `Approved by NMDC C&IT. Forwarded to CISF ${pass.gateNumber} Gate for signature`,
      };
    } else if (nextStage === 'Pass Obtained') {
      updatedFields = {
        ...updatedFields,
        cisfSignatureDate: today,
        passObtainedDate: today,
        status: 'Approved',
        cisfVerified: true,
        lastGateActivity: `CISF Gate Officer signed & stamped. Pass officially obtained`,
      };
    }

    setPasses((prev) =>
      prev.map((p) => (p.id === pass.id ? ({ ...p, ...updatedFields } as EntryPass) : p))
    );

    if (viewingPass && viewingPass.id === pass.id) {
      setViewingPass((prev) => (prev ? ({ ...prev, ...updatedFields } as EntryPass) : null));
    }

    showToast(`Pass #${pass.passNumber} workflow advanced to "${nextStage}".`);
  };

  const handleSaveDoc = (
    passId: string,
    doc: {
      fileName: string;
      fileSize: string;
      fileUrl: string;
      uploadedAt: string;
      uploadedBy: string;
    }
  ) => {
    setPasses((prev) =>
      prev.map((p) =>
        p.id === passId
          ? {
              ...p,
              approvedDocument: doc,
              cisfVerified: true,
              lastGateActivity: `Approved pass document uploaded by ${doc.uploadedBy}`,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : p
      )
    );

    if (viewingPass && viewingPass.id === passId) {
      setViewingPass((prev) => (prev ? { ...prev, approvedDocument: doc, cisfVerified: true } : null));
    }

    showToast(`Approved signed pass attached. Download link is now active.`);
  };

  const handleSaveBill = (
    passId: string,
    billNumber: string,
    billDoc: ApprovedDocument
  ) => {
    setPasses((prev) =>
      prev.map((p) =>
        p.id === passId
          ? {
              ...p,
              billNumber,
              billDocument: billDoc,
              lastGateActivity: `Bill / Invoice ${billNumber} attached by ${billDoc.uploadedBy}`,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : p
      )
    );

    if (viewingPass && viewingPass.id === passId) {
      setViewingPass((prev) => (prev ? { ...prev, billNumber, billDocument: billDoc } : null));
    }

    showToast(`Tax invoice / bill document attached for ${billNumber}. Download link active.`);
  };

  const handleImportPasses = (newPasses: EntryPass[]) => {
    setPasses((prev) => [...newPasses, ...prev]);
    showToast(`Successfully imported ${newPasses.length} passes from Excel!`);
  };

  const handleClearAllData = () => {
    if (window.confirm('Delete all test records and start with a clean, empty database?')) {
      const reset = clearAllPasses();
      setPasses(reset);
      showToast('All test records deleted. Database is now clean and ready.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs animate-in slide-in-from-top-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Corporate Header with User Profile / Switcher & Cloud Indicator */}
      <Header
        currentProfile={currentProfile}
        cloudStatus={cloudStatus}
        onRefreshCloud={() => {
          loadCloudPasses();
          showToast('Checking Neon Postgres cloud database connection...');
        }}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenNewPassModal={() => {
          setEditingPass(null);
          setIsFormModalOpen(true);
        }}
        onOpenExcelModal={() => setIsExcelModalOpen(true)}
        onExportExcel={() => exportPassesToExcel(passes)}
        onResetData={handleClearAllData}
        onOpenUserModal={() => setIsUserModalOpen(true)}
        totalPasses={passes.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Urgent Follow-Up Alert Banner (If Returnable Materials Pending or Passes Expiring) */}
        {(pendingReturnables.length > 0 || expiringSoonCount > 0) && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-2xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-amber-900">
                  CISF Security Follow-Up Action Required
                </h3>
                <p className="text-xs text-amber-800 mt-0.5">
                  {pendingReturnables.length > 0 && (
                    <span className="font-semibold">
                      {pendingReturnables.length} Returnable Material Pass(es) (RGP) pending return.
                    </span>
                  )}
                  {pendingReturnables.length > 0 && expiringSoonCount > 0 && ' • '}
                  {expiringSoonCount > 0 && (
                    <span>
                      {expiringSoonCount} pass(es) expiring within 5 days requiring extension approval.
                    </span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {pendingReturnables.length > 0 && (
                <button
                  onClick={() => {
                    setSelectedType('Materials');
                    setMaterialReturnFilter('Returnable');
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                >
                  View RGP Due ({pendingReturnables.length})
                </button>
              )}
              {expiringSoonCount > 0 && (
                <button
                  onClick={() => setValidityFilter('Expiring Soon')}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold shadow-2xs transition cursor-pointer"
                >
                  View Expiring ({expiringSoonCount})
                </button>
              )}
            </div>
          </div>
        )}

        {/* KPI Stats Cards with Contractor, Material & Pipeline Breakdown */}
        <StatsCards
          passes={passes}
          onSelectFilter={(type, status, materialCategory, procedureStage) => {
            if (type !== 'ALL') setSelectedType(type);
            if (materialCategory) {
              setMaterialReturnFilter(materialCategory);
            }
            if (status) {
              if (status === 'In-Premises') setGateStatusFilter('In-Premises');
              if (status === 'Expiring Soon') setValidityFilter('Expiring Soon');
            }
            if (procedureStage) {
              setProcedureStageFilter(procedureStage);
            }
          }}
        />

        {/* Filter Controls with Procedure Stage & Designated Gates */}
        <PassFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          materialSearchQuery={materialSearchQuery}
          onMaterialSearchChange={setMaterialSearchQuery}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          procedureStageFilter={procedureStageFilter}
          onProcedureStageChange={setProcedureStageFilter}
          gateFilter={gateFilter}
          onGateFilterChange={setGateFilter}
          validityFilter={validityFilter}
          onValidityChange={setValidityFilter}
          gateStatusFilter={gateStatusFilter}
          onGateStatusChange={setGateStatusFilter}
          materialReturnFilter={materialReturnFilter}
          onMaterialReturnChange={setMaterialReturnFilter}
          boqFilter={boqFilter}
          onBoqFilterChange={setBoqFilter}
          billFilter={billFilter}
          onBillFilterChange={setBillFilter}
          docStatusFilter={docStatusFilter}
          onDocStatusChange={setDocStatusFilter}
          onResetFilters={() => {
            setSearchQuery('');
            setMaterialSearchQuery('');
            setSelectedType('ALL');
            setProcedureStageFilter('ALL');
            setGateFilter('ALL');
            setValidityFilter('ALL');
            setGateStatusFilter('ALL');
            setMaterialReturnFilter('ALL');
            setBoqFilter('ALL');
            setBillFilter('ALL');
            setDocStatusFilter('ALL');
          }}
          counts={counts}
        />

        {/* Passes Table with RBAC, Download Links, BOQ Details and Bill Links */}
        <PassTable
          passes={filteredPasses}
          userRole={currentProfile.role}
          onViewPass={(pass) => setViewingPass(pass)}
          onPrintPass={(pass) => setPrintingPass(pass)}
          onEditPass={(pass) => {
            setEditingPass(pass);
            setIsFormModalOpen(true);
          }}
          onDeletePass={handleDeletePass}
          onUploadDocClick={(pass) => setUploadDocPass(pass)}
          onUploadBillClick={(pass) => setUploadBillPass(pass)}
          onToggleGateStatus={handleToggleGateStatus}
          onToggleMaterialReturn={handleToggleMaterialReturn}
          onAdvanceProcedureStage={handleAdvanceProcedureStage}
          onOpenNewPassModal={() => {
            setEditingPass(null);
            setIsFormModalOpen(true);
          }}
          onOpenExcelModal={() => setIsExcelModalOpen(true)}
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-5 text-slate-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-800">Amnex Infotechnologies Pvt. Ltd.</span>
            <span>•</span>
            <span className="font-semibold text-blue-900">Client: NMDC , Donimalai</span>
          </div>
          <div className="text-slate-400 text-[11px]">
            Admin: Ashwin R. • Security Monitored by Central Industrial Security Force (CISF)
          </div>
        </div>
      </footer>

      {/* Passes Issued Audit & Material Movement Report Modal (RGP vs NRGP) */}
      {isReportModalOpen && (
        <PassReportModal
          isOpen={isReportModalOpen}
          onClose={() => setIsReportModalOpen(false)}
          passes={passes}
        />
      )}

      {/* Pass Detail Modal */}
      {viewingPass && (
        <PassDetailModal
          pass={viewingPass}
          userRole={currentProfile.role}
          onClose={() => setViewingPass(null)}
          onPrint={(pass) => {
            setViewingPass(null);
            setPrintingPass(pass);
          }}
          onEdit={(pass) => {
            setViewingPass(null);
            setEditingPass(pass);
            setIsFormModalOpen(true);
          }}
          onUploadDoc={(pass) => {
            setUploadDocPass(pass);
          }}
          onUploadBill={(pass) => {
            setUploadBillPass(pass);
          }}
          onToggleGateStatus={handleToggleGateStatus}
          onToggleMaterialReturn={handleToggleMaterialReturn}
          onAdvanceProcedureStage={handleAdvanceProcedureStage}
        />
      )}

      {/* Create / Edit Pass Modal (Admin) */}
      {isFormModalOpen && (
        <PassFormModal
          pass={editingPass}
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingPass(null);
          }}
          onSave={handleSavePass}
          existingPasses={passes}
        />
      )}

      {/* Excel Upload Modal (Admin) */}
      {isExcelModalOpen && (
        <ExcelUploadModal
          isOpen={isExcelModalOpen}
          onClose={() => setIsExcelModalOpen(false)}
          onImportPasses={handleImportPasses}
        />
      )}

      {/* Upload Approved Signed Pass Modal (Admin) */}
      {uploadDocPass && (
        <UploadDocModal
          pass={uploadDocPass}
          isOpen={true}
          onClose={() => setUploadDocPass(null)}
          onSaveDoc={handleSaveDoc}
        />
      )}

      {/* Upload Material Bill Modal (Admin) */}
      {uploadBillPass && (
        <UploadBillModal
          pass={uploadBillPass}
          isOpen={true}
          onClose={() => setUploadBillPass(null)}
          onSaveBill={handleSaveBill}
        />
      )}

      {/* Printable CISF Gate Badge Modal (Both Roles) */}
      {printingPass && (
        <PrintablePassModal
          pass={printingPass}
          onClose={() => setPrintingPass(null)}
        />
      )}

      {/* User Switcher Modal */}
      {isUserModalOpen && (
        <RoleSwitcherModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          currentProfile={currentProfile}
          onSelectUser={(user) => {
            const updated = setActiveUserProfile(user.username);
            setCurrentProfile(updated);
            showToast(`Switched active profile to ${updated.name} (@${updated.username})`);
          }}
        />
      )}
    </div>
  );
}
