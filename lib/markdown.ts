function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function parseInlineHtml(text: string): string {
  let result = escapeHtml(text);
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
  result = result.replace(/_(.+?)_/g, '<u>$1</u>');
  return result;
}

function parseTableRow(line: string): string[] {
  return line
    .split('|')
    .filter((_, i, arr) => i > 1 - (line.startsWith('|') ? 1 : 0) && i < arr.length - (line.endsWith('|') ? 1 : 0))
    .map((cell) => cell.trim());
}

function isTableLine(line: string): boolean {
  return /^\s*\|?[^\n]+\|\s*[^\n]+\|?\s*$/.test(line);
}

function isTableSeparator(line: string): boolean {
  return /^\s*\|?\s*[-:]+\s*(\|\s*[-:]+\s*)*\|?\s*$/.test(line);
}

export function markdownToHtml(md: string): string {
  if (!md.trim()) return '';

  const lines = md.split('\n');
  const htmlParts: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    const bulletMatch = line.match(/^\s*[-]\s+(.*)/);
    const numberedMatch = line.match(/^\s*\d+[.]\s+(.*)/);
    const isTable = isTableLine(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1]);

    if (isTable) {
      const headers = parseTableRow(lines[i]);
      i += 2; // skip header and separator
      const rows: string[][] = [];
      while (i < lines.length && isTableLine(lines[i])) {
        rows.push(parseTableRow(lines[i]));
        i++;
      }
      const headerHtml = `<tr>${headers.map((h) => `<th>${parseInlineHtml(h)}</th>`).join('')}</tr>`;
      const bodyHtml = rows
        .map(
          (row) =>
            `<tr>${row.map((cell) => `<td>${parseInlineHtml(cell)}</td>`).join('')}</tr>`
        )
        .join('');
      htmlParts.push(
        `<table class="markdown-table"><thead>${headerHtml}</thead><tbody>${bodyHtml}</tbody></table>`
      );
    } else if (bulletMatch) {
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^\s*[-]\s+(.*)/);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      htmlParts.push(
        `<ul>${items.map((item) => `<li>${parseInlineHtml(item)}</li>`).join('')}</ul>`
      );
    } else if (numberedMatch) {
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^\s*\d+[.]\s+(.*)/);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      htmlParts.push(
        `<ol>${items.map((item) => `<li>${parseInlineHtml(item)}</li>`).join('')}</ol>`
      );
    } else {
      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].match(/^\s*[-]\s+/) &&
        !lines[i].match(/^\s*\d+[.]\s+/) &&
        !(
          i < lines.length - 1 &&
          isTableLine(lines[i]) &&
          i + 1 < lines.length &&
          isTableSeparator(lines[i + 1])
        )
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      htmlParts.push(`<p>${parseInlineHtml(paraLines.join('<br/>'))}</p>`);
    }
  }

  return htmlParts.join('');
}

export interface InlineSegment {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
}

export function parseInlineSegments(text: string): InlineSegment[] {
  const segments: InlineSegment[] = [];
  let remaining = text;

  const patterns: Array<{ regex: RegExp; style: keyof InlineSegment }> = [
    { regex: /\*\*(.+?)\*\*/, style: 'bold' },
    { regex: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/, style: 'italic' },
    { regex: /_(.+?)_/, style: 'underline' },
  ];

  while (remaining.length > 0) {
    let earliestMatch: RegExpMatchArray | null = null;
    let earliestStyle: keyof InlineSegment | null = null;
    let earliestIndex = remaining.length;

    for (const { regex, style } of patterns) {
      const match = remaining.match(regex);
      if (match && match.index !== undefined && match.index < earliestIndex) {
        earliestIndex = match.index;
        earliestMatch = match;
        earliestStyle = style;
      }
    }

    if (!earliestMatch || earliestStyle === null) {
      if (remaining) segments.push({ text: remaining });
      break;
    }

    if (earliestMatch.index! > 0) {
      segments.push({ text: remaining.slice(0, earliestMatch.index!) });
    }

    segments.push({
      text: earliestMatch[1],
      [earliestStyle]: true,
    });

    remaining = remaining.slice(earliestMatch.index! + earliestMatch[0].length);
  }

  return segments;
}

export interface MarkdownTableRow {
  cells: string[];
}

export interface MarkdownTableBlock {
  type: 'table';
  headers: string[];
  rows: MarkdownTableRow[];
}

export type MarkdownBlock =
  | { type: 'paragraph'; text: string }
  | { type: 'bullet-list'; items: string[] }
  | { type: 'numbered-list'; items: string[] }
  | MarkdownTableBlock;

export function parseMarkdownBlocks(md: string): MarkdownBlock[] {
  if (!md.trim()) return [];

  const lines = md.split('\n');
  const blocks: MarkdownBlock[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') {
      i++;
      continue;
    }

    const bulletMatch = line.match(/^\s*[-]\s+(.*)/);
    const numberedMatch = line.match(/^\s*\d+[.]\s+(.*)/);
    const isTable = isTableLine(line) && i + 1 < lines.length && isTableSeparator(lines[i + 1]);

    if (isTable) {
      const headers = parseTableRow(lines[i]);
      i += 2; // skip header and separator
      const rows: MarkdownTableRow[] = [];
      while (i < lines.length && isTableLine(lines[i])) {
        rows.push({ cells: parseTableRow(lines[i]) });
        i++;
      }
      blocks.push({ type: 'table', headers, rows });
    } else if (bulletMatch) {
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^\s*[-]\s+(.*)/);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      blocks.push({ type: 'bullet-list', items });
    } else if (numberedMatch) {
      const items: string[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^\s*\d+[.]\s+(.*)/);
        if (!m) break;
        items.push(m[1]);
        i++;
      }
      blocks.push({ type: 'numbered-list', items });
    } else {
      const paraLines: string[] = [];
      while (
        i < lines.length &&
        lines[i].trim() !== '' &&
        !lines[i].match(/^\s*[-]\s+/) &&
        !lines[i].match(/^\s*\d+[.]\s+/) &&
        !(
          i < lines.length - 1 &&
          isTableLine(lines[i]) &&
          i + 1 < lines.length &&
          isTableSeparator(lines[i + 1])
        )
      ) {
        paraLines.push(lines[i]);
        i++;
      }
      blocks.push({ type: 'paragraph', text: paraLines.join('\n') });
    }
  }

  return blocks;
}
