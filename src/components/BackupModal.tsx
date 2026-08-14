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
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          className={`rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 border ${
            isLight ? 'bg-white border-neutral-200 text-neutral-900' : 'bg-[#101014] border-neutral-800 text-neutral-100'
          }`}
        >
          <div className="flex items-center justify-between border-b pb-3 border-neutral-200/60 dark:border-neutral-800/60">
            <h3 className="text-base font-bold flex items-center space-x-2">
              <Database className="w-4 h-4 text-neutral-500" />
              <span>Database & Backup</span>
            </h3>
            <button
              onClick={onClose}
              className={`text-sm ${isLight ? 'text-neutral-400 hover:text-neutral-700' : 'text-neutral-500 hover:text-white'}`}
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div className={`p-3 rounded-xl border space-y-1 ${isLight ? 'bg-neutral-50 border-neutral-200/80 text-neutral-600' : 'bg-neutral-900 border-neutral-800 text-neutral-400'}`}>
              <div className={`font-semibold flex items-center space-x-1.5 ${isLight ? 'text-neutral-900' : 'text-white'}`}>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>SQLite Disk Persistence Active</span>
              </div>
              <p className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                Your trades and targets are automatically saved to local SQLite database.
              </p>
            </div>

            {/* Export */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${isLight ? 'bg-neutral-50 border-neutral-200/80' : 'bg-neutral-900 border-neutral-800'}`}>
              <div className="font-semibold text-[11px] uppercase">Export JSON Backup</div>
              <p className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                Download a complete backup snapshot of all your logged trades and tasks.
              </p>
              <button
                onClick={handleExportJSON}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Backup</span>
              </button>
            </div>

            {/* Import */}
            <div className={`p-3.5 rounded-xl border space-y-2 ${isLight ? 'bg-neutral-50 border-neutral-200/80' : 'bg-neutral-900 border-neutral-800'}`}>
              <div className="font-semibold text-[11px] uppercase">Restore Backup</div>
              <p className={`text-[11px] ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                Upload a previously exported JSON backup file.
              </p>
              <label className={`w-full py-2 font-mono text-xs font-semibold rounded-lg flex items-center justify-center space-x-1.5 border transition-colors cursor-pointer ${
                isLight
                  ? 'bg-white hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                  : 'bg-neutral-800 hover:bg-neutral-700 border-neutral-700 text-white'
              }`}>
                <Upload className="w-3.5 h-3.5 text-amber-500" />
                <span>Upload .JSON File</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>

            {importStatus && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold rounded-lg text-center flex items-center justify-center space-x-1.5">
                <Check className="w-4 h-4" />
                <span>{importStatus}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2 border-t border-neutral-200/60 dark:border-neutral-800/60">
            <button
              onClick={onClose}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium border ${
                isLight ? 'bg-neutral-50 border-neutral-200 text-neutral-600' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              Close
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
