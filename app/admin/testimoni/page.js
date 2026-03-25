"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import TestimonialForm from '@/components/TestimonialForm';
import { Plus, Edit2, Trash2, LogOut, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AdminTestimonialDashboard() {
  const [session, setSession] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [isDeleting, setIsDeleting] = useState(null);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { session: activeSession } } = await supabase.auth.getSession();
    
    if (!activeSession) {
      router.push('/admin/login');
      return;
    }
    
    setSession(activeSession);
    fetchTestimonials();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out');
    router.push('/');
  };

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        if (error.code !== '42P01' && error.code !== 'PGRST205') {
            throw error;
        }
      } else {
        setTestimonials(data || []);
      }
    } catch (error) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this testimonial photo?')) return;
    
    setIsDeleting(id);
    try {
      const { error } = await supabase
        .from('testimonials')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      toast.success('Testimonial deleted correctly');
      fetchTestimonials();
    } catch (error) {
      toast.error('Failed to delete testimonial');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setIsFormOpen(true);
  };

  const openNewForm = () => {
    setEditingTestimonial(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingTestimonial(null);
  };

  const handleFormSuccess = () => {
    closeForm();
    fetchTestimonials();
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
        <Link href="/admin" className="px-5 py-2.5 rounded-full text-sm font-semibold text-gray-500 hover:text-black hover:bg-gray-100 transition-all">
          📦 Kelola Produk
        </Link>
        <div className="px-5 py-2.5 rounded-full text-sm font-semibold bg-black text-white shadow-lg shadow-black/10 cursor-default">
          📸 Kelola Testimoni
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-10 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">Admin Testimonials</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">Manage your Wall of Trust gallery</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={openNewForm}
            className="px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform shadow-lg shadow-black/10 dark:shadow-white/10"
          >
            <Plus className="w-4 h-4" />
            Upload Photo
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
          <div className="flex items-center gap-3 mb-6 max-w-2xl mx-auto">
            <button onClick={closeForm} className="text-sm font-semibold text-gray-500 hover:text-black dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-full flex items-center gap-2">
              &larr; Back to Gallery
            </button>
          </div>
          <TestimonialForm 
            initialData={editingTestimonial} 
            onSubmitSuccess={handleFormSuccess}
            onCancel={closeForm}
          />
        </div>
      ) : (
        <div className="bg-white dark:bg-[#121212] rounded-[2rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 dark:shadow-none min-h-[500px]">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-20">
               <div className="w-20 h-20 bg-gray-50 dark:bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-5">
                 <ImageIcon className="w-10 h-10 text-gray-400" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No photos yet</h3>
               <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">Start uploading customer photos to build your Wall of Trust.</p>
               <button 
                 onClick={openNewForm}
                 className="px-6 py-2.5 bg-black text-white dark:bg-white dark:text-black rounded-full font-semibold hover:scale-105 transition-transform"
               >
                 Upload First Photo
               </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {testimonials.map((item) => (
                <div key={item.id} className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-[3/4] border border-gray-200 dark:border-gray-800">
                  <img src={item.image_url} alt="Testimonial" className="w-full h-full object-cover" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(item)} className="p-2 bg-white/20 hover:bg-white rounded-full text-white hover:text-black transition-colors backdrop-blur">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} disabled={isDeleting === item.id} className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full text-white transition-colors backdrop-blur disabled:opacity-50">
                        {isDeleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    </div>
                    
                    <div className="text-white">
                      <p className="font-bold text-sm truncate">{item.customer_name || 'No Name'}</p>
                      <p className="text-xs text-gray-300 truncate">{item.product_name || 'No Product'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
