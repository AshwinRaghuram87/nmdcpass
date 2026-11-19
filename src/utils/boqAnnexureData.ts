import { MaterialItem } from '../types';
import { findMasterBoqItem } from './boqUtils';

export const BOQ_ANNEXURE_PDF_URL = '/assets/aistudio/NMDC_UMLMSS_Unpriced_BoQ_1bbf358d.pdf';

export type BoqAnnexureSectionId = 'A' | 'B' | 'C' | 'D' | 'E';

export interface BoqAnnexureItem {
  id: string;
  section: BoqAnnexureSectionId;
  sectionTitle: string;
  slNo: number;
  code: string; // e.g., "A.1", "B.14", "D.3"
  description: string;
  category: string;
  uom: string;
  kiom: number;
  diom: number;
  pelletPlant: number;
  totalQty: number;
  oemName: string;
  modelName: string;
  masterItemNumbers?: number[]; // Optional link to MASTER_BOQ_ITEMS itemNumber
}

export const BOQ_ANNEXURE_SECTIONS: { id: BoqAnnexureSectionId; title: string }[] = [
  { id: 'A', title: 'A. Weighbridge' },
  { id: 'B', title: 'B. Entry / Exit Gate' },
  { id: 'C', title: 'C. Other Devices' },
  { id: 'D', title: 'D. Data Centre Hardware' },
  { id: 'E', title: 'E. Setup of Command and Control Room (KIOM, DIOM & Pellet Plant)' },
];

export const BOQ_ANNEXURE_ITEMS: BoqAnnexureItem[] = [
  // =========================================================================
  // A. Weighbridge
  // =========================================================================
  {
    id: 'anx-a-1', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 1, code: 'A.1',
    description: 'UHF RFID Reader', category: 'UHF RFID Reader', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Zebra', modelName: 'FX9600 4 Port Reader', masterItemNumbers: [1]
  },
  {
    id: 'anx-a-2', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 2, code: 'A.2',
    description: 'UHF RFID Tag', category: 'UHF RFID Tag', uom: 'Nos.',
    kiom: 400, diom: 500, pelletPlant: 100, totalQty: 1000,
    oemName: 'ID Tech', modelName: 'IDT WT01', masterItemNumbers: [2]
  },
  {
    id: 'anx-a-3', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 3, code: 'A.3',
    description: 'IP CCTV- Bullet Camera with IR Illuminator', category: 'CCTV Cameras', uom: 'Nos.',
    kiom: 50, diom: 20, pelletPlant: 4, totalQty: 74,
    oemName: 'Honeywell', modelName: 'HC50WB3R2', masterItemNumbers: [5]
  },
  {
    id: 'anx-a-4', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 4, code: 'A.4',
    description: 'IP CCTV- Bullet Camera with IR Illuminator with Material Verification Analytics', category: 'CCTV Cameras', uom: 'Nos.',
    kiom: 10, diom: 8, pelletPlant: 2, totalQty: 20,
    oemName: 'Honeywell', modelName: 'HC50WB3R2', masterItemNumbers: [6]
  },
  {
    id: 'anx-a-5', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 5, code: 'A.5',
    description: 'IP CCTV- Dome Camera with IR Illuminator for Weighbridge Counter', category: 'CCTV Cameras', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Honeywell', modelName: 'HC50W43R2', masterItemNumbers: [7]
  },
  {
    id: 'anx-a-6', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 6, code: 'A.6',
    description: 'IP CCTV- PTZ Camera with IR Illuminator', category: 'CCTV Cameras', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Honeywell', modelName: 'HC35WZ5R30+ Wall mount', masterItemNumbers: [8]
  },
  {
    id: 'anx-a-7', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 7, code: 'A.7',
    description: 'Vehicle Position Sensor (IR Based)', category: 'Vehicle Position Sensors', uom: 'Nos.',
    kiom: 300, diom: 120, pelletPlant: 24, totalQty: 444,
    oemName: 'Banner', modelName: 'QS18E (61618) + QS18VP6R (61624)', masterItemNumbers: [9]
  },
  {
    id: 'anx-a-8', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 8, code: 'A.8',
    description: 'Pole for Sensors (6m height)', category: 'Poles', uom: 'Nos.',
    kiom: 150, diom: 60, pelletPlant: 12, totalQty: 222,
    oemName: 'Standard', modelName: 'Standard', masterItemNumbers: [10]
  },
  {
    id: 'anx-a-9', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 9, code: 'A.9',
    description: 'Handheld RFID Reader', category: 'Handheld RFID Reader', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Zebra', modelName: 'MC333U-GJ4EG4IN-1SKT', masterItemNumbers: [11]
  },
  {
    id: 'anx-a-10', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 10, code: 'A.10',
    description: 'Boom Barrier with safety sensors', category: 'Boom Barrier', uom: 'Nos.',
    kiom: 50, diom: 20, pelletPlant: 4, totalQty: 74,
    oemName: 'Magtech', modelName: 'MTBB06', masterItemNumbers: [12]
  },
  {
    id: 'anx-a-11', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 11, code: 'A.11',
    description: 'IoT Controller', category: 'IOT Controller', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'ID Tech', modelName: 'IDT IOT Controller', masterItemNumbers: [13]
  },
  {
    id: 'anx-a-12', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 12, code: 'A.12',
    description: 'Switch L2 8 Port PoE plus switch - Rugged', category: 'Industrial/Rugged 8 Port Switch', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Comnus/Cisco', modelName: 'CX-NPA-8GS2I-L2/IE-3100-8P2C-E++', masterItemNumbers: [14]
  },
  {
    id: 'anx-a-13', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 13, code: 'A.13',
    description: 'Signal Light (Set of Red & Green)', category: 'Signal Light', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Amnex', modelName: 'SYNCNEX_L_001002', masterItemNumbers: [16]
  },
  {
    id: 'anx-a-14', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 14, code: 'A.14',
    description: 'Public Address System - IP based PA with speakers, etc. including Mounting structure with all required accessories (Weighbridge)', category: 'PA', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Heinrich', modelName: 'OHS30/T', masterItemNumbers: [17]
  },
  {
    id: 'anx-a-15', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 15, code: 'A.15',
    description: 'ECB system with mounting structure, pole etc.', category: 'ECB', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Heinrich', modelName: 'H104-SC-L-SIP', masterItemNumbers: [18]
  },
  {
    id: 'anx-a-16', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 16, code: 'A.16',
    description: 'LED Display Unit with controller (970mm x 970mm or higher) - Rugged', category: 'LED Display Unit-Rugged', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Vulcan', modelName: 'VMS (1000x1000mm) True Colour', masterItemNumbers: [19]
  },
  {
    id: 'anx-a-17', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 17, code: 'A.17',
    description: 'Desktop PC at each Weighbridge', category: 'Desktop PC', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Acer', modelName: 'S2710G', masterItemNumbers: [23]
  },
  {
    id: 'anx-a-18', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 18, code: 'A.18',
    description: 'Uninterrupted Power Supply (UPS) 2KVA - 2Hrs. backup', category: 'UPS', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'BPE', modelName: 'MF1102 + Exide/Quanta', masterItemNumbers: [26]
  },
  {
    id: 'anx-a-19', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 19, code: 'A.19',
    description: '9U Rack', category: 'Rack', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Standard', modelName: 'Standard', masterItemNumbers: [29]
  },
  {
    id: 'anx-a-20', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 20, code: 'A.20',
    description: 'Junction BOX - outdoor for all infra', category: 'Junction Box', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Standard', modelName: 'Standard', masterItemNumbers: [30]
  },
  {
    id: 'anx-a-21', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 21, code: 'A.21',
    description: 'Cantilever Pole (height: 7 m and arm: 5 m) for UHF RFID Reader, Bullet camera, Display Unit, PA System, Signal Light', category: 'Poles', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Standard', modelName: 'Standard', masterItemNumbers: [31]
  },
  {
    id: 'anx-a-22', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 22, code: 'A.22',
    description: 'Straight (6 m) Pole for IP CCTV - Bullet camera', category: 'Poles', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Standard', modelName: 'Standard', masterItemNumbers: [32]
  },
  {
    id: 'anx-a-23', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 23, code: 'A.23',
    description: 'Pole (height 10m) for IP CCTV-PTZ Camera (with ESE Lightning Arrestor and required accessories)', category: 'Poles', uom: 'Nos.',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Standard', modelName: 'Standard', masterItemNumbers: [33]
  },
  {
    id: 'anx-a-24', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 24, code: 'A.24',
    description: 'Straight (6m) arm 2 m Pole for IP CCTV - Bullet camera', category: 'Poles', uom: 'Nos.',
    kiom: 10, diom: 8, pelletPlant: 2, totalQty: 20,
    oemName: 'Standard', modelName: 'Standard', masterItemNumbers: [34]
  },
  {
    id: 'anx-a-25', section: 'A', sectionTitle: 'A. Weighbridge', slNo: 25, code: 'A.25',
    description: 'Site Preparation Work (Earthing, Foundation Work for Pole Erection, Surge Arrestor, Mounting Clumps, Electrical Wiring, PVC Pipes for wiring, RJ45 Jack, Patch Cord, IO Box, Electrical Board, Switch, Fiber Connectivity from nearest PoP, Fully Loaded Jack Panel, Face Plate, etc. for complete readiness of the site)',
    category: 'Site Preparation Work', uom: 'Lump Sum',
    kiom: 25, diom: 10, pelletPlant: 2, totalQty: 37,
    oemName: 'Standard', modelName: 'Standard'
  },

  // =========================================================================
  // B. Entry / Exit Gate
  // =========================================================================
  {
    id: 'anx-b-1', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 1, code: 'B.1',
    description: 'UHF RFID Reader', category: 'UHF RFID Reader', uom: 'Nos.',
    kiom: 7, diom: 2, pelletPlant: 4, totalQty: 13,
    oemName: 'Zebra', modelName: 'FX9600 4 Port Reader', masterItemNumbers: [1]
  },
  {
    id: 'anx-b-2', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 2, code: 'B.2',
    description: 'Handheld RFID Reader', category: 'Handheld RFID Reader', uom: 'Nos.',
    kiom: 7, diom: 1, pelletPlant: 2, totalQty: 10,
    oemName: 'Zebra', modelName: 'MC333U-GJ4EG4IN-1SKT', masterItemNumbers: [11]
  },
  {
    id: 'anx-b-3', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 3, code: 'B.3',
    description: 'ANPR Camera with IR Illuminator', category: 'CCTV Cameras', uom: 'Nos.',
    kiom: 3, diom: 1, pelletPlant: 2, totalQty: 6,
    oemName: 'Honeywell', modelName: 'HC50W43R2', masterItemNumbers: [3]
  },
  {
    id: 'anx-b-4', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 4, code: 'B.4',
    description: 'ANPR System (Per Camera License)', category: 'CCTV Cameras', uom: 'Nos.',
    kiom: 3, diom: 1, pelletPlant: 2, totalQty: 6,
    oemName: 'Metafusion', modelName: 'metaVISIO', masterItemNumbers: [4]
  },
  {
    id: 'anx-b-5', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 5, code: 'B.5',
    description: 'IP CCTV- Bullet Camera With IR Illuminator', category: 'CCTV Cameras', uom: 'Nos.',
    kiom: 7, diom: 2, pelletPlant: 4, totalQty: 13,
    oemName: 'Honeywell', modelName: 'HC50WB3R2', masterItemNumbers: [5]
  },
  {
    id: 'anx-b-6', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 6, code: 'B.6',
    description: 'IP CCTV - PTZ Camera with IR Illuminator', category: 'CCTV Cameras', uom: 'Nos.',
    kiom: 7, diom: 1, pelletPlant: 2, totalQty: 10,
    oemName: 'Honeywell', modelName: 'HC35WZ5R30+ Wall mount', masterItemNumbers: [8]
  },
  {
    id: 'anx-b-7', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 7, code: 'B.7',
    description: 'Dome Camera for Gates Counter', category: 'CCTV Cameras', uom: 'Nos.',
    kiom: 7, diom: 2, pelletPlant: 2, totalQty: 11,
    oemName: 'Honeywell', modelName: 'HC50W43R2', masterItemNumbers: [7]
  },
  {
    id: 'anx-b-8', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 8, code: 'B.8',
    description: 'Signal Light (Set of Red & Green)', category: 'Signal Light', uom: 'Nos.',
    kiom: 7, diom: 2, pelletPlant: 4, totalQty: 13,
    oemName: 'Amnex', modelName: 'SYNCNEX_L_001002', masterItemNumbers: [16]
  },
  {
    id: 'anx-b-9', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 9, code: 'B.9',
    description: 'Boom Barrier with safety sensors', category: 'Boom Barrier', uom: 'Nos.',
    kiom: 7, diom: 2, pelletPlant: 4, totalQty: 13,
    oemName: 'Magtech', modelName: 'MTBB06', masterItemNumbers: [12]
  },
  {
    id: 'anx-b-10', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 10, code: 'B.10',
    description: 'IoT Controller', category: 'IOT Controller', uom: 'Nos.',
    kiom: 7, diom: 2, pelletPlant: 4, totalQty: 13,
    oemName: 'ID Tech', modelName: 'IDT IOT Controller', masterItemNumbers: [13]
  },
  {
    id: 'anx-b-11', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 11, code: 'B.11',
    description: 'LED Display Unit with controller (970mm x 970mm or higher) - Rugged', category: 'LED Display Unit-Rugged', uom: 'Nos.',
    kiom: 7, diom: 2, pelletPlant: 4, totalQty: 13,
    oemName: 'Vulcan', modelName: 'VMS (1000x1000mm) True Colour', masterItemNumbers: [19]
  },
  {
    id: 'anx-b-12', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 12, code: 'B.12',
    description: 'LED Display Unit (6.72m x 2.88m) for Entry Scheduling Details at entry gate including content management software', category: 'VMD- Entry Gate', uom: 'Nos.',
    kiom: 3, diom: 0, pelletPlant: 0, totalQty: 3,
    oemName: 'Delta', modelName: 'Outdoor LED display (VMD) VDU-006MISDR', masterItemNumbers: [20]
  },
  {
    id: 'anx-b-13', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 13, code: 'B.13',
    description: 'LED Controller', category: 'VMD Controller', uom: 'Nos.',
    kiom: 3, diom: 0, pelletPlant: 0, totalQty: 3,
    oemName: 'Delta', modelName: 'LED Display System DC-2', masterItemNumbers: [21]
  },
  {
    id: 'anx-b-14', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 14, code: 'B.14',
    description: '43" LED Display at Exit gate', category: 'LED Display- Indoor', uom: 'Nos.',
    kiom: 15, diom: 2, pelletPlant: 0, totalQty: 17,
    oemName: 'Samsung', modelName: 'QM55C', masterItemNumbers: [22]
  },
  {
    id: 'anx-b-15', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 15, code: 'B.15',
    description: 'Public Address System - IP based PA with speakers, etc. including Mounting structure with all required accessories', category: 'PA', uom: 'Nos.',
    kiom: 7, diom: 1, pelletPlant: 2, totalQty: 10,
    oemName: 'Heinrich', modelName: 'IP-WS25/T', masterItemNumbers: [17]
  },
  {
    id: 'anx-b-16', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 16, code: 'B.16',
    description: 'ECB system with Mounting structure, power supply, pole etc.', category: 'ECB', uom: 'Nos.',
    kiom: 7, diom: 1, pelletPlant: 2, totalQty: 10,
    oemName: 'Heinrich', modelName: 'HNEX106-CSB-FK-SIP', masterItemNumbers: [18]
  },
  {
    id: 'anx-b-17', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 17, code: 'B.17',
    description: 'Desktop PC', category: 'Desktop PC', uom: 'Nos.',
    kiom: 22, diom: 4, pelletPlant: 4, totalQty: 30,
    oemName: 'Acer', modelName: 'S2710G', masterItemNumbers: [23]
  },
  {
    id: 'anx-b-18', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 18, code: 'B.18',
    description: 'Multi Functional printer Laser based including cartridge (Total printing 5000 A4 paper per day)', category: 'Printer', uom: 'Nos.',
    kiom: 15, diom: 2, pelletPlant: 2, totalQty: 19,
    oemName: 'Brother', modelName: 'DCP-B7620DWB', masterItemNumbers: [24]
  },
  {
    id: 'anx-b-19', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 19, code: 'B.19',
    description: 'Barcode Scanner for DMG Paper', category: 'Barcode Scanner', uom: 'Nos.',
    kiom: 15, diom: 2, pelletPlant: 0, totalQty: 17,
    oemName: 'Zebra', modelName: 'LS2208-SR20007R-Y', masterItemNumbers: [25]
  },
  {
    id: 'anx-b-20', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 20, code: 'B.20',
    description: 'Switch L2 24 Port PoE plus switch - Rugged', category: 'Industrial/Rugged 24 Port Switch', uom: 'Nos.',
    kiom: 11, diom: 1, pelletPlant: 2, totalQty: 14,
    oemName: 'Cisco', modelName: 'IE-9320-24P4X-E++', masterItemNumbers: [15]
  },
  {
    id: 'anx-b-21', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 21, code: 'B.21',
    description: '9U Rack', category: 'Rack', uom: 'Nos.',
    kiom: 7, diom: 1, pelletPlant: 2, totalQty: 10,
    oemName: 'Standard', modelName: 'Standard', masterItemNumbers: [29]
  },
  {
    id: 'anx-b-22', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 22, code: 'B.22',
    description: 'Uninterrupted Power Supply (UPS) 5KVA- 2 Hrs. backup', category: 'UPS', uom: 'Nos.',
    kiom: 4, diom: 1, pelletPlant: 2, totalQty: 7,
    oemName: 'BPE', modelName: 'MF1106L16 + Exide/Quanta', masterItemNumbers: [27]
  },
  {
    id: 'anx-b-23', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 23, code: 'B.23',
    description: 'Uninterrupted Power Supply (UPS) 5KVA- 2 Hrs. backup for large screen at entry gate', category: 'UPS', uom: 'Nos.',
    kiom: 3, diom: 0, pelletPlant: 0, totalQty: 3,
    oemName: 'BPE', modelName: 'MF1106L16 + Exide/Quanta', masterItemNumbers: [28]
  },
  {
    id: 'anx-b-24', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 24, code: 'B.24',
    description: 'Cantilever Pole (height 7 m and 5 m arm) for UHF RFID Reader, Display Unit, ANPR camera, PA System, Signal Light', category: 'Poles', uom: 'Nos.',
    kiom: 7, diom: 2, pelletPlant: 4, totalQty: 13,
    oemName: 'Standard', modelName: 'Standard', masterItemNumbers: [31]
  },
  {
    id: 'anx-b-25', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 25, code: 'B.25',
    description: 'Straight (6 m) Pole for IP CCTV - Bullet camera', category: 'Poles', uom: 'Nos.',
    kiom: 7, diom: 1, pelletPlant: 2, totalQty: 10,
    oemName: 'Standard', modelName: 'Standard', masterItemNumbers: [32]
  },
  {
    id: 'anx-b-26', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 26, code: 'B.26',
    description: 'Pole (height 10 m) for IP CCTV-PTZ Camera (with ESE Lightning Arrestor and required accessories)', category: 'Poles', uom: 'Nos.',
    kiom: 3, diom: 0, pelletPlant: 0, totalQty: 3,
    oemName: 'Standard', modelName: 'Standard', masterItemNumbers: [33]
  },
  {
    id: 'anx-b-27', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 27, code: 'B.27',
    description: 'Entry Gate Pole Mounting Structure (H: 15 meter x W: 12 Meter)', category: 'Poles', uom: 'Nos.',
    kiom: 4, diom: 0, pelletPlant: 0, totalQty: 4,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-b-28', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 28, code: 'B.28',
    description: 'Porta Cabin for Exit Gate Size 20 x 18 Feet including lighting, Fan, Workstation Furniture', category: 'Porta Cabin', uom: 'Nos.',
    kiom: 4, diom: 0, pelletPlant: 0, totalQty: 4,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-b-29', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 29, code: 'B.29',
    description: '2 Ton AC for porta cabin', category: 'AC', uom: 'Nos.',
    kiom: 4, diom: 0, pelletPlant: 0, totalQty: 4,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-b-30', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 30, code: 'B.30',
    description: 'Porta Cabin for Entry Gate Size 10 x 8 Feet including lighting, Fan, Workstation Furniture', category: 'Porta Cabin', uom: 'Nos.',
    kiom: 3, diom: 1, pelletPlant: 0, totalQty: 4,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-b-31', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 31, code: 'B.31',
    description: '2 Ton AC for porta cabin', category: 'AC', uom: 'Nos.',
    kiom: 3, diom: 1, pelletPlant: 2, totalQty: 6,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-b-32', section: 'B', sectionTitle: 'B. Entry / Exit Gate', slNo: 32, code: 'B.32',
    description: 'Site Preparation Work (Earthing, Foundation Work for Pole Erection, Surge Arrestor, Mounting Clumps, Electrical Wiring, PVC Pipes for wiring, RJ45 Jack, Patch Cord, IO Box, Electrical Board, Switch, Fiber Connectivity from nearest PoP, Fully Loaded Jack Panel, Face Plate, etc. for complete readiness of the site)',
    category: 'Site Preparation Work', uom: 'Lump Sum',
    kiom: 7, diom: 1, pelletPlant: 2, totalQty: 10,
    oemName: 'Standard', modelName: 'Standard'
  },

  // =========================================================================
  // C. Other Devices
  // =========================================================================
  {
    id: 'anx-c-1', section: 'C', sectionTitle: 'C. Other Devices', slNo: 1, code: 'C.1',
    description: 'GPS Devices (Dual SIM Based & WiFi based) integrated with proximity sensor Display unit and Software', category: 'GPS device', uom: 'Nos.',
    kiom: 120, diom: 160, pelletPlant: 0, totalQty: 280,
    oemName: 'Accolade', modelName: 'ATT-140'
  },
  {
    id: 'anx-c-2', section: 'C', sectionTitle: 'C. Other Devices', slNo: 2, code: 'C.2',
    description: 'Proximity Warning Device with Display Unit', category: 'Proximity Warning device', uom: 'Nos.',
    kiom: 120, diom: 160, pelletPlant: 0, totalQty: 280,
    oemName: 'Davesman', modelName: 'AMNS'
  },
  {
    id: 'anx-c-3', section: 'C', sectionTitle: 'C. Other Devices', slNo: 3, code: 'C.3',
    description: 'Payload Sensor (PLMS) for shovel/Front Loader with Display Unit (GSM Based)', category: 'PLMS', uom: 'Nos.',
    kiom: 10, diom: 2, pelletPlant: 0, totalQty: 12,
    oemName: 'Synapsis Techno', modelName: 'PLMS'
  },
  {
    id: 'anx-c-4', section: 'C', sectionTitle: 'C. Other Devices', slNo: 4, code: 'C.4',
    description: 'Radar for Surveillance for Pellet Plant', category: 'Radar', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 30, totalQty: 30,
    oemName: 'Tyco', modelName: 'As per BoQ'
  },
  {
    id: 'anx-c-5', section: 'C', sectionTitle: 'C. Other Devices', slNo: 5, code: 'C.5',
    description: 'Additional IP CCTV- PTZ Camera for different Locations at Site', category: 'CCTV Cameras', uom: 'Nos.',
    kiom: 12, diom: 9, pelletPlant: 29, totalQty: 50,
    oemName: 'Honeywell', modelName: 'HC35WZ5R30+ Wall mount', masterItemNumbers: [8]
  },
  {
    id: 'anx-c-6', section: 'C', sectionTitle: 'C. Other Devices', slNo: 6, code: 'C.6',
    description: 'Additional IP CCTV - Bullet Camera for different Locations at Site', category: 'CCTV Cameras', uom: 'Nos.',
    kiom: 8, diom: 6, pelletPlant: 4, totalQty: 18,
    oemName: 'Honeywell', modelName: 'HC50WB3R2', masterItemNumbers: [5]
  },
  {
    id: 'anx-c-7', section: 'C', sectionTitle: 'C. Other Devices', slNo: 7, code: 'C.7',
    description: 'Additional IP CCTV - Dome Camera for different Locations at Site', category: 'CCTV Cameras', uom: 'Nos.',
    kiom: 4, diom: 0, pelletPlant: 3, totalQty: 7,
    oemName: 'Honeywell', modelName: 'HC50WB43R2', masterItemNumbers: [7]
  },
  {
    id: 'anx-c-8', section: 'C', sectionTitle: 'C. Other Devices', slNo: 8, code: 'C.8',
    description: 'Pole (height 10 m) for IP CCTV-PTZ Camera (with ESE Lightning Arrestor and required accessories)', category: 'Poles', uom: 'Nos.',
    kiom: 12, diom: 9, pelletPlant: 29, totalQty: 50,
    oemName: 'Standard', modelName: 'Standard', masterItemNumbers: [33]
  },
  {
    id: 'anx-c-9', section: 'C', sectionTitle: 'C. Other Devices', slNo: 9, code: 'C.9',
    description: 'Straight (6 m) for IP CCTV- Bullet camera', category: 'Poles', uom: 'Nos.',
    kiom: 8, diom: 6, pelletPlant: 4, totalQty: 18,
    oemName: 'Standard', modelName: 'Standard', masterItemNumbers: [32]
  },
  {
    id: 'anx-c-10', section: 'C', sectionTitle: 'C. Other Devices', slNo: 10, code: 'C.10',
    description: 'Switch L2 8 Port PoE plus switch - Rugged', category: 'Industrial/Rugged 8 Port Switch', uom: 'Nos.',
    kiom: 22, diom: 15, pelletPlant: 20, totalQty: 57,
    oemName: 'Comnus/Cisco', modelName: 'CX-NPA-8GS2I-L2/IE-3100-8P2C-E++', masterItemNumbers: [14]
  },
  {
    id: 'anx-c-11', section: 'C', sectionTitle: 'C. Other Devices', slNo: 11, code: 'C.11',
    description: 'Cat-6 UTP Outdoor Armoured, Double Jacket Cable', category: 'Passive Networking', uom: 'Meter',
    kiom: 900, diom: 700, pelletPlant: 1380, totalQty: 2980,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-c-12', section: 'C', sectionTitle: 'C. Other Devices', slNo: 12, code: 'C.12',
    description: '12 CORE ADSS OFC', category: 'Passive Networking', uom: 'Meter',
    kiom: 2100, diom: 1600, pelletPlant: 1700, totalQty: 5400,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-c-13', section: 'C', sectionTitle: 'C. Other Devices', slNo: 13, code: 'C.13',
    description: 'Junction BOX - outdoor for all infra', category: 'Junction Box', uom: 'Nos.',
    kiom: 22, diom: 15, pelletPlant: 20, totalQty: 57,
    oemName: 'Standard', modelName: 'Standard', masterItemNumbers: [30]
  },
  {
    id: 'anx-c-14', section: 'C', sectionTitle: 'C. Other Devices', slNo: 14, code: 'C.14',
    description: 'DG Set - 15 KVA', category: 'DG Set', uom: 'Nos.',
    kiom: 2, diom: 0, pelletPlant: 0, totalQty: 2,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-c-15', section: 'C', sectionTitle: 'C. Other Devices', slNo: 15, code: 'C.15',
    description: 'DG Set - 10 KVA', category: 'DG Set', uom: 'Nos.',
    kiom: 3, diom: 0, pelletPlant: 0, totalQty: 3,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-c-16', section: 'C', sectionTitle: 'C. Other Devices', slNo: 16, code: 'C.16',
    description: 'DG Set - 7.5 KVA', category: 'DG Set', uom: 'Nos.',
    kiom: 1, diom: 0, pelletPlant: 0, totalQty: 1,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-c-17', section: 'C', sectionTitle: 'C. Other Devices', slNo: 17, code: 'C.17',
    description: 'DG Set - 5 KVA', category: 'DG Set', uom: 'Nos.',
    kiom: 1, diom: 0, pelletPlant: 0, totalQty: 1,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-c-18', section: 'C', sectionTitle: 'C. Other Devices', slNo: 18, code: 'C.18',
    description: 'Change over Switch (Automatic) 3 Phase 100 AMPS', category: 'Passive Networking', uom: 'Nos.',
    kiom: 14, diom: 0, pelletPlant: 0, totalQty: 14,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-c-19', section: 'C', sectionTitle: 'C. Other Devices', slNo: 19, code: 'C.19',
    description: 'Electrical Cable', category: 'Passive Networking', uom: 'Meter',
    kiom: 0, diom: 0, pelletPlant: 1400, totalQty: 1400,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-c-20', section: 'C', sectionTitle: 'C. Other Devices', slNo: 20, code: 'C.20',
    description: 'Site Preparation Work (Earthing, Foundation Work for Pole Erection, Surge Arrestor, Mounting Clumps, Electrical Wiring, PVC Pipes for wiring, RJ45 Jack, Patch Cord, IO Box, Electrical Board, Switch, Fiber Connectivity from nearest PoP, Fully Loaded Jack Panel, Face Plate, etc. for complete readiness of the site)',
    category: 'Site Preparation Work', uom: 'Lump Sum',
    kiom: 22, diom: 15, pelletPlant: 15, totalQty: 52,
    oemName: 'Standard', modelName: 'Standard'
  },

  // =========================================================================
  // D. Data Centre Hardware
  // =========================================================================
  {
    id: 'anx-d-1', section: 'D', sectionTitle: 'D. Data Centre Hardware', slNo: 1, code: 'D.1',
    description: 'Core Router', category: 'Core Router', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 1, totalQty: 1,
    oemName: 'Cisco/Nokia', modelName: 'NCS-5504/7250 IXR-R6'
  },
  {
    id: 'anx-d-2', section: 'D', sectionTitle: 'D. Data Centre Hardware', slNo: 2, code: 'D.2',
    description: 'Core Switch', category: 'Core Switch', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 2, totalQty: 2,
    oemName: 'Cisco', modelName: 'C9500X-28C8D'
  },
  {
    id: 'anx-d-3', section: 'D', sectionTitle: 'D. Data Centre Hardware', slNo: 3, code: 'D.3',
    description: 'Firewall (NGFW)', category: 'Firewall', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 1, totalQty: 1,
    oemName: 'Fortinet',
    modelName: 'FG-600F + FC-10-0600F-809-02-60 + FN-TRAN-SFP+SR + FN-TRAN-SFP28-SR + FAZ-150G + FC-10-L150G-661-02-60 + FC-10-L150G-247-02-60'
  },
  {
    id: 'anx-d-4', section: 'D', sectionTitle: 'D. Data Centre Hardware', slNo: 4, code: 'D.4',
    description: 'Managed 24 Port L3 Edge Switches for Management', category: 'L3 Management Switch', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 2, totalQty: 2,
    oemName: 'Cisco', modelName: 'C9500-24Y4C-A'
  },
  {
    id: 'anx-d-5', section: 'D', sectionTitle: 'D. Data Centre Hardware', slNo: 5, code: 'D.5',
    description: '42U Server Rack with necessary accessories', category: 'Rack', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 3, totalQty: 3,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-d-6', section: 'D', sectionTitle: 'D. Data Centre Hardware', slNo: 6, code: 'D.6',
    description: 'KVM Switch', category: 'KVM Switch', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 4, totalQty: 4,
    oemName: 'ATEN', modelName: 'KN1108VA + KA7175 + CL1000N'
  },
  {
    id: 'anx-d-7', section: 'D', sectionTitle: 'D. Data Centre Hardware', slNo: 7, code: 'D.7',
    description: 'Rack Server (App Server, DB Server, Web Server, Failover & Recording Server) in HA configuration for critical application', category: 'Rack Server', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 12, totalQty: 12,
    oemName: 'Vantage/Cisco', modelName: 'Vantage 2240/UCSC-C240-M75X'
  },
  {
    id: 'anx-d-8', section: 'D', sectionTitle: 'D. Data Centre Hardware', slNo: 8, code: 'D.8',
    description: 'SAN Switch', category: 'SAN Switch', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 1, totalQty: 1,
    oemName: 'Cisco', modelName: 'DS-C9124V-24PITK9'
  },
  {
    id: 'anx-d-9', section: 'D', sectionTitle: 'D. Data Centre Hardware', slNo: 9, code: 'D.9',
    description: 'SAN Storage - 500 TB', category: 'SAN Storage', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 1, totalQty: 1,
    oemName: 'Hitachi Vantara/NetApp/QSAN', modelName: 'VSP-E590H-A0001.S / FAS90 / XF4226-D+ / JBOD'
  },
  {
    id: 'anx-d-10', section: 'D', sectionTitle: 'D. Data Centre Hardware', slNo: 10, code: 'D.10',
    description: '2 ton Precision Air Conditioning System for the Server Area', category: 'AC', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 1, totalQty: 1,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-d-11', section: 'D', sectionTitle: 'D. Data Centre Hardware', slNo: 11, code: 'D.11',
    description: 'Rodent Repellent system', category: 'Rodent Repellent', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 1, totalQty: 1,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-d-12', section: 'D', sectionTitle: 'D. Data Centre Hardware', slNo: 12, code: 'D.12',
    description: 'Water Leakage Detection', category: 'Water Leakage detection', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 1, totalQty: 1,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-d-13', section: 'D', sectionTitle: 'D. Data Centre Hardware', slNo: 13, code: 'D.13',
    description: 'Fire Alarm System', category: 'Fire Alarm', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 1, totalQty: 1,
    oemName: 'Standard', modelName: 'Standard'
  },
  {
    id: 'anx-d-14', section: 'D', sectionTitle: 'D. Data Centre Hardware', slNo: 14, code: 'D.14',
    description: 'Site Preparation Work (Earthing, Surge Arrestor, Copper Cabling, Wire basket for Copper, Fibre Runner, Electrical Wiring, Clumps, PVC Pipes for wiring, RJ45 Jack, Patch Cord, IO Box, Electrical Board, Switch, Fiber Connectivity from nearest PoP, Fully Loaded Jack Panel, Face Plate, etc. for complete readiness of the site)',
    category: 'Site Preparation Work', uom: 'Lump Sum',
    kiom: 0, diom: 0, pelletPlant: 1, totalQty: 1,
    oemName: 'Standard', modelName: 'Standard'
  },

  // =========================================================================
  // E. Setup of Command and Control Room at Kumarswamy, Donimalai and Pellet Plant
  // =========================================================================
  {
    id: 'anx-e-1', section: 'E', sectionTitle: 'E. Setup of Command and Control Room (KIOM, DIOM & Pellet Plant)', slNo: 1, code: 'E.1',
    description: 'Videowall (50" diagonal) 3x2 with videowall controller and software', category: 'Videowall', uom: 'Nos.',
    kiom: 1, diom: 1, pelletPlant: 0, totalQty: 2,
    oemName: 'Delta', modelName: 'DVS-508 RS + Icon Pro'
  },
  {
    id: 'anx-e-2', section: 'E', sectionTitle: 'E. Setup of Command and Control Room (KIOM, DIOM & Pellet Plant)', slNo: 2, code: 'E.2',
    description: 'Videowall (50" diagonal) 4x2 with videowall controller and software', category: 'Videowall', uom: 'Nos.',
    kiom: 0, diom: 0, pelletPlant: 1, totalQty: 1,
    oemName: 'Delta', modelName: 'DVS-508 RS + Icon Pro'
  },
  {
    id: 'anx-e-3', section: 'E', sectionTitle: 'E. Setup of Command and Control Room (KIOM, DIOM & Pellet Plant)', slNo: 3, code: 'E.3',
    description: 'LED Display (70") for CISF for CCTV Monitoring', category: 'LED Display- Indoor', uom: 'Nos.',
    kiom: 1, diom: 1, pelletPlant: 1, totalQty: 3,
    oemName: 'Samsung', modelName: 'QM75C'
  },
];

export type MakeModelMatchStatus = 'verified' | 'mismatch' | 'unfilled' | 'unmatched';

export interface MakeModelVerificationResult {
  status: MakeModelMatchStatus;
  matchedEntries: BoqAnnexureItem[];
  oemMatched: boolean;
  modelMatched: boolean;
}

function normalizeToken(val?: string): string {
  return (val || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function splitAlternatives(approvedValue: string): string[] {
  return approvedValue
    .split(/[/,+]/)
    .map((part) => normalizeToken(part))
    .filter((p) => p.length >= 2);
}

function matchesApprovedText(entered: string, approved: string): boolean {
  const normEntered = normalizeToken(entered);
  const normApproved = normalizeToken(approved);
  if (!normEntered || !normApproved) return false;
  if (normApproved === 'as per boq') return true;
  if (normEntered === normApproved) return true;
  if (normApproved.includes(normEntered) && normEntered.length >= 3) return true;
  if (normEntered.includes(normApproved) && normApproved.length >= 3) return true;

  const alts = splitAlternatives(approved);
  return alts.some((alt) => normEntered === alt || normEntered.includes(alt) || (normEntered.length >= 3 && alt.includes(normEntered)));
}

/**
 * Find matching Annexure 2 official Make & Model entries for a given MaterialItem.
 */
export function findAnnexureEntriesForMaterialItem(item: MaterialItem): BoqAnnexureItem[] {
  // 1. Check direct Section.SlNo code match (e.g., "A.1", "B.14", "D.3")
  const codeCandidates = [item.boqItemNumber, item.boqNumber].filter(Boolean) as string[];
  for (const raw of codeCandidates) {
    const codeMatch = raw.trim().toUpperCase().match(/^([A-E])[\s.-]+(\d+)$/);
    if (codeMatch) {
      const code = `${codeMatch[1]}.${parseInt(codeMatch[2], 10)}`;
      const exactCode = BOQ_ANNEXURE_ITEMS.filter((e) => e.code === code);
      if (exactCode.length > 0) return exactCode;
    }
  }

  // 2. Check Master BOQ Item Number mapping (items 1..34)
  const master = findMasterBoqItem(item);
  if (master) {
    const byMaster = BOQ_ANNEXURE_ITEMS.filter((e) =>
      e.masterItemNumbers?.includes(master.itemNumber)
    );
    if (byMaster.length > 0) return byMaster;
  }

  // 3. Exact or strong substring match on description
  const normName = normalizeToken(item.itemName);
  if (!normName) return [];

  const exactDesc = BOQ_ANNEXURE_ITEMS.filter(
    (e) => normalizeToken(e.description) === normName
  );
  if (exactDesc.length > 0) return exactDesc;

  const partialDesc = BOQ_ANNEXURE_ITEMS.filter((e) => {
    const d = normalizeToken(e.description);
    return (normName.length >= 4 && d.includes(normName)) || (d.length >= 4 && normName.includes(d));
  });
  if (partialDesc.length > 0) return partialDesc;

  // 4. Keyword overlap fallback (at least 2 meaningful tokens matching)
  const tokens = normName.split(' ').filter((t) => t.length >= 3 && !['for', 'with', 'and', 'the', 'all', 'set'].includes(t));
  if (tokens.length >= 2) {
    const scored = BOQ_ANNEXURE_ITEMS.map((entry) => {
      const haystack = normalizeToken(`${entry.description} ${entry.category} ${entry.oemName} ${entry.modelName}`);
      const hits = tokens.filter((t) => haystack.includes(t)).length;
      return { entry, hits };
    })
      .filter((s) => s.hits >= Math.min(2, tokens.length))
      .sort((a, b) => b.hits - a.hits);

    if (scored.length > 0) {
      const topScore = scored[0].hits;
      return scored.filter((s) => s.hits === topScore).slice(0, 4).map((s) => s.entry);
    }
  }

  return [];
}

/**
 * Verify an item's entered OEM (Make) and OEM Model against the official Annexure 2 BoQ.
 */
export function verifyItemMakeAndModel(item: MaterialItem): MakeModelVerificationResult {
  const matchedEntries = findAnnexureEntriesForMaterialItem(item);

  if (matchedEntries.length === 0) {
    return {
      status: 'unmatched',
      matchedEntries: [],
      oemMatched: false,
      modelMatched: false,
    };
  }

  const enteredOem = (item.oem || '').trim();
  const enteredModel = (item.oemModel || '').trim();

  if (!enteredOem && !enteredModel) {
    return {
      status: 'unfilled',
      matchedEntries,
      oemMatched: false,
      modelMatched: false,
    };
  }

  const oemMatched = enteredOem
    ? matchedEntries.some((e) => matchesApprovedText(enteredOem, e.oemName))
    : false;
  const modelMatched = enteredModel
    ? matchedEntries.some((e) => matchesApprovedText(enteredModel, e.modelName))
    : false;

  if (enteredOem && enteredModel) {
    const exactPairMatch = matchedEntries.some(
      (e) =>
        matchesApprovedText(enteredOem, e.oemName) &&
        matchesApprovedText(enteredModel, e.modelName)
    );
    return {
      status: exactPairMatch ? 'verified' : 'mismatch',
      matchedEntries,
      oemMatched,
      modelMatched,
    };
  }

  // Only one of OEM or Model entered
  return {
    status: oemMatched || modelMatched ? 'unfilled' : 'mismatch',
    matchedEntries,
    oemMatched,
    modelMatched,
  };
}
