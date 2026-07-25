'use client';

import { useRef } from 'react';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const textareaClass =
  'w-full bg-ledger-paper border border-ledger-text/20 px-3 py-2 text-ledger-text placeholder:text-ledger-grey focus:outline-none focus:border-ledger-text text-sm resize-none font-serif leading-relaxed';

const toolbarBtnClass =
  'font-mono text-[9px] uppercase tracking-[0.08em] text-ledger-text bg-ledger-warm border border-ledger-text/20 px-2 py-1 hover:bg-ledger-paper transition-colors';

export default function MarkdownEditor({
  value,
  onChange,
  placeholder,
  rows = 6,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const wrapSelection = (before: string, after: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.slice(start, end);
    const newText =
      value.slice(0, start) + before + selectedText + after + value.slice(end);

    onChange(newText);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    });
  };

  const insertAtLineStart = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const newText =
      value.slice(0, lineStart) + prefix + value.slice(lineStart);

    onChange(newText);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    });
  };

  const insertBlock = (block: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const prefix = start > 0 && value[start - 1] !== '\n' ? '\n' : '';
    const newText = value.slice(0, start) + prefix + block + value.slice(start);

    onChange(newText);

    requestAnimationFrame(() => {
      textarea.focus();
      const newPos = start + prefix.length + block.length;
      textarea.setSelectionRange(newPos, newPos);
    });
  };

  return (
    <div className="space-y-2">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1.5 border border-ledger-text/20 bg-ledger-paper px-2 py-1.5">
        <button
          type="button"
          onClick={() => wrapSelection('**', '**')}
          className={toolbarBtnClass}
          title="Bold"
        >
          <span className="font-bold">B</span>
        </button>
        <button
          type="button"
          onClick={() => wrapSelection('*', '*')}
          className={toolbarBtnClass}
          title="Italic"
        >
          <span className="italic">I</span>
        </button>
        <button
          type="button"
          onClick={() => wrapSelection('_', '_')}
          className={toolbarBtnClass}
          title="Underline"
        >
          <span className="underline">U</span>
        </button>
        <div className="w-[1px] bg-ledger-text/20 mx-1" />
        <button
          type="button"
          onClick={() => insertAtLineStart('- ')}
          className={toolbarBtnClass}
          title="Bullet List"
        >
          &bull; List
        </button>
        <button
          type="button"
          onClick={() => insertAtLineStart('1. ')}
          className={toolbarBtnClass}
          title="Numbered List"
        >
          1. List
        </button>
        <div className="w-[1px] bg-ledger-text/20 mx-1" />
        <button
          type="button"
          onClick={() => insertBlock('\n')}
          className={toolbarBtnClass}
          title="Line Break"
        >
          &crarr; Break
        </button>
      </div>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={textareaClass}
        rows={rows}
      />

      {/* Hint */}
      <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ledger-grey">
        Use <span className="text-ledger-text">**bold**</span>,{' '}
        <span className="text-ledger-text">*italic*</span>,{' '}
        <span className="text-ledger-text">_underline_</span>,{' '}
        <span className="text-ledger-text">- bullet</span>,{' '}
        <span className="text-ledger-text">1. numbered</span>
      </p>
    </div>
  );
}
