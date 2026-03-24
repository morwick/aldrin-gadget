"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProductCard from '@/components/ProductCard';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

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

  // Derive active products based on filters and search
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesStorage = storageFilter === 'All' || p.storage === storageFilter;
    return matchesSearch && matchesStorage;
  }).sort((a, b) => {
    if (sortOrder === 'asc') return a.price - b.price;
    if (sortOrder === 'desc') return b.price - a.price;
    return 0; // retain original created_at order
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">Latest Models</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg">Discover our premium collection of devices.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-auto shadow-sm transition-shadow hover:shadow-md rounded-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-11 pr-4 py-3 bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none shadow-sm transition-shadow hover:shadow-md rounded-full">
              <select 
                value={storageFilter}
                onChange={(e) => setStorageFilter(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white dark:bg-[#121212] border border-gray-100 dark:border-gray-800 rounded-full text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white cursor-pointer transition-all"
              >
                {STORAGE_OPTIONS.map(opt => (
                  <option key={opt} value={opt}>{opt === 'All' ? 'Storage' : opt}</option>
                ))}
              </select>
              <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>

            <button 
              onClick={() => setSortOrder(prev => prev === 'none' ? 'asc' : prev === 'asc' ? 'desc' : 'none')}
              className="px-5 py-3 bg-white dark:bg-[#121212] shadow-sm transition-all hover:shadow-md border border-gray-100 dark:border-gray-800 rounded-full text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-900 shrink-0"
              title="Sort by price"
            >
              <ArrowUpDown className="w-4 h-4" />
              <span className="hidden sm:inline">
                {sortOrder === 'none' ? 'Sort' : sortOrder === 'asc' ? 'Lowest price' : 'Highest price'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="animate-pulse bg-white dark:bg-[#121212] rounded-3xl h-[420px] border border-gray-100 dark:border-gray-800 shadow-sm"></div>
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-white dark:bg-[#121212] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-semibold mb-3">No products found</h3>
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            {products.length === 0 ? "Check back later for new arrivals." : "Try adjusting your search or filters."}
          </p>
          {products.length > 0 && (
            <button 
              onClick={() => { setSearch(''); setStorageFilter('All'); setSortOrder('none'); }}
              className="mt-8 px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-medium hover:scale-105 transition-transform"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
