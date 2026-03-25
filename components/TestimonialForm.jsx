"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { UploadCloud, CheckCircle2, X } from 'lucide-react';
import imageCompression from 'browser-image-compression';

export default function TestimonialForm({ initialData = null, onSubmitSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: initialData?.customer_name || '',
    product_name: initialData?.product_name || '',
  });
  
  const [existingImage, setExistingImage] = useState(initialData?.image_url || null);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImageFile({
        file,
        preview: URL.createObjectURL(file)
      });
      setExistingImage(null); // Clear existing if a new one is selected
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setExistingImage(null);
  };

  const uploadImage = async (file) => {
    const options = {
      maxSizeMB: 0.1,
      maxWidthOrHeight: 1280,
      useWebWorker: true,
      initialQuality: 0.8
    };
    
    let compressedFile;
    try {
      compressedFile = await imageCompression(file, options);
    } catch (err) {
      console.warn("Compression failed, using original file", err);
      compressedFile = file;
    }

    const fileExt = compressedFile.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('testimonials')
      .upload(filePath, compressedFile);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('testimonials')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!imageFile && !existingImage) {
        throw new Error('A testimonial photo is required');
      }

      let finalImageUrl = existingImage;

      if (imageFile) {
        finalImageUrl = await uploadImage(imageFile.file);
      }

      const testimonialPayload = {
        customer_name: formData.customer_name,
        product_name: formData.product_name,
        image_url: finalImageUrl,
      };

      if (initialData?.id) {
        const { error } = await supabase
          .from('testimonials')
          .update(testimonialPayload)
          .eq('id', initialData.id);
        
        if (error) throw error;
        toast.success('Testimonial updated successfully');
      } else {
        // Force array structure since Supabase insert requires it
        const { error } = await supabase
          .from('testimonials')
          .insert([testimonialPayload]);
        
        if (error) throw error;
        toast.success('Testimonial added successfully');
      }

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
      if (!initialData && !onSubmitSuccess) {
          setFormData({ customer_name: '', product_name: '' });
          setImageFile(null);
          setExistingImage(null);
      }

    } catch (error) {
      toast.error(error.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#121212] p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 dark:shadow-none space-y-8 max-w-2xl mx-auto">
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Customer Name (Optional)</label>
            <input 
              type="text" 
              name="customer_name" 
              value={formData.customer_name} 
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. Budi Santoso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Purchased (Optional)</label>
            <input 
              type="text" 
              name="product_name" 
              value={formData.product_name} 
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              placeholder="e.g. iPhone 15 Pro Max"
            />
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
             Testimonial Photo <span className="text-red-500">*</span>
           </label>
           
           {(existingImage || imageFile) ? (
             <div className="relative w-full max-w-sm aspect-[3/4] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mx-auto group">
               <img 
                 src={imageFile ? imageFile.preview : existingImage} 
                 alt="Testimonial Preview" 
                 className="absolute inset-0 w-full h-full object-cover" 
               />
               <button 
                 type="button"
                 onClick={removeImage}
                 className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 hover:scale-110 transition-all z-10"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>
           ) : (
             <label className="relative cursor-pointer hover:opacity-80 transition-opacity block w-full max-w-sm aspect-[3/4] mx-auto">
               <div className="w-full h-full relative rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/30 dark:hover:bg-gray-800/50 flex flex-col items-center justify-center text-gray-400">
                 <div className="flex flex-col items-center justify-center gap-3">
                   <UploadCloud className="w-10 h-10 text-blue-500" />
                   <span className="text-sm font-bold text-blue-600 dark:text-blue-400">Upload Photo</span>
                   <span className="text-xs text-gray-400 max-w-[200px] text-center">Vertical (portrait) photos look best in the gallery.</span>
                 </div>
               </div>
               <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
             </label>
           )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-800">
        {onCancel && (
          <button 
            type="button" 
            onClick={onCancel}
            className="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            Cancel
          </button>
        )}
        <button 
          type="submit" 
          disabled={loading}
          className="px-8 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[170px]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Uploading...</span>
            </div>
          ) : (
             <span>{initialData ? 'Save Changes' : 'Upload Testimonial'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
