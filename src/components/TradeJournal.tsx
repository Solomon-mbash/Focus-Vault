'use client';

import React, { useState } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { Trade, TradingSession, TradeDirection, TradeResult, TradeType } from '@/types';
import { format } from 'date-fns';
import {
  TrendingUp,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
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
  ImageIcon,
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
    return true;
  });

  const sortedTrades = [...filteredTrades].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const latestTrade = sortedTrades.length > 0 ? sortedTrades[0] : null;

  let currentEquity = 0;
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
  const chartHeight = 140;
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
          <head><title>Full Resolution Chart</title></head>
          <body style="margin:0; background:#0a0a0a; display:flex; justify-content:center; align-items:center; min-height:100vh;">
            <img src="${imgSrc}" style="max-width:100%; height:auto;" />
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="w-full space-y-5">
      {/* Header & Stats */}
      <div
        className={`flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl border transition-colors ${
          isLight
            ? 'bg-white border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-neutral-900'
            : 'bg-[#101014] border-neutral-800/80 text-neutral-100 shadow-xl'
        }`}
      >
        <div>
          <div className={`text-[11px] font-mono uppercase tracking-wider ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
            SMC Execution Vault
          </div>
          <h2 className="text-xl font-bold tracking-tight mt-0.5">
            Trade Journal
          </h2>
        </div>

        <div className="flex items-center space-x-3">
          <div
            className={`flex items-center space-x-3 px-3.5 py-1.5 rounded-xl border text-xs font-mono ${
              isLight ? 'bg-neutral-50 border-neutral-200/80' : 'bg-neutral-900 border-neutral-800'
            }`}
          >
            <div>
              <span className={isLight ? 'text-neutral-400' : 'text-neutral-500'}>PnL: </span>
              <strong className={`font-bold ${totalPnL >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                ${totalPnL.toLocaleString()}
              </strong>
            </div>
            <div className="border-l pl-3 border-neutral-200 dark:border-neutral-800">
              <span className={isLight ? 'text-neutral-400' : 'text-neutral-500'}>Win Rate: </span>
              <strong className="font-bold">{winRate}%</strong>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer flex items-center space-x-1.5 shadow-xs ${
              isLight
                ? 'bg-neutral-900 hover:bg-neutral-800 text-white'
                : 'bg-white hover:bg-neutral-100 text-neutral-950 font-semibold'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Trade</span>
          </button>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center justify-between">
        <div
          className={`inline-flex p-1 rounded-xl border text-xs font-mono transition-colors ${
            isLight ? 'bg-neutral-100/70 border-neutral-200/80' : 'bg-neutral-900 border-neutral-800'
          }`}
        >
          <button
            onClick={() => setTradeTypeFilter('ALL')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              tradeTypeFilter === 'ALL'
                ? isLight
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'bg-neutral-800 text-white shadow-xs font-semibold'
                : isLight
                ? 'text-neutral-500 hover:text-neutral-900'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All ({trades.length})
          </button>

          <button
            onClick={() => setTradeTypeFilter('Real')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center space-x-1 ${
              tradeTypeFilter === 'Real'
                ? isLight
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'bg-neutral-800 text-white shadow-xs font-semibold'
                : isLight
                ? 'text-neutral-500 hover:text-neutral-900'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Activity className="w-3 h-3" />
            <span>Live ({realCount})</span>
          </button>

          <button
            onClick={() => setTradeTypeFilter('Backtest')}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center space-x-1 ${
              tradeTypeFilter === 'Backtest'
                ? isLight
                  ? 'bg-white text-neutral-900 shadow-xs font-semibold'
                  : 'bg-neutral-800 text-white shadow-xs font-semibold'
                : isLight
                ? 'text-neutral-500 hover:text-neutral-900'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <FlaskConical className="w-3 h-3" />
            <span>Backtest ({backtestCount})</span>
          </button>
        </div>

        <div className={`text-[11px] font-mono ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
          {filteredTrades.length} trades recorded
        </div>
      </div>

      {/* Latest Trade Preview Banner */}
      {latestTrade && (
        <div
          className={`p-4 md:p-5 rounded-2xl border transition-colors ${
            isLight
              ? 'bg-white border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-neutral-900'
              : 'bg-[#101014] border-neutral-800/80 text-neutral-100 shadow-xl'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-3 mb-3 border-neutral-200/60 dark:border-neutral-800/60">
            <div className="flex items-center space-x-2 text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="font-semibold">Latest Trade Confluence</span>
              <span className={`text-[11px] font-mono ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                &bull; {latestTrade.date} ({latestTrade.session})
              </span>
            </div>

            <button
              onClick={() => setPreviewTrade(latestTrade)}
              className={`text-xs font-medium flex items-center space-x-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                  : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Full Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className={`p-3 rounded-xl border ${isLight ? 'bg-neutral-50/70 border-neutral-200/70' : 'bg-neutral-900/50 border-neutral-800/60'}`}>
              <div className={`text-[10px] uppercase font-mono mb-1 ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Instrument
              </div>
              <div className="flex items-center space-x-2 font-mono">
                <span className="font-bold">{latestTrade.pair}</span>
                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                  latestTrade.direction === 'Long' ? 'text-emerald-600 bg-emerald-500/10' : 'text-rose-600 bg-rose-500/10'
                }`}>
                  {latestTrade.direction}
                </span>
                <span className={`font-bold ${latestTrade.result === 'Win' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {latestTrade.result} ({latestTrade.pnl >= 0 ? `+$${latestTrade.pnl}` : `-$${Math.abs(latestTrade.pnl)}`})
                </span>
              </div>
            </div>

            <div className={`p-3 rounded-xl border ${isLight ? 'bg-neutral-50/70 border-neutral-200/70' : 'bg-neutral-900/50 border-neutral-800/60'}`}>
              <div className={`text-[10px] uppercase font-mono mb-1 flex items-center gap-1 ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                <Layers className="w-3 h-3" />
                <span>SMC Model</span>
              </div>
              <div className="font-semibold truncate">{latestTrade.model}</div>
            </div>

            <div className={`p-3 rounded-xl border ${isLight ? 'bg-neutral-50/70 border-neutral-200/70' : 'bg-neutral-900/50 border-neutral-800/60'}`}>
              <div className={`text-[10px] uppercase font-mono mb-1 flex items-center gap-1 ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                <FileText className="w-3 h-3" />
                <span>Reasoning</span>
              </div>
              <div className={`truncate ${isLight ? 'text-neutral-600' : 'text-neutral-300'}`}>{latestTrade.reason}</div>
            </div>
          </div>
        </div>
      )}

      {/* Equity Curve SVG Chart */}
      <div
        className={`p-5 md:p-6 rounded-2xl border space-y-3 transition-colors ${
          isLight
            ? 'bg-white border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-neutral-900'
            : 'bg-[#101014] border-neutral-800/80 text-neutral-100 shadow-xl'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-mono border-b pb-2.5 border-neutral-200/60 dark:border-neutral-800/60">
          <span className="font-semibold">Equity Growth</span>
          <span className={isLight ? 'text-neutral-400' : 'text-neutral-500'}>
            {sortedTrades.length} trades plotted
          </span>
        </div>

        <div className="w-full overflow-x-auto py-1">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-32">
            <defs>
              <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={totalPnL >= 0 ? '#10B981' : '#F43F5E'} stopOpacity="0.2" />
                <stop offset="100%" stopColor={totalPnL >= 0 ? '#10B981' : '#F43F5E'} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <line
              x1="0"
              y1={chartHeight - ((0 - minEquity) / equityRange) * (chartHeight - 30) - 15}
              x2={chartWidth}
              y2={chartHeight - ((0 - minEquity) / equityRange) * (chartHeight - 30) - 15}
              stroke={isLight ? '#E5E5E5' : '#262626'}
              strokeDasharray="3 3"
              strokeWidth="1"
            />

            {fillPath && <path d={fillPath} fill="url(#equityGrad)" />}

            <path
              d={chartPath}
              fill="none"
              stroke={totalPnL >= 0 ? '#10B981' : '#F43F5E'}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Trades Table */}
      <div
        className={`rounded-2xl border overflow-hidden transition-colors ${
          isLight
            ? 'bg-white border-neutral-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] text-neutral-900'
            : 'bg-[#101014] border-neutral-800/80 text-neutral-100 shadow-xl'
        }`}
      >
        {sortedTrades.length === 0 ? (
          <div className={`p-12 text-center text-xs font-mono ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
            No trades recorded for this view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`border-b font-mono text-[11px] ${isLight ? 'bg-neutral-50/70 border-neutral-200/80 text-neutral-500' : 'bg-neutral-900/50 border-neutral-800 text-neutral-400'}`}>
                  <th className="p-3.5">Mode</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5">Pair</th>
                  <th className="p-3.5">Dir</th>
                  <th className="p-3.5">Model</th>
                  <th className="p-3.5">Plan</th>
                  <th className="p-3.5">Result</th>
                  <th className="p-3.5">PnL</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y font-mono ${isLight ? 'divide-neutral-200/60' : 'divide-neutral-800/60'}`}>
                {sortedTrades.map((t) => {
                  const isBacktest = (t.tradeType || 'Real') === 'Backtest';

                  return (
                    <tr key={t.id} className={`transition-colors ${isLight ? 'hover:bg-neutral-50/80' : 'hover:bg-neutral-900/50'}`}>
                      <td className="p-3.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                            isBacktest
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                              : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-500/20'
                          }`}
                        >
                          {t.tradeType || 'Real'}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-semibold">{t.date}</div>
                        <div className={`text-[10px] ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>{t.session}</div>
                      </td>
                      <td className="p-3.5 font-bold">{t.pair}</td>
                      <td className="p-3.5">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            t.direction === 'Long'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {t.direction}
                        </span>
                      </td>
                      <td className="p-3.5 font-medium truncate max-w-[180px]">{t.model}</td>
                      <td className="p-3.5">
                        {t.followedPlan ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Yes</span>
                          </span>
                        ) : (
                          <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center space-x-1">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>No</span>
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`font-semibold ${
                            t.result === 'Win'
                              ? 'text-emerald-600 dark:text-emerald-400'
                              : t.result === 'Loss'
                              ? 'text-rose-600 dark:text-rose-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {t.result} ({t.r >= 0 ? `+${t.r}R` : `${t.r}R`})
                        </span>
                      </td>
                      <td className={`p-3.5 font-bold ${t.pnl >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {t.pnl >= 0 ? `+$${t.pnl}` : `-$${Math.abs(t.pnl)}`}
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => setPreviewTrade(t)}
                          className={`px-2 py-1 rounded border text-[11px] font-medium transition-colors cursor-pointer inline-flex items-center space-x-1 ${
                            isLight
                              ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
                              : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-300'
                          }`}
                        >
                          <Eye className="w-3 h-3" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => deleteTrade(t.id)}
                          className={`p-1 rounded transition-colors cursor-pointer ${
                            isLight ? 'text-neutral-400 hover:text-rose-600 hover:bg-neutral-100' : 'text-neutral-500 hover:text-rose-400 hover:bg-neutral-800'
                          }`}
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className={`rounded-2xl p-6 max-w-lg w-full shadow-2xl space-y-4 my-8 border ${
                isLight ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-[#101014] border-neutral-800 text-neutral-100'
              }`}
            >
              <div className="flex items-center justify-between border-b pb-3 border-neutral-200/60 dark:border-neutral-800/60">
                <h3 className="text-base font-bold">Log SMC Trade</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className={`text-sm ${isLight ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-500 hover:text-white'}`}
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateTrade} className="space-y-4 text-xs font-mono">
                {/* Trade Type */}
                <div>
                  <label className={`block mb-1.5 font-sans font-medium ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                    Execution Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTradeType('Real')}
                      className={`py-2 px-3 rounded-xl border font-sans font-medium text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                        tradeType === 'Real'
                          ? isLight
                            ? 'bg-neutral-900 text-white border-neutral-900 shadow-xs'
                            : 'bg-white text-neutral-950 border-white shadow-xs'
                          : isLight
                          ? 'bg-neutral-50 border-neutral-200 text-neutral-600'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      <span>Live Trade</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTradeType('Backtest')}
                      className={`py-2 px-3 rounded-xl border font-sans font-medium text-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                        tradeType === 'Backtest'
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : isLight
                          ? 'bg-neutral-50 border-neutral-200 text-neutral-600'
                          : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      }`}
                    >
                      <FlaskConical className="w-3.5 h-3.5" />
                      <span>Backtest</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block mb-1.5 font-sans font-medium ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Date</label>
                    <input
                      type="date"
                      required
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'
                      }`}
                    />
                  </div>
                  <div>
                    <label className={`block mb-1.5 font-sans font-medium ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Session</label>
                    <select
                      value={session}
                      onChange={(e) => setSession(e.target.value as TradingSession)}
                      className={`w-full rounded-xl px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'
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
                    <label className={`block mb-1.5 font-sans font-medium ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Pair</label>
                    <div className="space-y-1.5">
                      <select
                        value={['EURUSD', 'XAUUSD', 'GBPUSD', 'AUDUSD'].includes(pair) ? pair : 'OTHER'}
                        onChange={(e) => {
                          if (e.target.value !== 'OTHER') {
                            setPair(e.target.value);
                          } else {
                            setPair('');
                          }
                        }}
                        className={`w-full rounded-xl px-3 py-2 focus:outline-none border ${
                          isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'
                        }`}
                      >
                        <option value="EURUSD">EURUSD</option>
                        <option value="XAUUSD">XAUUSD (Gold)</option>
                        <option value="GBPUSD">GBPUSD</option>
                        <option value="AUDUSD">AUDUSD</option>
                        <option value="OTHER">Custom...</option>
                      </select>

                      {!['EURUSD', 'XAUUSD', 'GBPUSD', 'AUDUSD'].includes(pair) && (
                        <input
                          type="text"
                          required
                          placeholder="BTCUSD, NQ..."
                          value={pair}
                          onChange={(e) => setPair(e.target.value.toUpperCase())}
                          className={`w-full rounded-xl px-3 py-2 focus:outline-none border uppercase ${
                            isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'
                          }`}
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={`block mb-1.5 font-sans font-medium ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Direction</label>
                    <select
                      value={direction}
                      onChange={(e) => setDirection(e.target.value as TradeDirection)}
                      className={`w-full rounded-xl px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'
                      }`}
                    >
                      <option value="Long">Long</option>
                      <option value="Short">Short</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block mb-1.5 font-sans font-medium ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>SMC Confluence Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Turtle Soup + FVG + BOS"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 focus:outline-none border font-sans ${
                      isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'
                    }`}
                  />
                </div>

                <div>
                  <label className={`block mb-1.5 font-sans font-medium ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Why taken (Thought Process)</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Liquidity sweep, market structure, time of day..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className={`w-full rounded-xl px-3 py-2 focus:outline-none border font-sans ${
                      isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className={`block mb-1.5 font-sans font-medium ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Result</label>
                    <select
                      value={result}
                      onChange={(e) => setResult(e.target.value as TradeResult)}
                      className={`w-full rounded-xl px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'
                      }`}
                    >
                      <option value="Win">Win</option>
                      <option value="Loss">Loss</option>
                      <option value="BE">BE</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block mb-1.5 font-sans font-medium ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>R Multiplier</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={r}
                      onChange={(e) => setR(Number(e.target.value))}
                      className={`w-full rounded-xl px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block mb-1.5 font-sans font-medium ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>PnL ($)</label>
                    <input
                      type="number"
                      required
                      value={pnl}
                      onChange={(e) => setPnl(Number(e.target.value))}
                      className={`w-full rounded-xl px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={`block mb-1.5 font-sans font-medium ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Followed Plan?</label>
                    <select
                      value={followedPlan ? 'YES' : 'NO'}
                      onChange={(e) => setFollowedPlan(e.target.value === 'YES')}
                      className={`w-full rounded-xl px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'
                      }`}
                    >
                      <option value="YES">Yes</option>
                      <option value="NO">No</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block mb-1.5 font-sans font-medium ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Mistake Tag</label>
                    <select
                      value={mistakeTag}
                      onChange={(e) => setMistakeTag(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 focus:outline-none border ${
                        isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-900' : 'bg-neutral-900 border-neutral-800 text-white'
                      }`}
                    >
                      <option value="None">None</option>
                      <option value="FOMO">FOMO</option>
                      <option value="Revenge">Revenge</option>
                      <option value="Early Entry">Early Entry</option>
                      <option value="No Setup">No Setup</option>
                      <option value="Over-leveraging">Over-leveraging</option>
                      <option value="Chasing">Chasing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block mb-1.5 font-sans font-medium ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>Chart Screenshot (Optional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className={`w-full rounded-xl px-3 py-1.5 border file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs ${
                      isLight
                        ? 'bg-neutral-50 border-neutral-200 text-neutral-600 file:bg-neutral-200 file:text-neutral-800'
                        : 'bg-neutral-900 border-neutral-800 text-neutral-400 file:bg-neutral-800 file:text-neutral-200'
                    }`}
                  />
                  {screenshot && (
                    <div className="mt-2 relative w-20 h-14 border rounded-lg overflow-hidden border-neutral-200 dark:border-neutral-800">
                      <img src={screenshot} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className={`px-4 py-2 rounded-xl text-xs font-sans font-medium border ${
                      isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-600' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-5 py-2 rounded-xl text-xs font-sans font-semibold shadow-xs ${
                      isLight ? 'bg-neutral-900 hover:bg-neutral-800 text-white' : 'bg-white hover:bg-neutral-100 text-neutral-950'
                    }`}
                  >
                    Save Trade
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULL TRADE DETAILS PREVIEW MODAL */}
      <AnimatePresence>
        {previewTrade && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className={`rounded-2xl p-6 max-w-3xl w-full shadow-2xl space-y-4 my-8 border ${
                isLight ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-[#101014] border-neutral-800 text-neutral-100'
              }`}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b pb-3 border-neutral-200/60 dark:border-neutral-800/60">
                <div className="flex items-center space-x-2.5 font-mono">
                  <span className="text-lg font-bold">{previewTrade.pair}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    previewTrade.direction === 'Long'
                      ? 'bg-emerald-500/10 text-emerald-600'
                      : 'bg-rose-500/10 text-rose-600'
                  }`}>
                    {previewTrade.direction}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold uppercase bg-neutral-500/10 text-neutral-500">
                    {previewTrade.tradeType || 'Real'}
                  </span>
                  <span className={`text-xs ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>
                    &bull; {previewTrade.date} ({previewTrade.session})
                  </span>
                </div>
                <button
                  onClick={() => setPreviewTrade(null)}
                  className={`text-sm ${isLight ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-500 hover:text-white'}`}
                >
                  ✕
                </button>
              </div>

              {/* Result Summary Bar */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className={`p-3 rounded-xl border ${isLight ? 'bg-neutral-50/70 border-neutral-200/70' : 'bg-neutral-900/60 border-neutral-800'}`}>
                  <div className={`text-[10px] uppercase mb-0.5 ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Result / PnL</div>
                  <div className={`text-sm font-bold ${previewTrade.result === 'Win' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {previewTrade.result} ({previewTrade.pnl >= 0 ? `+$${previewTrade.pnl}` : `-$${Math.abs(previewTrade.pnl)}`})
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${isLight ? 'bg-neutral-50/70 border-neutral-200/70' : 'bg-neutral-900/60 border-neutral-800'}`}>
                  <div className={`text-[10px] uppercase mb-0.5 ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Risk Reward</div>
                  <div className="text-sm font-bold text-amber-600 dark:text-amber-400">
                    {previewTrade.r >= 0 ? `+${previewTrade.r}R` : `${previewTrade.r}R`}
                  </div>
                </div>

                <div className={`p-3 rounded-xl border ${isLight ? 'bg-neutral-50/70 border-neutral-200/70' : 'bg-neutral-900/60 border-neutral-800'}`}>
                  <div className={`text-[10px] uppercase mb-0.5 ${isLight ? 'text-neutral-400' : 'text-neutral-500'}`}>Plan Followed</div>
                  <div className="text-sm font-bold">
                    {previewTrade.followedPlan ? (
                      <span className="text-emerald-600 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Yes</span>
                      </span>
                    ) : (
                      <span className="text-rose-600 flex items-center space-x-1">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>No ({previewTrade.mistakeTag})</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* SMC Model Box */}
              <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-neutral-50/70 border-neutral-200/70' : 'bg-neutral-900/60 border-neutral-800'}`}>
                <div className={`text-xs font-semibold uppercase mb-1 flex items-center gap-1.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  <Layers className="w-3.5 h-3.5" />
                  <span>SMC Confluence Model</span>
                </div>
                <div className="text-sm font-medium">
                  {previewTrade.model}
                </div>
              </div>

              {/* Reasoning Box */}
              <div className={`p-3.5 rounded-xl border ${isLight ? 'bg-neutral-50/70 border-neutral-200/70' : 'bg-neutral-900/60 border-neutral-800'}`}>
                <div className={`text-xs font-semibold uppercase mb-1 flex items-center gap-1.5 ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                  <FileText className="w-3.5 h-3.5" />
                  <span>Reasoning & Thought Process</span>
                </div>
                <p className={`text-xs font-sans leading-relaxed ${isLight ? 'text-neutral-700' : 'text-neutral-300'}`}>
                  {previewTrade.reason}
                </p>
              </div>

              {/* Chart Screenshot Section */}
              {previewTrade.screenshot ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className={`text-xs font-semibold uppercase flex items-center space-x-1.5 ${isLight ? 'text-neutral-600' : 'text-neutral-400'}`}>
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Chart Screenshot</span>
                    </div>

                    <div className="flex items-center space-x-2 text-xs">
                      <button
                        onClick={() => handleOpenLightbox(previewTrade.screenshot!)}
                        className={`px-2.5 py-1 rounded-lg font-medium flex items-center space-x-1 border transition-colors cursor-pointer ${
                          isLight ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-800' : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-200'
                        }`}
                      >
                        <Maximize2 className="w-3 h-3" />
                        <span>Fullscreen</span>
                      </button>

                      <button
                        onClick={() => handleOpenNewTab(previewTrade.screenshot!)}
                        className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                          isLight ? 'bg-neutral-100 hover:bg-neutral-200 border-neutral-200 text-neutral-600' : 'bg-neutral-900 hover:bg-neutral-800 border-neutral-800 text-neutral-400'
                        }`}
                        title="Open in new tab"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Clickable Image Box */}
                  <div
                    onClick={() => handleOpenLightbox(previewTrade.screenshot!)}
                    className="relative border rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-neutral-200 dark:border-neutral-800 bg-neutral-950"
                  >
                    <img
                      src={previewTrade.screenshot}
                      alt="Trade Chart"
                      className="w-full max-h-[420px] object-contain rounded-lg"
                    />
                  </div>
                </div>
              ) : null}

              <div className="flex justify-end pt-3 border-t border-neutral-200/60 dark:border-neutral-800/60">
                <button
                  onClick={() => setPreviewTrade(null)}
                  className={`px-4 py-1.5 rounded-xl text-xs font-medium border ${
                    isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-600' : 'bg-neutral-900 border-neutral-800 text-neutral-400'
                  }`}
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      <AnimatePresence>
        {lightboxImage && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex flex-col items-center justify-between p-4 overflow-hidden select-none">
            {/* Top Toolbar */}
            <div className="w-full max-w-5xl flex items-center justify-between gap-4 bg-neutral-950/80 border border-neutral-800 px-5 py-2.5 rounded-xl z-10">
              <div className="flex items-center space-x-2 text-white font-mono text-xs">
                <span className="font-semibold">{previewTrade?.pair}</span>
                <span className="text-neutral-500">Chart View</span>
              </div>

              {/* Zoom Controls */}
              <div className="flex items-center space-x-1.5 text-xs font-mono">
                <span className="text-neutral-400 px-2 py-1 bg-neutral-900 rounded border border-neutral-800">
                  {Math.round(zoomScale * 100)}%
                </span>

                <button
                  onClick={handleZoomIn}
                  className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white rounded transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={handleZoomOut}
                  className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white rounded transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setZoomScale(1)}
                  className="p-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-neutral-300 rounded transition-colors cursor-pointer"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => setLightboxImage(null)}
                  className="px-3 py-1 bg-white hover:bg-neutral-200 text-neutral-950 font-semibold rounded text-xs transition-colors cursor-pointer ml-2"
                >
                  Close
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="w-full flex-1 flex items-center justify-center overflow-auto p-4 my-2">
              <motion.div
                animate={{ scale: zoomScale }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <img
                  src={lightboxImage}
                  alt="Full Chart"
                  className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg border border-neutral-800 shadow-2xl"
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
