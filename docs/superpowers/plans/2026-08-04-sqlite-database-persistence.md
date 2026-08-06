# SQLite Database & 1-Click Backup Persistence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate a persistent SQLite database (`focus_vault.db`) via Next.js App Router API endpoints, paired with automated background sync and 1-click JSON Backup Export/Import buttons in the Navbar so user data (trades, tasks, vision forcefield, daily reflections, parked ideas) NEVER disappears.

**Architecture:** 
- Next.js App Router API route (`/api/sync` and `/api/data`) connected to a local SQLite database engine (`better-sqlite3` or Prisma SQLite).
- Frontend Zustand store (`useFocusStore`) syncs state bidirectionally: instant optimistic UI updates + background API persistence to disk.
- 1-Click Export/Import JSON Backup modal & buttons in the Navbar.

**Tech Stack:** Next.js 14 App Router, SQLite (`better-sqlite3` or `sqlite3`), Zustand, TypeScript, Tailwind CSS.

## Global Constraints

- SQLite file location: `data/focus_vault.db` in project directory.
- Instant offline availability: UI stays snappy with LocalStorage fallback.
- No data loss on browser cache clear: Database file persists independently on disk.

---

### Task 1: Setup SQLite Database Helper & Next.js API Routes

**Files:**
- Create: `src/lib/db.ts`
- Create: `src/app/api/data/route.ts`
- Create: `src/app/api/sync/route.ts`
- Create: `src/app/api/backup/route.ts`

- [ ] **Step 1: Install `better-sqlite3` package & types**
  Run: `npm install better-sqlite3 && npm install -D @types/better-sqlite3`

- [ ] **Step 2: Create SQLite Database Helper (`src/lib/db.ts`)**
  Initialize database file `data/focus_vault.db` and create tables (`tasks`, `trades`, `day_logs`, `vision`, `avoid_checklist`, `later_ideas`).

- [ ] **Step 3: Create GET/POST API Routes (`src/app/api/data/route.ts` and `src/app/api/sync/route.ts`)**
  Implement endpoints to fetch and save application state to SQLite.

---

### Task 2: Connect Zustand Store to SQLite API & Background Sync

**Files:**
- Modify: `src/store/useFocusStore.ts`

- [ ] **Step 1: Add API Sync logic to store**
  On `addTask`, `completeTask`, `addTrade`, `updateVision`, `submitDailyReflection`, `addLaterIdea`, automatically trigger background sync to `/api/sync`.

- [ ] **Step 2: Implement initial database hydration**
  On app mount, fetch `/api/data` to load data directly from the SQLite database.

---

### Task 3: Add 1-Click Backup Export & Restore in Navbar

**Files:**
- Create: `src/components/BackupModal.tsx`
- Modify: `src/components/Navbar.tsx`

- [ ] **Step 1: Build BackupModal component (`src/components/BackupModal.tsx`)**
  Add "EXPORT JSON BACKUP" (downloads `focus_vault_backup.json`) and "IMPORT JSON BACKUP" (file uploader to restore data).

- [ ] **Step 2: Add Backup button to Navbar (`src/components/Navbar.tsx`)**
  Place a clean "Database & Backup" button in the Navbar header.

- [ ] **Step 3: Test and build project**
  Run: `npm run build` to verify build succeeds cleanly.
