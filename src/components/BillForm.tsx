import { useState, useEffect } from 'react';
import type { MonthlyInputs, StoredData } from '../types';

interface Props {
  storedData: StoredData;
  onGenerate: (inputs: MonthlyInputs) => void;
}

function currentMonthLabel(): string {
  const d = new Date();
  return d.toLocaleString('en-IN', { month: 'long', year: 'numeric' });
}

function todayIso(): string {
  return new Date().toISOString().split('T')[0];
}

export function BillForm({ storedData, onGenerate }: Props) {
  const { config } = storedData;

  const [month, setMonth] = useState(currentMonthLabel());
  const [billDate, setBillDate] = useState(todayIso());
  const [months, setMonths] = useState('1');

  const [mCurrentReading, setMCurrentReading] = useState('');
  const [mPerUnit, setMPerUnit] = useState('');
  const [mWaterUnits, setMWaterUnits] = useState('');
  const [mMunicipalWater, setMMunicipalWater] = useState('');
  const [mTankerCount1, setMTankerCount1] = useState('0');
  const [mTankerRate1, setMTankerRate1] = useState(String(config.tankerRate));
  const [mTankerCount2, setMTankerCount2] = useState('0');
  const [mTankerRate2, setMTankerRate2] = useState(String(config.tankerRate));
  const [showTankerBatch2, setShowTankerBatch2] = useState(false);
  const [mExtraCash, setMExtraCash] = useState('0');
  const [mPrevDues, setMPrevDues] = useState('0');

  const [sCurrentReading, setSCurrentReading] = useState('');
  const [sPerUnit, setSPerUnit] = useState('');
  const [sWaterUnits, setSWaterUnits] = useState('');
  const [sMunicipalWater, setSMunicipalWater] = useState('');
  const [sExtraCash, setSExtraCash] = useState('0');
  const [sPrevDues, setSPrevDues] = useState('0');

  const [mjMainBill, setMjMainBill] = useState('');
  const [mjMunicipalWater, setMjMunicipalWater] = useState('');
  const [mjExtraCash, setMjExtraCash] = useState('0');
  const [mjPrevDues, setMjPrevDues] = useState('0');

  useEffect(() => {
    setMTankerRate1(String(config.tankerRate));
    setMTankerRate2(String(config.tankerRate));
  }, [config.tankerRate]);

  const n = (v: string) => parseFloat(v) || 0;

  const handleSubmit = () => {
    const inputs: MonthlyInputs = {
      month,
      billDate,
      months: Math.max(1, n(months)),
      tenant1: {
        currentReading: n(mCurrentReading),
        perUnitRate: n(mPerUnit),
        waterMotorUnits: n(mWaterUnits),
        municipalWaterBill: n(mMunicipalWater),
        tankerCount1: n(mTankerCount1),
        tankerRate1: n(mTankerRate1),
        tankerCount2: showTankerBatch2 ? n(mTankerCount2) : 0,
        tankerRate2: showTankerBatch2 ? n(mTankerRate2) : 0,
        extraCash: n(mExtraCash),
        previousDues: n(mPrevDues),
      },
      tenant2: {
        currentReading: n(sCurrentReading),
        perUnitRate: n(sPerUnit),
        waterMotorUnits: n(sWaterUnits),
        municipalWaterBill: n(sMunicipalWater),
        extraCash: n(sExtraCash),
        previousDues: n(sPrevDues),
      },
      tenant3: {
        mainMeterBill: n(mjMainBill),
        municipalWaterBill: n(mjMunicipalWater),
        extraCash: n(mjExtraCash),
        previousDues: n(mjPrevDues),
      },
    };
    onGenerate(inputs);
  };

  const canSubmit = mCurrentReading && mPerUnit && sCurrentReading && sPerUnit && mjMainBill;

  return (
    <div className="form-screen">
      <div className="form-header">
        <div>
          <h1>Generate Bill</h1>
          <p>Enter meter readings and charges for the month</p>
        </div>
        <button className="btn btn-primary" onClick={handleSubmit} disabled={!canSubmit}>
          Generate Bill →
        </button>
      </div>

      <div className="form-meta-row">
        <div className="field">
          <label>Bill Month</label>
          <input value={month} onChange={e => setMonth(e.target.value)} placeholder="May 2026" />
        </div>
        <div className="field">
          <label>Bill Date</label>
          <input type="date" value={billDate} onChange={e => setBillDate(e.target.value)} />
        </div>
        <div className="field">
          <label>Number of Months</label>
          <input
            type="number"
            min="1"
            value={months}
            onChange={e => setMonths(e.target.value)}
            placeholder="1"
          />
          {n(months) > 1 && <span className="hint">Water motor, municipal water & extra cash x{n(months)}</span>}
        </div>
      </div>

      <div className="tenant-grid">

        <div className="tenant-card">
          <div className="tenant-card-header">
            <div className="dot dot-1" />
            <span className="tenant-card-name">{config.tenant1Name}</span>
            <span className="tenant-card-prop">Property 1</span>
          </div>
          <div className="tenant-card-body">
            <div className="reading-display">
              Last reading: <strong>{config.tenant1LastReading}</strong>
            </div>
            <div className="field">
              <label>Current Meter Reading</label>
              <input
                type="number"
                value={mCurrentReading}
                onChange={e => setMCurrentReading(e.target.value)}
                placeholder="e.g. 27387"
              />
              {mCurrentReading && (
                <span className="hint">
                  Units: {n(mCurrentReading) - config.tenant1LastReading}
                </span>
              )}
            </div>
            <div className="field">
              <label>Per Unit Rate (₹)</label>
              <input type="number" value={mPerUnit} onChange={e => setMPerUnit(e.target.value)} placeholder="e.g. 9.25" />
            </div>
            <hr className="divider" />
            <div className="field">
              <label>Water Motor Units</label>
              <input type="number" value={mWaterUnits} onChange={e => setMWaterUnits(e.target.value)} placeholder="e.g. 120" />
              <span className="hint">Your share: {(n(mWaterUnits) * n(months) * 0.5).toFixed(1)} units</span>
            </div>
            <div className="field">
              <label>Municipal Water Bill (₹)</label>
              <input type="number" value={mMunicipalWater} onChange={e => setMMunicipalWater(e.target.value)} placeholder="e.g. 160" />
            </div>
            <div className="field">
              <label>Water Tankers</label>
              <div className="tanker-batch-row">
                <input type="number" value={mTankerCount1} onChange={e => setMTankerCount1(e.target.value)} placeholder="0" style={{ width: '70px' }} />
                <span className="tanker-batch-sep">x</span>
                <input type="number" value={mTankerRate1} onChange={e => setMTankerRate1(e.target.value)} placeholder="350" style={{ width: '80px' }} />
                <span className="tanker-batch-sep">₹/tanker</span>
              </div>
              {showTankerBatch2 ? (
                <div className="tanker-batch-row">
                  <input type="number" value={mTankerCount2} onChange={e => setMTankerCount2(e.target.value)} placeholder="0" style={{ width: '70px' }} />
                  <span className="tanker-batch-sep">x</span>
                  <input type="number" value={mTankerRate2} onChange={e => setMTankerRate2(e.target.value)} placeholder="350" style={{ width: '80px' }} />
                  <span className="tanker-batch-sep">₹/tanker</span>
                  <button
                    type="button"
                    className="tanker-batch-remove"
                    onClick={() => { setShowTankerBatch2(false); setMTankerCount2('0'); }}
                  >x</button>
                </div>
              ) : (
                <button type="button" className="tanker-add-batch" onClick={() => setShowTankerBatch2(true)}>
                  + Add batch at different rate
                </button>
              )}
              <span className="hint">
                Your share: ₹{((n(mTankerCount1) * n(mTankerRate1) + (showTankerBatch2 ? n(mTankerCount2) * n(mTankerRate2) : 0)) / 2).toFixed(2)}
              </span>
            </div>
            <hr className="divider" />
            <div className="field">
              <label>Extra Cash Received (₹)</label>
              <input type="number" value={mExtraCash} onChange={e => setMExtraCash(e.target.value)} placeholder="0" />
            </div>
            <div className="field">
              <label>Previous Dues (₹)</label>
              <input type="number" value={mPrevDues} onChange={e => setMPrevDues(e.target.value)} placeholder="0" />
            </div>
          </div>
        </div>

        <div className="tenant-card">
          <div className="tenant-card-header">
            <div className="dot dot-2" />
            <span className="tenant-card-name">{config.tenant2Name}</span>
            <span className="tenant-card-prop">Property 2</span>
          </div>
          <div className="tenant-card-body">
            <div className="reading-display">
              Last reading: <strong>{config.tenant2LastReading}</strong>
            </div>
            <div className="field">
              <label>Current Sub-Meter Reading</label>
              <input
                type="number"
                value={sCurrentReading}
                onChange={e => setSCurrentReading(e.target.value)}
                placeholder="e.g. 3251"
              />
              {sCurrentReading && (
                <span className="hint">
                  Units: {n(sCurrentReading) - config.tenant2LastReading}
                </span>
              )}
            </div>
            <div className="field">
              <label>Per Unit Rate (₹)</label>
              <input type="number" value={sPerUnit} onChange={e => setSPerUnit(e.target.value)} placeholder="e.g. 10" />
            </div>
            <hr className="divider" />
            <div className="field">
              <label>Water Motor Units (total)</label>
              <input type="number" value={sWaterUnits} onChange={e => setSWaterUnits(e.target.value)} placeholder="e.g. 67" />
              <span className="hint">{config.tenant2Name} share ({config.waterRatioTenant2}): {(n(sWaterUnits) * n(months) * config.waterRatioTenant2).toFixed(2)} units</span>
            </div>
            <div className="field">
              <label>Municipal Water Bill (₹)</label>
              <input type="number" value={sMunicipalWater} onChange={e => setSMunicipalWater(e.target.value)} placeholder="e.g. 212" />
            </div>
            <hr className="divider" />
            <div className="field">
              <label>Extra Cash Received (₹)</label>
              <input type="number" value={sExtraCash} onChange={e => setSExtraCash(e.target.value)} placeholder="0" />
            </div>
            <div className="field">
              <label>Previous Dues (₹)</label>
              <input type="number" value={sPrevDues} onChange={e => setSPrevDues(e.target.value)} placeholder="0" />
            </div>
          </div>
        </div>

        <div className="tenant-card">
          <div className="tenant-card-header">
            <div className="dot dot-3" />
            <span className="tenant-card-name">{config.tenant3Name}</span>
            <span className="tenant-card-prop">Property 2</span>
          </div>
          <div className="tenant-card-body">
            <div className="field">
              <label>Total Main Meter Bill (₹)</label>
              <input type="number" value={mjMainBill} onChange={e => setMjMainBill(e.target.value)} placeholder="e.g. 6671" />
              <span className="hint">{config.tenant2Name} gross share will be deducted automatically</span>
            </div>
            <div className="field">
              <label>Municipal Water Bill (₹)</label>
              <input type="number" value={mjMunicipalWater} onChange={e => setMjMunicipalWater(e.target.value)} placeholder="e.g. 212" />
            </div>
            <hr className="divider" />
            <div className="field">
              <label>Extra Cash Received (₹)</label>
              <input type="number" value={mjExtraCash} onChange={e => setMjExtraCash(e.target.value)} placeholder="0" />
            </div>
            <div className="field">
              <label>Previous Dues (₹)</label>
              <input type="number" value={mjPrevDues} onChange={e => setMjPrevDues(e.target.value)} placeholder="0" />
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
