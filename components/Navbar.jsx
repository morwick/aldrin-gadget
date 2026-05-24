"use client";

import Link from 'next/link';
import { ShieldCheck, MessageCircle, Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const navItems = [
    { href: '/', label: 'Showcase' },
    { href: '/testimoni', label: 'Testimoni' },
  ];

  const isActive = (href) => href === '/' ? pathname === '/' : pathname?.startsWith(href);

  return (
    <nav
      className={`sticky top-0 z-50 w-full backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? 'bg-white/85 dark:bg-[#0a0a0a]/85 border-b border-gray-200/70 dark:border-gray-800/70 shadow-sm shadow-black/[0.02]'
          : 'bg-white/60 dark:bg-[#0a0a0a]/60 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <img src="/logo.png" alt="Logo Aldrin Gadget" className="h-8 w-auto group-hover:scale-105 transition-transform duration-300" />
            <span className="font-semibold tracking-tight text-lg sm:text-xl text-black dark:text-white">Aldrin Gadget</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-black dark:text-white'
                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {isActive(item.href) && (
                  <span className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-full -z-0" aria-hidden />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
            <Link
              href="/admin"
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all duration-300 ${
                pathname?.startsWith('/admin')
                  ? 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white'
                  : 'text-gray-500 hover:text-black hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </Link>
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <a
              href="https://wa.me/6281267250095"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm font-semibold hover:scale-105 active:scale-95 transition-transform shadow-md shadow-black/10 dark:shadow-white/10"
            >
              <MessageCircle className="w-4 h-4" />
              Hubungi
            </a>
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/admin"
              aria-label="Admin"
              className={`p-2 rounded-full transition-all ${
                pathname?.startsWith('/admin')
                  ? 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white'
                  : 'text-gray-500 hover:text-black hover:bg-gray-50 dark:hover:text-white dark:hover:bg-gray-800/50'
              }`}
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="p-2 rounded-full text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileOpen ? 'max-h-80 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="pt-2 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-3 rounded-2xl text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-gray-100 text-black dark:bg-gray-800 dark:text-white'
                    : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://wa.me/6281267250095"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center justify-center gap-2 px-4 py-3 bg-black text-white dark:bg-white dark:text-black rounded-2xl text-sm font-semibold"
            >
              <MessageCircle className="w-4 h-4" />
              Hubungi via WhatsApp
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
