import type { BillResult, Tenant1Bill, Tenant2Bill, Tenant3Bill } from '../types';

interface Props {
  bill: BillResult;
}

function fmt(n: number): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(s: string): string {
  if (!s) return '';
  const [a, b, c] = s.split('-');
  return a.length === 4 ? `${c}-${b}-${a}` : s;
}

function BillHeader({ name, month, billDate }: {
  name: string;
  month: string;
  billDate: string;
}) {
  return (
    <div className="bill-header">
      <div className="bill-title-row">
        <span className="bill-title">{name}</span>
        <span className="bill-title-sep" />
        <span className="bill-month">{month}</span>
      </div>
      <div className="bill-paid-date">
        <span>Bill Date: {fmtDate(billDate)}</span>
      </div>
    </div>
  );
}

function Tenant1BillBlock({ bill, month, billDate }: {
  bill: Tenant1Bill;
  month: string;
  billDate: string;
}) {
  return (
    <div className="bill-block">
      <BillHeader name={bill.name} month={month} billDate={billDate} />

      <table className="bill-table">
        <tbody>
          <tr className="bill-section-header"><td colSpan={2}>Electricity</td></tr>
          <tr><td>Current Reading</td><td>{bill.currentReading}</td></tr>
          <tr><td>Last Reading</td><td>{bill.lastReading}</td></tr>
          <tr><td>Total Units</td><td>{bill.units}</td></tr>
          <tr><td>Per Unit Rate</td><td>₹{bill.perUnitRate}</td></tr>
          <tr><td>Electricity Charges</td><td>₹{fmt(bill.electricity)}</td></tr>

          <tr className="bill-section-header"><td colSpan={2}>Water Motor</td></tr>
          <tr><td>Total Units</td><td>{bill.waterMotorUnits}</td></tr>
          <tr><td>Your Share</td><td>{bill.waterMotorShare} units</td></tr>
          <tr><td>Water Motor Charges</td><td>₹{fmt(bill.waterMotorAmount)}</td></tr>

          <tr className="bill-section-header"><td colSpan={2}>Water</td></tr>
          <tr><td>Municipal Water Bill</td><td>₹{fmt(bill.municipalWaterBill)}</td></tr>
          <tr><td>Your Share</td><td>₹{fmt(bill.municipalWaterShare)}</td></tr>

          {bill.tankerCount > 0 && (
            <>
              <tr className="bill-section-header"><td colSpan={2}>Water Tanker</td></tr>
              <tr><td>Tankers × ₹{bill.tankerRate}</td><td>{bill.tankerCount} × ₹{bill.tankerRate}</td></tr>
              <tr><td>Your Share</td><td>₹{fmt(bill.tankerShare)}</td></tr>
            </>
          )}

          {(bill.extraCash > 0 || bill.previousDues > 0) && (
            <tr className="bill-section-header"><td colSpan={2}>Adjustments</td></tr>
          )}
          {bill.extraCash > 0 && (
            <tr><td>Extra Cash Received</td><td className="bill-negative">-₹{fmt(bill.extraCash)}</td></tr>
          )}
          {bill.previousDues > 0 && (
            <tr><td>Previous Dues</td><td>₹{fmt(bill.previousDues)}</td></tr>
          )}

          <tr className="bill-divider"><td colSpan={2}></td></tr>
          <tr className="bill-total-row"><td>Total Due</td><td>₹{fmt(bill.total)}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

function Tenant2BillBlock({ bill, month, billDate }: {
  bill: Tenant2Bill;
  month: string;
  billDate: string;
}) {
  return (
    <div className="bill-block">
      <BillHeader name={bill.name} month={month} billDate={billDate} />

      <table className="bill-table">
        <tbody>
          <tr className="bill-section-header"><td colSpan={2}>Electricity</td></tr>
          <tr><td>Current Reading</td><td>{bill.currentReading}</td></tr>
          <tr><td>Last Reading</td><td>{bill.lastReading}</td></tr>
          <tr><td>Total Units</td><td>{bill.units}</td></tr>
          <tr><td>Per Unit Rate</td><td>₹{bill.perUnitRate}</td></tr>
          <tr><td>Electricity Charges</td><td>₹{fmt(bill.electricity)}</td></tr>

          <tr className="bill-section-header"><td colSpan={2}>Water Motor</td></tr>
          <tr><td>Total Units</td><td>{bill.waterMotorUnits}</td></tr>
          <tr><td>Your Share</td><td>{bill.waterMotorShare.toFixed(3)} units</td></tr>
          <tr><td>Water Motor Charges</td><td>₹{fmt(bill.waterMotorAmount)}</td></tr>

          <tr className="bill-section-header"><td colSpan={2}>Water</td></tr>
          <tr><td>Municipal Water Bill</td><td>₹{fmt(bill.municipalWaterBill)}</td></tr>
          <tr><td>Your Share</td><td>₹{fmt(bill.municipalWaterShare)}</td></tr>

          {(bill.extraCash > 0 || bill.previousDues > 0) && (
            <tr className="bill-section-header"><td colSpan={2}>Adjustments</td></tr>
          )}
          {bill.extraCash > 0 && (
            <tr><td>Extra Cash Received</td><td className="bill-negative">-₹{fmt(bill.extraCash)}</td></tr>
          )}
          {bill.previousDues > 0 && (
            <tr><td>Previous Dues</td><td>₹{fmt(bill.previousDues)}</td></tr>
          )}

          <tr className="bill-divider"><td colSpan={2}></td></tr>
          <tr className="bill-total-row"><td>Total Due</td><td>₹{fmt(bill.total)}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

function Tenant3BillBlock({ bill, month, billDate }: {
  bill: Tenant3Bill;
  month: string;
  billDate: string;
}) {
  return (
    <div className="bill-block">
      <BillHeader name={bill.name} month={month} billDate={billDate} />

      <table className="bill-table">
        <tbody>
          <tr className="bill-section-header"><td colSpan={2}>Electricity</td></tr>
          <tr><td>Total Meter Bill</td><td>₹{fmt(bill.mainMeterBill)}</td></tr>
          <tr><td>Tenant 2 Share</td><td className="bill-negative">-₹{fmt(bill.tenant2GrossShare)}</td></tr>
          <tr><td>Your Electricity</td><td>₹{fmt(bill.electricity)}</td></tr>

          <tr className="bill-section-header"><td colSpan={2}>Water</td></tr>
          <tr><td>Municipal Water Bill</td><td>₹{fmt(bill.municipalWaterBill)}</td></tr>
          <tr><td>Your Share</td><td>₹{fmt(bill.municipalWaterShare)}</td></tr>

          {(bill.extraCash > 0 || bill.previousDues > 0) && (
            <tr className="bill-section-header"><td colSpan={2}>Adjustments</td></tr>
          )}
          {bill.extraCash > 0 && (
            <tr><td>Extra Cash Received</td><td className="bill-negative">-₹{fmt(bill.extraCash)}</td></tr>
          )}
          {bill.previousDues > 0 && (
            <tr><td>Previous Dues</td><td>₹{fmt(bill.previousDues)}</td></tr>
          )}

          <tr className="bill-divider"><td colSpan={2}></td></tr>
          <tr className="bill-total-row"><td>Total Due</td><td>₹{fmt(bill.total)}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

export function PrintView({ bill }: Props) {
  const handlePrint = () => {
    const api = (window as any).electronAPI;
    if (api) api.print();
    else window.print();
  };

  return (
    <div className="print-screen">
      <div className="print-header">
        <h1>Bill — {bill.month}</h1>
        <div className="print-actions">
          <button className="btn btn-primary" onClick={handlePrint}>
            Print Bill
          </button>
        </div>
      </div>

      <div className="bills-container">
        <Tenant1BillBlock bill={bill.tenant1} month={bill.month} billDate={bill.billDate} />
        <Tenant2BillBlock bill={bill.tenant2} month={bill.month} billDate={bill.billDate} />
        <Tenant3BillBlock bill={bill.tenant3} month={bill.month} billDate={bill.billDate} />
      </div>
    </div>
  );
}
