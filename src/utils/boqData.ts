export interface MasterBoqItem {
  id: string;
  itemNumber: number;
  description: string;
  totalQuantity: number;
  unit: string;
}

export const MASTER_BOQ_ITEMS: MasterBoqItem[] = [
  { id: 'boq-1', itemNumber: 1, description: 'UHF RFID Reader', totalQuantity: 50, unit: 'Nos' },
  { id: 'boq-2', itemNumber: 2, description: 'UHF RFID Tag', totalQuantity: 1000, unit: 'Nos' },
  { id: 'boq-3', itemNumber: 3, description: 'ANPR Camera with IR Illuminator', totalQuantity: 6, unit: 'Nos' },
  { id: 'boq-4', itemNumber: 4, description: 'ANPR System (Per Camera License)', totalQuantity: 6, unit: 'Nos' },
  { id: 'boq-5', itemNumber: 5, description: 'IP CCTV- Bullet Camera with IR illuminator', totalQuantity: 105, unit: 'Nos' },
  { id: 'boq-6', itemNumber: 6, description: 'IP CCTV- Bullet Camera with Material Verification Analytics', totalQuantity: 20, unit: 'Nos' },
  { id: 'boq-7', itemNumber: 7, description: 'IP CCTV- Dome Camera with IR illuminator for Weighbridge Counter', totalQuantity: 55, unit: 'Nos' },
  { id: 'boq-8', itemNumber: 8, description: 'IP CCTV- PTZ Camera with IR illuminator', totalQuantity: 97, unit: 'Nos' },
  { id: 'boq-9', itemNumber: 9, description: 'Vehicle Position Sensor (IR Based)', totalQuantity: 444, unit: 'Nos' },
  { id: 'boq-10', itemNumber: 10, description: 'Pole for Sensors (6 m height)', totalQuantity: 222, unit: 'Nos' },
  { id: 'boq-11', itemNumber: 11, description: 'Handheld RFID Reader', totalQuantity: 47, unit: 'Nos' },
  { id: 'boq-12', itemNumber: 12, description: 'Boom Barrier with safety sensors', totalQuantity: 87, unit: 'Nos' },
  { id: 'boq-13', itemNumber: 13, description: 'IoT Controller', totalQuantity: 50, unit: 'Nos' },
  { id: 'boq-14', itemNumber: 14, description: 'Industrial grade 8 Port PoE access switch - Rugged', totalQuantity: 94, unit: 'Nos' },
  { id: 'boq-15', itemNumber: 15, description: 'Switch L2 24 Port PoE plus switch - Rugged', totalQuantity: 14, unit: 'Nos' },
  { id: 'boq-16', itemNumber: 16, description: 'Signal Light (Set of Red & Green)', totalQuantity: 50, unit: 'Sets' },
  { id: 'boq-17', itemNumber: 17, description: 'Public Address System – IP based PA with speakers & mounting structure', totalQuantity: 47, unit: 'Sets' },
  { id: 'boq-18', itemNumber: 18, description: 'ECB system with Mounting structure', totalQuantity: 47, unit: 'Nos' },
  { id: 'boq-19', itemNumber: 19, description: 'LED Display Unit with controller (970mm x 970mm or higher) - Rugged', totalQuantity: 50, unit: 'Nos' },
  { id: 'boq-20', itemNumber: 20, description: 'Variable Message Display (VMD) Display Unit (Entry Gate)', totalQuantity: 3, unit: 'Nos' },
  { id: 'boq-21', itemNumber: 21, description: 'LED Controller', totalQuantity: 3, unit: 'Nos' },
  { id: 'boq-22', itemNumber: 22, description: "43'' LED Display at Exit gate", totalQuantity: 17, unit: 'Nos' },
  { id: 'boq-23', itemNumber: 23, description: 'Desktops PC at each Weighbridge', totalQuantity: 67, unit: 'Nos' },
  { id: 'boq-24', itemNumber: 24, description: 'Multi-Functional Laser Printer (5000 A4 paper/day)', totalQuantity: 19, unit: 'Nos' },
  { id: 'boq-25', itemNumber: 25, description: 'Barcode Scanner for DMG Paper', totalQuantity: 17, unit: 'Nos' },
  { id: 'boq-26', itemNumber: 26, description: 'Uninterrupted Power Supply (UPS) 2 KVA - 2 Hrs. backup', totalQuantity: 37, unit: 'Nos' },
  { id: 'boq-27', itemNumber: 27, description: 'Uninterrupted Power Supply (UPS) 5 KVA - 2 Hrs. backup', totalQuantity: 7, unit: 'Nos' },
  { id: 'boq-28', itemNumber: 28, description: 'Uninterrupted Power Supply (UPS) 5 KVA - 2 Hrs. backup for large screen', totalQuantity: 3, unit: 'Nos' },
  { id: 'boq-29', itemNumber: 29, description: '9U Rack', totalQuantity: 47, unit: 'Nos' },
  { id: 'boq-30', itemNumber: 30, description: 'Junction BOX - outdoor for all infra', totalQuantity: 94, unit: 'Nos' },
  { id: 'boq-31', itemNumber: 31, description: 'Cantilever Pole (7 m height, 5 m arm)', totalQuantity: 50, unit: 'Nos' },
  { id: 'boq-32', itemNumber: 32, description: 'Straight (6 m) Pole for IP CCTV - Bullet camera', totalQuantity: 68, unit: 'Nos' },
  { id: 'boq-33', itemNumber: 33, description: 'Pole (10 m) for IP CCTV - PTZ Camera (with ESE Lightning Arrestor)', totalQuantity: 97, unit: 'Nos' },
  { id: 'boq-34', itemNumber: 34, description: 'Straight (6 m) arm 2 m Pole for IP CCTV - Bullet camera', totalQuantity: 20, unit: 'Nos' },
];
