"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import ProductForm from '@/components/ProductForm';
import { Plus, Edit2, Trash2, LogOut, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminDashboard() {
  const [session, setSession] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session: activeSession } } = await supabase.auth.getSession();
    
    if (!activeSession) {
      router.push('/login');
      return;
    }
    
    setSession(activeSession);
    fetchProducts();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out');
    router.push('/');
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
    
    setIsDeleting(id);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const openNewProductForm = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    closeForm();
    fetchProducts();
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black dark:border-gray-800 dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Navigation Tabs */}
      <div className="flex gap-4 mb-8">
        <div className="px-5 py-2.5 rounded-full text-sm font-semibold bg-black text-white shadow-lg shadow-black/10 cursor-default">
          📦 Kelola Produk
        </div>
        <Link href="/admin/testimoni" className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-500 hover:text-black hover:bg-gray-100 transition-all">
          📸 Kelola Testimoni
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage your product showcase</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={openNewProductForm}
            className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-black/10 dark:shadow-white/10"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
          <button 
            onClick={handleLogout}
            className="px-6 py-3 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>

      {isFormOpen ? (
        <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={closeForm} className="text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-full flex items-center gap-2">
              &larr; Back to List
            </button>
          </div>
          <ProductForm 
            initialData={editingProduct} 
            onSubmitSuccess={handleFormSuccess}
            onCancel={closeForm}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121212] rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 dark:shadow-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50/80 dark:bg-[#1a1a1a] dark:text-gray-300 border-b border-gray-100 dark:border-gray-800">
                <tr>
                  <th scope="col" className="px-8 py-5 font-bold tracking-wider">Product</th>
                  <th scope="col" className="px-8 py-5 font-bold tracking-wider">Price</th>
                  <th scope="col" className="px-8 py-5 font-bold tracking-wider">Config</th>
                  <th scope="col" className="px-8 py-5 font-bold tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-12 text-center">
                      <div className="w-8 h-8 border-4 border-gray-200 border-t-black dark:border-gray-700 dark:border-t-white rounded-full animate-spin mx-auto"></div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-16 text-center">
                      <div className="w-20 h-20 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-5">
                        <Package className="w-10 h-10 text-gray-400" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No products yet</h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">Get started by adding your first product from the dashboard.</p>
                      <button 
                        onClick={openNewProductForm}
                        className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-full font-semibold hover:scale-105 transition-transform"
                      >
                        Add Product
                      </button>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 dark:hover:bg-[#1a1a1a] transition-colors group">
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200 dark:border-gray-700">
                            {product.images && product.images.length > 0 ? (
                              <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal" />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs text-base">
                            {product.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap font-bold text-gray-900 dark:text-white text-base">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(product.price)}
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs font-bold text-gray-800 dark:text-gray-200 bg-gray-200/50 dark:bg-gray-800 px-2.5 py-1 rounded w-fit">{product.storage}</span>
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{product.warranty}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-3 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="p-2.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            disabled={isDeleting === product.id}
                            className="p-2.5 text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            {isDeleting === product.id ? (
                              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
