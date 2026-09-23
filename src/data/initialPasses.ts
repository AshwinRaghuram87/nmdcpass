import { EntryPass } from '../types';

export const INITIAL_PASSES: EntryPass[] = [
  {
    id: 'pass-nmdc-cit-15',
    passNumber: 'NMDC/C&IT/15',
    passType: 'Contractor',
    passHolderName: 'B Shivamurthy',
    passHolderDesignation: 'Senior Site Technician',
    passHolderContact: '+91 98450 12345',
    passHolderIdProof: '447193919163',
    departmentOrProject: 'C&IT DEPARTMENT',
    validFrom: '2026-09-18',
    validTo: '2026-10-17',
    validityStatus: 'Active',
    status: 'Approved',
    gateNumber: 'Admin Building, DIOM, KIOM, PPT',
    procedureStage: 'Pass Obtained',
    preparedBy: 'Amnex Site Coordinator',
    preparedDate: '2026-09-17',
    citApprovedBy: 'Mr Mayur Kant Tripathi, Dy.G.M (Electrical)/C&IT)',
    citApprovalDate: '2026-09-18',
    citApprovedDate: '2026-09-18',
    cisfSignedBy: 'Mr Sreekanth Babu B, Dy.G.M (C&IT) H.O.D',
    cisfSignatureDate: '2026-09-18',
    passObtainedDate: '2026-09-18',
    contractorFirm: 'Amnex Infotechnologies Pvt.Ltd',
    nameOfWork: 'UMLMSS Project Work Implementations.',
    workOrderNo: `Letters of Awards of Contract(LAC) Vide
HO(contract)/NMDC/UMLMSS/2025/275/395
HO(contract)/NMDC/UMLMSS/2025/275/396
HO(contract)/NMDC/UMLMSS/2025/275/397`,
    recommendedBy: 'Mr.A.V.L.Ramakrishna, Dy.G.M (C&IT), Engineer-in-Charge',
    recommendedDate: '2026-09-18',
    cisfVerified: true,
    cisfVerifierName: 'CISF Inspector Donimalai Check Post',
    employees: [
      {
        id: 'emp-1',
        name: 'B Shivamurthy',
        designation: 'Senior Technician',
        idNumber: '447193919163',
        contactNumber: '+91 98450 12345',
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
      },
      {
        id: 'emp-2',
        name: 'Basha',
        designation: 'Technician',
        idNumber: '730048476698',
        contactNumber: '+91 98450 23456',
        fatherName: 'Khasim Sab',
        sex: 'M',
        age: '40',
        dob: '12.08.1986',
        address: 'Taranagar, Bellary 583119'
      },
      {
        id: 'emp-3',
        name: 'Basavaraja Maretle',
        designation: 'Supervisor',
        idNumber: '273684246103',
        contactNumber: '+91 98450 34567',
        fatherName: 'Mallappa',
        sex: 'M',
        age: '48',
        dob: '05.03.1978',
        address: 'Sandur, Bellary 583119'
      },
      {
        id: 'emp-4',
        name: 'Huligesha',
        designation: 'Skilled Labour',
        idNumber: '542903666765',
        contactNumber: '+91 98450 45678',
        fatherName: 'Parasappa',
        sex: 'M',
        age: '33',
        dob: '01.01.1993',
        address: '4th Ward, Chapparadahalli, Taranagar, Bellary 583119'
      }
    ],
    createdAt: '2026-09-18T09:00:00.000Z',
    updatedAt: '2026-09-18T10:30:00.000Z'
  }
];

