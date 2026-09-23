import { EntryPass } from '../types';

export const INITIAL_PASSES: EntryPass[] = [
  {
    id: 'pass-001',
    passNumber: 'AMN-NMDC-EMP-2025-0101',
    passType: 'Employee',
    passHolderName: 'Rajesh Kumar Verma',
    passHolderDesignation: 'Project Lead (SCADA & Automation)',
    passHolderContact: '+91 98765 43210',
    passHolderIdProof: 'AMN-ID-8842',
    departmentOrProject: 'C&IT',
    validFrom: '2025-01-01',
    validTo: '2025-12-31',
    validityStatus: 'Active',
    status: 'Approved',
    gateNumber: 'Admin Building',
    procedureStage: 'Pass Obtained',
    preparedBy: 'Amnex HR & Project Admin',
    preparedDate: '2025-01-01',
    citApprovedBy: 'NMDC DGM (C&IT)',
    citApprovalDate: '2025-01-02',
    citRemarks: 'C&IT approval granted for Amnex IT technical crew.',
    cisfSignedBy: 'Inspector V. K. Singh (CISF Unit NMDC)',
    cisfSignatureDate: '2025-01-02',
    cisfRemarks: 'Biometric gate clearance configured.',
    passObtainedDate: '2025-01-02',
    employees: [
      {
        id: 'emp-1',
        name: 'Rajesh Kumar Verma',
        designation: 'Project Lead',
        idNumber: 'AMN-ID-8842 / AADHAAR 5421-9988-1234',
        contactNumber: '+91 98765 43210'
      },
      {
        id: 'emp-2',
        name: 'Sneha Roy',
        designation: 'Senior Network Engineer',
        idNumber: 'AMN-ID-8845 / AADHAAR 8722-1102-4455',
        contactNumber: '+91 94321 55678'
      },
      {
        id: 'emp-3',
        name: 'Arjun Sen',
        designation: 'Systems Integration Specialist',
        idNumber: 'AMN-ID-8901 / AADHAAR 9081-3344-7788',
        contactNumber: '+91 91234 88765'
      }
    ],
    approvedDocument: {
      fileName: 'NMDC_CISF_Approved_AMN-EMP-0101.pdf',
      fileSize: '1.4 MB',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedAt: '2025-01-02 09:30 AM',
      uploadedBy: 'CISF Inspector V. K. Singh',
      fileType: 'application/pdf'
    },
    approvalAuthority: 'NMDC C&IT / CISF Security Unit',
    approvedDate: '2025-01-02',
    cisfVerified: true,
    cisfVerifierName: 'Sub-Inspector R. B. Tiwari (CISF Badge #98221)',
    followUpNotes: 'Annual employee pass approved for Amnex IT technical crew at Admin Building gate.',
    lastGateActivity: 'Pass verified & active',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-02'
  },
  {
    id: 'pass-002',
    passNumber: 'AMN-NMDC-CON-2025-0219',
    passType: 'Contractor',
    passHolderName: 'Manish Choudhary (Shree Ram Infra & Cabling)',
    passHolderDesignation: 'Site Sub-Contractor Incharge',
    passHolderContact: '+91 98230 11223',
    passHolderIdProof: 'AADHAAR 6744-8832-1928',
    departmentOrProject: 'C&IT',
    validFrom: '2025-03-01',
    validTo: '2025-03-31',
    validityStatus: 'Expiring Soon',
    status: 'Pending Approval',
    gateNumber: 'DIOM',
    procedureStage: 'Submitted to CISF',
    preparedBy: 'Amnex Site Coordinator',
    preparedDate: '2025-03-01',
    citApprovedBy: 'NMDC DGM (C&IT)',
    citApprovalDate: '2025-03-03',
    citRemarks: 'C&IT scope verified for optical fiber trenching work.',
    cisfRemarks: 'Awaiting CISF Commandant physical endorsement and signature badge.',
    employees: [
      {
        id: 'con-1',
        name: 'Manish Choudhary',
        designation: 'Sub-Contractor Supervisor',
        idNumber: 'AADHAAR 6744-8832-1928',
        contactNumber: '+91 98230 11223'
      },
      {
        id: 'con-2',
        name: 'Dinesh Yadav',
        designation: 'Optical Fiber Splicer',
        idNumber: 'AADHAAR 4432-9012-7711',
        contactNumber: '+91 97112 33445'
      },
      {
        id: 'con-3',
        name: 'Sunil Kumar Baghel',
        designation: 'Electrician',
        idNumber: 'AADHAAR 3211-5566-9900',
        contactNumber: '+91 96543 22110'
      },
      {
        id: 'con-4',
        name: 'Ramesh Netam',
        designation: 'Cabling Technician',
        idNumber: 'AADHAAR 8901-2234-5567',
        contactNumber: '+91 95432 10987'
      }
    ],
    followUpNotes: 'Safety induction completed. Submitted to CISF Security for signature at DIOM gate.',
    cisfVerified: false,
    createdAt: '2025-03-01',
    updatedAt: '2025-03-03'
  },
  {
    id: 'pass-003',
    passNumber: 'AMN-NMDC-MAT-2025-0340',
    passType: 'Materials',
    passHolderName: 'Vikramaditya Rao (Amnex Logistics)',
    passHolderDesignation: 'Senior Material & Asset Coordinator',
    passHolderContact: '+91 97765 44332',
    passHolderIdProof: 'AMN-EMP-4421',
    departmentOrProject: 'C&IT',
    validFrom: '2025-03-10',
    validTo: '2025-03-25',
    validityStatus: 'Expiring Soon',
    status: 'Approved',
    gateNumber: 'PPT',
    procedureStage: 'Pass Obtained',
    preparedBy: 'Amnex Stores Lead',
    preparedDate: '2025-03-08',
    citApprovedBy: 'NMDC C&IT In-Charge',
    citApprovalDate: '2025-03-09',
    cisfSignedBy: 'Inspector D. S. Rawat (CISF Badge #77234)',
    cisfSignatureDate: '2025-03-10',
    passObtainedDate: '2025-03-10',
    materialCategory: 'Returnable',
    materialReturnStatus: 'Pending Return',
    expectedReturnDate: '2025-03-25',
    challanInvoiceNumber: 'AMN/DC/2025/RGP-889',
    billNumber: 'AMN-GST-INV-2025-0891',
    rgpPurpose: 'Weighbridge Load Cell Calibration & Field Testing',
    billDocument: {
      fileName: 'Tax_Invoice_AMN_0891_Calibration_Kit.pdf',
      fileSize: '1.2 MB',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedAt: '2025-03-10 10:15 AM',
      uploadedBy: 'Amnex Commercial & Accounts Dept',
      fileType: 'application/pdf'
    },
    employees: [
      {
        id: 'mat-emp-1',
        name: 'Vikramaditya Rao',
        designation: 'Logistics Lead',
        idNumber: 'AMN-EMP-4421',
        contactNumber: '+91 97765 44332'
      },
      {
        id: 'mat-emp-2',
        name: 'Harish Dewangan',
        designation: 'Calibration Technician',
        idNumber: 'AADHAAR 9988-1122-3344',
        contactNumber: '+91 98877 66554'
      }
    ],
    materialItems: [
      {
        id: 'item-1',
        itemName: 'Fluke 754 Documenting Process Calibrator',
        specification: 'Precision testing instrument with rugged case',
        quantity: 1,
        unit: 'Set',
        boqItemNumber: 'BOQ-ELEC-4.1',
        isBoq: true,
        billNumber: 'AMN-GST-INV-2025-0891',
        serialNumber: 'FLK-99214-X',
        challanNumber: 'RGP-889-ITM1',
        remarks: 'Brought for weighbridge load cell test (Returnable)'
      },
      {
        id: 'item-2',
        itemName: 'Standard M1 Class Cast Iron Test Weights (20kg)',
        specification: 'NABL Certified Reference Weights',
        quantity: 10,
        unit: 'Pieces',
        boqItemNumber: 'BOQ-ELEC-4.2',
        isBoq: true,
        billNumber: 'AMN-GST-INV-2025-0891',
        serialNumber: 'WT-20KG-01 to 10',
        challanNumber: 'RGP-889-ITM2',
        remarks: 'Must be returned after NMDC verification'
      },
      {
        id: 'item-3',
        itemName: 'Fiber Optic OTDR Testing Kit (Yokogawa AQ7280)',
        specification: 'Portable Optical Time Domain Reflectometer',
        quantity: 1,
        unit: 'Box',
        boqItemNumber: '',
        isBoq: false,
        billNumber: 'AMN-INT-ASSET-44',
        serialNumber: 'YKG-55421',
        challanNumber: 'RGP-889-ITM3',
        remarks: 'Amnex internal testing asset (Non-BOQ tool)'
      }
    ],
    approvedDocument: {
      fileName: 'NMDC_CISF_RGP_Signed_Pass_0340.pdf',
      fileSize: '2.1 MB',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedAt: '2025-03-10 11:45 AM',
      uploadedBy: 'NMDC C&IT / CISF PPT Gate',
      fileType: 'application/pdf'
    },
    approvalAuthority: 'NMDC C&IT & CISF Inspector (Stores)',
    approvedDate: '2025-03-10',
    cisfVerified: true,
    cisfVerifierName: 'Inspector D. S. Rawat (CISF Badge #77234)',
    followUpNotes: 'Returnable Gate Pass (RGP) issued at PPT Gate. Return deadline 25-Mar-2025.',
    lastGateActivity: 'Material Inward inspection passed at PPT Gate',
    createdAt: '2025-03-08',
    updatedAt: '2025-03-10'
  },
  {
    id: 'pass-004',
    passNumber: 'AMN-NMDC-MAT-2025-0348',
    passType: 'Materials',
    passHolderName: 'Praveen Sharma (Amnex Hardware Supply)',
    passHolderDesignation: 'Hardware Dispatch Executive',
    passHolderContact: '+91 98989 00112',
    passHolderIdProof: 'AMN-EMP-6632',
    departmentOrProject: 'C&IT',
    validFrom: '2025-03-12',
    validTo: '2025-03-22',
    validityStatus: 'Active',
    status: 'Pending Approval',
    gateNumber: 'KIOM',
    procedureStage: 'Submitted to C&IT',
    preparedBy: 'Amnex Logistics Desk',
    preparedDate: '2025-03-12',
    citRemarks: 'Submitted for C&IT department approval on 12-Mar-2025.',
    materialCategory: 'Non-Returnable',
    materialReturnStatus: 'Returned',
    challanInvoiceNumber: 'AMN/INV/2025/1104',
    billNumber: 'AMN-GST-INV-2025-1104',
    nrgpStoreReceiptNo: 'NMDC-KIR-GRN-2025-0812',
    billDocument: {
      fileName: 'GST_Tax_Invoice_1104_CCTV_RFID.pdf',
      fileSize: '2.4 MB',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedAt: '2025-03-12 08:15 AM',
      uploadedBy: 'Amnex Billing & Commercial Unit',
      fileType: 'application/pdf'
    },
    employees: [
      {
        id: 'mat-emp-3',
        name: 'Praveen Sharma',
        designation: 'Hardware Dispatch Executive',
        idNumber: 'AMN-EMP-6632',
        contactNumber: '+91 98989 00112'
      }
    ],
    materialItems: [
      {
        id: 'item-4',
        itemName: '4K Ultra HD ANPR Bullet Cameras with IR',
        specification: 'Hikvision Industrial IP67 Cameras',
        quantity: 8,
        unit: 'Numbers',
        boqItemNumber: 'BOQ-SEC-1.1',
        isBoq: true,
        billNumber: 'AMN-GST-INV-2025-1104',
        serialNumber: 'HK-ANPR-9901 to 9908',
        challanNumber: 'INV-1104-A',
        remarks: 'Permanent handover to NMDC Mine Dispatch Gate'
      },
      {
        id: 'item-5',
        itemName: 'Long Range UHF RFID Readers (865-868 MHz)',
        specification: 'Zebra Integrated Fixed Readers',
        quantity: 4,
        unit: 'Units',
        boqItemNumber: 'BOQ-SEC-1.4',
        isBoq: true,
        billNumber: 'AMN-GST-INV-2025-1104',
        serialNumber: 'ZB-RFID-441 to 444',
        challanNumber: 'INV-1104-B',
        remarks: 'Project installation supply'
      },
      {
        id: 'item-6',
        itemName: 'Cat6 Outdoor Shielded Cable Drums (305m)',
        specification: 'D-Link Heavy Duty Armoured',
        quantity: 6,
        unit: 'Rolls',
        boqItemNumber: '',
        isBoq: false,
        billNumber: 'AMN-GST-INV-2025-1104',
        serialNumber: 'DL-C6-DRUM-01..06',
        challanNumber: 'INV-1104-C',
        remarks: 'Permanent cabling consumable (Non-BOQ supply)'
      }
    ],
    followUpNotes: 'NRGP Pass prepared and submitted for C&IT department approval for KIOM Gate entry.',
    cisfVerified: false,
    createdAt: '2025-03-12',
    updatedAt: '2025-03-12'
  },
  {
    id: 'pass-005',
    passNumber: 'AMN-NMDC-VEH-2025-0077',
    passType: 'Vehicle',
    passHolderName: 'Someshwar Sahu (Driver)',
    passHolderDesignation: 'Authorized Commercial Driver',
    passHolderContact: '+91 97551 22334',
    passHolderIdProof: 'DL: CG-17-2021-0045129',
    departmentOrProject: 'C&IT',
    validFrom: '2025-01-15',
    validTo: '2025-07-15',
    validityStatus: 'Active',
    status: 'Approved',
    gateNumber: 'Admin Building',
    procedureStage: 'Pass Obtained',
    preparedBy: 'Amnex Transport Officer',
    preparedDate: '2025-01-14',
    citApprovedBy: 'NMDC C&IT Lead',
    citApprovalDate: '2025-01-15',
    cisfSignedBy: 'Head Constable S. C. Murmu (CISF Badge #55123)',
    cisfSignatureDate: '2025-01-15',
    passObtainedDate: '2025-01-15',
    vehicleNumber: 'CG-17-KC-4890',
    vehicleType: 'Mahindra Bolero Utility Pickup (Project Vehicle)',
    driverLicenseNumber: 'CG-17-2021-0045129',
    employees: [
      {
        id: 'veh-emp-1',
        name: 'Someshwar Sahu',
        designation: 'Driver',
        idNumber: 'DL: CG-17-2021-0045129 / AADHAAR 3321-4455-6677',
        contactNumber: '+91 97551 22334'
      },
      {
        id: 'veh-emp-2',
        name: 'Bhaskar Nayak',
        designation: 'Field Instrumentation Tech',
        idNumber: 'AMN-EMP-7712',
        contactNumber: '+91 94060 11998'
      }
    ],
    approvedDocument: {
      fileName: 'Vehicle_Pass_CG17KC4890_NMDC_CISF.pdf',
      fileSize: '1.1 MB',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedAt: '2025-01-15 02:20 PM',
      uploadedBy: 'CISF Admin Building Gate Unit',
      fileType: 'application/pdf'
    },
    approvalAuthority: 'NMDC C&IT & CISF Security Unit',
    approvedDate: '2025-01-15',
    cisfVerified: true,
    cisfVerifierName: 'Head Constable S. C. Murmu (CISF Badge #55123)',
    followUpNotes: 'Valid PUC, Insurance, and mine fitness on file. Authorized for Admin Building Gate.',
    createdAt: '2025-01-14',
    updatedAt: '2025-01-15'
  },
  {
    id: 'pass-006',
    passNumber: 'AMN-NMDC-CON-2025-0188',
    passType: 'Contractor',
    passHolderName: 'Gurpreet Singh (Apex Rigging Services)',
    passHolderDesignation: 'Tower Rigging Supervisor',
    passHolderContact: '+91 98112 77665',
    passHolderIdProof: 'AADHAAR 7712-4409-8812',
    departmentOrProject: 'C&IT',
    validFrom: '2025-03-15',
    validTo: '2025-04-15',
    validityStatus: 'Active',
    status: 'Pending Approval',
    gateNumber: 'DIOM',
    procedureStage: 'Pass Prepared',
    preparedBy: 'Amnex Field Supervisor',
    preparedDate: '2025-03-15',
    employees: [
      {
        id: 'con-rig-1',
        name: 'Gurpreet Singh',
        designation: 'Supervisor',
        idNumber: 'AADHAAR 7712-4409-8812',
        contactNumber: '+91 98112 77665'
      },
      {
        id: 'con-rig-2',
        name: 'Balwinder Singh',
        designation: 'High Altitude Rigger',
        idNumber: 'AADHAAR 9921-3345-0012',
        contactNumber: '+91 98112 77666'
      },
      {
        id: 'con-rig-3',
        name: 'Mohd. Imran',
        designation: 'Safety Harness Specialist',
        idNumber: 'AADHAAR 5543-2211-9988',
        contactNumber: '+91 98112 77667'
      }
    ],
    followUpNotes: 'Pass prepared by Amnex. Ready to submit for C&IT Department approval for DIOM gate.',
    cisfVerified: false,
    createdAt: '2025-03-15',
    updatedAt: '2025-03-15'
  },
  {
    id: 'pass-007',
    passNumber: 'AMN-NMDC-MAT-2025-0402',
    passType: 'Materials',
    passHolderName: 'Anand Swamy (Amnex Instrumentation)',
    passHolderDesignation: 'Senior Telemetry Engineer',
    passHolderContact: '+91 94251 66778',
    passHolderIdProof: 'AMN-EMP-5519',
    departmentOrProject: 'C&IT',
    validFrom: '2025-03-14',
    validTo: '2025-03-28',
    validityStatus: 'Active',
    status: 'Approved',
    gateNumber: 'PPT',
    procedureStage: 'Submitted to CISF',
    preparedBy: 'Amnex SCADA Engineer',
    preparedDate: '2025-03-13',
    citApprovedBy: 'NMDC DGM (C&IT)',
    citApprovalDate: '2025-03-14',
    citRemarks: 'Approved for Conveyor SCADA testing.',
    materialCategory: 'Returnable',
    materialReturnStatus: 'Pending Return',
    expectedReturnDate: '2025-03-28',
    challanInvoiceNumber: 'AMN/DC/2025/RGP-914',
    billNumber: 'AMN-INV-SCADA-309',
    rgpPurpose: 'PLC Controller Programming, Loop Testing & Return',
    billDocument: {
      fileName: 'Tax_Invoice_AMN_309_Siemens_PLC.pdf',
      fileSize: '1.6 MB',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      uploadedAt: '2025-03-14 09:40 AM',
      uploadedBy: 'Amnex Commercial Division',
      fileType: 'application/pdf'
    },
    employees: [
      {
        id: 'mat-emp-7',
        name: 'Anand Swamy',
        designation: 'Senior Telemetry Engineer',
        idNumber: 'AMN-EMP-5519',
        contactNumber: '+91 94251 66778'
      },
      {
        id: 'mat-emp-8',
        name: 'Gopal Krishna',
        designation: 'Instrumentation Tech',
        idNumber: 'AADHAAR 8821-4433-2211',
        contactNumber: '+91 94251 66779'
      }
    ],
    materialItems: [
      {
        id: 'item-7',
        itemName: 'Siemens S7-1500 Modular PLC CPU 1516-3 PN/DP',
        specification: 'Programmable Logic Controller for Conveyor SCADA',
        quantity: 1,
        unit: 'Unit',
        boqItemNumber: 'BOQ-AUTO-2.3',
        isBoq: true,
        billNumber: 'AMN-INV-SCADA-309',
        serialNumber: 'SN-SIE-1516-9923',
        challanNumber: 'RGP-914-A',
        remarks: 'Testing kit with memory card (Returnable Gate Pass)'
      },
      {
        id: 'item-8',
        itemName: 'HART Protocol Field Communicator (Emerson 475)',
        specification: 'Intrinsically Safe Handheld Communicator',
        quantity: 1,
        unit: 'Piece',
        boqItemNumber: 'BOQ-AUTO-2.7',
        isBoq: true,
        billNumber: 'AMN-INV-SCADA-309',
        serialNumber: 'EMR-475-6819',
        challanNumber: 'RGP-914-B',
        remarks: 'Field configuration device'
      },
      {
        id: 'item-9',
        itemName: 'Industrial Heavy Duty Multimeter & Clamp Meter',
        specification: 'True RMS CAT IV 600V Tester',
        quantity: 2,
        unit: 'Sets',
        boqItemNumber: '',
        isBoq: false,
        billNumber: 'AMN-TOOL-INV-88',
        serialNumber: 'FLUKE-87V-A1, B2',
        challanNumber: 'RGP-914-C',
        remarks: 'Engineers standard toolbox (Non-BOQ testing tools)'
      }
    ],
    followUpNotes: 'RGP approved by C&IT; currently submitted to CISF PPT Gate for signature.',
    cisfVerified: false,
    createdAt: '2025-03-13',
    updatedAt: '2025-03-14'
  },
  {
    id: 'pass-008',
    passNumber: 'AMN-NMDC-CON-2025-0255',
    passType: 'Contractor',
    passHolderName: 'Sunil Verma (PowerTech Cabling)',
    passHolderDesignation: 'Contractor In-Charge',
    passHolderContact: '+91 98270 55441',
    passHolderIdProof: 'AADHAAR 3344-9988-1122',
    departmentOrProject: 'C&IT',
    validFrom: '2025-03-18',
    validTo: '2025-04-18',
    validityStatus: 'Active',
    status: 'Pending Approval',
    gateNumber: 'KIOM',
    procedureStage: 'Submitted to C&IT',
    preparedBy: 'Amnex Project Admin',
    preparedDate: '2025-03-18',
    employees: [
      {
        id: 'con-8-1',
        name: 'Sunil Verma',
        designation: 'Supervisor',
        idNumber: 'AADHAAR 3344-9988-1122',
        contactNumber: '+91 98270 55441'
      },
      {
        id: 'con-8-2',
        name: 'Kamlesh Sahu',
        designation: 'Cable Jointer',
        idNumber: 'AADHAAR 7788-1122-3344',
        contactNumber: '+91 98270 55442'
      }
    ],
    followUpNotes: 'Contractor team pass prepared and submitted for C&IT Department review at KIOM gate.',
    cisfVerified: false,
    createdAt: '2025-03-18',
    updatedAt: '2025-03-18'
  }
];
