'use client';

import React, { useState } from 'react';
import { useFocusStore } from '@/store/useFocusStore';
import { Database, Download, Upload, Check, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({ isOpen, onClose }) => {
  const { importFullData, theme } = useFocusStore();
  const isLight = theme === 'light';
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportJSON = () => {
    window.location.href = '/api/backup';
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const content = event.target?.result as string;
          const parsed = JSON.parse(content);
          if (parsed && typeof parsed === 'object') {
            await importFullData(parsed);
            setImportStatus('Backup restored successfully!');
            setTimeout(() => {
              setImportStatus(null);
              onClose();
            }, 1500);
          }
        } catch (err: any) {
          alert('Failed to parse backup JSON file: ' + err.message);
        }
      };
      reader.readAsText(file);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className={`rounded-xl p-6 max-w-md w-full shadow-2xl space-y-5 border ${
            isLight ? 'bg-white border-slate-200 text-slate-800' : 'bg-[#111111] border-neutral-800 text-white'
          }`}
        >
          <div className={`flex items-center justify-between border-b pb-3 ${isLight ? 'border-slate-200' : 'border-neutral-800'}`}>
            <h3 className="text-base font-mono font-bold flex items-center space-x-2">
              <Database className={`w-5 h-5 ${isLight ? 'text-[#4946FF]' : 'text-emerald-400'}`} />
              <span>SQLITE DATABASE & BACKUP VAULT</span>
            </h3>
            <button
              onClick={onClose}
              className={`text-sm font-mono ${isLight ? 'text-slate-400 hover:text-slate-700' : 'text-neutral-500 hover:text-white'}`}
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className={`p-3 rounded-lg border space-y-1.5 ${isLight ? 'bg-slate-50 border-slate-200 text-slate-600' : 'bg-neutral-950 border-neutral-800 text-neutral-400'}`}>
              <div className={`font-bold flex items-center space-x-1.5 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>SQLite Disk Persistence Active</span>
              </div>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
                Your trades, tasks, vision, and reflections are saved directly to <code className={isLight ? 'text-slate-800 font-bold' : 'text-neutral-300'}>data/focus_vault.db</code> on disk.
              </p>
            </div>

            {/* Export */}
            <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800/80'}`}>
              <div className={`font-bold uppercase text-[11px] ${isLight ? 'text-slate-900' : 'text-white'}`}>1-CLICK EXPORT JSON BACKUP</div>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
                Download a complete JSON snapshot file of your trade journal, daily targets, and framework.
              </p>
              <button
                onClick={handleExportJSON}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase rounded-lg flex items-center justify-center space-x-2 shadow-lg transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD JSON BACKUP</span>
              </button>
            </div>

            {/* Import */}
            <div className={`p-4 rounded-xl border space-y-2 ${isLight ? 'bg-slate-50 border-slate-200' : 'bg-neutral-950 border-neutral-800/80'}`}>
              <div className={`font-bold uppercase text-[11px] ${isLight ? 'text-slate-900' : 'text-white'}`}>RESTORE FROM JSON BACKUP</div>
              <p className={`text-[11px] ${isLight ? 'text-slate-500' : 'text-neutral-500'}`}>
                Upload a previously exported JSON backup file to restore all your data.
              </p>
              <label className={`w-full py-2.5 font-mono text-xs font-bold uppercase rounded-lg flex items-center justify-center space-x-2 border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-slate-100 border-slate-300 text-slate-800'
                  : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-white'
              }`}>
                <Upload className="w-4 h-4 text-amber-500" />
                <span>UPLOAD BACKUP FILE (.JSON)</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-bold rounded-lg text-center flex items-center justify-center space-x-2">
                <Check className="w-4 h-4" />
                <span>{importStatus}</span>
              </div>
            )}
          </div>

          <div className={`flex justify-end pt-2 border-t ${isLight ? 'border-slate-200' : 'border-neutral-800'}`}>
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg text-xs font-mono border ${
                isLight ? 'bg-slate-100 border-slate-300 text-slate-600' : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              CLOSE
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
