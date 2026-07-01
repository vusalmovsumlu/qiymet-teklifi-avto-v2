import React from 'react';
import { CalculationResult, InvoiceInfo, ProductItem } from '../types';
import { formatAzn } from '../utils/calculations';
import { VmsLogo } from './VmsLogo';

interface InvoicePreviewProps {
  info: InvoiceInfo;
  products: ProductItem[];
  totals: CalculationResult;
}

export const InvoicePreview: React.FC<InvoicePreviewProps> = ({ info, products, totals }) => {
  return (
    <div 
      id="invoice-print-area"
      className="bg-white text-[#1a1915] font-sans relative flex flex-col justify-between shadow-2xl mx-auto select-text transition-all duration-300"
      style={{
        width: '100%',
        maxWidth: '210mm',
        minHeight: '297mm',
        padding: '16mm 16mm 12mm 16mm',
        boxSizing: 'border-box'
      }}
    >
      {/* Top & Main Content Container */}
      <div className="flex-grow flex flex-col">
        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#D4AF37]">
          <div className="flex items-center gap-3">
            <VmsLogo className="w-12 h-12" customUrl={info.customLogoUrl} />
            <span className="font-bold text-xl tracking-tight text-[#1a1915]">
              {info.companyName || "VMSC MMC"}
            </span>
          </div>
          <div className="text-right">
            <span className="font-semibold text-lg text-[#b8860b] tracking-wide font-serif">
              Qiymət Təklifi
            </span>
          </div>
        </div>

        {/* Center Title Badge & Subtitle */}
        <div className="text-center my-6">
          <div className="flex justify-center mb-3">
            <VmsLogo className="w-16 h-16" customUrl={info.customLogoUrl} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-widest text-[#1a1915] uppercase">
            QİYMƏT TƏKLİFİ
          </h1>
          <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 mb-4 text-gray-700">
            <div className="h-[1px] w-8 sm:w-16 bg-gray-400"></div>
            <span className="italic text-xs sm:text-sm font-serif px-1">
              {info.clientName || "Sifarişçi"} {info.objectName ? `— ${info.objectName}` : ""} üçün
            </span>
            <div className="h-[1px] w-8 sm:w-16 bg-gray-400"></div>
          </div>
        </div>

        {/* Client & Project Details Header Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm mb-6 pb-3 border-b border-gray-200">
          <div className="space-y-1.5 leading-relaxed">
            <div>
              <span className="font-bold text-gray-900">Sifarişçi: </span>
              <span className="text-gray-800 font-medium">{info.clientName || "—"}</span>
            </div>
            <div>
              <span className="font-bold text-gray-900">Obyekt: </span>
              <span className="text-gray-800 font-medium">{info.objectName || "—"}</span>
            </div>
          </div>

          <div className="space-y-1.5 text-right leading-relaxed">
            <div className="font-bold text-gray-900 text-sm sm:text-base">
              {info.city || "Bakı ş."}
            </div>
            <div>
              <span className="font-bold text-gray-900">Tarix: </span>
              <span className="text-gray-800 font-mono font-semibold">{info.date || "—"}</span>
            </div>
            <div className="text-xs text-gray-500">
              Ödəniş növü: <span className="text-gray-800 font-semibold">{info.paymentMethod === 'transfer' ? 'Köçürmə (ƏDV 18%)' : 'Nağd'}</span>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="mb-6 overflow-hidden border border-gray-300 rounded-sm">
          <table className="w-full border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#191814] text-white text-xs font-semibold tracking-wider">
                <th className="py-2.5 px-2 w-[40px] text-center border-r border-gray-700">№</th>
                <th className="py-2.5 px-3 text-left border-r border-gray-700">Mal adı</th>
                <th className="py-2.5 px-2 w-[70px] text-center border-r border-gray-700">Vahidi</th>
                <th className="py-2.5 px-2 w-[70px] text-center border-r border-gray-700">Miqdar</th>
                <th className="py-2.5 px-2.5 w-[110px] text-right border-r border-gray-700">Vah.Qiymət<br/><span className="text-[10px] text-gray-300 font-normal">(AZN)</span></th>
                <th className="py-2.5 px-2.5 w-[110px] text-right">Məbləğ<br/><span className="text-[10px] text-gray-300 font-normal">(AZN)</span></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 italic bg-gray-50/50">
                    Siyahıya məhsul əlavə edilməyib...
                  </td>
                </tr>
              ) : (
                products.map((item, index) => {
                  const itemTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
                  return (
                    <tr key={item.id} className="hover:bg-amber-50/30 transition-colors text-gray-800">
                      <td className="py-2.5 px-2 text-center font-medium text-gray-600 border-r border-gray-300">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-gray-900 border-r border-gray-300">
                        {item.name || "Adsız məhsul"}
                      </td>
                      <td className="py-2.5 px-2 text-center text-gray-700 border-r border-gray-300">
                        {item.unit || "ədəd"}
                      </td>
                      <td className="py-2.5 px-2 text-center font-semibold text-gray-900 border-r border-gray-300">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-2.5 text-right font-mono text-gray-800 border-r border-gray-300">
                        {formatAzn(Number(item.unitPrice) || 0)}
                      </td>
                      <td className="py-2.5 px-2.5 text-right font-mono font-semibold text-gray-900">
                        {formatAzn(itemTotal)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {/* Summary Box Attached beneath table */}
          <div className="flex justify-end bg-white border-t border-gray-300">
            <div className="w-[260px] sm:w-[320px] divide-y divide-gray-200 text-xs sm:text-sm">
              <div className="flex items-center justify-between py-2 px-4">
                <span className="font-bold text-gray-800">Cəmi:</span>
                <span className="font-mono font-bold text-gray-900">{formatAzn(totals.subtotal)} AZN</span>
              </div>

              {info.paymentMethod === 'transfer' ? (
                <div className="flex items-center justify-between py-2 px-4 bg-gray-50/80">
                  <span className="font-bold text-gray-800">ƏDV ({info.vatRate}%):</span>
                  <span className="font-mono font-bold text-gray-900">{formatAzn(totals.vatAmount)} AZN</span>
                </div>
              ) : (
                <div className="flex items-center justify-between py-1.5 px-4 bg-gray-50/40 text-xs text-gray-500">
                  <span>ƏDV (18%):</span>
                  <span className="italic">Şamil edilmir (Nağd)</span>
                </div>
              )}

              <div className="flex items-center justify-between py-2.5 px-4 bg-[#fef9e7] border-t-2 border-[#D4AF37]">
                <span className="font-black text-[#b8860b] text-sm sm:text-base">Yekun Məbləğ:</span>
                <span className="font-mono font-black text-[#b8860b] text-sm sm:text-base">{formatAzn(totals.grandTotal)} AZN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Note Line */}
        {info.note && (
          <div className="mb-10 text-xs sm:text-sm leading-relaxed">
            <span className="text-[#b8860b] font-bold">Qeyd: </span>
            <span className="italic text-gray-700">{info.note}</span>
          </div>
        )}

        {/* Signatures Block */}
        <div className="mt-8 pt-4 grid grid-cols-2 items-end gap-6 sm:gap-8 text-xs sm:text-sm">
          <div className="space-y-1 text-gray-900">
            <div className="font-bold text-sm sm:text-base">{info.directorCompany || "VMSC MMC"}</div>
            <div className="font-bold">{info.directorTitle || "Direktor:"}</div>
          </div>

          <div className="text-right pb-1">
            <div className="font-semibold text-gray-900 text-sm sm:text-base">
              {info.directorName || "Mövsümov Vüqar Camal oğlu"}
            </div>
          </div>
        </div>
      </div>

      {/* Document Footer */}
      <div className="mt-12 pt-3 border-t-2 border-[#D4AF37] text-center">
        <p className="text-[10px] sm:text-[11px] text-gray-600 font-medium tracking-wider">
          {info.footerContact || "VMSC MMC • Bakı, Azərbaycan • Tel: +994 50 253 34 51"}
        </p>
      </div>
    </div>
  );
};
