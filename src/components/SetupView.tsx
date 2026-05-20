import { useState } from 'react';
import { pickFolder } from '../storage';
import { AppIcon } from './AppIcon';

interface Props {
  onComplete: (folder: string) => void;
}

export function SetupView({ onComplete }: Props) {
  const [folder, setFolder] = useState('');

  const handlePick = async () => {
    const path = await pickFolder();
    if (path) setFolder(path);
  };

  return (
    <div className="setup-screen">
      <div className="setup-card">
        <div className="setup-icon"><AppIcon size={64} /></div>
        <h1 className="setup-title">Tenant Bill</h1>
        <p className="setup-subtitle">
          Choose a folder where your bill data will be saved.<br />
          Use your OneDrive folder for automatic cloud backup.<br />
          You'll configure tenant names and rates on the next step.
        </p>

        <div
          className={`setup-path ${!folder ? 'empty' : ''}`}
          title={folder}
        >
          {folder || 'No folder selected'}
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button className="btn btn-secondary" onClick={handlePick}>
            Browse Folder
          </button>
          <button
            className="btn btn-primary"
            onClick={() => onComplete(folder)}
            disabled={!folder}
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}
