'use client';

import MarkdownEditor from './markdown-editor';

interface ScopeOfWorkEditorProps {
  scopeOfWork: string;
  notesAndTerms: string;
  onScopeUpdate: (scope: string) => void;
  onNotesUpdate: (notes: string) => void;
}

const labelClass =
  'block font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mb-2';

export default function ScopeOfWorkEditor({
  scopeOfWork,
  notesAndTerms,
  onScopeUpdate,
  onNotesUpdate,
}: ScopeOfWorkEditorProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>Scope of Work</label>
        <MarkdownEditor
          placeholder="Describe the scope of work, deliverables, and project details..."
          value={scopeOfWork}
          onChange={onScopeUpdate}
          rows={6}
        />
      </div>

      <div>
        <label className={labelClass}>Notes & Terms</label>
        <MarkdownEditor
          placeholder="Add payment terms, conditions, warranty information, etc..."
          value={notesAndTerms}
          onChange={onNotesUpdate}
          rows={6}
        />
      </div>
    </div>
  );
}
