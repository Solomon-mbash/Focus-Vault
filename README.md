# FOCUS VAULT &bull; Discipline Execution Engine


FOCUS VAULT is a full-stack, single-page discipline execution prison inspired by Obsidian + Linear design aesthetics. Built for high-performance engineers, traders, and founders who prioritize brutal execution over information overload.

---

## ⚡ Key Features

### 1. Daily Execution Board (Single-Task Execution Prison)
- **Top Header**: Date display + Discipline Streak Counter ($\ge 80\%$ daily completion rate).
- **Target Tasks**: Priority levels (`P1` Red Must, `P2` Yellow Should, `P3` Gray Nice), estimated durations ($15\text{m}, 25\text{m}, 30\text{m}, 50\text{m}, 60\text{m}, 90\text{m}$), and categories (`CODE`, `TRADE`, `LIFE`).
- **Single-Task Lock-In**: Only **ONE** active task can be in "DOING" status at a time.
- **Historical View & Carry Over**: Filter targets by `TODAY`, `YESTERDAY`, or `ALL HISTORY`. 1-click **CARRY OVER UNFINISHED TASKS** from past days.

### 2. Pomodoro Execution Prison Clock
- Big bold digital timer with wall-clock timestamp synchronization (`targetEndTime`).
- **Background Sync**: Tab sleep/throttling protection. Returning to inactive tabs or switching windows instantly syncs exact remaining time.
- **Live Tab Title**: Shows real-time countdown in browser tab title `(24:45) [WORK] FOCUS VAULT`.
- **Duration Auto-Sync**: Locking into a task automatically sets the timer to that task's estimated time.
- **Skip Break Toggle**: Bypasses recovery breaks instantly to maintain continuous flow.

### 3. Institutional SMC Trade Execution Vault
- Log trades with `Pair` (`EURUSD`, `XAUUSD`, `GBPUSD`, `AUDUSD`, Custom), `Session` (`London`, `NY`, `Asian`, `London/NY Overlap`, `Asian/London Overlap`, `Overnight`), `SMC Model`, `Risk/Reward (R)`, `PnL ($)`, and `Mistake Tag`.
- **Interactive Equity Curve**: SVG gradient chart tracking total PnL growth over time.
- **Weekly Leak Detector**: Auto-detects top trading mistakes and warns user to eliminate emotional triggers.
- **Trade Details & Confluence Preview Modal**: 1-click preview modal inspecting SMC model, entry confluence, thought process ("Why I took this trade"), and attached chart screenshots.

### 4. Vision Forcefield & 1-Month Boss Fight Restraint
- **Concentric Orbit Visualization**: Pulsing Anti-Vision core vs. Ideal 5-Year Vision outer ring.
- **Single 1-Month Project Restraint**: Enforces strictly **ONE** active 1-Month Boss Fight Project at a time.
- **90-Day Elimination Checklist**: Daily reduction targets to eliminate cheap dopamine triggers.

### 5. Daily Evening Reflection & 30-Day Heatmap
- **4 Evening Questions**:
  1. 🏆 *What did I accomplish?*
  2. 💡 *What did I learn?*
  3. ⚠️ *What went wrong?*
  4. 🎯 *What is tomorrow's #1 priority?*
- **30-Day Execution Heatmap**: GitHub-style green/amber/red heat grid showing daily task completion rate, deep work hours, and task breakdown on click.

### 6. SQLite Disk Database & 1-Click JSON Backups
- Physical SQLite database persistence (`data/focus_vault.db`) via Next.js App Router API endpoints (`/api/data`, `/api/sync`, `/api/backup`).
- 1-Click **`[DATABASE]`** modal in header to download or restore complete JSON snapshots (`.json`).

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (OLED dark mode `#0A0A0A`, Obsidian typography, custom scrollbars)
- **State Management**: Zustand with `persist` middleware + SQLite sync
- **Database**: SQLite (`better-sqlite3`)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Utilities**: `date-fns`
- **PWA Ready**: Web app manifest included for installation on Desktop & Mobile.

---

## 🚀 Getting Started

### 1. Installation

```bash
git clone https://github.com/Solomon-mbash/Focus-Vault.git
cd Focus-Vault
npm install
```

### 2. Development Mode

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build

```bash
npm run build
npm start
```

---

## 📜 License

MIT License. Designed & Built for Discipline Execution.
