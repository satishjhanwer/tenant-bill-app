import { useState } from 'react';
import type { StoredData } from '../types';

type SettingsPayload = {
  tenant1Name: string;
  tenant2Name: string;
  tenant3Name: string;
  waterRatioTenant2: number;
  tankerRate: number;
  tenant1LastReading: number;
  tenant2LastReading: number;
};

interface Props {
  config: StoredData['config'];
  storagePath: string;
  onSave: (settings: SettingsPayload) => void;
  onClose: () => void;
  onChangeFolder: () => void;
}

export function SettingsModal({ config, storagePath, onSave, onClose, onChangeFolder }: Props) {
  const [t1Name, setT1Name] = useState(config.tenant1Name);
  const [t2Name, setT2Name] = useState(config.tenant2Name);
  const [t3Name, setT3Name] = useState(config.tenant3Name);
  const [waterRatio, setWaterRatio] = useState(String(config.waterRatioTenant2));
  const [tankerRate, setTankerRate] = useState(String(config.tankerRate));
  const [t1Reading, setT1Reading] = useState(String(config.tenant1LastReading));
  const [t2Reading, setT2Reading] = useState(String(config.tenant2LastReading));

  const handleSave = () => {
    onSave({
      tenant1Name: t1Name.trim() || 'Tenant 1',
      tenant2Name: t2Name.trim() || 'Tenant 2',
      tenant3Name: t3Name.trim() || 'Tenant 3',
      waterRatioTenant2: parseFloat(waterRatio) || 0.334,
      tankerRate: parseFloat(tankerRate) || 350,
      tenant1LastReading: parseFloat(t1Reading) || 0,
      tenant2LastReading: parseFloat(t2Reading) || 0,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal settings-modal" onClick={e => e.stopPropagation()}>
        <h2>Settings</h2>

        <div className="settings-section">
          <div className="field">
            <label>Storage Folder</label>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div className="storage-path-value" style={{ flex: 1 }} title={storagePath}>
                {storagePath}
              </div>
              <button className="btn btn-secondary btn-sm" onClick={onChangeFolder}>
                Change
              </button>
            </div>
          </div>
        </div>

        <hr className="divider" />

        <div className="settings-section settings-grid-3">
          <div className="field">
            <label>Tenant 1 (Property 1)</label>
            <input value={t1Name} onChange={e => setT1Name(e.target.value)} placeholder="Tenant 1" />
          </div>
          <div className="field">
            <label>Tenant 2 (sub-meter)</label>
            <input value={t2Name} onChange={e => setT2Name(e.target.value)} placeholder="Tenant 2" />
          </div>
          <div className="field">
            <label>Tenant 3 (main meter)</label>
            <input value={t3Name} onChange={e => setT3Name(e.target.value)} placeholder="Tenant 3" />
          </div>
        </div>

        <hr className="divider" />

        <div className="settings-section settings-grid-2">
          <div className="field">
            <label>{t2Name} - Water Ratio</label>
            <input
              type="number"
              step="0.001"
              value={waterRatio}
              onChange={e => setWaterRatio(e.target.value)}
            />
            <span className="hint">
              {t3Name}'s ratio: {(1 - (parseFloat(waterRatio) || 0)).toFixed(3)}
            </span>
          </div>
          <div className="field">
            <label>Water Tanker Rate (₹)</label>
            <input
              type="number"
              value={tankerRate}
              onChange={e => setTankerRate(e.target.value)}
            />
          </div>
        </div>

        <hr className="divider" />

        <div className="settings-section settings-grid-2">
          <div className="field">
            <label>{t1Name} - Last Meter Reading</label>
            <input
              type="number"
              value={t1Reading}
              onChange={e => setT1Reading(e.target.value)}
            />
            <span className="hint">Auto-updated after each bill</span>
          </div>
          <div className="field">
            <label>{t2Name} - Last Sub-Meter Reading</label>
            <input
              type="number"
              value={t2Reading}
              onChange={e => setT2Reading(e.target.value)}
            />
            <span className="hint">Auto-updated after each bill</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSave}>Save Settings</button>
        </div>
      </div>
    </div>
  );
}
