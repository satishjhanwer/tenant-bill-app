import { useState, useEffect } from 'react';
import type { MonthlyInputs, BillResult, StoredData } from './types';
import { calculateBills } from './calculations';
import { loadData, saveData, loadConfig, saveConfig, pickFolder, defaultStoredData } from './storage';
import { BillForm } from './components/BillForm';
import { PrintView } from './components/PrintView';
import { HistoryView } from './components/HistoryView';
import { SetupView } from './components/SetupView';
import { SettingsModal } from './components/SettingsModal';
import { AppIcon } from './components/AppIcon';
import './App.css';

type Screen = 'setup' | 'form' | 'print' | 'history';

type SettingsPayload = {
  tenant1Name: string;
  tenant2Name: string;
  tenant3Name: string;
  waterRatioTenant2: number;
  tankerRate: number;
  tenant1LastReading: number;
  tenant2LastReading: number;
};

function mergeWithDefaults(raw: StoredData): StoredData {
  return { config: { ...defaultStoredData().config, ...raw.config }, bills: raw.bills };
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('setup');
  const [storagePath, setStoragePath] = useState<string>('');
  const [storedData, setStoredData] = useState<StoredData>(defaultStoredData());
  const [currentBill, setCurrentBill] = useState<BillResult | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const config = await loadConfig();
      if (config?.storagePath) {
        setStoragePath(config.storagePath);
        const data = await loadData(config.storagePath);
        if (data) setStoredData(mergeWithDefaults(data));
        setScreen('form');
      }
      setLoading(false);
    })();
  }, []);

  const handleSetupComplete = async (folder: string) => {
    await saveConfig({ storagePath: folder });
    setStoragePath(folder);
    const data = await loadData(folder);
    const firstLaunch = !data;
    if (data) setStoredData(mergeWithDefaults(data));
    setScreen('form');
    if (firstLaunch) setShowSettings(true);
  };

  const handleGenerateBill = async (inputs: MonthlyInputs) => {
    const { config } = storedData;
    const bill = calculateBills(
      inputs,
      config.tenant1LastReading,
      config.tenant2LastReading,
      config.waterRatioTenant2,
      config.tenant1Name,
      config.tenant2Name,
      config.tenant3Name,
    );

    const updated: StoredData = {
      config: {
        ...config,
        tenant1LastReading: inputs.tenant1.currentReading,
        tenant2LastReading: inputs.tenant2.currentReading,
      },
      bills: [bill, ...storedData.bills.filter(b => b.month !== bill.month)],
    };

    await saveData(storagePath, updated);
    setStoredData(updated);
    setCurrentBill(bill);
    setScreen('print');
  };

  const handleSaveSettings = async (settings: SettingsPayload) => {
    const updated: StoredData = {
      ...storedData,
      config: { ...storedData.config, ...settings },
    };
    await saveData(storagePath, updated);
    setStoredData(updated);
    setShowSettings(false);
  };

  const handleViewBill = (bill: BillResult) => {
    setCurrentBill(bill);
    setScreen('print');
  };

  const handleDeleteBill = async () => {
    const mostRecentBill = storedData.bills[0];
    if (!mostRecentBill) return;

    const updated: StoredData = {
      config: {
        ...storedData.config,
        tenant1LastReading: mostRecentBill.tenant1.lastReading,
        tenant2LastReading: mostRecentBill.tenant2.lastReading,
      },
      bills: storedData.bills.slice(1),
    };

    await saveData(storagePath, updated);
    setStoredData(updated);

    if (currentBill?.month === mostRecentBill.month) {
      setCurrentBill(null);
      setScreen('form');
    }
  };

  const handleChangeFolder = async () => {
    const folder = await pickFolder();
    if (folder) {
      await saveConfig({ storagePath: folder });
      setStoragePath(folder);
      const data = await loadData(folder);
      if (data) setStoredData(mergeWithDefaults(data));
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="app">
      {screen !== 'setup' && (
        <nav className="navbar">
          <div className="nav-brand">
            <AppIcon size={22} />
            <span className="nav-title">Tenant Bill</span>
          </div>
          <div className="nav-links">
            <button
              className={`nav-btn ${screen === 'form' ? 'active' : ''}`}
              onClick={() => setScreen('form')}
            >
              New Bill
            </button>
            <button
              className={`nav-btn ${screen === 'history' ? 'active' : ''}`}
              onClick={() => setScreen('history')}
            >
              History
            </button>
            {currentBill && (
              <button
                className={`nav-btn ${screen === 'print' ? 'active' : ''}`}
                onClick={() => setScreen('print')}
              >
                Current Bill
              </button>
            )}
            <button className="nav-btn settings-btn" onClick={() => setShowSettings(true)}>
              ⚙
            </button>
          </div>
        </nav>
      )}

      <main className="main-content">
        {screen === 'setup' && <SetupView onComplete={handleSetupComplete} />}
        {screen === 'form' && (
          <BillForm storedData={storedData} onGenerate={handleGenerateBill} />
        )}
        {screen === 'print' && currentBill && <PrintView bill={currentBill} />}
        {screen === 'history' && (
          <HistoryView bills={storedData.bills} onView={handleViewBill} onDelete={handleDeleteBill} />
        )}
      </main>

      {showSettings && (
        <SettingsModal
          config={storedData.config}
          storagePath={storagePath}
          onSave={handleSaveSettings}
          onClose={() => setShowSettings(false)}
          onChangeFolder={handleChangeFolder}
        />
      )}
    </div>
  );
}
