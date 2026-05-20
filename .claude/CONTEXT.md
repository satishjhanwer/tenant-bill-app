# Tenant Bill App — Project Context

This file contains the full business context, calculation rules, and design decisions
for the Tenant Bill App. Read this before making any changes.

---

## What This App Does

Generates monthly utility bills for 3 tenants across 2 properties. The owner
enters meter readings and charges each month, the app calculates each tenant's
share, and prints all 3 bills on one page (cut and distribute).

Data is saved as JSON to a user-chosen folder (OneDrive for auto-backup).
The app is an Electron desktop app running on Windows 11, used by a non-technical user.

---

## Tenant Names (change here when a tenant leaves)

Tenant names are stored in `src/config/tenants.ts` as a single source of truth.
All UI labels, bill headers, and settings labels read from this file.
To rename a tenant, update only this file — nothing else needs to change.

```ts
export const TENANTS = {
  tenant1: { name: 'Tenant 1', property: 1 },
  tenant2: { name: 'Tenant 2', property: 2 },
  tenant3: { name: 'Tenant 3', property: 2 },
};
```

---

## Properties & Tenants

### Property 1

- **Tenant 1** — sole tenant, dedicated electricity meter

### Property 2

- **Tenant 2** — has a sub-meter for electricity
- **Tenant 3** — shares the main meter with Tenant 2, no sub-meter

---

## Electricity Billing

### Tenant 1 (Property 1)

- Has their own dedicated meter
- Bill = (Current Reading - Last Reading) x Per Unit Rate
- Per unit rate is entered manually each month (varies based on board bill)
- Last reading is stored by the app and auto-filled as "Last Reading" next month

### Tenant 2 (Property 2)

- Has a sub-meter
- Bill = (Current Sub-Meter Reading - Last Sub-Meter Reading) x Per Unit Rate
- Per unit rate is entered manually each month
- Last reading is stored and auto-filled next month

### Tenant 3 (Property 2)

- No sub-meter
- The owner receives one main meter bill for the entire Property 2
- Tenant 3 electricity = Main Meter Bill Amount - Tenant 2 Gross Share
- Tenant 2 Gross Share = Tenant 2 electricity + Tenant 2 water motor amount
  (this is BEFORE any extra cash deduction -- it's the raw utility cost)
- The per unit rate field exists in settings for reference but Tenant 3 electricity
  is always derived as the remainder, never calculated from units directly

---

## Water Billing -- Two Separate Components

### 1. Water Motor (Electricity for Pump)

Units consumed by the electric pump that pushes water from ground tank to rooftop tank.
Billed at the same per-unit electricity rate as that tenant's meter.

- **Tenant 1**: Split 50/50 with owner. Tenant pays = (0.5 x total units) x per unit rate
- **Tenant 2**: Split by household member ratio. Tenant pays = (waterRatioTenant2 x total units) x per unit rate
- **Tenant 3**: Gets the remaining water motor share. Tenant 3 water motor is
  NOT a separate line item -- it is implicitly included in Tenant 2 gross share deduction
  from the main meter bill. Do not add a separate water motor line for Tenant 3.

### 2. Municipal Water Bill (Flat Monthly Charge)

A fixed monthly charge from the municipality. Split 50/50 with owner for ALL tenants.
Tenant pays = flat bill amount / 2

This is NOT split by member ratio. Always 50/50 regardless of household size.

---

## Water Ratio (Tenant 2 and Tenant 3)

Tenant 2 and Tenant 3 share the water motor units based on household members.

- Tenant 2: 3 members in house
- Tenant 3: 6 members in house
- Tenant 2 ratio = 3/9 = 0.334 (stored as editable setting waterRatioTenant2, default 0.334)
- Tenant 3 implicit ratio = 1 - 0.334 = 0.666 (not stored separately, just the remainder)

The ratio is stored as a single editable field in settings (waterRatioTenant2).
If household members change, the owner updates this ratio manually in settings.

---

## Water Tanker

- Applies ONLY to Property 1 (Tenant 1). Property 2 tenants manage tanker costs themselves.
- Cost = (tanker count x tanker rate) / 2 -- owner pays half
- Tanker rate default: 350 INR per tanker (editable in settings)
- Tanker count: entered each month (can be 0)

---

## Extra Cash Received

Tenants sometimes pay more than their rent. The excess (non-rent portion) is deducted
from the utility bill.

- Currently Tenant 1 and Tenant 2 regularly send extra cash
- Tenant 3 currently does not, but the field exists for future use
- Formula: Extra Cash is subtracted (negative adjustment) from total

In the app there are two fields per tenant for extra cash:

- Number of months (count) -- default 1, but can be 2 if generating a combined 2-month bill
- Amount per month -- the extra cash figure for that month

Formula: extraCashAdj = -(count x amount)

Example: tenant sent 1000 extra, generating for 2 months -> -(2 x 1000) = -2000 deducted.

Note on months multiplier -- each field behaves differently:

- Electricity: NO multiplier. Meter reading difference already covers the full period naturally.
- Water motor units: MULTIPLY by months. It is a manually estimated monthly figure
  (based on how many times the motor runs per day), not read from a meter.
  For a 2-month bill: use waterMotorUnits x months before calculating the tenant share.
- Municipal water bill: MULTIPLY by months. It is a flat monthly charge.
- Tanker count: NO multiplier. Owner enters the actual total tankers used across the full period.
- Extra cash: MULTIPLY by months. It is a fixed monthly amount per tenant.

The app should have a single "Number of Months" input (default 1) at the top of the
bill form. Water motor units, municipal water bill, and extra cash all use this multiplier.
Electricity and tanker count do not.

---

## Previous Dues

If a tenant did not pay their full bill last month, the outstanding amount carries forward.

- Applicable to ALL 3 tenants
- Entered manually each month by the owner
- Added to (not subtracted from) the total due
- Default value: 0

---

## Exact Calculation Formulas (from Excel)

These are the verified formulas extracted directly from the Excel file:

### Tenant 1

```
units             = currentReading - lastReading
electricity       = units x perUnitRate
waterMotorShare   = 0.5 x waterMotorUnits
waterMotorAmount  = waterMotorShare x perUnitRate
municipalShare    = municipalWaterBill / 2
tankerShare       = (tankerRate x tankerCount) / 2
extraCashAdj      = -(extraCash)
total             = electricity + waterMotorAmount + municipalShare + tankerShare + extraCashAdj + previousDues
```

### Tenant 2

```
units             = currentReading - lastReading
electricity       = units x perUnitRate
waterMotorShare   = waterRatioTenant2 x waterMotorUnits
waterMotorAmount  = waterMotorShare x perUnitRate
municipalShare    = municipalWaterBill / 2
extraCashAdj      = -(extraCash)
grossShare        = electricity + waterMotorAmount   (used in Tenant 3 calculation)
total             = electricity + waterMotorAmount + municipalShare + extraCashAdj + previousDues
```

### Tenant 3

```
tenant2GrossShare = tenant2.electricity + tenant2.waterMotorAmount
electricity       = mainMeterBill - tenant2GrossShare
municipalShare    = municipalWaterBill / 2
extraCashAdj      = -(extraCash)
total             = electricity + municipalShare + extraCashAdj + previousDues
```

All amounts rounded to 2 decimal places.

---

## Data Storage

### Config (stored in Electron userData, always local)

```json
{ "storagePath": "C:\\Users\\Name\\OneDrive\\TenantBills" }
```

### bills.json (stored in user-chosen folder, e.g. OneDrive)

```json
{
  "config": {
    "tenant1LastReading": 27387,
    "tenant2LastReading": 3251,
    "waterRatioTenant2": 0.334,
    "tankerRate": 350
  },
  "bills": [
    {
      "month": "May 2026",
      "billDate": "12-05-2026",
      "tenant1": { },
      "tenant2": { },
      "tenant3": { }
    }
  ]
}
```

Bills array is newest-first. If a bill for the same month is regenerated, it replaces
the existing entry (matched by month string).

Last meter readings (tenant1LastReading, tenant2LastReading) are auto-updated in
bills.json every time a new bill is generated.

---

## App Screens

### 1. Setup Screen (first launch only)

- Shown when no storagePath is saved in config
- User picks a folder via OS folder picker dialog
- Recommended: OneDrive folder for auto-backup
- After folder is chosen, never shown again (can change via Settings)

### 2. Bill Form (main screen)

- Month label field (e.g. "May 2026") -- defaults to current month
- Bill date field (DD-MM-YYYY) -- defaults to today
- 3 tenant cards side by side (Tenant 1 | Tenant 2 | Tenant 3)
- Each card shows the last meter reading (read-only, from stored data)
- Live hint shows units consumed as user types current reading
- Generate Bill button runs calculations, saves data, goes to Print View

### 3. Print View

- Shows all 3 bills in a 3-column layout
- Print button triggers Electron print dialog (window.print() fallback)
- Print CSS: A4 landscape, dashed cut lines between columns, black text on white

### 4. History Screen

- Lists all past bills newest-first
- Shows month + total due for each tenant per row
- "View" button loads that bill into Print View

### 5. Settings Modal (gear button in navbar)

- Change storage folder
- Edit waterRatioTenant2 (shows Tenant 3 derived ratio as hint)
- Edit tankerRate
- Manually correct tenant1LastReading and tenant2LastReading
  (auto-updated normally, manual edit needed if user made a mistake)

---

## UI/UX Decisions

- Dark theme, monospace font (DM Mono), serif display font (Fraunces)
- Minimalist -- no unnecessary decoration
- Non-technical user: no jargon, clear labels, sensible defaults
- Print layout: 3 columns landscape, dashed separator lines, black/white for printing
- All currency in Indian Rupees (INR), formatted with en-IN locale (e.g. 2,482.25)
- Amounts rounded to 2 decimal places throughout

---

## Tech Stack

- Electron (v28) -- desktop shell, filesystem access, print
- React 18 + TypeScript -- UI
- Vite -- bundler
- electron-builder -- packages to Windows .exe installer
- No external UI library, no database, no internet required after install

### Key Files

```
electron/main.js            -- Electron main process, IPC handlers, filesystem ops
electron/preload.js         -- Exposes electronAPI to renderer (contextBridge)
src/config/tenants.ts       -- Tenant names (ONLY place to change names)
src/types.ts                -- All TypeScript interfaces
src/calculations.ts         -- Pure calculation functions (no side effects)
src/storage.ts              -- Read/write JSON via electronAPI
src/App.tsx                 -- Root component, screen routing, state
src/App.css                 -- All styles including print CSS
src/components/
  SetupView.tsx             -- First-launch folder picker
  BillForm.tsx              -- Monthly input form
  PrintView.tsx             -- Bill display + print
  HistoryView.tsx           -- Past bills list
  SettingsModal.tsx         -- Settings overlay
```

### IPC Channels (renderer to main)

- pick-folder -- opens OS folder picker, returns path
- read-json -- reads and parses a JSON file at given path
- write-json -- writes JSON to given path (creates dirs if needed)
- print -- triggers Electron print dialog
- read-config -- reads app config from userData
- write-config -- writes app config to userData

---

## Known Constraints and Edge Cases

1. Tenant 3 extra cash: Field exists in UI, defaults to 0. Currently unused but
   fully wired into calculations for future use. Do not remove it.

2. Previous dues for all tenants: All 3 tenants have this field. Default 0.

3. Tenant 2 gross share: Must use pre-deduction amounts (electricity + water motor)
   for Tenant 3 calculation. Extra cash and previous dues do NOT affect Tenant 3 bill.

4. Same month regeneration: If bill is generated twice for the same month string,
   the second replaces the first in the bills array. Last readings are updated both times.

5. Tanker count = 0: Tanker section should not appear on Tenant 1 printed bill
   when count is 0. The UI field still shows (owner needs to enter 0 explicitly).

6. Water motor units for Tenant 3: Not a separate input. Tenant 3 water motor cost is
   implicitly included in the main meter bill remainder. Do not add a water motor
   input for Tenant 3.

7. Per unit rate for Tenant 3: Not used in calculations (Tenant 3 electricity is always
   main bill minus Tenant 2 gross share). The rate field in settings is for reference only.

---

## Build and Run

```bash
# Dev mode (opens Electron with hot reload)
npm run dev

# Production build (creates dist-electron/Tenant Bill Setup.exe)
npm run build
```

Requires Node.js installed. Electron binary (~80MB) downloads on first npm install.
Built .exe runs fully offline on target Windows 11 machine.
