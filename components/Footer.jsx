import Link from 'next/link';
import { MessageCircle, MapPin, ShieldCheck, Sparkles } from 'lucide-react';

function InstagramIcon({ className = '' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-gray-200/70 dark:border-gray-800/70 bg-white/60 dark:bg-[#0a0a0a]/60 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <img src="/logo.png" alt="Aldrin Gadget" className="h-9 w-auto group-hover:scale-105 transition-transform" />
              <span className="font-semibold tracking-tight text-xl text-black dark:text-white">Aldrin Gadget</span>
            </Link>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-md mb-5">
              Distributor gadget premium terpercaya. Setiap perangkat dijamin original dengan garansi resmi dan pengiriman aman ke seluruh Indonesia.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-full w-fit border border-gray-200 dark:border-gray-800">
              <ShieldCheck className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
              100% Original &amp; Bergaransi
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-4">Jelajahi</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
                  Showcase Produk
                </Link>
              </li>
              <li>
                <Link href="/testimoni" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
                  Galeri Testimoni
                </Link>
              </li>
              <li>
                <a href="https://wa.me/6281267250095" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors">
                  Hubungi Admin
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white mb-4">Kontak</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href="https://wa.me/6281267250095"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors group"
                >
                  <span className="w-8 h-8 rounded-full bg-green-50 dark:bg-green-900/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <MessageCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </span>
                  <span>
                    <span className="block text-xs text-gray-400 dark:text-gray-500">WhatsApp</span>
                    <span className="font-medium">+62 812-6725-0095</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/aldrin.gadget"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors group"
                >
                  <span className="w-8 h-8 rounded-full bg-pink-50 dark:bg-pink-900/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <InstagramIcon className="w-4 h-4 text-pink-600 dark:text-pink-400" />
                  </span>
                  <span>
                    <span className="block text-xs text-gray-400 dark:text-gray-500">Instagram</span>
                    <span className="font-medium">@aldrin.gadget</span>
                  </span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-gray-500 dark:text-gray-400">
                <span className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </span>
                <span>
                  <span className="block text-xs text-gray-400 dark:text-gray-500">Lokasi</span>
                  <span className="font-medium">Indonesia</span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-6 border-t border-gray-200/70 dark:border-gray-800/70 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 dark:text-gray-500">
            &copy; {year} Aldrin Gadget. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-500">
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            Crafted with passion for premium devices.
          </div>
        </div>
      </div>
    </footer>
  );
}
