export interface Currency {
  code: string;
  symbol: string;
  locale: string;
  name: string;
  flag: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', locale: 'en-US', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', symbol: '€', locale: 'de-DE', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', symbol: '£', locale: 'en-GB', name: 'British Pound', flag: '🇬🇧' },
  { code: 'INR', symbol: '₹', locale: 'en-IN', name: 'Indian Rupee', flag: '🇮🇳' },
  { code: 'CAD', symbol: 'C$', locale: 'en-CA', name: 'Canadian Dollar', flag: '🇨🇦' },
  { code: 'AUD', symbol: 'A$', locale: 'en-AU', name: 'Australian Dollar', flag: '🇦🇺' },
  { code: 'NZD', symbol: 'NZ$', locale: 'en-NZ', name: 'New Zealand Dollar', flag: '🇳🇿' },
  { code: 'SGD', symbol: 'S$', locale: 'en-SG', name: 'Singapore Dollar', flag: '🇸🇬' },
  { code: 'AED', symbol: 'د.إ', locale: 'ar-AE', name: 'UAE Dirham', flag: '🇦🇪' },
  { code: 'SAR', symbol: '﷼', locale: 'ar-SA', name: 'Saudi Riyal', flag: '🇸🇦' },
  { code: 'JPY', symbol: '¥', locale: 'ja-JP', name: 'Japanese Yen', flag: '🇯🇵' },
  { code: 'CNY', symbol: '¥', locale: 'zh-CN', name: 'Chinese Yuan', flag: '🇨🇳' },
  { code: 'HKD', symbol: 'HK$', locale: 'en-HK', name: 'Hong Kong Dollar', flag: '🇭🇰' },
  { code: 'CHF', symbol: 'CHF', locale: 'de-CH', name: 'Swiss Franc', flag: '🇨🇭' },
  { code: 'SEK', symbol: 'kr', locale: 'sv-SE', name: 'Swedish Krona', flag: '🇸🇪' },
  { code: 'NOK', symbol: 'kr', locale: 'nb-NO', name: 'Norwegian Krone', flag: '🇳🇴' },
  { code: 'DKK', symbol: 'kr', locale: 'da-DK', name: 'Danish Krone', flag: '🇩🇰' },
  { code: 'ZAR', symbol: 'R', locale: 'en-ZA', name: 'South African Rand', flag: '🇿🇦' },
  { code: 'MXN', symbol: '$', locale: 'es-MX', name: 'Mexican Peso', flag: '🇲🇽' },
  { code: 'BRL', symbol: 'R$', locale: 'pt-BR', name: 'Brazilian Real', flag: '🇧🇷' },
];

export const DEFAULT_CURRENCY_CODE = 'USD';

export const getCurrencyByCode = (code: string): Currency => {
  return CURRENCIES.find((c) => c.code === code) ?? CURRENCIES[0];
};
