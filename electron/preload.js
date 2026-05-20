const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  pickFolder: () => ipcRenderer.invoke('pick-folder'),
  readJson: (filePath) => ipcRenderer.invoke('read-json', filePath),
  writeJson: (filePath, data) => ipcRenderer.invoke('write-json', filePath, data),
  print: () => ipcRenderer.invoke('print'),
  readConfig: () => ipcRenderer.invoke('read-config'),
  writeConfig: (data) => ipcRenderer.invoke('write-config', data),
});
