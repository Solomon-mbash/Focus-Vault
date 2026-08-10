'use client';

import React, { useState } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { Trade, TradingSession, TradeDirection, TradeResult, TradeType } from '@/types';
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
  FlaskConical,
  Activity,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ExternalLink,
  RotateCcw,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TradeJournal: React.FC = () => {
  const { trades, addTrade, deleteTrade, theme } = useFocusStore();
  const isLight = theme === 'light';

  // Filter View mode: 'ALL' | 'Real' | 'Backtest'
  const [tradeTypeFilter, setTradeTypeFilter] = useState<'ALL' | 'Real' | 'Backtest'>('ALL');

  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [session, setSession] = useState<TradingSession>('London');
  const [tradeType, setTradeType] = useState<TradeType>('Real');
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

  // Fullscreen High-Resolution Lightbox & Zoom State
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);

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
      tradeType,
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

  // Filter trades based on selected filter mode
  const filteredTrades = trades.filter((t) => {
    const type = t.tradeType || 'Real';
    if (tradeTypeFilter === 'Real') return type === 'Real';
    if (tradeTypeFilter === 'Backtest') return type === 'Backtest';
    return true; // 'ALL'
  });

  // Leak Detector logic
  const mistakeCounts: Record<string, number> = {};
  filteredTrades.forEach((t) => {
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

  const sortedTrades = [...filteredTrades].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latestTrade = sortedTrades.length > 0 ? sortedTrades[0] : null;

  let currentEquity = 0;
  // Sort chronologically for equity curve
  const chronoTrades = [...filteredTrades].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const equityPoints = chronoTrades.map((t) => {
    currentEquity += t.pnl;
    return { date: t.date, equity: currentEquity };
  });

  const totalPnL = filteredTrades.reduce((acc, t) => acc + t.pnl, 0);
  const winCount = filteredTrades.filter((t) => t.result === 'Win').length;
  const winRate = filteredTrades.length > 0 ? Math.round((winCount / filteredTrades.length) * 100) : 0;

  const realCount = trades.filter((t) => (t.tradeType || 'Real') === 'Real').length;
  const backtestCount = trades.filter((t) => t.tradeType === 'Backtest').length;

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

  const handleOpenLightbox = (imgSrc: string) => {
    setLightboxImage(imgSrc);
    setZoomScale(1);
  };

  const handleZoomIn = () => {
    setZoomScale((prev) => Math.min(prev + 0.5, 3.5));
  };

  const handleZoomOut = () => {
    setZoomScale((prev) => Math.max(prev - 0.5, 0.75));
  };

  const handleOpenNewTab = (imgSrc: string) => {
    const win = window.open();
    if (win) {
      win.document.write(`
        <html>
          <head><title>Full Resolution Chart Screenshot</title></head>
          <body style="margin:0; background:#0a0a0a; display:flex; justify-content:center; align-items:center; min-height:100vh;">
            <img src="${imgSrc}" style="max-width:100%; height:auto;" />
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header & Stats */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 p-6 rounded-xl border transition-colors ${
          isLight ? 'bg-white border-slate-200 shadow-xl shadow-slate-200/50 text-slate-800' : 'bg-[#111111] border-neutral-800 shadow-xl text-white'
        }`}
      >
        <div>
          <div className={`text-xs font-mono uppercase tracking-widest ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
            INSTITUTIONAL SMC JOURNAL
          </div>
          <h2 className="text-2xl font-black font-mono tracking-tight mt-0.5 flex items-center space-x-2.5">
            <TrendingUp className={`w-6 h-6 ${isLight ? 'text-[#4946FF]' : 'text-red-500'}`} />
            <span>TRADE EXECUTION VAULT</span>
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <div className={`px-4 py-2 rounded-lg font-mono text-xs border shadow-inner ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'}`}>
            <div className={`text-[10px] ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>NET PnL / WIN RATE</div>
            <div className="flex items-center space-x-2">
              <span className={`font-bold text-base ${totalPnL >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                ${totalPnL.toLocaleString()}
              </span>
              <span className={`font-normal ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>({winRate}%)</span>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`px-4 py-2.5 text-white text-xs font-bold font-mono uppercase tracking-wider rounded-lg flex items-center space-x-2 transition-all cursor-pointer ${
              isLight
                ? 'bg-[#4946FF] hover:bg-[#3B38EC] shadow-md shadow-[#4946FF]/30'
                : 'bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>LOG SMC TRADE</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS: ALL TRADES / REAL TRADES / BACKTESTING */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#111111] border-neutral-800/80'
        }`}
      >
        <div className="flex items-center space-x-2 font-mono text-xs">
          <Activity className={`w-4 h-4 ${isLight ? 'text-[#4946FF]' : 'text-emerald-400'}`} />
          <span className={`font-bold uppercase ${isLight ? 'text-slate-700' : 'text-neutral-400'}`}>MODE FILTER:</span>
        </div>

        <div
          className={`flex items-center space-x-1.5 p-1 rounded-lg border ${
            isLight ? 'bg-slate-100 border-slate-200' : 'bg-neutral-950 border-neutral-800'
          }`}
        >
          <button
            onClick={() => setTradeTypeFilter('ALL')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-md transition-all cursor-pointer ${
              tradeTypeFilter === 'ALL'
                ? isLight
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'bg-neutral-800 text-white shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ALL TRADES ({trades.length})
          </button>

          <button
            onClick={() => setTradeTypeFilter('Real')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
              tradeTypeFilter === 'Real'
                ? isLight
                  ? 'bg-[#4946FF] text-white shadow-md'
                  : 'bg-emerald-600 text-white shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>REAL / LIVE ({realCount})</span>
          </button>

          <button
            onClick={() => setTradeTypeFilter('Backtest')}
            className={`px-3.5 py-1.5 text-xs font-mono font-bold rounded-md transition-all cursor-pointer flex items-center space-x-1 ${
              tradeTypeFilter === 'Backtest'
                ? 'bg-purple-600 text-white shadow-md'
                : isLight
                ? 'text-slate-600 hover:text-slate-900'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>BACKTESTING ({backtestCount})</span>
          </button>
        </div>
      </div>

      {/* LATEST TRADE QUICK CONFLUENCE PREVIEW PANEL */}
      {latestTrade && (
        <div
          className={`p-5 rounded-xl border space-y-3 shadow-xl transition-colors ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#111111] border-neutral-800/90 text-white'
          }`}
        >
          <div className={`flex flex-wrap items-center justify-between gap-2 border-b pb-3 ${isLight ? 'border-slate-200' : 'border-neutral-800/80'}`}>
            <div className={`flex items-center space-x-2 text-xs font-mono ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>
              <Sparkles className={`w-4 h-4 ${isLight ? 'text-[#4946FF]' : 'text-amber-400'}`} />
              <span className="font-bold uppercase">LATEST TRADE CONFLUENCE PREVIEW</span>
              <span>&bull;</span>
              <span>{latestTrade.date} ({latestTrade.session})</span>
            </div>

            <button
              onClick={() => setPreviewTrade(latestTrade)}
              className={`text-xs font-mono font-bold flex items-center space-x-1 border px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                isLight
                  ? 'bg-[#4946FF]/10 text-[#4946FF] border-[#4946FF]/30 hover:bg-[#4946FF]/20'
                  : 'bg-amber-950/40 text-amber-400 border-amber-500/40 hover:text-amber-300'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>EXPAND FULL PREVIEW</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
            {/* Pair & Result */}
            <div className={`p-3 rounded-lg border space-y-1 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'}`}>
              <div className={`text-[10px] uppercase flex items-center justify-between ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
                <span>INSTRUMENT & RESULT</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                  (latestTrade.tradeType || 'Real') === 'Backtest'
                    ? 'bg-purple-500/10 text-purple-600 border border-purple-500/30'
                    : 'bg-[#4946FF]/10 text-[#4946FF] border border-[#4946FF]/30'
                }`}>
                  {latestTrade.tradeType || 'Real'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-base font-extrabold">{latestTrade.pair}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  latestTrade.direction === 'Long'
                    ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                    : 'bg-red-500/10 text-red-600 border border-red-500/30'
                }`}>
                  {latestTrade.direction}
                </span>
                <span className={`font-bold ${latestTrade.result === 'Win' ? 'text-emerald-600' : 'text-red-500'}`}>
                  {latestTrade.result} ({latestTrade.pnl >= 0 ? `+$${latestTrade.pnl}` : `-$${Math.abs(latestTrade.pnl)}`})
                </span>
              </div>
            </div>

            {/* SMC Model */}
            <div className={`p-3 rounded-lg border space-y-1 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'}`}>
              <div className={`text-[10px] uppercase flex items-center space-x-1 ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
                <Layers className={`w-3 h-3 ${isLight ? 'text-[#4946FF]' : 'text-red-400'}`} />
                <span>SMC MODEL / ENTRY CONFLUENCE</span>
              </div>
              <div className="font-bold truncate">{latestTrade.model}</div>
            </div>

            {/* Why Taken / Reasoning snippet */}
            <div className={`p-3 rounded-lg border space-y-1 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'}`}>
              <div className={`text-[10px] uppercase flex items-center space-x-1 ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
                <FileText className="w-3 h-3 text-amber-500" />
                <span>WHY I TOOK THIS TRADE</span>
              </div>
              <div className={`font-sans text-xs truncate ${isLight ? 'text-slate-700' : 'text-neutral-300'}`}>{latestTrade.reason}</div>
            </div>
          </div>
        </div>
      )}

      {/* Leak Detector Warning Banner */}
      {topMistake && (
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-red-500/10 border-2 border-red-500/80 p-4 rounded-xl flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center space-x-3 text-red-600 font-mono text-xs md:text-sm">
            <ShieldAlert className="w-6 h-6 text-red-600 shrink-0 animate-pulse" />
            <div>
              <span className="font-bold uppercase">WEEKLY TRADING LEAK DETECTED:</span>{' '}
              Primary mistake is <span className="underline font-bold text-white bg-red-600 px-2 py-0.5 rounded-md">{topMistake}</span> logged {topMistakeCount} times. Eliminate this trigger immediately!
            </div>
          </div>
        </motion.div>
      )}

      {/* Equity Curve SVG Chart */}
      <div
        className={`p-6 rounded-xl border space-y-4 shadow-xl transition-colors ${
          isLight ? 'bg-white border-slate-200 shadow-slate-200/50 text-slate-800' : 'bg-[#111111] border-neutral-800 text-white'
        }`}
      >
        <div className={`flex items-center justify-between text-xs font-mono border-b pb-3 ${isLight ? 'border-slate-200 text-slate-500' : 'border-neutral-800 text-neutral-400'}`}>
          <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-white'}`}>
            EQUITY CURVE GROWTH ({tradeTypeFilter === 'ALL' ? 'ALL TRADES' : tradeTypeFilter === 'Real' ? 'REAL TRADES' : 'BACKTESTING'})
          </span>
          <span className="font-bold">{sortedTrades.length} TRADES IN VIEW</span>
        </div>

        <div className="w-full overflow-x-auto py-2">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-40">
            <defs>
              <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={totalPnL >= 0 ? (isLight ? '#4946FF' : '#10b981') : '#ef4444'} stopOpacity="0.3" />
                <stop offset="100%" stopColor={totalPnL >= 0 ? (isLight ? '#4946FF' : '#10b981') : '#ef4444'} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line
              x1="0"
              y1={chartHeight - ((0 - minEquity) / equityRange) * (chartHeight - 30) - 15}
              x2={chartWidth}
              y2={chartHeight - ((0 - minEquity) / equityRange) * (chartHeight - 30) - 15}
              stroke={isLight ? '#CBD5E1' : '#333'}
              strokeDasharray="4 4"
              strokeWidth="1"
            />

            {fillPath && <path d={fillPath} fill="url(#equityGradient)" />}

            <path
              d={chartPath}
              fill="none"
              stroke={totalPnL >= 0 ? (isLight ? '#4946FF' : '#10b981') : '#ef4444'}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Trades Table */}
      <div
        className={`rounded-xl border overflow-hidden shadow-xl transition-colors ${
          isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#111111] border-neutral-800 text-white'
        }`}
      >
        <div className={`p-4 border-b text-xs font-mono font-bold uppercase tracking-wider flex items-center justify-between ${isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-neutral-950 border-neutral-800 text-white'}`}>
          <span>JOURNAL ENTRIES ({sortedTrades.length})</span>
          <span className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
            SHOWING: {tradeTypeFilter}
          </span>
        </div>

        {sortedTrades.length === 0 ? (
          <div className={`p-12 text-center font-mono text-xs ${isLight ? 'text-slate-400' : 'text-neutral-500'}`}>
            No trades logged for this filter. Click "LOG SMC TRADE" to record your execution.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className={`border-b ${isLight ? 'bg-slate-100 border-slate-200 text-slate-600' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}>
                  <th className="p-3.5">MODE</th>
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
              <tbody className={`divide-y ${isLight ? 'divide-slate-200' : 'divide-neutral-800/60'}`}>
                {sortedTrades.map((t) => {
                  const mode = t.tradeType || 'Real';
                  const isBacktest = mode === 'Backtest';

                  return (
                    <tr key={t.id} className={`transition-colors ${isLight ? 'hover:bg-slate-50' : 'hover:bg-neutral-950/60'}`}>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isBacktest
                              ? 'bg-purple-500/10 text-purple-600 border border-purple-500/30'
                              : isLight
                              ? 'bg-[#4946FF]/10 text-[#4946FF] border border-[#4946FF]/30'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {mode}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold">{t.date}</div>
                        <div className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>{t.session}</div>
                      </td>
                      <td className="p-3.5 font-bold">{t.pair}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            t.direction === 'Long'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                              : 'bg-red-500/10 text-red-600 border border-red-500/30'
                          }`}
                        >
                          {t.direction}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold">{t.model}</td>
                      <td className="p-3.5">
                        {t.followedPlan ? (
                          <span className="text-emerald-600 font-bold flex items-center space-x-1">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>YES</span>
                          </span>
                        ) : (
                          <span className="text-red-500 font-bold flex items-center space-x-1">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>NO</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`font-bold ${
                            t.result === 'Win'
                              ? 'text-emerald-600'
                              : t.result === 'Loss'
                              ? 'text-red-500'
                              : 'text-amber-500'
                          }`}
                        >
                          {t.result} ({t.r >= 0 ? `+${t.r}R` : `${t.r}R`})
                        </span>
                      </td>
                      <td className={`p-3.5 font-bold ${t.pnl >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {t.pnl >= 0 ? `+$${t.pnl}` : `-$${Math.abs(t.pnl)}`}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] ${
                            t.mistakeTag !== 'None'
                              ? 'bg-red-500/10 text-red-600 border border-red-500/30 font-bold'
                              : isLight
                              ? 'text-slate-400'
                              : 'text-neutral-500'
                          }`}
                        >
                          {t.mistakeTag}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => setPreviewTrade(t)}
                          className={`px-2 py-1 border rounded-md transition-colors cursor-pointer text-[10px] font-bold inline-flex items-center space-x-1 ${
                            isLight
                              ? 'bg-[#4946FF]/10 text-[#4946FF] border-[#4946FF]/30 hover:bg-[#4946FF]/20'
                              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-300'
                          }`}
                          title="Preview Confluence & Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>PREVIEW</span>
                        </button>
                        <button
                          onClick={() => deleteTrade(t.id)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            isLight ? 'text-slate-400 hover:text-red-600 hover:bg-slate-100' : 'text-neutral-500 hover:text-red-400 hover:bg-neutral-800'
                          }`}
                          title="Delete Trade"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Trade Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4 my-8 border ${
                isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#111111] border-neutral-800 text-white'
              }`}
            >
              <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-neutral-800'}`}>
                <h3 className="text-lg font-mono font-bold flex items-center space-x-2">
                  <Plus className={`w-5 h-5 ${isLight ? 'text-[#4946FF]' : 'text-red-500'}`} />
                  <span>LOG SMC TRADE EXECUTION</span>
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`text-sm ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-neutral-500 hover:text-white'}`}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTrade} className="space-y-4 font-mono text-xs">
                {/* TRADE TYPE SELECTOR */}
                <div>
                  <label className={`block mb-1.5 font-bold uppercase ${isLight ? 'text-slate-700' : 'text-neutral-300'}`}>
                    TRADE EXECUTION TYPE (MODE)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTradeType('Real')}
                      className={`py-2.5 px-3 rounded-lg border font-mono font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                        tradeType === 'Real'
                          ? isLight
                            ? 'bg-[#4946FF] text-white border-[#3B38EC] shadow-md shadow-[#4946FF]/30'
                            : 'bg-emerald-600 text-white border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                          : isLight
                          ? 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Activity className="w-4 h-4" />
                      <span>REAL TRADE (LIVE)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTradeType('Backtest')}
                      className={`py-2.5 px-3 rounded-lg border font-mono font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                        tradeType === 'Backtest'
                          ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                          : isLight
                          ? 'bg-slate-100 border-slate-300 text-slate-600 hover:bg-slate-200'
                          : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                      }`}
                    >
                      <FlaskConical className="w-4 h-4" />
                      <span>BACKTESTING</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>DATE</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>SESSION</label>
                    <select
                      value={session}
                      onChange={(e) => setSession(e.target.value as TradingSession)}
                      className={`w-full rounded-lg px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                      }`}
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
                    <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>PAIR / INSTRUMENT</label>
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
                        className={`w-full rounded-lg px-3 py-2 focus:outline-none border font-mono ${
                          isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                        }`}
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
                          className={`w-full rounded-lg px-3 py-2 focus:outline-none border uppercase font-mono ${
                            isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                          }`}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>DIRECTION</label>
                    <select
                      value={direction}
                      onChange={(e) => setDirection(e.target.value as TradeDirection)}
                      className={`w-full rounded-lg px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                      }`}
                    >
                      <option value="Long">Long</option>
                      <option value="Short">Short</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>SMC MODEL / ENTRY CONFLUENCE</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Turtle Soup + FVG + BOS"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 focus:outline-none border font-sans ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>WHY I TOOK THIS TRADE (THOUGHT PROCESS)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe liquidity sweep, market structure, time of day, entry trigger..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className={`w-full rounded-lg px-3 py-2 focus:outline-none border font-sans ${
                      isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>RESULT</label>
                    <select
                      value={result}
                      onChange={(e) => setResult(e.target.value as TradeResult)}
                      className={`w-full rounded-lg px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                      }`}
                    >
                      <option value="Win">Win</option>
                      <option value="Loss">Loss</option>
                      <option value="BE">BE</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>R MULTIPLIER</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={r}
                      onChange={(e) => setR(Number(e.target.value))}
                      className={`w-full rounded-lg px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>PnL ($)</label>
                    <input
                      type="number"
                      required
                      value={pnl}
                      onChange={(e) => setPnl(Number(e.target.value))}
                      className={`w-full rounded-lg px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>FOLLOWED PLAN?</label>
                    <select
                      value={followedPlan ? 'YES' : 'NO'}
                      onChange={(e) => setFollowedPlan(e.target.value === 'YES')}
                      className={`w-full rounded-lg px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                      }`}
                    >
                      <option value="YES">YES</option>
                      <option value="NO">NO</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>MISTAKE TAG</label>
                    <select
                      value={mistakeTag}
                      onChange={(e) => setMistakeTag(e.target.value)}
                      className={`w-full rounded-lg px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-slate-50 border-slate-300 text-slate-900' : 'bg-neutral-950 border-neutral-800 text-white'
                      }`}
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
                  <label className={`block mb-1 ${isLight ? 'text-slate-600' : 'text-neutral-400'}`}>CHART SCREENSHOT (OPTIONAL)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={`w-full rounded-lg px-3 py-1.5 border file:mr-3 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs ${
                      isLight
                        ? 'bg-slate-50 border-slate-300 text-slate-600 file:bg-slate-200 file:text-slate-800'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 file:bg-neutral-800 file:text-neutral-200'
                    }`}
                  />
                  {screenshot && (
                    <div className="mt-2 relative w-24 h-16 border rounded-md overflow-hidden">
                      <img src={screenshot} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className={`flex justify-end space-x-3 pt-3 border-t ${isLight ? 'border-slate-200' : 'border-neutral-800'}`}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={`px-4 py-2 rounded-lg border ${
                      isLight ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 text-white rounded-lg font-bold uppercase tracking-wider shadow-lg ${
                      isLight ? 'bg-[#4946FF] hover:bg-[#3B38EC]' : 'bg-red-600 hover:bg-red-500'
                    }`}
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
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className={`rounded-xl p-6 max-w-3xl w-full shadow-2xl space-y-5 my-8 border ${
                isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#111111] border-neutral-800 text-white'
              }`}
            >
              {/* Modal Header */}
              <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-neutral-800'}`}>
                <div className="flex items-center space-x-3">
                  <span className="text-xl font-black font-mono">{previewTrade.pair}</span>
                  <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                    previewTrade.direction === 'Long'
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/30'
                      : 'bg-red-500/10 text-red-600 border border-red-500/30'
                  }`}>
                    {previewTrade.direction}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-mono font-bold uppercase ${
                      (previewTrade.tradeType || 'Real') === 'Backtest'
                        ? 'bg-purple-500/10 text-purple-600 border border-purple-500/30'
                        : 'bg-[#4946FF]/10 text-[#4946FF] border border-[#4946FF]/30'
                    }`}
                  >
                    {previewTrade.tradeType || 'Real'}
                  </span>
                  <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-neutral-400'}`}>
                    {previewTrade.date} &bull; {previewTrade.session} Session
                  </span>
                </div>
                <button
                  onClick={() => setPreviewTrade(null)}
                  className={`text-sm font-mono p-1 ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-neutral-500 hover:text-white'}`}
                >
                  ✕
                </button>
              </div>

              {/* Result Summary Bar */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className={`p-3 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'}`}>
                  <div className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>RESULT / PnL</div>
                  <div className={`text-base font-extrabold ${previewTrade.result === 'Win' ? 'text-emerald-600' : previewTrade.result === 'Loss' ? 'text-red-500' : 'text-amber-500'}`}>
                    {previewTrade.result} ({previewTrade.pnl >= 0 ? `+$${previewTrade.pnl}` : `-$${Math.abs(previewTrade.pnl)}`})
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'}`}>
                  <div className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>RISK REWARD (R)</div>
                  <div className="text-base font-extrabold text-amber-500">
                    {previewTrade.r >= 0 ? `+${previewTrade.r}R` : `${previewTrade.r}R`}
                  </div>
                </div>

                <div className={`p-3 rounded-lg border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'}`}>
                  <div className={`text-[10px] uppercase ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>PLAN FOLLOWED?</div>
                  <div className="text-base font-extrabold">
                    {previewTrade.followedPlan ? (
                      <span className="text-emerald-600 flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>YES</span>
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center space-x-1">
                        <XCircle className="w-4 h-4" />
                        <span>NO ({previewTrade.mistakeTag})</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* SMC Model / Entry Confluence Box */}
              <div className={`p-4 rounded-xl space-y-1.5 border ${
                isLight ? 'bg-[#4946FF]/5 border-[#4946FF]/30' : 'bg-neutral-950 border-red-900/60'
              }`}>
                <div className={`text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-2 ${isLight ? 'text-[#4946FF]' : 'text-red-400'}`}>
                  <Layers className={`w-4 h-4 ${isLight ? 'text-[#4946FF]' : 'text-red-500'}`} />
                  <span>SMC MODEL / ENTRY CONFLUENCE</span>
                </div>
                <div className="text-sm font-mono font-extrabold">
                  {previewTrade.model}
                </div>
              </div>

              {/* Why I Took This Trade Box */}
              <div className={`p-4 rounded-xl space-y-1.5 border ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800'}`}>
                <div className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <span>WHY I TOOK THIS TRADE (THOUGHT PROCESS)</span>
                </div>
                <p className={`text-xs font-sans leading-relaxed p-3.5 rounded-lg border ${
                  isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-neutral-900 border-neutral-800 text-neutral-200'
                }`}>
                  {previewTrade.reason}
                </p>
              </div>

              {/* Enhanced Interactive Chart Screenshot Section with High-Res Lightbox */}
              {previewTrade.screenshot ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`text-xs font-mono font-bold uppercase flex items-center space-x-2 ${isLight ? 'text-slate-700' : 'text-neutral-300'}`}>
                      <ImageIcon className={`w-4 h-4 ${isLight ? 'text-[#4946FF]' : 'text-emerald-400'}`} />
                      <span>ENTRY CHART SCREENSHOT</span>
                    </div>

                    <div className="flex items-center space-x-2 font-mono text-xs">
                      <button
                        onClick={() => handleOpenLightbox(previewTrade.screenshot!)}
                        className={`px-3 py-1.5 rounded-lg font-bold flex items-center space-x-1.5 border transition-all cursor-pointer shadow-sm ${
                          isLight
                            ? 'bg-[#4946FF] text-white border-[#3B38EC] hover:bg-[#3B38EC]'
                            : 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500'
                        }`}
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                        <span>FULLSCREEN / ZOOM</span>
                      </button>

                      <button
                        onClick={() => handleOpenNewTab(previewTrade.screenshot!)}
                        className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                          isLight ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-700 text-neutral-300'
                        }`}
                        title="Open full image in new browser tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Clickable Image Preview Box */}
                  <div
                    onClick={() => handleOpenLightbox(previewTrade.screenshot!)}
                    className={`group relative border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 shadow-inner ${
                      isLight ? 'bg-slate-100 border-slate-300 hover:border-[#4946FF]' : 'bg-neutral-950 border-neutral-800 hover:border-emerald-500'
                    }`}
                  >
                    <img
                      src={previewTrade.screenshot}
                      alt="Trade Chart Preview"
                      className="w-full max-h-[480px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.01]"
                    />

                    {/* Hover Overlay Prompt */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2 text-white font-mono text-xs font-bold uppercase backdrop-blur-xs">
                      <ZoomIn className="w-5 h-5 text-emerald-400" />
                      <span>CLICK FOR FULLSCREEN & HIGH-RES ZOOM</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={`p-4 border border-dashed rounded-xl text-xs font-mono text-center ${isLight ? 'bg-slate-50 border-slate-300 text-slate-500' : 'bg-neutral-950/60 border-neutral-800 text-neutral-500'}`}>
                  No chart screenshot attached for this trade.
                </div>
              )}

              <div className={`flex justify-end pt-3 border-t ${isLight ? 'border-slate-200' : 'border-neutral-800'}`}>
                <button
                  onClick={() => setPreviewTrade(null)}
                  className={`px-5 py-2 rounded-lg text-xs font-mono border ${
                    isLight ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  CLOSE PREVIEW
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN HIGH-RESOLUTION LIGHTBOX & INTERACTIVE ZOOM MODAL */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 overflow-hidden select-none">
            {/* Top Toolbar */}
            <div className="w-full max-w-7xl flex flex-wrap items-center justify-between gap-4 bg-neutral-950/90 border border-neutral-800/90 px-6 py-3 rounded-xl z-10 shadow-2xl">
              <div className="flex items-center space-x-3 text-white font-mono text-xs">
                <ImageIcon className="w-5 h-5 text-emerald-400" />
                <span className="font-bold uppercase tracking-wider">FULL HIGH-RESOLUTION CHART VIEW</span>
                {previewTrade && (
                  <>
                    <span className="text-neutral-600">&bull;</span>
                    <span className="text-emerald-400 font-bold">{previewTrade.pair}</span>
                    <span className="text-neutral-500">({previewTrade.date})</span>
                  </>
                )}
              </div>

              {/* Interactive Zoom Controls */}
              <div className="flex items-center space-x-2 font-mono text-xs">
                <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-white font-bold">
                  ZOOM: {Math.round(zoomScale * 100)}%
                </div>

                <button
                  onClick={handleZoomIn}
                  className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white rounded-lg transition-colors cursor-pointer"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="w-4 h-4 text-emerald-400" />
                </button>

                <button
                  onClick={handleZoomOut}
                  className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white rounded-lg transition-colors cursor-pointer"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="w-4 h-4 text-amber-400" />
                </button>

                <button
                  onClick={() => setZoomScale(1)}
                  className="p-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white rounded-lg transition-colors cursor-pointer"
                  title="Reset Zoom (100%)"
                >
                  <RotateCcw className="w-4 h-4 text-neutral-300" />
                </button>

                <button
                  onClick={() => handleOpenNewTab(lightboxImage)}
                  className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white rounded-lg font-bold flex items-center space-x-1.5 cursor-pointer"
                  title="Open Original Image File"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">ORIGINAL</span>
                </button>

                <button
                  onClick={() => setLightboxImage(null)}
                  className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold uppercase transition-colors cursor-pointer ml-2"
                >
                  CLOSE ✕
                </button>
              </div>
            </div>

            {/* Main Interactive Zoomable Canvas */}
            <div className="w-full flex-1 flex items-center justify-center overflow-auto p-4 my-2 scrollbar-thin">
              <motion.div
                animate={{ scale: zoomScale }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="max-w-none max-h-none flex items-center justify-center"
              >
                <img
                  src={lightboxImage}
                  alt="High Resolution Chart"
                  className="max-w-[92vw] max-h-[82vh] object-contain rounded-lg shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-neutral-800"
                />
              </motion.div>
            </div>

            {/* Bottom Tip */}
            <div className="text-[10px] font-mono text-neutral-500 z-10 uppercase tracking-widest text-center">
              USE ZOOM BUTTONS ABOVE OR OPEN ORIGINAL FOR DEEP CANDLE WICK & LEVEL INSPECTION &bull; PRESS ESC / CLOSE TO EXIT
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
