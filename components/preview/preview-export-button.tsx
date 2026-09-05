'use client';

import { useState } from 'react';
import { QuoteData, SenderInfo } from '@/lib/types';
import { pdf } from '@react-pdf/renderer';
import PDFDocument from './pdf-document';
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

  const hasClient = quote.clientInfo.name;
  const hasItems = quote.lineItems.length > 0;
  const milestonesValid = !quote.paymentScheduleEnabled || validateMilestones(quote.milestones).isValid;
  const isValid = hasClient && hasItems && milestonesValid;

  const filename = `quote-${quote.quoteNumber}.pdf`;

  const handleDownload = async () => {
    setLoading(true);
    try {
      const blob = await pdf(<PDFDocument quote={quote} senderInfo={senderInfo} />).toBlob();
      const url = URL.createObjectURL(blob);

      // iOS Safari doesn't support the download attribute on anchor clicks —
      // opening in a new tab is the reliable cross-platform fallback.
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (isMobile) {
        window.open(url, '_blank');
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      } else {
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={handleDownload}
          disabled={loading || !isValid}
          className={`font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-text px-5 py-3 hover:bg-ledger-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full`}
        >
          {loading ? 'Generating PDF...' : 'Download PDF'}
        </button>
        {!isValid && (
          <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-ledger-oxblood space-y-1 text-center md:text-right">
            {!hasClient && <div>* Add client name</div>}
            {!hasItems && <div>* Add line items</div>}
            {!milestonesValid && <div>* Fix payment schedule</div>}
          </div>
        )}
      </div>
    </div>
  );
}
