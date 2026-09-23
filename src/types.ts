export type UserRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  organization: string; // e.g., 'Amnex Infotechnologies / NMDC Security' or 'CISF Gate Security Unit'
  designation: string;
}

export type PassType = 'Employee' | 'Contractor' | 'Vehicle' | 'Materials';

export type MaterialReturnType = 'Returnable' | 'Non-Returnable';

// Official 4-stage lifecycle procedure:
// 1. Pass Prepared -> 2. Submitted to C&IT -> 3. Submitted to CISF -> 4. Pass Obtained
export type ProcedureStage = 
  | 'Pass Prepared'
  | 'Submitted to C&IT'
  | 'Submitted to CISF'
  | 'Pass Obtained';

export const DESIGNATED_GATES = [
  'DIOM',
  'KIOM',
  'Admin Building',
  'PPT'
] as const;

export type DesignatedGate = typeof DESIGNATED_GATES[number];

export type PassStatus = 'Approved' | 'Pending Approval' | 'In-Premises' | 'Exited' | 'Expired';

export type MaterialReturnStatus = 'Pending Return' | 'Partially Returned' | 'Returned' | 'Overdue';

export interface PassEmployee {
  id: string;
  name: string;
  designation: string;
  idNumber: string; // Aadhaar / Voter ID / Govt ID
  contactNumber: string;
}

export interface MaterialItem {
  id: string;
  itemName: string;
  specification?: string;
  quantity: number;
  unit: string;
  boqItemNumber?: string; // e.g. "BOQ-ITEM-4.1", "BOQ-ELEC-11"
  isBoq: boolean; // true = BOQ Item, false = Non-BOQ Item
  billNumber?: string; // Invoice / Bill / Delivery Challan reference
  billDocument?: ApprovedDocument; // Uploaded bill document for item
  serialNumber?: string;
  challanNumber?: string;
  remarks?: string;
}

export interface GateLog {
  timestamp: string;
  action: 'Entry' | 'Exit' | 'Material Returned' | 'Approved' | 'Verification';
  cisfOfficerName: string;
  cisfOfficerBadge: string;
  gateNumber: string;
  remarks?: string;
}

export interface ApprovedDocument {
  fileName: string;
  fileSize?: string;
  fileUrl: string; // Data URL or external link
  uploadedAt: string;
  uploadedBy: string;
  fileType?: string;
}

export interface EntryPass {
  id: string;
  passNumber: string; // e.g. AMN-NMDC-EMP-2025-001
  passType: PassType;
  passHolderName: string;
  passHolderDesignation?: string;
  passHolderContact?: string;
  passHolderIdProof?: string;
  departmentOrProject: string; // Default: 'C&IT'
  validFrom: string; // YYYY-MM-DD
  validTo: string; // YYYY-MM-DD
  validityStatus: 'Active' | 'Expiring Soon' | 'Expired';
  status: PassStatus;
  gateNumber: string; // Designated gate: 'DIOM' | 'KIOM' | 'Admin Building' | 'PPT'
  
  // Official 4-step procedure stage:
  // Step 1: Pass Prepared -> Step 2: Submitted to C&IT -> Step 3: Submitted to CISF -> Step 4: Pass Obtained
  procedureStage: ProcedureStage;
  preparedBy?: string;
  preparedDate?: string;
  citSubmittedDate?: string;
  citApprovedBy?: string;
  citApprovalDate?: string;
  citApprovedDate?: string;
  citRemarks?: string;
  cisfSubmittedDate?: string;
  cisfSignedBy?: string;
  cisfSignatureDate?: string;
  cisfRemarks?: string;
  passObtainedDate?: string;

  // List of employees covered under this pass (vital for contractor teams & work gangs)
  employees: PassEmployee[];
  
  // Specific to Vehicle passes
  vehicleNumber?: string;
  vehicleType?: string;
  driverLicenseNumber?: string;
  
  // Specific to Material passes (RGP vs NRGP)
  materialCategory?: MaterialReturnType; // 'Returnable' (RGP) | 'Non-Returnable' (NRGP)
  materialItems?: MaterialItem[];
  expectedReturnDate?: string; // For Returnable materials (RGP)
  materialReturnStatus?: MaterialReturnStatus;
  challanInvoiceNumber?: string;
  billNumber?: string; // Consignment Bill / Tax Invoice Number
  billDocument?: ApprovedDocument; // Uploaded Bill Copy (PDF / Scan)
  rgpPurpose?: string; // e.g., Calibration, Testing, Maintenance, Loan
  nrgpStoreReceiptNo?: string; // e.g., NMDC Store GRN / SRN number
  
  // Approved Pass Document (Uploaded signed/received pass & downloadable link)
  approvedDocument?: ApprovedDocument;
  approvalAuthority?: string; // e.g., NMDC C&IT / CISF Security Unit
  approvedDate?: string;
  
  // CISF gate logs and follow-up notes
  cisfVerified: boolean;
  cisfVerifierName?: string;
  followUpNotes?: string;
  lastGateActivity?: string;
  createdAt: string;
  updatedAt: string;
}
