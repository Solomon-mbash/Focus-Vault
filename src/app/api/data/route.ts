import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const tasks = db.prepare('SELECT * FROM tasks').all();
    const trades = db.prepare('SELECT * FROM trades').all().map((t: any) => ({
      ...t,
      tradeType: t.tradeType || 'Real',
      followedPlan: Boolean(t.followedPlan),
    }));

    const rawDayLogs = db.prepare('SELECT * FROM day_logs').all();
    const dayLogs: Record<string, any> = {};
    rawDayLogs.forEach((row: any) => {
      dayLogs[row.date] = {
        date: row.date,
        tasksDone: row.tasksDone,
        totalTasks: row.totalTasks,
        deepWorkMinutes: row.deepWorkMinutes,
        scores: row.scores ? JSON.parse(row.scores) : undefined,
        reflection: row.reflection ? JSON.parse(row.reflection) : undefined,
      };
    });

    const visionRow: any = db.prepare('SELECT * FROM vision WHERE id = 1').get();
    const vision = visionRow
      ? {
          antiVision: visionRow.antiVision || '',
          vision: visionRow.vision || '',
          oneYearGoal: visionRow.oneYearGoal || '',
          oneMonthProject: visionRow.oneMonthProject || '',
          constraints: visionRow.constraints || '',
        }
      : {
          antiVision: '',
          vision: '',
          oneYearGoal: '',
          oneMonthProject: '',
          constraints: '',
        };

    const avoidRows = db.prepare('SELECT * FROM avoid_checklist').all();
    const avoidChecklist: Record<string, boolean> = {};
    avoidRows.forEach((row: any) => {
      avoidChecklist[row.item] = Boolean(row.checked);
    });

    const laterIdeas = db.prepare('SELECT * FROM later_ideas ORDER BY createdAt DESC').all();

    return NextResponse.json({
      success: true,
      data: {
        tasks,
        trades,
        dayLogs,
        vision,
        avoidChecklist,
        laterIdeas,
      },
    });
  } catch (error: any) {
    console.error('Error fetching SQLite data:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
