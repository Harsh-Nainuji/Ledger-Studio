'use client';

import { useState, useEffect } from 'react';
import { QuoteData, SenderInfo } from '@/lib/types';
import { validateMilestones } from '@/lib/validateMilestones';

interface PreviewExportButtonProps {
  quote: QuoteData;
  senderInfo: SenderInfo;
  className?: string;
}

export default function PreviewExportButton({
  quote,
  senderInfo,
  className = '',
}: PreviewExportButtonProps) {
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hasClient = quote.clientInfo.name;
  const hasItems = quote.lineItems.length > 0;
  const milestonesValid = !quote.paymentScheduleEnabled || validateMilestones(quote.milestones).isValid;
  const isValid = hasClient && hasItems && milestonesValid;

  const filename = `quote-${quote.quoteNumber}.pdf`;

  if (!isValid) {
    return (
      <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ledger-oxblood space-y-1">
        {!hasClient && <div>Add client name</div>}
        {!hasItems && <div>Add line items</div>}
        {!milestonesValid && <div>Fix payment schedule allocation</div>}
      </div>
    );
  }

  const handleDownload = async () => {
    if (!mounted) return;
    setLoading(true);
    try {
      // Dynamically import to avoid SSR/mobile rendering issues
      const [{ pdf }, { default: PDFDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('./pdf-document'),
      ]);
      const blob = await pdf(<PDFDocument quote={quote} senderInfo={senderInfo} />).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className={`font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-text px-5 py-3 hover:bg-ledger-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {loading ? 'Generating PDF...' : 'Download PDF'}
    </button>
  );
}
