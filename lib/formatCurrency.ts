import { Currency } from '@/constants/currencies';
import { getCurrencyByCode } from '@/constants/currencies';

export function formatCurrency(value: number, currency: Currency | string): string {
  const curr = typeof currency === 'string' ? getCurrencyByCode(currency) : currency;
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${curr.symbol || curr.code} ${value.toFixed(2)}`;
  }
}
