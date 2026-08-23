import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

interface TemplateWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  templateName: string;
}

export default function TemplateWarningModal({ isOpen, onClose, onConfirm, templateName }: TemplateWarningModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-md rounded-xl shadow-2xl border border-border overflow-hidden flex flex-col">
        <div className="p-5 border-b border-border flex items-center gap-3 bg-amber-500/10 text-amber-600 dark:text-amber-500">
          <AlertTriangle size={24} />
          <h2 className="text-lg font-bold">Apply Template?</h2>
        </div>
        
        <div className="p-5 bg-background">
          <p className="text-sm text-foreground mb-4">
            You are about to apply the <strong>{templateName}</strong> template.
          </p>
          <p className="text-sm text-muted-foreground">
            This will overwrite your current project settings, bylaws, and rate cards. 
            Don&apos;t worry, this action can be undone via the Edit menu.
          </p>
        </div>

        <div className="p-4 border-t border-border bg-muted/30 flex gap-3 justify-end items-center">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }} 
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm rounded-lg shadow-md transition-all active:scale-95"
          >
            <Check size={16} />
            Apply Template
          </button>
        </div>
      </div>
    </div>
  );
}
