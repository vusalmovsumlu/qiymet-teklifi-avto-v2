export type UnitType = 'ədəd' | 'metr' | 'komplekt' | 'm²' | 'm³' | 'kq' | 'litr' | 'qutu' | 'bağlama' | 'rulon' | 'saat';

export type PaymentMethod = 'transfer' | 'cash'; // transfer = Köçürmə (ƏDV 18%), cash = Nağd

export interface ProductItem {
  id: string;
  name: string;
  unit: UnitType | string;
  quantity: number | string;
  unitPrice: number | string;
}

export interface InvoiceInfo {
  companyName: string;
  clientName: string;
  objectName: string;
  city: string;
  date: string; // DD.MM.YYYY
  paymentMethod: PaymentMethod;
  vatRate: number; // 18 by default
  note: string;
  directorCompany: string;
  directorTitle: string;
  directorName: string;
  footerContact: string;
  customLogoUrl?: string;
}

export interface CalculationResult {
  subtotal: number;
  vatAmount: number;
  grandTotal: number;
}
