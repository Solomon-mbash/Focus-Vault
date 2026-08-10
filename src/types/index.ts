export type Priority = 'P1' | 'P2' | 'P3';
export type TaskCategory = 'CODE' | 'TRADE' | 'LIFE';
export type TaskStatus = 'todo' | 'doing' | 'done' | 'failed';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  estTime: number; // 15, 30, 60, 90 mins
  actualTime?: number; // mins logged
  category: TaskCategory;
  status: TaskStatus;
  createdAt: string;
  doneAt?: string;
  dateStr: string; // YYYY-MM-DD
  focusScore?: number;
}

export type TradingSession =
  | 'London'
  | 'NY'
  | 'Asian'
  | 'London/NY Overlap'
  | 'Asian/London Overlap'
  | 'Overnight';
export type TradeDirection = 'Long' | 'Short';
export type TradeResult = 'Win' | 'Loss' | 'BE';
export type TradeType = 'Real' | 'Backtest';

export interface Trade {
  id: string;
  date: string; // YYYY-MM-DD
  session: TradingSession;
  tradeType?: TradeType; // 'Real' | 'Backtest'
  pair: string;
  direction: TradeDirection;
  model: string;
  reason: string;
  followedPlan: boolean;
  result: TradeResult;
  r: number;
  pnl: number;
  mistakeTag: string;
  screenshot?: string;
}

export interface DayScore {
  codeShipped: number; // 0-10
  smcPlanFollowed: number; // 0-10
  noScrollBefore6pm: number; // 0-10
}

export interface DailyReflection {
  accomplished: string;
  learned: string;
  wentWrong: string;
  tomorrowPriority: string;
}

export interface DayLog {
  date: string; // YYYY-MM-DD
  tasksDone: number;
  totalTasks: number;
  deepWorkMinutes: number;
  scores?: DayScore;
  reflection?: DailyReflection;
}

export interface VisionFramework {
  antiVision: string;
  vision: string;
  oneYearGoal: string;
  oneMonthProject: string; // Boss fight - ONLY ONE allowed
  constraints: string;
}

export interface LaterIdea {
  id: string;
  text: string;
  createdAt: string;
}

export interface PomodoroSettings {
  defaultDuration: number; // 15, 25, 50
  soundEnabled: boolean;
}
