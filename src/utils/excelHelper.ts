import * as XLSX from 'xlsx';
import { EntryPass, PassType, MaterialReturnType, PassEmployee, MaterialItem } from '../types';

export interface ParsedRowResult {
  rowNumber: number;
  pass: Partial<EntryPass>;
  isValid: boolean;
  errors: string[];
}

export function parseExcelOrCsv(file: File): Promise<ParsedRowResult[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        
        // Read first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON array of objects
        const rawRows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { defval: '' });

        const results: ParsedRowResult[] = rawRows.map((row, index) => {
          const errors: string[] = [];
          const rowNumber = index + 2; // +1 for 1-based, +1 for header

          // Flexible header mapping (handles slight variations in column names)
          const getVal = (possibleKeys: string[]): string => {
            for (const key of possibleKeys) {
              const matchedKey = Object.keys(row).find(
                (k) => k.trim().toLowerCase() === key.toLowerCase()
              );
              if (matchedKey && row[matchedKey] !== undefined && row[matchedKey] !== null) {
                return String(row[matchedKey]).trim();
              }
            }
            return '';
          };

          const passNumber = getVal(['Pass Number', 'PassNumber', 'Pass No', 'Pass_No', 'Pass #']);
          const rawPassType = getVal(['Pass Type', 'PassType', 'Type', 'Category']);
          const passHolderName = getVal(['Pass Holder Name', 'Holder Name', 'Pass Holder', 'Authorized Person', 'Name']);
          const employeesRaw = getVal(['List of Employees', 'Employees', 'Staff List', 'Team Members', 'Workers']);
          const validFromRaw = getVal(['Valid From', 'Validity From', 'From Date', 'Start Date']);
          const validToRaw = getVal(['Valid To', 'Validity To', 'To Date', 'Expiry Date', 'Validity']);
          const department = getVal(['Department / Project', 'Department', 'Project', 'Work Order']) || 'C&IT';
          const rawGate = getVal(['Gate Number', 'Gate', 'Entry Gate', 'Designated Gate']);
          let gateNumber = 'DIOM';
          if (rawGate) {
            const lowGate = rawGate.toLowerCase();
            if (lowGate.includes('diom')) gateNumber = 'DIOM';
            else if (lowGate.includes('kiom')) gateNumber = 'KIOM';
            else if (lowGate.includes('admin')) gateNumber = 'Admin Building';
            else if (lowGate.includes('ppt')) gateNumber = 'PPT';
          }
          const rawStage = getVal(['Procedure Stage', 'Workflow Stage', 'Approval Stage', 'Stage']);
          let procedureStage: any = 'Pass Prepared';
          if (rawStage) {
            const lowStage = rawStage.toLowerCase();
            if (lowStage.includes('obtain')) procedureStage = 'Pass Obtained';
            else if (lowStage.includes('cisf')) procedureStage = 'Submitted to CISF';
            else if (lowStage.includes('c&it') || lowStage.includes('cit') || lowStage.includes('approval')) procedureStage = 'Submitted to C&IT';
          }
          const materialCategoryRaw = getVal(['Material Type', 'Material Category', 'Returnable / Non-Returnable', 'RGP/NRGP', 'RGP / NRGP']);
          const vehicleNumber = getVal(['Vehicle Number', 'Vehicle No', 'Reg No']);
          const expectedReturnRaw = getVal(['Expected Return Date', 'Return Date', 'Return Deadline']);
          const itemsRaw = getVal(['Material Items', 'Items List', 'Equipment', 'Materials']);
          const billNumberRaw = getVal(['Bill Number', 'Invoice Number', 'Bill No', 'Invoice No', 'Challan Number']);
          const boqRaw = getVal(['BOQ Item Number', 'BOQ Number', 'BOQ No', 'BOQ Ref']);
          const boqTypeRaw = getVal(['BOQ or Non-BOQ', 'BOQ / Non-BOQ', 'BOQ Type', 'Is BOQ']);
          const notes = getVal(['Follow-up Notes', 'Notes', 'Remarks']);

          // Validate Pass Type
          let passType: PassType = 'Employee';
          const normalizedType = rawPassType.toLowerCase();
          if (normalizedType.includes('contractor') || normalizedType.includes('labour')) {
            passType = 'Contractor';
          } else if (normalizedType.includes('vehicle') || normalizedType.includes('truck') || normalizedType.includes('car')) {
            passType = 'Vehicle';
          } else if (normalizedType.includes('material') || normalizedType.includes('asset') || normalizedType.includes('equipment')) {
            passType = 'Materials';
          } else if (normalizedType.includes('employee') || normalizedType.includes('staff')) {
            passType = 'Employee';
          } else if (rawPassType) {
            errors.push(`Unrecognized pass type: "${rawPassType}". Valid: Employee, Contractor, Vehicle, Materials.`);
          }

          if (!passHolderName) {
            errors.push('Pass holder name is required.');
          }

          // Format Dates
          const formatDate = (val: string): string => {
            if (!val) return '';
            // If already YYYY-MM-DD
            if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
            const parsed = new Date(val);
            if (!isNaN(parsed.getTime())) {
              return parsed.toISOString().split('T')[0];
            }
            return val;
          };

          const validFrom = formatDate(validFromRaw) || new Date().toISOString().split('T')[0];
          const validTo = formatDate(validToRaw);
          if (!validTo) {
            errors.push('Validity expiry date ("Valid To") is required.');
          }

          // Parse Employees
          const employees: PassEmployee[] = [];
          if (employeesRaw) {
            // Split by comma or semicolon or newline
            const names = employeesRaw.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
            names.forEach((empText, i) => {
              // Can be "Name (Designation)" or just "Name"
              const match = empText.match(/^([^(]+)(?:\(([^)]+)\))?$/);
              const name = match ? match[1].trim() : empText;
              const designation = match && match[2] ? match[2].trim() : 'Project Personnel';
              employees.push({
                id: `imp-emp-${Date.now()}-${i}`,
                name,
                designation,
                idNumber: 'To be verified at CISF Gate',
                contactNumber: ''
              });
            });
          } else if (passHolderName) {
            // Default to pass holder if no employee list provided
            employees.push({
              id: `imp-emp-${Date.now()}-0`,
              name: passHolderName,
              designation: passType === 'Vehicle' ? 'Driver / Operator' : 'Authorized Personnel',
              idNumber: 'To be verified at CISF Gate',
              contactNumber: ''
            });
          }

          // Material Category
          let materialCategory: MaterialReturnType | undefined = undefined;
          if (passType === 'Materials') {
            const matNorm = materialCategoryRaw.toLowerCase();
            if (matNorm.includes('non') || matNorm.includes('nrgp') || matNorm.includes('permanent')) {
              materialCategory = 'Non-Returnable';
            } else {
              // Default for materials is Returnable unless specified Non-Returnable
              materialCategory = 'Returnable';
            }
          }

          // Material items
          const materialItems: MaterialItem[] = [];
          const isBoqDefault = boqTypeRaw ? !boqTypeRaw.toLowerCase().includes('non') : !!boqRaw;
          if (itemsRaw) {
            const itemTokens = itemsRaw.split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
            itemTokens.forEach((tok, i) => {
              // e.g. "Laptop (2 Nos)" or "Calibrator"
              materialItems.push({
                id: `imp-item-${Date.now()}-${i}`,
                itemName: tok,
                quantity: 1,
                unit: 'Nos',
                boqItemNumber: boqRaw ? `${boqRaw}` : undefined,
                isBoq: isBoqDefault,
                billNumber: billNumberRaw || undefined,
                remarks: 'Uploaded from Excel'
              });
            });
          }

          // Determine validity status
          const today = new Date().toISOString().split('T')[0];
          let validityStatus: 'Active' | 'Expiring Soon' | 'Expired' = 'Active';
          if (validTo) {
            const diffDays = Math.ceil((new Date(validTo).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays < 0) {
              validityStatus = 'Expired';
            } else if (diffDays <= 5) {
              validityStatus = 'Expiring Soon';
            }
          }

          const autoPassNumber = passNumber || `AMN-NMDC-${passType.substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;

          const pass: Partial<EntryPass> = {
            id: `pass-${Date.now()}-${index}`,
            passNumber: autoPassNumber,
            passType,
            passHolderName,
            departmentOrProject: department,
            validFrom,
            validTo,
            validityStatus,
            status: validityStatus === 'Expired' ? 'Expired' : 'Approved',
            gateNumber,
            procedureStage,
            employees,
            vehicleNumber: vehicleNumber || undefined,
            materialCategory,
            materialItems: materialItems.length > 0 ? materialItems : undefined,
            expectedReturnDate: expectedReturnRaw ? formatDate(expectedReturnRaw) : undefined,
            materialReturnStatus: materialCategory === 'Returnable' ? 'Pending Return' : 'Returned',
            billNumber: billNumberRaw || undefined,
            cisfVerified: true,
            cisfVerifierName: 'CISF Gate Duty Officer',
            followUpNotes: notes || 'Imported via Excel bulk upload',
            lastGateActivity: 'Pass record imported from Excel sheet',
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
          };

          return {
            rowNumber,
            pass,
            isValid: errors.length === 0,
            errors
          };
        });

        resolve(results);
      } catch (err: any) {
        reject(new Error(err.message || 'Failed to parse Excel file'));
      }
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Downloads a pre-formatted Excel template for Amnex Infotechnologies @ NMDC Ltd
 */
export function downloadSampleTemplate(): void {
  const headers = [
    'Pass Number',
    'Pass Type',
    'Pass Holder Name',
    'List of Employees',
    'Valid From',
    'Valid To',
    'Department / Project',
    'Designated Gate (DIOM/KIOM/Admin Building/PPT)',
    'Procedure Stage',
    'Material Category (Returnable/Non-Returnable)',
    'Expected Return Date',
    'Material Items',
    'BOQ Item Number',
    'BOQ or Non-BOQ',
    'Bill Number',
    'Vehicle Number',
    'Follow-up Notes'
  ];

  const sampleRows = [
    [
      'AMN-NMDC-EMP-2025-0105',
      'Employee',
      'Anandita Deshmukh',
      'Anandita Deshmukh (Lead), Rakesh Nair (Sr. Engg), Deepa Sahu (Tech)',
      '2025-03-01',
      '2025-12-31',
      'C&IT',
      'Admin Building',
      'Pass Obtained',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Amnex Core Team deployment'
    ],
    [
      'AMN-NMDC-CON-2025-0230',
      'Contractor',
      'Kailash Patel (Patel Electricals)',
      'Kailash Patel (Supervisor), Amit Yadav, Mohan Lal, Suraj Kumar',
      '2025-03-15',
      '2025-04-15',
      'C&IT',
      'DIOM',
      'Submitted to CISF',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'Safety gear cleared; awaiting CISF signature'
    ],
    [
      'AMN-NMDC-MAT-2025-0412',
      'Materials',
      'Sunil Joshi (Amnex Store)',
      'Sunil Joshi, Vijay Kumar',
      '2025-03-18',
      '2025-03-28',
      'C&IT',
      'PPT',
      'Pass Obtained',
      'Returnable',
      '2025-03-28',
      'Reference Calibration Weights (10 Pcs), Multimeter (2 Nos)',
      'BOQ-ELEC-4.1',
      'BOQ Item',
      'AMN-GST-INV-2025-0891',
      '',
      'Returnable gate pass (RGP). Items must be returned after testing.'
    ],
    [
      'AMN-NMDC-MAT-2025-0415',
      'Materials',
      'Tanmay Ghosh (Amnex Supply)',
      'Tanmay Ghosh',
      '2025-03-18',
      '2025-03-20',
      'C&IT',
      'KIOM',
      'Submitted to C&IT',
      'Non-Returnable',
      '',
      'CCTV Dome Cameras (6 Nos), Power Adapters (12 Nos)',
      'BOQ-SEC-1.1',
      'BOQ Item',
      'AMN-GST-INV-2025-1104',
      '',
      'Non-Returnable delivery (NRGP) submitted for C&IT department approval.'
    ],
    [
      'AMN-NMDC-VEH-2025-0089',
      'Vehicle',
      'Ramanuj Verma (Driver)',
      'Ramanuj Verma (Driver), Alok Mishra (Site Tech)',
      '2025-03-01',
      '2025-09-01',
      'C&IT',
      'DIOM',
      'Pass Obtained',
      '',
      '',
      '',
      '',
      '',
      '',
      'CG-17-MA-9102',
      'Spark arrestor and mine fitness valid'
    ]
  ];

  const worksheetData = [headers, ...sampleRows];
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

  // Set column widths for readability
  worksheet['!cols'] = [
    { wch: 26 }, // Pass Number
    { wch: 14 }, // Pass Type
    { wch: 28 }, // Pass Holder Name
    { wch: 45 }, // List of Employees
    { wch: 13 }, // Valid From
    { wch: 13 }, // Valid To
    { wch: 15 }, // Dept / Project (C&IT)
    { wch: 22 }, // Designated Gate
    { wch: 20 }, // Procedure Stage
    { wch: 32 }, // Material Category (RGP/NRGP)
    { wch: 18 }, // Expected Return Date
    { wch: 40 }, // Material Items
    { wch: 18 }, // BOQ Item Number
    { wch: 16 }, // BOQ or Non-BOQ
    { wch: 22 }, // Bill Number
    { wch: 16 }, // Vehicle Number
    { wch: 35 }  // Follow-up Notes
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Entry_Passes_Template');

  XLSX.writeFile(workbook, 'Amnex_NMDC_Entry_Pass_Upload_Template.xlsx');
}

/**
 * Exports current list of Entry Passes to an Excel spreadsheet
 */
export function exportPassesToExcel(passes: EntryPass[]): void {
  const data = passes.map((pass) => ({
    'Pass Number': pass.passNumber,
    'Pass Type': pass.passType,
    'Pass Holder Name': pass.passHolderName,
    'Designation': pass.passHolderDesignation || '',
    'Contact': pass.passHolderContact || '',
    'List of Employees': pass.employees.map(e => `${e.name} (${e.designation})`).join(', '),
    'Total Employees': pass.employees.length,
    'Valid From': pass.validFrom,
    'Valid To': pass.validTo,
    'Validity Status': pass.validityStatus,
    'Department': pass.departmentOrProject,
    'Designated Gate': pass.gateNumber,
    'Procedure Stage': pass.procedureStage,
    'Gate Status': pass.status,
    'Material Category': pass.materialCategory ? (pass.materialCategory === 'Returnable' ? 'RGP (Returnable)' : 'NRGP (Non-Returnable)') : 'N/A',
    'Material Return Status': pass.materialReturnStatus || 'N/A',
    'Expected Return Date': pass.expectedReturnDate || 'N/A',
    'Bill / Invoice Number': pass.billNumber || pass.challanInvoiceNumber || 'N/A',
    'Has Uploaded Bill': pass.billDocument ? 'Yes' : 'No',
    'Bill File Name': pass.billDocument?.fileName || 'None',
    'Material Items': pass.materialItems 
      ? pass.materialItems.map(m => `${m.itemName} [${m.isBoq ? `BOQ: ${m.boqItemNumber || 'Yes'}` : 'Non-BOQ'}] (${m.quantity} ${m.unit})`).join('; ') 
      : 'N/A',
    'Vehicle Number': pass.vehicleNumber || 'N/A',
    'Has Approved Pass Document': pass.approvedDocument ? 'Yes' : 'No',
    'Approved Pass File Name': pass.approvedDocument?.fileName || 'None',
    'CISF Verified': pass.cisfVerified ? 'Yes' : 'No',
    'CISF Verifier': pass.cisfVerifierName || '',
    'Follow-up Notes': pass.followUpNotes || '',
    'Last Gate Activity': pass.lastGateActivity || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Amnex_NMDC_Passes');

  const dateStr = new Date().toISOString().split('T')[0];
  XLSX.writeFile(workbook, `Amnex_NMDC_Entry_Passes_Report_${dateStr}.xlsx`);
}
