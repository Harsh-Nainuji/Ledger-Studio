import { Currency } from '@/constants/currencies';
import { getCurrencyByCode } from '@/constants/currencies';

export function formatCurrency(value: number, currency: Currency | string): string {
  const curr = typeof currency === 'string' ? getCurrencyByCode(currency) : currency;
  return new Intl.NumberFormat(curr.locale, {
    style: 'currency',
    currency: curr.code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
