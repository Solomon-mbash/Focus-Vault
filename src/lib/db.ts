import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Ensure data directory exists
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'focus_vault.db');
const db = new Database(dbPath);

// Enable WAL mode for high performance
db.pragma('journal_mode = WAL');

// Initialize database schema
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    priority TEXT NOT NULL,
    estTime INTEGER NOT NULL,
    actualTime INTEGER,
    category TEXT NOT NULL,
    status TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    doneAt TEXT,
    dateStr TEXT NOT NULL,
    focusScore INTEGER
  );

  CREATE TABLE IF NOT EXISTS trades (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    session TEXT NOT NULL,
    pair TEXT NOT NULL,
    direction TEXT NOT NULL,
    model TEXT NOT NULL,
    reason TEXT NOT NULL,
    followedPlan INTEGER NOT NULL,
    result TEXT NOT NULL,
    r REAL NOT NULL,
    pnl REAL NOT NULL,
    mistakeTag TEXT NOT NULL,
    screenshot TEXT
  );

  CREATE TABLE IF NOT EXISTS day_logs (
    date TEXT PRIMARY KEY,
    tasksDone INTEGER NOT NULL,
    totalTasks INTEGER NOT NULL,
    deepWorkMinutes INTEGER NOT NULL,
    scores TEXT,
    reflection TEXT
  );

  CREATE TABLE IF NOT EXISTS vision (
    id INTEGER PRIMARY KEY DEFAULT 1,
    antiVision TEXT NOT NULL,
    vision TEXT NOT NULL,
    oneYearGoal TEXT NOT NULL,
    oneMonthProject TEXT NOT NULL,
    constraints TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS avoid_checklist (
    item TEXT PRIMARY KEY,
    checked INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS later_ideas (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );
`);

export default db;
