import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { format, subDays } from 'date-fns';
import {
  Task,
  Trade,
  DayLog,
  VisionFramework,
  LaterIdea,
  DayScore,
  DailyReflection,
  Priority,
  TaskCategory,
} from '@/types';
import { playTaskDoneSound, playTimerCompletionSound } from '@/lib/sound';

interface FocusState {
  // Navigation active tab & Theme mode
  activeTab: 'board' | 'journal' | 'later';
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  // Tasks
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status' | 'dateStr'>) => void;
  startTask: (id: string) => void;
  completeTask: (id: string, actualTime: number) => void;
  failTask: (id: string) => void;
  deleteTask: (id: string) => void;
  carryOverUnfinishedTasks: () => void;

  // Day logs & History
  dayLogs: Record<string, DayLog>; // key: YYYY-MM-DD
  submitEveningReview: (dateStr: string, scores: DayScore) => void;
  submitDailyReflection: (dateStr: string, reflection: DailyReflection) => void;

  // Trades
  trades: Trade[];
  addTrade: (trade: Omit<Trade, 'id'>) => void;
  deleteTrade: (id: string) => void;

  // Vision Forcefield
  vision: VisionFramework;
  updateVision: (updates: Partial<VisionFramework>) => void;
  avoidChecklist: Record<string, boolean>;
  toggleAvoidItem: (item: string) => void;

  // Later List
  laterIdeas: LaterIdea[];
  addLaterIdea: (text: string) => void;
  deleteLaterIdea: (id: string) => void;

  // Pomodoro & Break Management
  pomodoroDuration: number; // 15, 25, 30, 50, 60, 90
  pomodoroSecondsLeft: number;
  targetEndTime: number | null; // Wall-clock timestamp when timer expires
  isPomodoroRunning: boolean;
  timerMode: 'work' | 'break';
  activeTaskId: string | null;
  soundEnabled: boolean;

  setPomodoroDuration: (minutes: number) => void;
  togglePomodoro: () => void;
  resetPomodoro: () => void;
  skipBreak: () => void;
  tickPomodoro: () => void;
  setSoundEnabled: (enabled: boolean) => void;
  setActiveTab: (tab: 'board' | 'journal' | 'later') => void;

  // Database Persistence Methods
  fetchDatabaseData: () => Promise<void>;
  syncToDatabase: () => Promise<void>;
  importFullData: (data: any) => Promise<void>;

  // Reset all user data to clean empty state
  resetAllData: () => void;
}

const getTodayStr = () => format(new Date(), 'yyyy-MM-dd');

const emptyVision: VisionFramework = {
  antiVision: '',
  vision: '',
  oneYearGoal: '',
  oneMonthProject: '',
  constraints: '',
};

export const useFocusStore = create<FocusState>()(
  persist(
    (set, get) => ({
      activeTab: 'board',
      theme: 'dark',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),

      tasks: [],
      dayLogs: {},
      trades: [],
      vision: emptyVision,
      avoidChecklist: {},
      laterIdeas: [],

      pomodoroDuration: 25,
      pomodoroSecondsLeft: 25 * 60,
      targetEndTime: null,
      isPomodoroRunning: false,
      timerMode: 'work',
      activeTaskId: null,
      soundEnabled: true,

      setActiveTab: (tab) => set({ activeTab: tab }),

      fetchDatabaseData: async () => {
        try {
          const res = await fetch('/api/data');
          const json = await res.json();
          if (json.success && json.data) {
            const { tasks, trades, dayLogs, vision, avoidChecklist, laterIdeas } = json.data;
            set((state) => ({
              tasks: tasks || state.tasks,
              trades: trades || state.trades,
              dayLogs: dayLogs || state.dayLogs,
              vision: vision || state.vision,
              avoidChecklist: avoidChecklist || state.avoidChecklist,
              laterIdeas: laterIdeas || state.laterIdeas,
            }));
          }
        } catch (e) {
          console.warn('SQLite database fetch fallback to LocalStorage:', e);
        }
      },

      syncToDatabase: async () => {
        try {
          const { tasks, trades, dayLogs, vision, avoidChecklist, laterIdeas } = get();
          await fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              tasks,
              trades,
              dayLogs,
              vision,
              avoidChecklist,
              laterIdeas,
            }),
          });
        } catch (e) {
          console.warn('SQLite background sync fallback to LocalStorage:', e);
        }
      },

      importFullData: async (importedData: any) => {
        const { tasks, trades, dayLogs, vision, avoidChecklist, laterIdeas } = importedData;
        set({
          tasks: tasks || [],
          trades: trades || [],
          dayLogs: dayLogs || {},
          vision: vision || emptyVision,
          avoidChecklist: avoidChecklist || {},
          laterIdeas: laterIdeas || [],
        });
        await get().syncToDatabase();
      },

      addTask: (newTaskData) => {
        const todayStr = getTodayStr();
        const newTask: Task = {
          ...newTaskData,
          id: `task-${Date.now()}`,
          status: 'todo',
          createdAt: new Date().toISOString(),
          dateStr: todayStr,
        };

        set((state) => {
          const updatedTasks = [...state.tasks, newTask];
          const currentLog = state.dayLogs[todayStr] || {
            date: todayStr,
            tasksDone: 0,
            totalTasks: 0,
            deepWorkMinutes: 0,
          };

          const todayTasks = updatedTasks.filter((t) => t.dateStr === todayStr);

          return {
            tasks: updatedTasks,
            dayLogs: {
              ...state.dayLogs,
              [todayStr]: {
                ...currentLog,
                totalTasks: todayTasks.length,
                tasksDone: todayTasks.filter((t) => t.status === 'done').length,
              },
            },
          };
        });
        get().syncToDatabase();
      },

      startTask: (id) => {
        set((state) => {
          const targetTask = state.tasks.find((t) => t.id === id);
          if (!targetTask) return state;

          const updatedTasks = state.tasks.map((t) => {
            if (t.id === id) {
              return { ...t, status: 'doing' as const };
            }
            if (t.status === 'doing') {
              return { ...t, status: 'todo' as const };
            }
            return t;
          });

          const taskDurationMinutes = targetTask.estTime || state.pomodoroDuration;
          const durationSeconds = taskDurationMinutes * 60;

          return {
            tasks: updatedTasks,
            activeTaskId: id,
            pomodoroDuration: taskDurationMinutes,
            pomodoroSecondsLeft: durationSeconds,
            targetEndTime: Date.now() + durationSeconds * 1000,
            isPomodoroRunning: true,
            timerMode: 'work',
          };
        });
        get().syncToDatabase();
      },

      completeTask: (id, actualTimeMinutes) => {
        const todayStr = getTodayStr();
        if (get().soundEnabled) {
          playTaskDoneSound();
        }

        set((state) => {
          const targetTask = state.tasks.find((t) => t.id === id);
          if (!targetTask) return state;

          const taskDateStr = targetTask.dateStr || todayStr;
          const multiplier = targetTask.priority === 'P1' ? 1.5 : targetTask.priority === 'P2' ? 1.2 : 1.0;
          const focusScore = Math.round(actualTimeMinutes * multiplier);

          const updatedTasks = state.tasks.map((t) => {
            if (t.id === id) {
              return {
                ...t,
                status: 'done' as const,
                actualTime: actualTimeMinutes,
                doneAt: new Date().toISOString(),
                focusScore,
              };
            }
            return t;
          });

          const isCurrentActive = state.activeTaskId === id;

          // Sync task's creation date log
          const taskDateTasks = updatedTasks.filter((t) => t.dateStr === taskDateStr);
          const taskDateDoneCount = taskDateTasks.filter((t) => t.status === 'done').length;
          const currentTaskDateLog = state.dayLogs[taskDateStr] || {
            date: taskDateStr,
            tasksDone: 0,
            totalTasks: taskDateTasks.length,
            deepWorkMinutes: 0,
          };

          // Sync today's log
          const todayTasks = updatedTasks.filter((t) => t.dateStr === todayStr);
          const todayDoneCount = todayTasks.filter((t) => t.status === 'done').length;
          const currentTodayLog = state.dayLogs[todayStr] || {
            date: todayStr,
            tasksDone: 0,
            totalTasks: todayTasks.length,
            deepWorkMinutes: 0,
          };

          return {
            tasks: updatedTasks,
            activeTaskId: isCurrentActive ? null : state.activeTaskId,
            isPomodoroRunning: isCurrentActive ? false : state.isPomodoroRunning,
            targetEndTime: isCurrentActive ? null : state.targetEndTime,
            dayLogs: {
              ...state.dayLogs,
              [taskDateStr]: {
                ...currentTaskDateLog,
                tasksDone: taskDateDoneCount,
                totalTasks: taskDateTasks.length,
                deepWorkMinutes: currentTaskDateLog.deepWorkMinutes + actualTimeMinutes,
              },
              [todayStr]: {
                ...currentTodayLog,
                tasksDone: todayDoneCount,
                totalTasks: todayTasks.length,
                deepWorkMinutes: currentTodayLog.deepWorkMinutes + actualTimeMinutes,
              },
            },
          };
        });
        get().syncToDatabase();
      },

      failTask: (id) => {
        set((state) => {
          const updatedTasks = state.tasks.map((t) =>
            t.id === id ? { ...t, status: 'failed' as const } : t
          );
          const isCurrentActive = state.activeTaskId === id;
          return {
            tasks: updatedTasks,
            activeTaskId: isCurrentActive ? null : state.activeTaskId,
            isPomodoroRunning: isCurrentActive ? false : state.isPomodoroRunning,
            targetEndTime: isCurrentActive ? null : state.targetEndTime,
          };
        });
        get().syncToDatabase();
      },

      deleteTask: (id) => {
        const todayStr = getTodayStr();
        set((state) => {
          const targetTask = state.tasks.find((t) => t.id === id);
          const taskDateStr = targetTask ? targetTask.dateStr : todayStr;
          const updatedTasks = state.tasks.filter((t) => t.id !== id);

          const taskDateTasks = updatedTasks.filter((t) => t.dateStr === taskDateStr);
          const currentTaskDateLog = state.dayLogs[taskDateStr];

          return {
            tasks: updatedTasks,
            activeTaskId: state.activeTaskId === id ? null : state.activeTaskId,
            isPomodoroRunning: state.activeTaskId === id ? false : state.isPomodoroRunning,
            targetEndTime: state.activeTaskId === id ? null : state.targetEndTime,
            dayLogs: currentTaskDateLog
              ? {
                  ...state.dayLogs,
                  [taskDateStr]: {
                    ...currentTaskDateLog,
                    totalTasks: taskDateTasks.length,
                    tasksDone: taskDateTasks.filter((t) => t.status === 'done').length,
                  },
                }
              : state.dayLogs,
          };
        });
        get().syncToDatabase();
      },

      carryOverUnfinishedTasks: () => {
        const todayStr = getTodayStr();
        set((state) => {
          const updatedTasks = state.tasks.map((t) => {
            if (t.status !== 'done' && t.dateStr !== todayStr) {
              return { ...t, dateStr: todayStr };
            }
            return t;
          });
          const todayTasks = updatedTasks.filter((t) => t.dateStr === todayStr);
          const currentLog = state.dayLogs[todayStr] || {
            date: todayStr,
            tasksDone: 0,
            totalTasks: 0,
            deepWorkMinutes: 0,
          };
          return {
            tasks: updatedTasks,
            dayLogs: {
              ...state.dayLogs,
              [todayStr]: {
                ...currentLog,
                totalTasks: todayTasks.length,
                tasksDone: todayTasks.filter((t) => t.status === 'done').length,
              },
            },
          };
        });
        get().syncToDatabase();
      },

      submitEveningReview: (dateStr, scores) => {
        set((state) => {
          const currentLog = state.dayLogs[dateStr] || {
            date: dateStr,
            tasksDone: 0,
            totalTasks: 0,
            deepWorkMinutes: 0,
          };

          return {
            dayLogs: {
              ...state.dayLogs,
              [dateStr]: {
                ...currentLog,
                scores,
              },
            },
          };
        });
        get().syncToDatabase();
      },

      submitDailyReflection: (dateStr, reflection) => {
        set((state) => {
          const currentLog = state.dayLogs[dateStr] || {
            date: dateStr,
            tasksDone: 0,
            totalTasks: 0,
            deepWorkMinutes: 0,
          };

          return {
            dayLogs: {
              ...state.dayLogs,
              [dateStr]: {
                ...currentLog,
                reflection,
              },
            },
          };
        });
        get().syncToDatabase();
      },

      addTrade: (newTradeData) => {
        const newTrade: Trade = {
          ...newTradeData,
          id: `trade-${Date.now()}`,
        };
        set((state) => ({ trades: [newTrade, ...state.trades] }));
        get().syncToDatabase();
      },

      deleteTrade: (id) => {
        set((state) => ({ trades: state.trades.filter((t) => t.id !== id) }));
        get().syncToDatabase();
      },

      updateVision: (updates) => {
        set((state) => {
          if (
            updates.oneMonthProject !== undefined &&
            updates.oneMonthProject.trim() !== '' &&
            state.vision.oneMonthProject.trim() !== '' &&
            updates.oneMonthProject.trim() !== state.vision.oneMonthProject.trim()
          ) {
            alert(
              '⚠️ STRICT RULE: Only ONE 1-Month Boss Fight Project is allowed! Finish or clear your current project before starting another.'
            );
            return state;
          }

          return {
            vision: {
              ...state.vision,
              ...updates,
            },
          };
        });
        get().syncToDatabase();
      },

      toggleAvoidItem: (item) => {
        set((state) => ({
          avoidChecklist: {
            ...state.avoidChecklist,
            [item]: !state.avoidChecklist[item],
          },
        }));
        get().syncToDatabase();
      },

      addLaterIdea: (text) => {
        const newIdea: LaterIdea = {
          id: `idea-${Date.now()}`,
          text,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ laterIdeas: [newIdea, ...state.laterIdeas] }));
        get().syncToDatabase();
      },

      deleteLaterIdea: (id) => {
        set((state) => ({ laterIdeas: state.laterIdeas.filter((i) => i.id !== id) }));
        get().syncToDatabase();
      },

      setPomodoroDuration: (minutes) => {
        set(() => ({
          pomodoroDuration: minutes,
          pomodoroSecondsLeft: minutes * 60,
          targetEndTime: null,
          isPomodoroRunning: false,
          timerMode: 'work',
        }));
      },

      togglePomodoro: () => {
        set((state) => {
          if (state.isPomodoroRunning) {
            const remaining = state.targetEndTime
              ? Math.max(0, Math.ceil((state.targetEndTime - Date.now()) / 1000))
              : state.pomodoroSecondsLeft;
            return {
              isPomodoroRunning: false,
              pomodoroSecondsLeft: remaining,
              targetEndTime: null,
            };
          } else {
            const defaultSeconds = state.timerMode === 'break' ? 5 * 60 : state.pomodoroDuration * 60;
            const secondsToRun = state.pomodoroSecondsLeft > 0 ? state.pomodoroSecondsLeft : defaultSeconds;
            return {
              isPomodoroRunning: true,
              pomodoroSecondsLeft: secondsToRun,
              targetEndTime: Date.now() + secondsToRun * 1000,
            };
          }
        });
      },

      resetPomodoro: () => {
        set((state) => {
          const seconds = state.timerMode === 'break' ? 5 * 60 : state.pomodoroDuration * 60;
          return {
            pomodoroSecondsLeft: seconds,
            targetEndTime: null,
            isPomodoroRunning: false,
          };
        });
      },

      skipBreak: () => {
        set((state) => {
          const workSeconds = state.pomodoroDuration * 60;
          return {
            timerMode: 'work',
            pomodoroSecondsLeft: workSeconds,
            targetEndTime: state.isPomodoroRunning ? Date.now() + workSeconds * 1000 : null,
          };
        });
      },

      tickPomodoro: () => {
        const { isPomodoroRunning, targetEndTime, soundEnabled, pomodoroSecondsLeft, timerMode, pomodoroDuration } = get();
        if (!isPomodoroRunning) return;

        const now = Date.now();
        const secondsRemaining = targetEndTime
          ? Math.max(0, Math.ceil((targetEndTime - now) / 1000))
          : pomodoroSecondsLeft - 1;

        if (secondsRemaining <= 0) {
          if (soundEnabled) {
            playTimerCompletionSound();
          }
          if (timerMode === 'work') {
            set({
              timerMode: 'break',
              pomodoroSecondsLeft: 5 * 60,
              targetEndTime: Date.now() + 5 * 60 * 1000,
              isPomodoroRunning: true,
            });
          } else {
            const workSeconds = pomodoroDuration * 60;
            set({
              timerMode: 'work',
              pomodoroSecondsLeft: workSeconds,
              targetEndTime: null,
              isPomodoroRunning: false,
            });
          }
        } else {
          set({ pomodoroSecondsLeft: secondsRemaining });
        }
      },

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      resetAllData: () => {
        set({
          tasks: [],
          dayLogs: {},
          trades: [],
          vision: emptyVision,
          avoidChecklist: {},
          laterIdeas: [],
          pomodoroSecondsLeft: 25 * 60,
          targetEndTime: null,
          isPomodoroRunning: false,
          timerMode: 'work',
          activeTaskId: null,
        });
        get().syncToDatabase();
      },
    }),
    {
      name: 'focus-vault-permanent-user-storage',
    }
  )
);

// Helper selector to calculate current streak
export function useStreakCount(dayLogs: Record<string, DayLog>) {
  let streak = 0;
  const today = new Date();

  for (let i = 0; i < 365; i++) {
    const dateStr = format(subDays(today, i), 'yyyy-MM-dd');
    const log = dayLogs[dateStr];
    if (!log || log.totalTasks === 0) {
      if (i === 0) continue;
      break;
    }
    const rate = log.tasksDone / log.totalTasks;
    if (rate >= 0.8) {
      streak++;
    } else {
      if (i === 0) continue;
      break;
    }
  }

  return streak;
}
