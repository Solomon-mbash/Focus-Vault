import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { tasks, trades, dayLogs, vision, avoidChecklist, laterIdeas } = body;

    const syncTransaction = db.transaction(() => {
      // 1. Sync tasks
      if (Array.isArray(tasks)) {
        db.prepare('DELETE FROM tasks').run();
        const insertTask = db.prepare(`
          INSERT INTO tasks (id, title, priority, estTime, actualTime, category, status, createdAt, doneAt, dateStr, focusScore)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const t of tasks) {
          insertTask.run(
            t.id,
            t.title,
            t.priority,
            t.estTime,
            t.actualTime || null,
            t.category,
            t.status,
            t.createdAt,
            t.doneAt || null,
            t.dateStr,
            t.focusScore || null
          );
        }
      }

      // 2. Sync trades
      if (Array.isArray(trades)) {
        db.prepare('DELETE FROM trades').run();
        const insertTrade = db.prepare(`
          INSERT INTO trades (id, date, session, tradeType, pair, direction, model, reason, followedPlan, result, r, pnl, mistakeTag, screenshot)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        for (const tr of trades) {
          insertTrade.run(
            tr.id,
            tr.date,
            tr.session,
            tr.tradeType || 'Real',
            tr.pair,
            tr.direction,
            tr.model,
            tr.reason,
            tr.followedPlan ? 1 : 0,
            tr.result,
            tr.r,
            tr.pnl,
            tr.mistakeTag,
            tr.screenshot || null
          );
        }
      }

      // 3. Sync dayLogs
      if (dayLogs && typeof dayLogs === 'object') {
        db.prepare('DELETE FROM day_logs').run();
        const insertDayLog = db.prepare(`
          INSERT INTO day_logs (date, tasksDone, totalTasks, deepWorkMinutes, scores, reflection)
          VALUES (?, ?, ?, ?, ?, ?)
        `);
        for (const [dateKey, log] of Object.entries<any>(dayLogs)) {
          insertDayLog.run(
            dateKey,
            log.tasksDone || 0,
            log.totalTasks || 0,
            log.deepWorkMinutes || 0,
            log.scores ? JSON.stringify(log.scores) : null,
            log.reflection ? JSON.stringify(log.reflection) : null
          );
        }
      }

      // 4. Sync vision
      if (vision && typeof vision === 'object') {
        db.prepare(`
          INSERT OR REPLACE INTO vision (id, antiVision, vision, oneYearGoal, oneMonthProject, constraints)
          VALUES (1, ?, ?, ?, ?, ?)
        `).run(
          vision.antiVision || '',
          vision.vision || '',
          vision.oneYearGoal || '',
          vision.oneMonthProject || '',
          vision.constraints || ''
        );
      }

      // 5. Sync avoidChecklist
      if (avoidChecklist && typeof avoidChecklist === 'object') {
        db.prepare('DELETE FROM avoid_checklist').run();
        const insertAvoid = db.prepare(`
          INSERT INTO avoid_checklist (item, checked) VALUES (?, ?)
        `);
        for (const [itemKey, isChecked] of Object.entries(avoidChecklist)) {
          insertAvoid.run(itemKey, isChecked ? 1 : 0);
        }
      }

      // 6. Sync laterIdeas
      if (Array.isArray(laterIdeas)) {
        db.prepare('DELETE FROM later_ideas').run();
        const insertIdea = db.prepare(`
          INSERT INTO later_ideas (id, text, createdAt) VALUES (?, ?, ?)
        `);
        for (const idea of laterIdeas) {
          insertIdea.run(idea.id, idea.text, idea.createdAt);
        }
      }
    });

    syncTransaction();

    return NextResponse.json({ success: true, message: 'SQLite database synced successfully.' });
  } catch (error: any) {
    console.error('Error syncing to SQLite:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
