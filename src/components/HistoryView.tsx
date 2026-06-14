import type { BillResult } from '../types';

interface HistoryProps {
  bills: BillResult[];
  onView: (bill: BillResult) => void;
  onDelete: () => void;
}

function fmt(n: number): string {
  return n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function HistoryView({ bills, onView, onDelete }: HistoryProps) {
  return (
    <div className="history-screen">
      <h1>Bill History</h1>
      {bills.length === 0 ? (
        <div className="history-empty">No bills generated yet.</div>
      ) : (
        <div className="history-list">
          {bills.map((bill, index) => (
            <div className="history-item" key={bill.month}>
              <div className="history-month">{bill.month}</div>
              <div className="history-amount">
                {bill.tenant1.name}: <span>₹{fmt(bill.tenant1.total)}</span>
              </div>
              <div className="history-amount">
                {bill.tenant2.name}: <span>₹{fmt(bill.tenant2.total)}</span>
              </div>
              <div className="history-amount">
                {bill.tenant3.name}: <span>₹{fmt(bill.tenant3.total)}</span>
              </div>
              <div className="history-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => onView(bill)}>
                  View
                </button>
                {index === 0 && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      if (window.confirm(`Delete bill for ${bill.month}? This will restore meter readings to before this bill was generated.`)) {
                        onDelete();
                      }
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
