import React, { useState } from 'react';
import { Plus, Trash2, Download, FileText, Settings2, Sparkles, Building2, UserCheck } from 'lucide-react';
import { InvoiceInfo, PaymentMethod, ProductItem, UnitType } from './types';
import { calculateTotals, formatAzn, getTodayDateString } from './utils/calculations';
import { downloadInvoicePdf } from './utils/pdfExport';
import { InvoicePreview } from './components/InvoicePreview';

const defaultUnits: UnitType[] = ['ədəd', 'metr', 'komplekt', 'm²', 'm³', 'kq', 'litr', 'qutu', 'bağlama', 'rulon', 'saat'];

export default function App() {
  // Sənəd məlumatları
  const [info, setInfo] = useState<InvoiceInfo>({
    companyName: 'VMSC MMC',
    clientName: 'Asnaf Sənaye Şirkəti',
    objectName: 'Parkside Hotel & Apartments',
    city: 'Bakı ş.',
    date: getTodayDateString(),
    paymentMethod: 'transfer', // köçürmə seçiləndə 18% ƏDV hesablanır
    vatRate: 18,
    note: 'Bu qiymət təklifi 15 (on beş) təqvim günü ərzində keçərlidir.',
    directorCompany: 'VMSC MMC',
    directorTitle: 'Direktor:',
    directorName: 'Mövsümov Vüqar Camal oğlu',
    footerContact: 'VMSC MMC • Bakı, Azərbaycan • Tel: +994 50 253 34 51',
    customLogoUrl: ''
  });

  // Məhsullar siyahısı (PDF nümunəsindəki kimi standart 3 məhsul ilə başlayır)
  const [products, setProducts] = useState<ProductItem[]>([
    { id: '1', name: 'Yataq (200×90 sm)', unit: 'ədəd', quantity: 2, unitPrice: 490 },
    { id: '2', name: 'Kürəklik (300×40 sm)', unit: 'ədəd', quantity: 1, unitPrice: 440 },
    { id: '3', name: 'Arakəsmə sütun 2 qollu (410×125×20 sm)', unit: 'ədəd', quantity: 1, unitPrice: 1800 }
  ]);

  // Form input states (Yeni məhsul əlavə etmək üçün)
  const [newName, setNewName] = useState('');
  const [newUnit, setNewUnit] = useState<string>('ədəd');
  const [newQty, setNewQty] = useState<number | string>(1);
  const [newPrice, setNewPrice] = useState<number | string>('');

  // Sifarişçi və ya şirkət parametrlərini açmaq üçün tab state
  const [activeTab, setActiveTab] = useState<'products' | 'details'>('products');
  const [isExporting, setIsExporting] = useState(false);

  // Yekun hesablamalar
  const totals = calculateTotals(products, info.paymentMethod, info.vatRate);

  // Məhsul əlavə et
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: ProductItem = {
      id: Date.now().toString(),
      name: newName.trim(),
      unit: newUnit,
      quantity: Number(newQty) || 1,
      unitPrice: Number(newPrice) || 0
    };

    setProducts([...products, newItem]);
    setNewName('');
    setNewQty(1);
    setNewPrice('');
  };

  // Məhsulu siyahıdan sil
  const handleRemoveProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Məhsul miqdarını və ya qiymətini cədvəl içindən dərhal dəyiş
  const handleUpdateProduct = (id: string, field: keyof ProductItem, val: any) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        return { ...p, [field]: val };
      }
      return p;
    }));
  };

  // Ödəniş üsulunu dəyiş
  const handlePaymentChange = (method: PaymentMethod) => {
    setInfo({ ...info, paymentMethod: method });
  };

  // PDF yüklə
  const handleDownloadPdf = async () => {
    setIsExporting(true);
    await downloadInvoicePdf('invoice-print-area', info.clientName);
    setIsExporting(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Header Navigation - Professional Polish Theme */}
      <header className="bg-white border-b border-slate-200 px-4 sm:px-8 py-4 flex flex-wrap justify-between items-center gap-4 sticky top-0 z-50 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center shadow-sm shadow-blue-500/20">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800">
              Qiymət Təklifi Generatoru <span className="text-blue-600 font-mono text-xs font-semibold px-1.5 py-0.5 bg-blue-50 rounded">PRO</span>
            </h1>
          </div>
        </div>

        <div className="flex gap-3 sm:gap-4 items-center ml-auto">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 font-medium px-3 py-1.5 bg-slate-100 rounded-md">
            <span>Tarix:</span>
            <span className="font-mono text-slate-800 font-bold">{info.date}</span>
          </div>

          <button 
            onClick={handleDownloadPdf}
            disabled={isExporting}
            className="bg-blue-600 text-white px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${isExporting ? 'animate-bounce' : ''}`} />
            <span>{isExporting ? 'PDF Hazırlanır...' : 'PDF-i Yadda Saxla'}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row p-4 sm:p-6 gap-6 max-w-[1700px] w-full mx-auto">
        
        {/* Left Column: Input Form (Professional Polish Card) */}
        <section className="w-full lg:w-[420px] xl:w-[460px] shrink-0 bg-white rounded-xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
          
          {/* Tab switches */}
          <div className="flex border-b border-slate-200 bg-slate-50/70 p-1.5 gap-1">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Məhsul & Ödəniş</span>
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'details'
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Sifarişçi & Şirkət</span>
            </button>
          </div>

          <div className="p-5 sm:p-6 flex-1 flex flex-col gap-6 overflow-y-auto max-h-[calc(100vh-140px)]">
            {activeTab === 'products' ? (
              <>
                {/* Yeni məhsul əlavə etmək üçün form */}
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                    <span>Məhsul Əlavə Et</span>
                    <div className="h-[1px] flex-1 bg-slate-100"></div>
                  </h2>

                  <form onSubmit={handleAddProduct} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">MƏHSULUN ADI</label>
                      <input 
                        type="text" 
                        value={newName} 
                        onChange={e => setNewName(e.target.value)}
                        placeholder="Məs: Alüminium Profil X12 və ya Yataq"
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all bg-slate-50/50 focus:bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">MİQDAR</label>
                        <input 
                          type="number" 
                          step="any"
                          min="0.1"
                          value={newQty} 
                          onChange={e => setNewQty(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">ÖLÇÜ VAHİDİ</label>
                        <select 
                          value={newUnit} 
                          onChange={e => setNewUnit(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all bg-white cursor-pointer"
                        >
                          {defaultUnits.map(u => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">VAHİD QİYMƏT (AZN)</label>
                      <input 
                        type="number" 
                        step="any"
                        placeholder="0.00"
                        value={newPrice} 
                        onChange={e => setNewPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm transition-all font-mono font-semibold"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!newName.trim()}
                      className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm mt-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Siyahıya Əlavə Et</span>
                    </button>
                  </form>
                </div>

                {/* Siyahıdakı məhsullar idarəetməsi */}
                <div className="space-y-3">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <span>Cari Məhsullar ({products.length})</span>
                    <div className="h-[1px] flex-1 bg-slate-100"></div>
                  </h2>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {products.length === 0 ? (
                      <p className="text-xs text-slate-400 italic text-center py-4">Siyahı boşdur</p>
                    ) : (
                      products.map((p, idx) => (
                        <div key={p.id} className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg flex items-center gap-2.5 text-xs hover:border-slate-300 transition-all group">
                          <span className="font-mono font-bold text-slate-400 text-[11px] w-4">{idx + 1}.</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-slate-800 truncate">{p.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <input 
                                type="number" 
                                className="w-14 px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-center text-xs"
                                value={p.quantity}
                                onChange={e => handleUpdateProduct(p.id, 'quantity', e.target.value)}
                              />
                              <span className="text-slate-500">{p.unit}</span>
                              <span className="text-slate-300">×</span>
                              <input 
                                type="number" 
                                className="w-20 px-1 py-0.5 bg-white border border-slate-200 rounded font-mono text-right text-xs font-semibold"
                                value={p.unitPrice}
                                onChange={e => handleUpdateProduct(p.id, 'unitPrice', e.target.value)}
                              />
                              <span className="text-slate-500">AZN</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => handleRemoveProduct(p.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Ödəniş Üsulu Bölməsi (İstifadəçi tələbi: Nağd / Köçürmə 18% ƏDV) */}
                <div className="pt-4 border-t border-slate-200 mt-auto">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="block text-xs font-bold text-slate-700 tracking-wide uppercase">ÖDƏNİŞ ÜSULU</label>
                    <span className="text-[11px] text-blue-600 font-semibold">
                      {info.paymentMethod === 'transfer' ? '+18% ƏDV avtomatik' : 'ƏDV şamil edilmir'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button 
                      type="button"
                      onClick={() => handlePaymentChange('cash')}
                      className={`py-2.5 px-3 border rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        info.paymentMethod === 'cash'
                          ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-xs ring-1 ring-blue-600'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>Nağd ödəniş</span>
                    </button>
                    <button 
                      type="button"
                      onClick={() => handlePaymentChange('transfer')}
                      className={`py-2.5 px-3 border rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                        info.paymentMethod === 'transfer'
                          ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-xs ring-1 ring-blue-600'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>Köçürmə (ƏDV)</span>
                    </button>
                  </div>
                </div>

                {/* Canlı Cəmi Göstəricisi */}
                <div className="p-4 bg-slate-900 text-white rounded-xl shadow-inner space-y-2">
                  <div className="flex justify-between text-xs text-slate-300">
                    <span>Ara cəmi:</span>
                    <span className="font-mono font-semibold">{formatAzn(totals.subtotal)} AZN</span>
                  </div>
                  {info.paymentMethod === 'transfer' && (
                    <div className="flex justify-between text-xs text-amber-400 font-medium">
                      <span>ƏDV (18%):</span>
                      <span className="font-mono">+{formatAzn(totals.vatAmount)} AZN</span>
                    </div>
                  )}
                  <div className="pt-2 border-t border-slate-700 flex justify-between items-center">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">Yekun Ödəniləcək:</span>
                    <span className="text-base sm:text-lg font-mono font-bold text-amber-300">{formatAzn(totals.grandTotal)} AZN</span>
                  </div>
                </div>
              </>
            ) : (
              /* Sifarişçi və Şirkət parametrləri tabı */
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-600 mb-1">ŞİRKƏTİNİZİN ADI</label>
                  <input 
                    type="text" 
                    value={info.companyName}
                    onChange={e => setInfo({ ...info, companyName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">SİFARİŞÇİ (Müştəri Şirkət)</label>
                  <input 
                    type="text" 
                    value={info.clientName}
                    onChange={e => setInfo({ ...info, clientName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">OBYEKT / LAYİHƏ ADI</label>
                  <input 
                    type="text" 
                    value={info.objectName}
                    onChange={e => setInfo({ ...info, objectName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">ŞƏHƏR</label>
                    <input 
                      type="text" 
                      value={info.city}
                      onChange={e => setInfo({ ...info, city: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">SƏNƏD TARİXİ</label>
                    <input 
                      type="text" 
                      value={info.date}
                      onChange={e => setInfo({ ...info, date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">DİREKTOR (İmza edən şəxs)</label>
                  <input 
                    type="text" 
                    value={info.directorName}
                    onChange={e => setInfo({ ...info, directorName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">QEYD SƏTRİ</label>
                  <textarea 
                    rows={2}
                    value={info.note}
                    onChange={e => setInfo({ ...info, note: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-600 mb-1">LOQO ŞƏKİL LİNKİ (URL)</label>
                  <input 
                    type="text" 
                    placeholder="https://... (boş qalsa qızılı VMS gerbi olacaq)"
                    value={info.customLogoUrl || ''}
                    onChange={e => setInfo({ ...info, customLogoUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Document Preview Area */}
        <section className="flex-1 bg-slate-200/60 rounded-xl border border-slate-200/80 p-4 sm:p-8 flex flex-col items-center justify-start overflow-x-auto min-h-[700px] shadow-inner">
          <div className="mb-4 flex items-center justify-between w-full max-w-[210mm] text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>A4 Canlı Önizləmə (Orijinal PDF formatı)</span>
            </span>
            <span className="font-mono bg-white px-2.5 py-1 rounded border border-slate-300 text-slate-700">
              Yekun: {formatAzn(totals.grandTotal)} AZN
            </span>
          </div>

          {/* Actual Invoice Document Component */}
          <div className="w-full flex justify-center">
            <InvoicePreview 
              info={info}
              products={products}
              totals={totals}
            />
          </div>
        </section>

      </main>

      {/* Footer minimal info */}
      <footer className="bg-white border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-400 mt-auto">
        <span>Azərbaycan Respublikasının Vergi Məcəlləsinə uyğun ƏDV (18%) kalkulyasiyası • Sürətli PDF ixracı</span>
      </footer>
    </div>
  );
}
