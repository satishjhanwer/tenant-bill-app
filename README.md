# Tenant Bill App

A desktop app to generate monthly utility bills for tenants. Built with Electron + React.

---

## Setup on your laptop (one time only)

1. **Install Node.js** if not already installed: <https://nodejs.org> (LTS version)

2. **Extract this folder** anywhere on your laptop

3. **Open a terminal** in this folder and run:

   ```bash
   npm install
   ```

4. **To test the app** (runs in dev mode):

   ```bash
   npm run dev
   ```

5. **To build the Windows installer (.exe)**:

   ```bash
   npm run build
   ```

   The installer will be at: `dist-electron/Tenant Bill Setup.exe`

6. **Copy the .exe to the target Windows machine** and run it once to install.

---

## First launch

- App opens and asks to choose a folder for saving data
- Select the OneDrive folder (e.g. `C:\Users\Name\OneDrive\TenantBills`)
- Click "Get Started" - done, never asked again

---

## Monthly workflow

1. Open Tenant Bill app
2. Enter meter readings, rates, water bills, and any cash adjustments
3. Click "Generate Bill"
4. Click "Print Bill" - browser print dialog opens
5. Print to paper, cut into 3, distribute

---

## Settings (⚙ button)

- Change storage folder
- Update Tenant2's water ratio (if household members change)
- Update tanker rate (if rate changes)
- Manually correct last meter readings if needed

---

## Data

All data is saved to `bills.json` in your chosen folder.
OneDrive auto-syncs this file - automatic backup.
