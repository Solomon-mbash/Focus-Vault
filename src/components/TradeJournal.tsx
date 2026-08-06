'use client';

import React, { useState } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { Trade, TradingSession, TradeDirection, TradeResult } from '@/types';
import { format } from 'date-fns';
import {
  TrendingUp,
  Plus,
  AlertTriangle,
  Image as ImageIcon,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  DollarSign,
  ShieldAlert,
  Calendar,
  Layers,
  FileText,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TradeJournal: React.FC = () => {
  const { trades, addTrade, deleteTrade } = useFocusStore();

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [session, setSession] = useState<TradingSession>('London');
  const [pair, setPair] = useState('EURUSD');
  const [direction, setDirection] = useState<TradeDirection>('Long');
  const [model, setModel] = useState('Turtle Soup + FVG + BOS');
  const [reason, setReason] = useState('');
  const [followedPlan, setFollowedPlan] = useState(true);
  const [result, setResult] = useState<TradeResult>('Win');
  const [r, setR] = useState(2.5);
  const [pnl, setPnl] = useState(500);
  const [mistakeTag, setMistakeTag] = useState('None');
  const [screenshot, setScreenshot] = useState<string | undefined>(undefined);

  // Trade Details & Confluence Preview Modal State
  const [previewTrade, setPreviewTrade] = useState<Trade | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshot(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateTrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pair.trim() || !reason.trim()) return;

    addTrade({
      date,
      session,
      pair: pair.trim().toUpperCase(),
      direction,
      model: model.trim(),
      reason: reason.trim(),
      followedPlan,
      result,
      r: Number(r),
      pnl: Number(pnl),
      mistakeTag,
      screenshot,
    });

    setReason('');
    setScreenshot(undefined);
    setIsModalOpen(false);
  };

  // Leak Detector logic
  const mistakeCounts: Record<string, number> = {};
  trades.forEach((t) => {
    if (t.mistakeTag && t.mistakeTag !== 'None') {
      mistakeCounts[t.mistakeTag] = (mistakeCounts[t.mistakeTag] || 0) + 1;
    }
  });

  let topMistake = '';
  let topMistakeCount = 0;
  Object.entries(mistakeCounts).forEach(([tag, count]) => {
    if (count > topMistakeCount) {
      topMistake = tag;
      topMistakeCount = count;
    }
  });

  const sortedTrades = [...trades].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latestTrade = sortedTrades.length > 0 ? sortedTrades[0] : null;

  let currentEquity = 0;
  // Sort chronologically for equity curve
  const chronoTrades = [...trades].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const equityPoints = chronoTrades.map((t) => {
    currentEquity += t.pnl;
    return { date: t.date, equity: currentEquity };
  });

  const totalPnL = trades.reduce((acc, t) => acc + t.pnl, 0);
  const winCount = trades.filter((t) => t.result === 'Win').length;
  const winRate = trades.length > 0 ? Math.round((winCount / trades.length) * 100) : 0;

  // SVG Chart Dimensions
  const chartHeight = 160;
  const chartWidth = 600;
  const maxEquity = Math.max(...equityPoints.map((p) => p.equity), 1000);
  const minEquity = Math.min(...equityPoints.map((p) => p.equity), -500);
  const equityRange = maxEquity - minEquity || 1;

  const pointsString = equityPoints.map((pt, idx) => {
    const x = (idx / Math.max(equityPoints.length - 1, 1)) * chartWidth;
    const y = chartHeight - ((pt.equity - minEquity) / equityRange) * (chartHeight - 30) - 15;
    return `${x},${y}`;
  }).join(' ');

  const chartPath = equityPoints.length > 0 ? `M ${pointsString.replace(/,/g, ' ')}` : `M 0,${chartHeight / 2} L ${chartWidth},${chartHeight / 2}`;
  const fillPath = equityPoints.length > 0 ? `M 0,${chartHeight} L ${pointsString.replace(/,/g, ' ')} L ${chartWidth},${chartHeight} Z` : '';

  return (
    <div className="w-full space-y-6">
      {/* Header & Stats */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#111111] border border-neutral-800 p-6 rounded-xl shadow-xl">
        <div>
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest">
            INSTITUTIONAL SMC JOURNAL
          </div>
          <h2 className="text-2xl font-black font-mono tracking-tight text-white mt-0.5 flex items-center space-x-2.5">
            <TrendingUp className="w-6 h-6 text-red-500" />
            <span>TRADE EXECUTION VAULT</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className="bg-neutral-950 border border-neutral-800 px-4 py-2 rounded-lg font-mono text-xs shadow-inner">
            <div className="text-neutral-500 text-[10px]">NET PnL / WIN RATE</div>
            <div className="flex items-center space-x-2">
              <span className={`font-bold text-base ${totalPnL >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                ${totalPnL.toLocaleString()}
              </span>
              <span className="text-neutral-400 font-normal">({winRate}%)</span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-lg flex items-center space-x-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>LOG SMC TRADE</span>
          </button>
        </div>
      </div>

      {/* LATEST TRADE QUICK CONFLUENCE PREVIEW PANEL */}
      {latestTrade && (
        <div className="bg-[#111111] border border-neutral-800/90 p-5 rounded-xl space-y-3 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800/80 pb-3">
            <div className="flex items-center space-x-2 text-xs font-mono text-neutral-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-bold text-white uppercase">LATEST TRADE CONFLUENCE PREVIEW</span>
              <span className="text-neutral-600">&bull;</span>
              <span>{latestTrade.date} ({latestTrade.session})</span>
            </div>

            <button
              onClick={() => setPreviewTrade(latestTrade)}
              className="text-xs font-mono font-bold text-amber-400 hover:text-amber-300 flex items-center space-x-1 border border-amber-500/40 bg-amber-950/40 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>EXPAND FULL PREVIEW</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Pair & Result */}
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg space-y-1">
              <div className="text-[10px] text-neutral-500 uppercase">INSTRUMENT & RESULT</div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold text-white">{latestTrade.pair}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  latestTrade.direction === 'Long' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                }`}>
                  {latestTrade.direction}
                </span>
                <span className={`font-bold ${latestTrade.result === 'Win' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {latestTrade.result} ({latestTrade.pnl >= 0 ? `+$${latestTrade.pnl}` : `-$${Math.abs(latestTrade.pnl)}`})
                </span>
              </div>
            </div>

            {/* SMC Model */}
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg space-y-1">
              <div className="text-[10px] text-neutral-500 uppercase flex items-center space-x-1">
                <Layers className="w-3 h-3 text-red-400" />
                <span>SMC MODEL / ENTRY CONFLUENCE</span>
              </div>
              <div className="font-bold text-neutral-200 truncate">{latestTrade.model}</div>
            </div>

            {/* Why Taken / Reasoning snippet */}
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg space-y-1">
              <div className="text-[10px] text-neutral-500 uppercase flex items-center space-x-1">
                <FileText className="w-3 h-3 text-amber-400" />
                <span>WHY I TOOK THIS TRADE</span>
              </div>
              <div className="font-sans text-neutral-300 text-xs truncate">{latestTrade.reason}</div>
            </div>
          </div>
        </div>
      )}

      {/* Leak Detector Warning Banner */}
      {topMistake && (
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-red-950/80 border-2 border-red-600/90 p-4 rounded-xl flex items-center justify-between shadow-2xl"
        >
          <div className="flex items-center space-x-3 text-red-200 font-mono text-xs md:text-sm">
            <ShieldAlert className="w-6 h-6 text-red-400 shrink-0 animate-pulse" />
            <div>
              <span className="font-bold text-red-400 uppercase">WEEKLY TRADING LEAK DETECTED:</span>{' '}
              Primary mistake is <span className="underline font-bold text-white bg-red-900 px-2 py-0.5 rounded-md">{topMistake}</span> logged {topMistakeCount} times. Eliminate this trigger immediately!
            </div>
          </div>
        </motion.div>
      )}

      {/* Equity Curve SVG Chart */}
      <div className="bg-[#111111] border border-neutral-800 p-6 rounded-xl space-y-4 shadow-xl">
        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 border-b border-neutral-800 pb-3">
          <span className="font-bold text-white">EQUITY CURVE GROWTH ($ PnL)</span>
          <span className="text-neutral-400 font-bold">{trades.length} TOTAL TRADES LOGGED</span>
        </div>

        <div className="w-full overflow-x-auto py-2">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-40">
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={totalPnL >= 0 ? '#10b981' : '#ef4444'} stopOpacity="0.3" />
                <stop offset="100%" stopColor={totalPnL >= 0 ? '#10b981' : '#ef4444'} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line
              x1="0"
              y1={chartHeight - ((0 - minEquity) / equityRange) * (chartHeight - 30) - 15}
              x2={chartWidth}
              y2={chartHeight - ((0 - minEquity) / equityRange) * (chartHeight - 30) - 15}
              stroke="#333"
              strokeDasharray="4 4"
              strokeWidth="1"
            />

            {fillPath && <path d={fillPath} fill="url(#equityGradient)" />}

            <path
              d={chartPath}
              fill="none"
              stroke={totalPnL >= 0 ? '#10b981' : '#ef4444'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Trades Table */}
      <div className="bg-[#111111] border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-neutral-800 text-xs font-mono font-bold text-white uppercase tracking-wider">
          JOURNAL ENTRIES ({sortedTrades.length})
        </div>

        {sortedTrades.length === 0 ? (
          <div className="p-12 text-center font-mono text-neutral-500 text-xs">
            No trades logged yet. Click "LOG SMC TRADE" to record your execution.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                  <th className="p-3.5">DATE / SESSION</th>
                  <th className="p-3.5">PAIR</th>
                  <th className="p-3.5">DIR</th>
                  <th className="p-3.5">SMC MODEL</th>
                  <th className="p-3.5">PLAN?</th>
                  <th className="p-3.5">RESULT / R</th>
                  <th className="p-3.5">PnL ($)</th>
                  <th className="p-3.5">MISTAKE TAG</th>
                  <th className="p-3.5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {sortedTrades.map((t) => (
                  <tr key={t.id} className="hover:bg-neutral-950/60 transition-colors">
                    <td className="p-3.5 text-neutral-300">
                      <div className="font-semibold text-white">{t.date}</div>
                      <div className="text-[10px] text-neutral-500 uppercase">{t.session}</div>
                    </td>
                    <td className="p-3.5 font-bold text-white">{t.pair}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          t.direction === 'Long'
                            ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950/90 text-red-400 border border-red-800'
                        }`}
                      >
                        {t.direction}
                      </span>
                    </td>
                    <td className="p-3.5 text-neutral-300 font-semibold">{t.model}</td>
                    <td className="p-3.5">
                      {t.followedPlan ? (
                        <span className="text-emerald-400 font-bold flex items-center space-x-1">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>YES</span>
                        </span>
                      ) : (
                        <span className="text-red-400 font-bold flex items-center space-x-1">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>NO</span>
                        </span>
                      )}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`font-bold ${
                          t.result === 'Win'
                            ? 'text-emerald-400'
                            : t.result === 'Loss'
                            ? 'text-red-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {t.result} ({t.r >= 0 ? `+${t.r}R` : `${t.r}R`})
                      </span>
                    </td>
                    <td
                      className={`p-3.5 font-bold ${
                        t.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {t.pnl >= 0 ? `+$${t.pnl}` : `-$${Math.abs(t.pnl)}`}
                    </td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] ${
                          t.mistakeTag !== 'None'
                            ? 'bg-red-950 text-red-400 border border-red-800 font-bold'
                            : 'text-neutral-500'
                        }`}
                      >
                        {t.mistakeTag}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => setPreviewTrade(t)}
                        className="px-2 py-1 text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-md transition-colors cursor-pointer text-[10px] font-bold inline-flex items-center space-x-1"
                        title="Preview Confluence & Details"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>PREVIEW</span>
                      </button>
                      <button
                        onClick={() => deleteTrade(t.id)}
                        className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 rounded transition-colors cursor-pointer"
                        title="Delete Trade"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Trade Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111111] border border-neutral-800 rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4 my-8"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <h3 className="text-lg font-mono font-bold text-white flex items-center space-x-2">
                  <Plus className="w-5 h-5 text-red-500" />
                  <span>LOG SMC TRADE EXECUTION</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white text-sm">
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTrade} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">DATE</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">SESSION</label>
                    <select
                      value={session}
                      onChange={(e) => setSession(e.target.value as TradingSession)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="London">London</option>
                      <option value="NY">NY</option>
                      <option value="Asian">Asian</option>
                      <option value="London/NY Overlap">London/NY Overlap</option>
                      <option value="Asian/London Overlap">Asian/London Overlap</option>
                      <option value="Overnight">Overnight</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">PAIR / INSTRUMENT</label>
                    <div className="space-y-2">
                      <select
                        value={['EURUSD', 'XAUUSD', 'GBPUSD', 'AUDUSD'].includes(pair) ? pair : 'OTHER'}
                        onChange={(e) => {
                          if (e.target.value !== 'OTHER') {
                            setPair(e.target.value);
                          } else {
                            setPair('');
                          }
                        }}
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 font-mono"
                      >
                        <option value="EURUSD">EURUSD</option>
                        <option value="XAUUSD">XAUUSD (Gold)</option>
                        <option value="GBPUSD">GBPUSD</option>
                        <option value="AUDUSD">AUDUSD</option>
                        <option value="OTHER">CUSTOM PAIR / INSTRUMENT...</option>
                      </select>

                      {!['EURUSD', 'XAUUSD', 'GBPUSD', 'AUDUSD'].includes(pair) && (
                        <input
                          type="text"
                          required
                          placeholder="Type pair e.g. BTCUSD, NQ..."
                          value={pair}
                          onChange={(e) => setPair(e.target.value.toUpperCase())}
                          className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 uppercase font-mono"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">DIRECTION</label>
                    <select
                      value={direction}
                      onChange={(e) => setDirection(e.target.value as TradeDirection)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Long">Long</option>
                      <option value="Short">Short</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">SMC MODEL / ENTRY CONFLUENCE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Turtle Soup + FVG + BOS"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">WHY I TOOK THIS TRADE (THOUGHT PROCESS)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe liquidity sweep, market structure, time of day, entry trigger..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500 font-sans"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">RESULT</label>
                    <select
                      value={result}
                      onChange={(e) => setResult(e.target.value as TradeResult)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="Win">Win</option>
                      <option value="Loss">Loss</option>
                      <option value="BE">BE</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">R MULTIPLIER</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={r}
                      onChange={(e) => setR(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">PnL ($)</label>
                    <input
                      type="number"
                      required
                      value={pnl}
                      onChange={(e) => setPnl(Number(e.target.value))}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-neutral-400 mb-1">FOLLOWED PLAN?</label>
                    <select
                      value={followedPlan ? 'YES' : 'NO'}
                      onChange={(e) => setFollowedPlan(e.target.value === 'YES')}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">MISTAKE TAG</label>
                    <select
                      value={mistakeTag}
                      onChange={(e) => setMistakeTag(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    >
                      <option value="None">None (Flawless Execution)</option>
                      <option value="FOMO">FOMO</option>
                      <option value="Revenge">Revenge Trading</option>
                      <option value="Early Entry">Early Entry</option>
                      <option value="No Setup">No Setup / Impulsive</option>
                      <option value="Over-leveraging">Over-leveraging</option>
                      <option value="Chasing">Chasing Candle</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 mb-1">CHART SCREENSHOT (OPTIONAL)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-neutral-400 file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:bg-neutral-800 file:text-neutral-200 hover:file:bg-neutral-700"
                  />
                  {screenshot && (
                    <div className="mt-2 relative w-24 h-16 border border-neutral-700 rounded-md overflow-hidden">
                      <img src={screenshot} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-3 pt-3 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg"
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold uppercase tracking-wider shadow-lg"
                  >
                    SAVE TRADE
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL TRADE DETAILS & CONFLUENCE PREVIEW MODAL */}
      <AnimatePresence>
        {previewTrade && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#111111] border border-neutral-800 rounded-xl p-6 max-w-2xl w-full shadow-2xl space-y-5 my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-black font-mono text-white">{previewTrade.pair}</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                    previewTrade.direction === 'Long' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'
                  }`}>
                    {previewTrade.direction}
                  </span>
                  <span className="text-xs font-mono text-neutral-400">
                    {previewTrade.date} &bull; {previewTrade.session} Session
                  </span>
                </div>
                <button
                  onClick={() => setPreviewTrade(null)}
                  className="text-neutral-500 hover:text-white text-sm font-mono p-1"
                >
                  ✕
                </button>
              </div>

              {/* Result Summary Bar */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                  <div className="text-[10px] text-neutral-500 uppercase">RESULT / PnL</div>
                  <div className={`text-base font-extrabold ${previewTrade.result === 'Win' ? 'text-emerald-400' : previewTrade.result === 'Loss' ? 'text-red-400' : 'text-amber-400'}`}>
                    {previewTrade.result} ({previewTrade.pnl >= 0 ? `+$${previewTrade.pnl}` : `-$${Math.abs(previewTrade.pnl)}`})
                  </div>
                </div>

                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                  <div className="text-[10px] text-neutral-500 uppercase">RISK REWARD (R)</div>
                  <div className="text-base font-extrabold text-amber-400">
                    {previewTrade.r >= 0 ? `+${previewTrade.r}R` : `${previewTrade.r}R`}
                  </div>
                </div>

                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-lg">
                  <div className="text-[10px] text-neutral-500 uppercase">PLAN FOLLOWED?</div>
                  <div className="text-base font-extrabold">
                    {previewTrade.followedPlan ? (
                      <span className="text-emerald-400 flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>YES</span>
                      </span>
                    ) : (
                      <span className="text-red-400 flex items-center space-x-1">
                        <XCircle className="w-4 h-4" />
                        <span>NO ({previewTrade.mistakeTag})</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* SMC Model / Entry Confluence Box */}
              <div className="p-4 bg-neutral-950 border border-red-900/60 rounded-xl space-y-1.5 shadow-inner">
                <div className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider flex items-center space-x-2">
                  <Layers className="w-4 h-4 text-red-500" />
                  <span>SMC MODEL / ENTRY CONFLUENCE</span>
                </div>
                <div className="text-sm font-mono font-extrabold text-white">
                  {previewTrade.model}
                </div>
              </div>

              {/* Why I Took This Trade Box */}
              <div className="p-4 bg-neutral-950 border border-neutral-800 rounded-xl space-y-1.5">
                <div className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>WHY I TOOK THIS TRADE (THOUGHT PROCESS)</span>
                </div>
                <p className="text-xs font-sans text-neutral-200 leading-relaxed bg-neutral-900/80 p-3.5 rounded-lg border border-neutral-800">
                  {previewTrade.reason}
                </p>
              </div>

              {/* Chart Screenshot Section */}
              {previewTrade.screenshot ? (
                <div className="space-y-1.5">
                  <div className="text-xs font-mono font-bold text-neutral-400 uppercase flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-neutral-400" />
                    <span>ENTRY CHART SCREENSHOT</span>
                  </div>
                  <div className="border border-neutral-800 rounded-xl overflow-hidden bg-neutral-950">
                    <img
                      src={previewTrade.screenshot}
                      alt="Trade Chart"
                      className="w-full max-h-[350px] object-contain rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-neutral-950/60 border border-dashed border-neutral-800 rounded-xl text-xs font-mono text-neutral-500 text-center">
                  No chart screenshot attached for this trade.
                </div>
              )}

              <div className="flex justify-end pt-3 border-t border-neutral-800">
                <button
                  onClick={() => setPreviewTrade(null)}
                  className="px-5 py-2 bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white rounded-lg text-xs font-mono"
                >
                  CLOSE PREVIEW
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
