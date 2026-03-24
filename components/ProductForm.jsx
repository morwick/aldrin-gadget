"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import toast from 'react-hot-toast';
import { UploadCloud, CheckCircle2, X } from 'lucide-react';

export default function ProductForm({ initialData = null, onSubmitSuccess, onCancel }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    price: initialData?.price || '',
    storage: initialData?.storage || '128GB',
    warranty: initialData?.warranty || '1 Year',
  });
  
  // existing images array from DB
  const [existingImages, setExistingImages] = useState(initialData?.images || []);
  // new files to upload
  const [imageFiles, setImageFiles] = useState([]);

  const STORAGE_OPTIONS = ['64GB', '128GB', '256GB', '512GB', '1TB'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      // Append new files to state, keeping references for ObjectURLs
      const filesWithPreviews = filesArray.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }));
      setImageFiles(prev => [...prev, ...filesWithPreviews]);
    }
  };

  const removeNewImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate
      if (!formData.name || !formData.price || !formData.storage || !formData.warranty) {
        throw new Error('All fields are required');
      }
      if (isNaN(Number(formData.price))) {
        throw new Error('Price must be a valid number');
      }

      let finalImages = [...existingImages];

      if (imageFiles.length > 0) {
        // Upload new images
        const uploadPromises = imageFiles.map(img => uploadImage(img.file));
        const uploadedUrls = await Promise.all(uploadPromises);
        finalImages = [...finalImages, ...uploadedUrls];
      }

      if (finalImages.length === 0) {
        throw new Error('At least one image is required');
      }

      const productPayload = {
        name: formData.name,
        price: Number(formData.price),
        storage: formData.storage,
        warranty: formData.warranty,
        images: finalImages,
      };

      if (initialData?.id) {
        // Update product
        const { error } = await supabase
          .from('products')
          .update(productPayload)
          .eq('id', initialData.id);
        
        if (error) throw error;
        toast.success('Product updated successfully');
      } else {
        // Insert product
        const { error } = await supabase
          .from('products')
          .insert([productPayload]);
        
        if (error) throw error;
        toast.success('Product added successfully');
      }

      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
      // Reset form if it is a new insertion without explicit success handler redirect
      if (!initialData && !onSubmitSuccess) {
          setFormData({ name: '', price: '', storage: '128GB', warranty: '1 Year' });
          setImageFiles([]);
          setExistingImages([]);
      }

    } catch (error) {
      console.error(error);
      toast.error(error.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-[#121212] p-6 sm:p-8 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-xl shadow-black/5 dark:shadow-none space-y-8">
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Name</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. iPhone 15 Pro Max"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Price (IDR)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange}
                step="1"
                min="0"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                placeholder="15000000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Storage</label>
            <select 
              name="storage" 
              value={formData.storage} 
              onChange={handleChange}
              className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none cursor-pointer"
            >
              {STORAGE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Warranty</label>
          <input 
            type="text" 
            name="warranty" 
            value={formData.warranty} 
            onChange={handleChange}
            className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50 focus:bg-white dark:focus:bg-[#1a1a1a] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            placeholder="e.g. 1 Year Official Warranty"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Product Images</label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {/* Existing Images */}
            {existingImages.map((url, index) => (
              <div key={`existing-${index}`} className="relative group w-full pt-[100%] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                <img src={url} alt={`Existing ${index}`} className="absolute inset-0 w-full h-full object-contain p-2 bg-gray-50 dark:bg-[#1a1a1a] mix-blend-multiply dark:mix-blend-normal" />
                <button 
                  type="button"
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}

            {/* New Images */}
            {imageFiles.map((img, index) => (
              <div key={`new-${index}`} className="relative group w-full pt-[100%] rounded-xl overflow-hidden border-2 border-green-500/50">
                <img src={img.preview} alt={`New upload ${index}`} className="absolute inset-0 w-full h-full object-contain p-2 bg-gray-50 dark:bg-[#1a1a1a] mix-blend-multiply dark:mix-blend-normal" />
                <button 
                  type="button"
                  onClick={() => removeNewImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute top-2 left-2 bg-green-500 rounded-full p-1 border-2 border-white dark:border-[#121212]">
                   <CheckCircle2 className="w-3 h-3 text-white" />
                </div>
              </div>
            ))}
            
            {/* Upload Button */}
            <label className="relative cursor-pointer hover:opacity-80 transition-opacity">
              <div className="w-full pt-[100%] relative rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/30 dark:hover:bg-gray-800/50 flex flex-col items-center justify-center text-gray-400">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <UploadCloud className="w-8 h-8 text-blue-500" />
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 text-center px-2">Add Images</span>
                </div>
              </div>
              <input type="file" multiple className="sr-only" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">You can select multiple images. PNG, JPG, WEBP up to 5MB.</p>

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
          className="px-8 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[140px]"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Saving...</span>
            </div>
          ) : (
             <span>{initialData ? 'Save Changes' : 'Add Product'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
