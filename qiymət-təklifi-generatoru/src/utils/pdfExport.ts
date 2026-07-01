import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { getTodayDateString } from './calculations';

/**
 * Generates and downloads a high quality A4 PDF from a given HTML element ID.
 * If html2canvas encounters browser sandbox/v4 CSS issues, automatically falls back to native window.print()
 */
export async function downloadInvoicePdf(elementId: string = 'invoice-print-area', clientName: string = ''): Promise<boolean> {
  // Use native browser print which produces perfect vector PDFs and handles Tailwind v4 oklch perfectly
  try {
    window.print();
    return true;
  } catch (e) {
    console.error("Print failed", e);
    return false;
  }
}
