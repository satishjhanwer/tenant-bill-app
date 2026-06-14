export interface MonthlyInputs {
  month: string;
  billDate: string;
  months: number;

  tenant1: {
    currentReading: number;
    perUnitRate: number;
    waterMotorUnits: number;
    municipalWaterBill: number;
    tankerCount1: number;
    tankerRate1: number;
    tankerCount2: number;
    tankerRate2: number;
    extraCash: number;
    previousDues: number;
  };

  tenant2: {
    currentReading: number;
    perUnitRate: number;
    waterMotorUnits: number;
    municipalWaterBill: number;
    extraCash: number;
    previousDues: number;
  };

  tenant3: {
    mainMeterBill: number;
    municipalWaterBill: number;
    extraCash: number;
    previousDues: number;
  };
}

export interface BillResult {
  month: string;
  billDate: string;
  months: number;
  tenant1: Tenant1Bill;
  tenant2: Tenant2Bill;
  tenant3: Tenant3Bill;
}

export interface Tenant1Bill {
  name: string;
  lastReading: number;
  currentReading: number;
  units: number;
  perUnitRate: number;
  electricity: number;
  waterMotorUnits: number;
  waterMotorShare: number;
  waterMotorAmount: number;
  municipalWaterBill: number;
  municipalWaterShare: number;
  tankerBatches: { count: number; rate: number }[];
  tankerShare: number;
  // kept for reading old stored bills
  tankerCount?: number;
  tankerRate?: number;
  extraCash: number;
  previousDues: number;
  total: number;
}

export interface Tenant2Bill {
  name: string;
  lastReading: number;
  currentReading: number;
  units: number;
  perUnitRate: number;
  electricity: number;
  waterRatio: number;
  waterMotorUnits: number;
  waterMotorShare: number;
  waterMotorAmount: number;
  municipalWaterBill: number;
  municipalWaterShare: number;
  extraCash: number;
  previousDues: number;
  grossShare: number;
  total: number;
}

export interface Tenant3Bill {
  name: string;
  mainMeterBill: number;
  tenant2GrossShare: number;
  electricity: number;
  municipalWaterBill: number;
  municipalWaterShare: number;
  extraCash: number;
  previousDues: number;
  total: number;
}

export interface StoredData {
  config: {
    tenant1Name: string;
    tenant2Name: string;
    tenant3Name: string;
    tenant1LastReading: number;
    tenant2LastReading: number;
    waterRatioTenant2: number;
    tankerRate: number;
  };
  bills: BillResult[];
}
