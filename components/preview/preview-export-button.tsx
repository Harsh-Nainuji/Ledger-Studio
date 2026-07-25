'use client';

import { QuoteData, SenderInfo } from '@/lib/types';
import { PDFDownloadLink } from '@react-pdf/renderer';
import PDFDocument from './pdf-document';
import { validateMilestones } from '@/lib/validateMilestones';

interface PreviewExportButtonProps {
  quote: QuoteData;
  senderInfo: SenderInfo;
}

export default function PreviewExportButton({
  quote,
  senderInfo,
}: PreviewExportButtonProps) {
  // Quick validation
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

  return (
    <PDFDownloadLink
      document={<PDFDocument quote={quote} senderInfo={senderInfo} />}
      fileName={filename}
      className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-cream bg-ledger-text px-5 py-3 hover:bg-ledger-dark transition-colors"
    >
      {({ loading }) =>
        loading ? 'Generating PDF...' : 'Download PDF'
      }
    </PDFDownloadLink>
  );
}
