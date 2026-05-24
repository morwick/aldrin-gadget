"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ShieldCheck,
  BadgeCheck,
  Truck,
  Sparkles,
  ArrowRight,
  Star,
} from 'lucide-react';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters and sort state
  const [search, setSearch] = useState('');
  const [storageFilter, setStorageFilter] = useState('All');
  const [sortOrder, setSortOrder] = useState('none'); // none, asc, desc

  const STORAGE_OPTIONS = ['All', '64GB', '128GB', '256GB', '512GB', '1TB'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products
    .filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesStorage = storageFilter === 'All' || p.storage === storageFilter;
      return matchesSearch && matchesStorage;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') return a.price - b.price;
      if (sortOrder === 'desc') return b.price - a.price;
      return 0;
    });

  const features = [
    {
      icon: BadgeCheck,
      title: '100% Original',
      desc: 'Setiap produk dijamin keaslian dan kualitasnya.',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      icon: ShieldCheck,
      title: 'Garansi Resmi',
      desc: 'Perlindungan resmi dari distributor terpercaya.',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      icon: Truck,
      title: 'Pengiriman Aman',
      desc: 'Dikemas rapi & dikirim ke seluruh Indonesia.',
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      icon: Star,
      title: 'Pelayanan Premium',
      desc: 'Ratusan pelanggan puas dengan transaksi kami.',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute top-10 right-0 w-96 h-96 bg-purple-400/15 dark:bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-16 sm:pt-20 sm:pb-20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/70 dark:bg-white/5 backdrop-blur border border-gray-200/70 dark:border-gray-800/70 text-xs font-semibold tracking-wider uppercase text-gray-700 dark:text-gray-300 mb-6 animate-fade-in-up">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              Premium Gadgets, Trusted Source
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
              <span className="text-gradient">Aldrin Gadget</span>
              <span className="block mt-2 text-gray-900 dark:text-white">
                Premium Devices.
              </span>
              <span className="block text-gray-500 dark:text-gray-400 font-medium text-2xl sm:text-3xl md:text-4xl mt-3 tracking-tight">
                Dipilih dengan teliti, untuk Anda.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
              Koleksi gadget original dengan garansi resmi. Bertransaksi mudah dan terpercaya, langsung dari distributor pilihan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
              <a
                href="#produk"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-black text-white dark:bg-white dark:text-black rounded-full font-semibold text-sm hover:scale-105 active:scale-95 transition-transform shadow-xl shadow-black/10 dark:shadow-white/10"
              >
                Jelajahi Produk
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/testimoni"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/70 dark:bg-white/5 backdrop-blur border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white rounded-full font-semibold text-sm hover:bg-white dark:hover:bg-white/10 transition-colors"
              >
                Lihat Testimoni
              </Link>
            </div>

            {/* Trust badge */}
            <div className="mt-10 flex items-center justify-center gap-6 text-xs text-gray-500 dark:text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <div className="flex items-center gap-1.5">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">5.0</span>
                <span className="hidden sm:inline">dari ratusan pelanggan</span>
              </div>
              <div className="h-4 w-px bg-gray-300 dark:bg-gray-700" />
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                <span className="font-medium">Original &amp; Bergaransi</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features / USP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group bg-white/80 dark:bg-[#121212]/80 backdrop-blur p-5 sm:p-6 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5 hover:-translate-y-0.5 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${0.05 * i}s`, opacity: 0 }}
            >
              <div className={`inline-flex items-center justify-center w-11 h-11 ${f.bg} ${f.color} rounded-xl mb-4 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base mb-1">
                {f.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Product Showcase */}
      <section id="produk" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider mb-3 border border-blue-100 dark:border-blue-900/50">
              <Sparkles className="w-3 h-3" />
              Koleksi Terbaru
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-2">
              Latest Models
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">
              Temukan perangkat premium pilihan terbaik.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-auto shadow-sm transition-shadow hover:shadow-md rounded-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 pl-11 pr-4 py-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none shadow-sm transition-shadow hover:shadow-md rounded-full">
                <select
                  value={storageFilter}
                  onChange={(e) => setStorageFilter(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-white dark:bg-[#121212] border border-gray-200 dark:border-gray-800 rounded-full text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent cursor-pointer transition-all"
                >
                  {STORAGE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt === 'All' ? 'Storage' : opt}
                    </option>
                  ))}
                </select>
                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              <button
                onClick={() =>
                  setSortOrder((prev) => (prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none'))
                }
                className="px-5 py-3 bg-white dark:bg-[#121212] shadow-sm transition-all hover:shadow-md border border-gray-200 dark:border-gray-800 rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 shrink-0"
                title="Sort by price"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {sortOrder === 'none' ? 'Sort' : sortOrder === 'asc' ? 'Termurah' : 'Termahal'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white dark:bg-[#121212] rounded-3xl h-[420px] border border-gray-100 dark:border-gray-800 shadow-sm"
              ></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product, i) => (
              <div
                key={product.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(i * 0.04, 0.4)}s`, opacity: 0 }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white dark:bg-[#121212] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Produk tidak ditemukan</h3>
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              {products.length === 0
                ? 'Belum ada produk. Silakan cek kembali nanti.'
                : 'Coba ubah kata kunci atau filter pencarian.'}
            </p>
            {products.length > 0 && (
              <button
                onClick={() => {
                  setSearch('');
                  setStorageFilter('All');
                  setSortOrder('none');
                }}
                className="mt-8 px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-medium hover:scale-105 transition-transform"
              >
                Reset Filter
              </button>
            )}
          </div>
        )}
      </section>
    </>
  );
}
