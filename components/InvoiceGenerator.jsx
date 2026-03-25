"use client";

import { useState, useRef } from 'react';
import { Download, Loader2 } from 'lucide-react';
import jsPDF from 'jspdf';
import * as htmlToImage from 'html-to-image';

export default function InvoiceGenerator({ product }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const invoiceRef = useRef(null);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const element = invoiceRef.current;
      
      const imgData = await htmlToImage.toPng(element, { 
        pixelRatio: 2, 
        skipFonts: false
      });
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      // Since we bypassed canvas manually, we need approx element height.
      // Usually pixelRatio=2 means double raw dimensions, but htmlToImage maintains scale logic.
      const ratio = element.offsetHeight / element.offsetWidth;
      const pdfHeight = pdfWidth * ratio;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Quotation_${product.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Maaf, terjadk kesalahan saat membuat dokumen PDF.');
    } finally {
      setIsGenerating(false);
    }
  };

  const formattedPrice = new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(product.price);
  
  const todayDate = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  return (
    <>
      <button 
        onClick={generatePDF}
        disabled={isGenerating}
        className="inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-white dark:bg-[#1a1a1a] border-2 border-gray-200 dark:border-gray-800 hover:border-black dark:hover:border-white text-black dark:text-white rounded-full font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
            Cetak Quotation
          </>
        )}
      </button>

      {/* Hidden Invoice Template for PDF Generation */}
      <div 
        className="fixed top-[-9999px] left-[-9999px]"
        style={{ width: '800px' }} // Fixed desktop width for consistent rendering
      >
        <div ref={invoiceRef} className="bg-white p-12 text-black font-sans w-full min-h-[1100px] border border-gray-100 relative">
          
          {/* Header */}
          <div className="flex justify-between items-start border-b-2 border-black pb-8 mb-8">
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tighter mix-blend-difference mb-1">
                Aldrin Gadget
              </h1>
              <p className="text-gray-500 font-medium tracking-wide">Premium Tech Showcase</p>
            </div>
            <div className="text-right">
              <h2 className="text-3xl font-bold tracking-tight text-gray-800 mb-2">OFFICIAL QUOTATION</h2>
              <p className="text-gray-500 mb-1">Date: <span className="font-semibold text-black">{todayDate}</span></p>
              <p className="text-gray-500">Ref: <span className="font-semibold text-black font-mono">QO-{Math.floor(Math.random() * 90000) + 10000}</span></p>
            </div>
          </div>

          {/* Customer / Store Details */}
          <div className="grid grid-cols-2 gap-12 mb-12">
            <div>
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-3">Issued By</h3>
              <p className="font-bold text-lg mb-1">Aldrin Gadget Store</p>
              <p className="text-gray-600 mb-1">Jakarta, Indonesia</p>
              <p className="text-gray-600">WhatsApp: +62 812-6725-0095</p>
              <p className="text-gray-600">Web: aldrin-gadget.com</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-widest mb-3">Prepared For</h3>
              <p className="font-bold text-lg mb-1">Customer / Perusahaan</p>
              <div className="w-48 h-px bg-gray-300 mt-6 md:mt-10 border-dashed"></div>
            </div>
          </div>

          {/* Product Info Block */}
          <div className="bg-gray-50 rounded-2xl p-8 mb-10 border border-gray-200 flex gap-8">
            {product.images && product.images.length > 0 ? (
              <div className="w-32 h-32 bg-white rounded-xl flex items-center justify-center p-2 shrink-0 border border-gray-100 shadow-sm">
                <img src={product.images[0]} alt="product" crossOrigin="anonymous" className="max-w-full max-h-full object-contain" />
              </div>
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-xl flex items-center justify-center shrink-0">
                <span className="text-gray-400 font-medium">No Image</span>
              </div>
            )}
            
            <div className="flex-1">
              <div className="bg-black text-white px-3 py-1 text-xs font-bold uppercase rounded inline-block mb-3">Unit Baru</div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 whitespace-pre-line leading-relaxed text-sm mb-4 max-w-lg line-clamp-3">
                {product.description || 'Tidak ada spesifikasi tambahan.'}
              </p>
            </div>
          </div>

          {/* Specification Table */}
          <h3 className="text-lg font-bold mb-4 uppercase tracking-wide border-l-4 border-black pl-3">Specifications Breakdown</h3>
          <table className="w-full text-left mb-12 border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-300">
                <th className="py-4 px-6 font-bold text-gray-700 text-sm tracking-wider uppercase">Item Description</th>
                <th className="py-4 px-6 font-bold text-gray-700 text-sm tracking-wider uppercase w-1/4">Detail</th>
                <th className="py-4 px-6 font-bold text-gray-700 text-sm tracking-wider uppercase text-right w-1/4">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-5 px-6 font-semibold">{product.name}</td>
                <td className="py-5 px-6 text-gray-600">Unit Utama</td>
                <td className="py-5 px-6 text-right font-semibold">{formattedPrice}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-5 px-6 font-medium text-gray-500">Kapasitas Penyimpanan</td>
                <td className="py-5 px-6 font-semibold">{product.storage}</td>
                <td className="py-5 px-6 text-right text-sm text-gray-400">Included</td>
              </tr>
              {product.color && (
                <tr className="border-b border-gray-100">
                  <td className="py-5 px-6 font-medium text-gray-500">Pilihan Warna</td>
                  <td className="py-5 px-6 font-semibold">{product.color}</td>
                  <td className="py-5 px-6 text-right text-sm text-gray-400">Included</td>
                </tr>
              )}
              <tr className="border-b border-gray-100">
                <td className="py-5 px-6 font-medium text-gray-500">Masa Garansi / Coverage</td>
                <td className="py-5 px-6 font-semibold">{product.warranty}</td>
                <td className="py-5 px-6 text-right text-sm text-gray-400">Included</td>
              </tr>
            </tbody>
          </table>

          {/* Total Block */}
          <div className="flex justify-end mb-16">
            <div className="w-1/2 p-6 bg-gray-50 border border-gray-200 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 font-medium">Subtotal</span>
                <span className="font-semibold">{formattedPrice}</span>
              </div>
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 font-medium">Tax / Pajak</span>
                <span className="text-sm text-gray-400">Hubungi CS</span>
              </div>
              <div className="w-full h-px bg-gray-300 mb-4"></div>
              <div className="flex justify-between items-end">
                <span className="text-gray-900 font-bold uppercase">Total Estimasi</span>
                <span className="text-3xl font-black text-black">{formattedPrice}</span>
              </div>
            </div>
          </div>

          {/* Footer Notes */}
          <div className="absolute bottom-12 left-12 right-12 border-t border-gray-200 pt-8">
            <div className="flex justify-between items-end">
              <div>
                <h4 className="font-bold mb-2">Terms & Conditions</h4>
                <ul className="text-xs text-gray-500 space-y-1 list-disc pl-4">
                  <li>Dokumen ini merupakan penawaran harga, bukan bukti pembayaran sah.</li>
                  <li>Harga dapat berubah sewaktu-waktu tergantung ketersediaan stok fisik.</li>
                  <li>Silakan hubungi admin WhatsApp untuk konfirmasi pembelian.</li>
                </ul>
              </div>
              <div className="text-right">
                <p className="text-lg font-black uppercase tracking-tighter text-gray-300">Aldrin Gadget</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </>
  );
}
