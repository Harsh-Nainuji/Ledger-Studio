import { Currency } from '@/constants/currencies';
import { getCurrencyByCode } from '@/constants/currencies';

export function formatCurrency(value: number, currency: Currency | string): string {
  const curr = typeof currency === 'string' ? getCurrencyByCode(currency) : currency;
  const numFormatted = value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const symbol = curr.symbol || curr.code;
  const space = /^[A-Za-z]+$/.test(symbol) ? ' ' : '';
  return `${symbol}${space}${numFormatted}`;
}
