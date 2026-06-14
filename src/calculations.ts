import type { MonthlyInputs, BillResult, Tenant1Bill, Tenant2Bill, Tenant3Bill } from './types';

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function calculateBills(
  inputs: MonthlyInputs,
  tenant1LastReading: number,
  tenant2LastReading: number,
  waterRatioTenant2: number,
  tenant1Name: string,
  tenant2Name: string,
  tenant3Name: string,
): BillResult {
  const months = inputs.months;

  const t1 = inputs.tenant1;
  const t1Units = t1.currentReading - tenant1LastReading;
  const t1Electricity = round2(t1Units * t1.perUnitRate);
  const t1WaterMotorShare = round2(0.5 * t1.waterMotorUnits * months);
  const t1WaterMotorAmount = round2(t1WaterMotorShare * t1.perUnitRate);
  const t1MunicipalShare = round2((t1.municipalWaterBill * months) / 2);
  const t1TankerTotal = round2(t1.tankerRate1 * t1.tankerCount1 + t1.tankerRate2 * t1.tankerCount2);
  const t1TankerShare = round2(t1TankerTotal / 2);
  const t1TankerBatches = [
    ...(t1.tankerCount1 > 0 ? [{ count: t1.tankerCount1, rate: t1.tankerRate1 }] : []),
    ...(t1.tankerCount2 > 0 ? [{ count: t1.tankerCount2, rate: t1.tankerRate2 }] : []),
  ];
  const t1ExtraCash = round2(-(t1.extraCash * months));
  const t1Total = round2(
    t1Electricity + t1WaterMotorAmount + t1MunicipalShare +
    t1TankerShare + t1ExtraCash + t1.previousDues
  );

  const t1Bill: Tenant1Bill = {
    name: tenant1Name,
    lastReading: tenant1LastReading,
    currentReading: t1.currentReading,
    units: t1Units,
    perUnitRate: t1.perUnitRate,
    electricity: t1Electricity,
    waterMotorUnits: t1.waterMotorUnits * months,
    waterMotorShare: t1WaterMotorShare,
    waterMotorAmount: t1WaterMotorAmount,
    municipalWaterBill: t1.municipalWaterBill * months,
    municipalWaterShare: t1MunicipalShare,
    tankerBatches: t1TankerBatches,
    tankerShare: t1TankerShare,
    extraCash: t1.extraCash * months,
    previousDues: t1.previousDues,
    total: t1Total,
  };

  const t2 = inputs.tenant2;
  const t2Units = t2.currentReading - tenant2LastReading;
  const t2Electricity = round2(t2Units * t2.perUnitRate);
  const t2WaterMotorShare = round2(waterRatioTenant2 * t2.waterMotorUnits * months);
  const t2WaterMotorAmount = round2(t2WaterMotorShare * t2.perUnitRate);
  const t2MunicipalShare = round2((t2.municipalWaterBill * months) / 2);
  const t2ExtraCash = round2(-(t2.extraCash * months));
  const t2GrossShare = round2(t2Electricity + t2WaterMotorAmount);
  const t2Total = round2(
    t2Electricity + t2WaterMotorAmount + t2MunicipalShare +
    t2ExtraCash + t2.previousDues
  );

  const t2Bill: Tenant2Bill = {
    name: tenant2Name,
    lastReading: tenant2LastReading,
    currentReading: t2.currentReading,
    units: t2Units,
    perUnitRate: t2.perUnitRate,
    electricity: t2Electricity,
    waterRatio: waterRatioTenant2,
    waterMotorUnits: t2.waterMotorUnits * months,
    waterMotorShare: t2WaterMotorShare,
    waterMotorAmount: t2WaterMotorAmount,
    municipalWaterBill: t2.municipalWaterBill * months,
    municipalWaterShare: t2MunicipalShare,
    extraCash: t2.extraCash * months,
    previousDues: t2.previousDues,
    grossShare: t2GrossShare,
    total: t2Total,
  };

  const t3 = inputs.tenant3;
  const t3Electricity = round2(t3.mainMeterBill - t2GrossShare);
  const t3MunicipalShare = round2((t3.municipalWaterBill * months) / 2);
  const t3ExtraCash = round2(-(t3.extraCash * months));
  const t3Total = round2(
    t3Electricity + t3MunicipalShare + t3ExtraCash + t3.previousDues
  );

  const t3Bill: Tenant3Bill = {
    name: tenant3Name,
    mainMeterBill: t3.mainMeterBill,
    tenant2GrossShare: t2GrossShare,
    electricity: t3Electricity,
    municipalWaterBill: t3.municipalWaterBill * months,
    municipalWaterShare: t3MunicipalShare,
    extraCash: t3.extraCash * months,
    previousDues: t3.previousDues,
    total: t3Total,
  };

  return {
    month: inputs.month,
    billDate: inputs.billDate,
    months: inputs.months,
    tenant1: t1Bill,
    tenant2: t2Bill,
    tenant3: t3Bill,
  };
}
