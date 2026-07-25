'use client';

import {
  Document,
  Image,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer';
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
import { parseMarkdownBlocks, parseInlineSegments, type InlineSegment } from '@/lib/markdown';

const SERIF = 'Times-Roman';
const MONO = 'Courier';
const SERIF_BOLD = 'Times-Bold';
const MONO_BOLD = 'Courier-Bold';

const COLORS = {
  cream: '#f5f1ed',
  ink: '#1a1918',
  inkMuted: '#2c2a28',
  grey: '#9b8f88',
};

interface PDFDocumentProps {
  quote: QuoteData;
  senderInfo: SenderInfo;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 10,
    fontFamily: SERIF,
    backgroundColor: '#ffffff',
    color: COLORS.ink,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    width: 100,
    height: 50,
    objectFit: 'contain',
  },
  quoteNumber: {
    fontSize: 24,
    fontFamily: SERIF,
    fontWeight: 700,
    color: COLORS.ink,
    marginBottom: 4,
  },
  date: {
    fontSize: 9,
    fontFamily: MONO,
    color: COLORS.inkMuted,
    textTransform: 'uppercase',
  },
  entityGrid: {
    borderWidth: 2,
    borderColor: COLORS.ink,
    borderStyle: 'solid',
    flexDirection: 'row',
    marginBottom: 20,
  },
  entityColumn: {
    flex: 1,
    padding: 12,
  },
  entityDivider: {
    borderRightWidth: 1.5,
    borderRightColor: COLORS.ink,
    borderRightStyle: 'solid',
  },
  entityLabel: {
    fontSize: 8,
    fontFamily: MONO,
    color: COLORS.grey,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  entityValue: {
    fontSize: 9,
    fontFamily: MONO,
    color: COLORS.inkMuted,
    marginBottom: 2,
  },
  entityName: {
    fontSize: 11,
    fontFamily: MONO,
    fontWeight: 700,
    color: COLORS.ink,
    marginBottom: 6,
  },
  table: {
    borderWidth: 1.5,
    borderColor: COLORS.ink,
    borderStyle: 'solid',
    marginBottom: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.ink,
    borderBottomStyle: 'solid',
  },
  tableHeader: {
    backgroundColor: COLORS.cream,
  },
  tableCell: {
    padding: 8,
    fontSize: 10,
    fontFamily: MONO,
    color: COLORS.inkMuted,
    borderRightWidth: 1.5,
    borderRightColor: COLORS.ink,
    borderRightStyle: 'solid',
  },
  tableCellLast: {
    borderRightWidth: 0,
  },
  tableCellRight: {
    textAlign: 'right',
  },
  tableHeaderCell: {
    padding: 8,
    fontSize: 9,
    fontFamily: MONO,
    fontWeight: 700,
    color: COLORS.ink,
    textTransform: 'uppercase',
    borderRightWidth: 1.5,
    borderRightColor: COLORS.ink,
    borderRightStyle: 'solid',
  },
  tableHeaderCellLast: {
    borderRightWidth: 0,
  },
  colDescription: {
    flex: 4,
  },
  colQty: {
    flex: 1,
  },
  colRate: {
    flex: 1.5,
  },
  colTotal: {
    flex: 1.5,
  },
  summaryBlock: {
    alignSelf: 'flex-end',
    width: 200,
    borderWidth: 1.5,
    borderColor: COLORS.ink,
    borderStyle: 'solid',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.inkMuted,
    borderBottomStyle: 'solid',
  },
  summaryLabel: {
    fontSize: 9,
    fontFamily: MONO,
    color: COLORS.grey,
    textTransform: 'uppercase',
  },
  summaryValue: {
    fontSize: 10,
    fontFamily: MONO,
    color: COLORS.inkMuted,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: COLORS.cream,
    borderTopWidth: 2,
    borderTopColor: COLORS.ink,
    borderTopStyle: 'solid',
  },
  summaryTotalLabel: {
    fontSize: 10,
    fontFamily: MONO,
    fontWeight: 700,
    color: COLORS.ink,
    textTransform: 'uppercase',
  },
  summaryTotalValue: {
    fontSize: 12,
    fontFamily: MONO,
    fontWeight: 700,
    color: COLORS.ink,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: MONO,
    color: COLORS.ink,
    textTransform: 'uppercase',
    marginBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.ink,
    borderBottomStyle: 'solid',
    paddingBottom: 4,
  },
  markdownText: {
    fontSize: 10,
    fontFamily: SERIF,
    color: COLORS.inkMuted,
    lineHeight: 1.6,
    marginBottom: 4,
  },
  mdTable: {
    borderWidth: 1,
    borderColor: COLORS.inkMuted,
    borderStyle: 'solid',
    marginBottom: 8,
  },
  mdTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.inkMuted,
    borderBottomStyle: 'solid',
  },
  mdTableCell: {
    flex: 1,
    padding: 4,
    fontSize: 9,
    fontFamily: MONO,
    color: COLORS.inkMuted,
    borderRightWidth: 0.5,
    borderRightColor: COLORS.inkMuted,
    borderRightStyle: 'solid',
  },
  mdTableHeaderCell: {
    flex: 1,
    padding: 4,
    backgroundColor: COLORS.cream,
    fontSize: 9,
    fontFamily: MONO,
    fontWeight: 700,
    color: COLORS.ink,
    borderRightWidth: 0.5,
    borderRightColor: COLORS.inkMuted,
    borderRightStyle: 'solid',
  },
});

function renderInline(segments: InlineSegment[]) {
  return segments.map((seg, i) => {
    const style: Record<string, string | number> = { fontFamily: SERIF };
    if (seg.bold) style.fontFamily = SERIF_BOLD;
    if (seg.italic) style.fontStyle = 'italic';
    if (seg.underline) style.textDecoration = 'underline';
    return (
      <Text key={`s-${i}`} style={style as any}>
        {seg.text}
      </Text>
    );
  });
}

function MarkdownPdf({ content }: { content: string }) {
  const blocks = parseMarkdownBlocks(content);
  return (
    <>
      {blocks.map((block, bi) => {
        if (block.type === 'paragraph' && block.text) {
          return (
            <View key={`p-${bi}`} style={{ marginBottom: 6 }}>
              <Text style={styles.markdownText}>
                {renderInline(parseInlineSegments(block.text))}
              </Text>
            </View>
          );
        }
        if (block.type === 'bullet-list' && block.items) {
          return block.items.map((item, ii) => (
            <View key={`ul-${bi}-${ii}`} style={{ flexDirection: 'row', marginBottom: 2 }}>
              <Text style={[styles.markdownText, { width: 12 }]}>{'\u2022  '}</Text>
              <Text style={styles.markdownText}>{renderInline(parseInlineSegments(item))}</Text>
            </View>
          ));
        }
        if (block.type === 'numbered-list' && block.items) {
          return block.items.map((item, ii) => (
            <View key={`ol-${bi}-${ii}`} style={{ flexDirection: 'row', marginBottom: 2 }}>
              <Text style={[styles.markdownText, { width: 18 }]}>{`${ii + 1}.  `}</Text>
              <Text style={styles.markdownText}>{renderInline(parseInlineSegments(item))}</Text>
            </View>
          ));
        }
        if (block.type === 'table') {
          return (
            <View key={`table-${bi}`} style={styles.mdTable}>
              <View style={styles.mdTableRow}>
                {block.headers.map((h, hi) => (
                  <View key={`h-${hi}`} style={styles.mdTableHeaderCell}>
                    <Text>{renderInline(parseInlineSegments(h))}</Text>
                  </View>
                ))}
              </View>
              {block.rows.map((row, ri) => (
                <View key={`row-${ri}`} style={styles.mdTableRow}>
                  {row.cells.map((cell, ci) => (
                    <View key={`c-${ci}`} style={styles.mdTableCell}>
                      <Text>{renderInline(parseInlineSegments(cell))}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          );
        }
        return null;
      })}
    </>
  );
}

export default function PDFDocument({ quote, senderInfo }: PDFDocumentProps) {
  const currency = getCurrencyByCode(quote.currencyCode);
  const subtotal = calculateSubtotal(quote.lineItems);
  const tax = calculateTax(subtotal, quote.taxRate);
  const grandTotal = calculateGrandTotal(quote.lineItems, quote.taxRate, quote.discountAmount);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.quoteNumber}>{quote.quoteNumber}</Text>
            <Text style={styles.date}>Date: {formatDate(quote.date)}</Text>
            <Text style={styles.date}>Due: {formatDate(quote.dueDate)}</Text>
          </View>
          <View style={styles.headerRight}>
            {senderInfo.logo ? <Image src={{ uri: senderInfo.logo }} style={styles.logo} /> : <View />}
          </View>
        </View>

        <View style={styles.entityGrid}>
          <View style={[styles.entityColumn, styles.entityDivider]}>
            <Text style={styles.entityLabel}>FROM</Text>
            <Text style={styles.entityName}>{senderInfo.company || senderInfo.name}</Text>
            {senderInfo.name && <Text style={styles.entityValue}>{senderInfo.name}</Text>}
            {senderInfo.email && <Text style={styles.entityValue}>{senderInfo.email}</Text>}
            {senderInfo.phone && <Text style={styles.entityValue}>{senderInfo.phone}</Text>}
            {senderInfo.address && <Text style={styles.entityValue}>{senderInfo.address}</Text>}
          </View>
          <View style={styles.entityColumn}>
            <Text style={styles.entityLabel}>BILL TO</Text>
            <Text style={styles.entityName}>{quote.clientInfo.company || quote.clientInfo.name}</Text>
            {quote.clientInfo.name && <Text style={styles.entityValue}>{quote.clientInfo.name}</Text>}
            {quote.clientInfo.email && <Text style={styles.entityValue}>{quote.clientInfo.email}</Text>}
            {quote.clientInfo.address && <Text style={styles.entityValue}>{quote.clientInfo.address}</Text>}
          </View>
        </View>

        {quote.lineItems.length > 0 && (
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeader]}>
              <View style={[styles.tableCell, styles.colDescription, styles.tableHeaderCell]}>
                <Text>Description</Text>
              </View>
              <View style={[styles.tableCell, styles.colQty, styles.tableHeaderCell, styles.tableCellRight, styles.tableHeaderCellLast]}>
                <Text>Qty</Text>
              </View>
              <View style={[styles.tableCell, styles.colRate, styles.tableHeaderCell, styles.tableCellRight, styles.tableHeaderCellLast]}>
                <Text>Rate</Text>
              </View>
              <View style={[styles.tableCell, styles.colTotal, styles.tableHeaderCell, styles.tableCellRight, styles.tableHeaderCellLast]}>
                <Text>Total</Text>
              </View>
            </View>
            {quote.lineItems.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.colDescription]}>
                  <Text>{item.description}</Text>
                </View>
                <View style={[styles.tableCell, styles.colQty, styles.tableCellRight, styles.tableCellLast]}>
                  <Text>{item.quantity}</Text>
                </View>
                <View style={[styles.tableCell, styles.colRate, styles.tableCellRight, styles.tableCellLast]}>
                  <Text>{formatCurrency(item.rate, currency)}</Text>
                </View>
                <View style={[styles.tableCell, styles.colTotal, styles.tableCellRight, styles.tableCellLast]}>
                  <Text>{formatCurrency(item.quantity * item.rate, currency)}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.summaryBlock}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal, currency)}</Text>
          </View>
          {quote.taxRate > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax ({quote.taxRate}%)</Text>
              <Text style={styles.summaryValue}>{formatCurrency(tax, currency)}</Text>
            </View>
          )}
          {quote.discountAmount > 0 && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Discount</Text>
              <Text style={styles.summaryValue}>-{formatCurrency(quote.discountAmount, currency)}</Text>
            </View>
          )}
          <View style={styles.summaryTotal}>
            <Text style={styles.summaryTotalLabel}>Grand Total</Text>
            <Text style={styles.summaryTotalValue}>{formatCurrency(grandTotal, currency)}</Text>
          </View>
        </View>

        {quote.paymentScheduleEnabled && quote.milestones.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment Schedule</Text>
            <View style={styles.table}>
              <View style={[styles.tableRow, styles.tableHeader]}>
                <View style={[styles.tableCell, styles.colDescription, styles.tableHeaderCell]}>
                  <Text>Milestone</Text>
                </View>
                <View style={[styles.tableCell, styles.colQty, styles.tableHeaderCell, styles.tableCellRight, styles.tableHeaderCellLast]}>
                  <Text>%</Text>
                </View>
                <View style={[styles.tableCell, styles.colTotal, styles.tableHeaderCell, styles.tableCellRight, styles.tableHeaderCellLast]}>
                  <Text>Amount</Text>
                </View>
              </View>
              {calculateMilestoneAmounts(quote.milestones, grandTotal).map((m) => (
                <View key={m.id} style={styles.tableRow}>
                  <View style={[styles.tableCell, styles.colDescription]}>
                    <Text>{m.name}</Text>
                  </View>
                  <View style={[styles.tableCell, styles.colQty, styles.tableCellRight, styles.tableCellLast]}>
                    <Text>{m.percentage}%</Text>
                  </View>
                  <View style={[styles.tableCell, styles.colTotal, styles.tableCellRight, styles.tableCellLast]}>
                    <Text>{formatCurrency(m.amount, currency)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {quote.scopeOfWork && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scope of Work</Text>
            <MarkdownPdf content={quote.scopeOfWork} />
          </View>
        )}

        {quote.notesAndTerms && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes & Terms</Text>
            <MarkdownPdf content={quote.notesAndTerms} />
          </View>
        )}
      </Page>
    </Document>
  );
}
