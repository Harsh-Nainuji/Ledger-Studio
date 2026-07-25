'use client';

import { useEffect, useState } from 'react';
import { QuoteData, SenderInfo } from '@/lib/types';
import {
  calculateSubtotal,
  calculateTax,
  calculateGrandTotal,
  formatDate,
} from '@/lib/quote-utils';
import { formatCurrency } from '@/lib/formatCurrency';
import { getCurrencyByCode } from '@/constants/currencies';
import { calculateMilestoneAmounts } from '@/lib/calculateMilestones';
import { markdownToHtml } from '@/lib/markdown';
import gsap from 'gsap';

interface LivePreviewProps {
  quote: QuoteData;
  senderInfo: SenderInfo;
  milestonesValid: boolean;
  effectiveHourlyRate: number;
  minimumHourlyRate: number;
  currencyCode: string;
}

export default function LivePreview({
  quote,
  senderInfo,
  milestonesValid,
  effectiveHourlyRate,
  minimumHourlyRate,
  currencyCode,
}: LivePreviewProps) {
  const currency = getCurrencyByCode(currencyCode);
  const isLosingMoney =
    minimumHourlyRate > 0 && effectiveHourlyRate > 0 && effectiveHourlyRate < minimumHourlyRate;
  const [displayGrandTotal, setDisplayGrandTotal] = useState<number>(0);

  const subtotal = calculateSubtotal(quote.lineItems);
  const tax = calculateTax(subtotal, quote.taxRate);
  const grandTotal = calculateGrandTotal(quote.lineItems, quote.taxRate, quote.discountAmount);

  useEffect(() => {
    if (quote.lineItems.length > 0) {
      const animObj = { value: displayGrandTotal };
      gsap.to(animObj, {
        value: grandTotal,
        duration: 0.6,
        ease: 'power1.out',
        onUpdate: () => setDisplayGrandTotal(animObj.value),
      });
    } else {
      setDisplayGrandTotal(0);
    }
  }, [grandTotal, quote.lineItems.length]);

  return (
    <div className="border border-ledger-text bg-ledger-paper p-6 md:p-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-6 border-b border-ledger-text pb-6 mb-6">
        {senderInfo.logo && (
          <img src={senderInfo.logo} alt="Sender logo" className="h-12 w-auto object-contain" />
        )}
        <div className="text-right">
          <div className="font-serif text-3xl md:text-4xl text-ledger-text">QUOTE</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey mt-1">
            {quote.quoteNumber}
          </div>
        </div>
      </div>

      {/* Quote Details */}
      <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-ledger-grey flex flex-wrap gap-4 md:gap-8 mb-8">
        <div>
          <span className="text-ledger-text">Date:</span> {formatDate(quote.date)}
        </div>
        <div>
          <span className="text-ledger-text">Due:</span> {formatDate(quote.dueDate)}
        </div>
      </div>

      {/* From / To */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-grey mb-2">
            From
          </div>
          {senderInfo.logo && (
            <img src={senderInfo.logo} alt="Sender logo" className="h-8 w-auto object-contain mb-2" />
          )}
          <div className="font-serif text-lg text-ledger-text">
            {senderInfo.company || senderInfo.name}
          </div>
          <div className="font-serif text-sm text-ledger-text leading-relaxed whitespace-pre-line">
            {senderInfo.name && <div>{senderInfo.name}</div>}
            {senderInfo.email && <div>{senderInfo.email}</div>}
            {senderInfo.phone && <div>{senderInfo.phone}</div>}
            {senderInfo.address && <div>{senderInfo.address}</div>}
          </div>
        </div>

        <div className="space-y-2">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-grey mb-2">
            Bill To
          </div>
          {quote.clientInfo.logo && (
            <img src={quote.clientInfo.logo} alt="Client logo" className="h-8 w-auto object-contain mb-2" />
          )}
          <div className="font-serif text-lg text-ledger-text">
            {quote.clientInfo.company || quote.clientInfo.name}
          </div>
          <div className="font-serif text-sm text-ledger-text leading-relaxed whitespace-pre-line">
            {quote.clientInfo.name && <div>{quote.clientInfo.name}</div>}
            {quote.clientInfo.email && <div>{quote.clientInfo.email}</div>}
            {quote.clientInfo.address && <div>{quote.clientInfo.address}</div>}
          </div>
        </div>
      </div>

      {/* Line Items */}
      {quote.lineItems.length > 0 && (
        <div className="mb-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-grey border-b border-ledger-text pb-2 mb-4">
            Services Rendered
          </div>
          <table className="w-full text-sm">
            <tbody>
              {quote.lineItems.map((item) => (
                <tr key={item.id} className="border-b border-ledger-text/10">
                  <td className="py-3 pr-4 align-top">
                    <div className="font-serif text-ledger-text">{item.description}</div>
                  </td>
                  <td className="py-3 pr-4 text-right align-top font-mono text-ledger-grey whitespace-nowrap">
                    {item.quantity}
                  </td>
                  <td className="py-3 pr-4 text-right align-top font-mono text-ledger-grey whitespace-nowrap">
                    {formatCurrency(item.rate, currency)}
                  </td>
                  <td className="py-3 text-right align-top font-mono text-ledger-text whitespace-nowrap">
                    {formatCurrency(item.quantity * item.rate, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      <div className="border-t border-ledger-text pt-6 mb-10 max-w-sm ml-auto">
        <div className="flex justify-between font-mono text-sm text-ledger-text py-1">
          <span className="text-ledger-grey">Subtotal</span>
          <span>{formatCurrency(subtotal, currency)}</span>
        </div>
        {quote.taxRate > 0 && (
          <div className="flex justify-between font-mono text-sm text-ledger-text py-1">
            <span className="text-ledger-grey">Tax ({quote.taxRate}%)</span>
            <span>{formatCurrency(tax, currency)}</span>
          </div>
        )}
        {quote.discountAmount > 0 && (
          <div className="flex justify-between font-mono text-sm text-ledger-text py-1">
            <span className="text-ledger-grey">Discount</span>
            <span>-{formatCurrency(quote.discountAmount, currency)}</span>
          </div>
        )}
        <div
          className={`flex justify-between font-mono text-lg font-bold pt-3 mt-3 border-t ${
            isLosingMoney ? 'border-ledger-oxblood text-ledger-oxblood' : 'border-ledger-text text-ledger-text'
          }`}
        >
          <span>Total</span>
          <span>{formatCurrency(displayGrandTotal, currency)}</span>
        </div>
      </div>

      {isLosingMoney && (
        <div className="border border-ledger-oxblood bg-ledger-warm p-4 mb-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ledger-oxblood font-bold">
            WARNING: This quote falls below your baseline survival rate of{' '}
            {formatCurrency(minimumHourlyRate, currency)}/hr. You are losing money.
          </p>
        </div>
      )}

      {/* Payment Schedule */}
      {quote.paymentScheduleEnabled && quote.milestones.length > 0 && (
        <div className="mb-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-grey border-b border-ledger-text pb-2 mb-4">
            Payment Schedule
          </div>
          <table className="w-full text-sm">
            <tbody>
              {calculateMilestoneAmounts(quote.milestones, grandTotal).map((m) => (
                <tr key={m.id} className="border-b border-ledger-text/10">
                  <td className="py-2 pr-4 font-serif text-ledger-text">{m.name}</td>
                  <td className="py-2 pr-4 text-right font-mono text-ledger-grey">{m.percentage}%</td>
                  <td className="py-2 text-right font-mono text-ledger-text">
                    {formatCurrency(m.amount, currency)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!milestonesValid && (
            <p className="font-mono text-[10px] uppercase tracking-[0.08em] text-ledger-oxblood mt-2">
              Payment schedule allocation is invalid. PDF export is disabled.
            </p>
          )}
        </div>
      )}

      {/* Scope of Work */}
      {quote.scopeOfWork && (
        <div className="mb-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-grey border-b border-ledger-text pb-2 mb-4">
            Scope of Work
          </div>
          <div
            className="font-serif text-sm text-ledger-text leading-relaxed markdown-preview"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(quote.scopeOfWork) }}
          />
        </div>
      )}

      {/* Notes & Terms */}
      {quote.notesAndTerms && (
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-ledger-grey border-b border-ledger-text pb-2 mb-4">
            Notes & Terms
          </div>
          <div
            className="font-serif text-sm text-ledger-text leading-relaxed markdown-preview"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(quote.notesAndTerms) }}
          />
        </div>
      )}
    </div>
  );
}
