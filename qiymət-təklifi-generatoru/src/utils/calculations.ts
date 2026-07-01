import { CalculationResult, PaymentMethod, ProductItem } from '../types';

/**
 * Calculates total invoice amounts based on products and payment method
 */
export function calculateTotals(products: ProductItem[], paymentMethod: PaymentMethod, vatRate: number = 18): CalculationResult {
  const subtotal = products.reduce((acc, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unitPrice) || 0;
    return acc + (qty * price);
  }, 0);

  // Əgər ödəniş üsulu köçürmədirsə, 18% ƏDV hesablanır
  let vatAmount = 0;
  if (paymentMethod === 'transfer') {
    vatAmount = subtotal * (vatRate / 100);
  }

  const grandTotal = subtotal + vatAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vatAmount: Math.round(vatAmount * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100
  };
}

/**
 * Rəqəmi PDF nümunəsindəki kimi səliqəli AZN formatına salır (məsələn: 490.0, 3220.0, 3799.6)
 */
export function formatAzn(num: number): string {
  if (isNaN(num) || num === null || num === undefined) return '0.0';
  const rounded = Math.round(num * 100) / 100;
  let str = rounded.toFixed(2);
  if (str.endsWith('0')) {
    str = rounded.toFixed(1);
  }
  return str;
}

/**
 * Bugünkü tarixi DD.MM.YYYY formatında qaytarır
 */
export function getTodayDateString(): string {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
}
