"use client";

import Link from 'next/link';
import { ShoppingBag, ShieldCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 border-b border-gray-200/50 dark:bg-[#0a0a0a]/80 dark:border-gray-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            {/* Pastikan file gambarmu bernama logo.png dan ditaruh di dalam folder "public" */}
            <img src="/logo.png" alt="Logo Toko" className="h-8 w-auto group-hover:scale-105 transition-transform duration-300" />

            {/* Ubah teksnya bebas, atau bisa juga kamu hapus jika logonya sudah memuat tulisan */}
            <span className="font-semibold tracking-tight text-xl text-black dark:text-white">Aldrin Gadget</span>
          </Link>


          <div className="flex items-center gap-1 sm:gap-4">
            <Link
              href="/"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname === '/' ? 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white' : 'text-gray-500 hover:text-black hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800/50'}`}
            >
              Showcase
            </Link>
            <Link
              href="/testimoni"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${pathname === '/testimoni' ? 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white' : 'text-gray-500 hover:text-black hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800/50'}`}
            >
              Testimoni
            </Link>
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all duration-300 ${pathname?.startsWith('/admin') ? 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white' : 'text-gray-500 hover:text-black hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800/50'}`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
