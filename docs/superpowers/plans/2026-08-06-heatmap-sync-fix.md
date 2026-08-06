# 30-Day Execution Heatmap Synchronization Fix Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the 30-Day Execution Heatmap so that tasks completed on any date (past, present, or carried over) are dynamically aggregated from the `tasks` array and synced with `dayLogs`, accurately displaying completion percentage and task details without adding any sample data.

**Architecture:** 
- `FocusFormulaSection.tsx`: Calculate `tasksDone` and `totalTasks` dynamically per `dateStr` from `tasks.filter(t => t.dateStr === dateStr)`, combined with `dayLogs[dateStr]`.
- `useFocusStore.ts`: Ensure `addTask`, `completeTask`, `failTask`, `deleteTask`, and `carryOverUnfinishedTasks` update `dayLogs` for both the task's specific `dateStr` and `todayStr`.
- Selected Day Modal in `FocusFormulaSection.tsx`: Render list of tasks completed on that specific day.

**Tech Stack:** Next.js 14 App Router, Zustand, TypeScript, date-fns.

## Global Constraints

- NO sample data allowed. State remains 100% clean for user testing.
- Dynamic fallback: Heatmap must read directly from `tasks` array so no past task is ever lost from the heatmap.

---

### Task 1: Update `FocusFormulaSection.tsx` Dynamic Heatmap & Day Modal

**Files:**
- Modify: `src/components/FocusFormulaSection.tsx`

- [ ] **Step 1: Update `last30Days` mapping to query `tasks` array directly**
  For each of the 30 days, calculate:
  `dayTasks = tasks.filter(t => t.dateStr === dateStr)`
  `tasksDone = dayTasks.filter(t => t.status === 'done').length`
  `totalTasks = dayTasks.length`
  `rate = totalTasks > 0 ? tasksDone / totalTasks : 0`

- [ ] **Step 2: Update Selected Day Detail Modal**
  Show the list of tasks completed and logged on that day, including task title, priority, and logged focus time.

---

### Task 2: Synchronize Task Actions in `useFocusStore.ts`

**Files:**
- Modify: `src/store/useFocusStore.ts`

- [ ] **Step 1: Multi-date `dayLogs` synchronization in store actions**
  Ensure `completeTask`, `failTask`, `deleteTask`, and `carryOverUnfinishedTasks` recalculate `dayLogs` for `targetTask.dateStr` as well as `todayStr`.

- [ ] **Step 2: Verify zero-sample data & clean build**
  Run `npm run build` to confirm compilation cleanly passes.
