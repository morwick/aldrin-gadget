"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, HardDrive, Shield, CheckCircle2, ChevronLeft, ChevronRight, Palette, X, ZoomIn } from 'lucide-react';
import Link from 'next/link';
import { use } from 'react';

export default function ProductDetail({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams?.id;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
    setCurrentUrl(window.location.href);
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextImage = (e) => {
    e?.stopPropagation();
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }
  };

  const prevImage = (e) => {
    e?.stopPropagation();
    if (product?.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
  };

  const onTouchStart = (e) => {
    if (e.touches && e.touches.length > 1) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    if (e.touches && e.touches.length > 1) {
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = (e) => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    if (distance > minSwipeDistance) {
      nextImage(e);
    } else if (distance < -minSwipeDistance) {
      prevImage(e);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-black dark:border-gray-800 dark:border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center bg-white dark:bg-[#121212] rounded-3xl mt-12 border border-gray-100 dark:border-gray-800 shadow-sm">
        <h2 className="text-3xl font-bold mb-6">Product Not Found</h2>
        <Link href="/" className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-medium hover:scale-105 transition-transform inline-block">
          Return to Showcase
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(product.price);

  const images = product.images || [];

  return (
    <>
      {isZoomed && images.length > 0 && (
        <div className="fixed inset-0 z-[100] bg-white/95 dark:bg-black/95 backdrop-blur flex items-center justify-center p-4 sm:p-8 cursor-zoom-out animate-in fade-in zoom-in duration-200" onClick={() => setIsZoomed(false)}>
          <button className="absolute top-6 right-6 text-black/70 hover:text-black dark:text-white/70 dark:hover:text-white transition-colors bg-black/5 dark:bg-white/10 p-2.5 rounded-full z-50 hover:scale-105" onClick={() => setIsZoomed(false)}>
            <X className="w-6 h-6" />
          </button>
          
          <img 
            src={images[currentImageIndex]} 
            alt="Zoomed product" 
            className="max-w-[95vw] max-h-[90vh] object-contain select-none drop-shadow-2xl mix-blend-multiply dark:mix-blend-normal"
            onClick={(e) => e.stopPropagation()} 
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEndHandler}
          />
          
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="hidden sm:block absolute left-6 top-1/2 -translate-y-1/2 bg-black/5 hover:bg-black/10 text-black dark:bg-white/10 dark:hover:bg-white/20 dark:text-white p-4 rounded-full backdrop-blur transition-all active:scale-95 z-50"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button 
                onClick={nextImage}
                className="hidden sm:block absolute right-6 top-1/2 -translate-y-1/2 bg-black/5 hover:bg-black/10 text-black dark:bg-white/10 dark:hover:bg-white/20 dark:text-white p-4 rounded-full backdrop-blur transition-all active:scale-95 z-50"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-black dark:hover:text-white mb-10 transition-colors bg-gray-100 dark:bg-gray-900 px-4 py-2 rounded-full font-medium text-sm">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to showcase</span>
        </Link>

        <div className="bg-white dark:bg-[#121212] rounded-[2.5rem] p-6 md:p-12 lg:p-16 border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
            
            <div className="w-full lg:w-1/2">
              <div 
                className="relative w-full pt-[100%] bg-gray-50 dark:bg-[#1a1a1a] rounded-[2rem] overflow-hidden group cursor-zoom-in"
                onClick={() => setIsZoomed(true)}
              >
                {images.length > 0 ? (
                  <>
                    <img 
                      src={images[currentImageIndex]} 
                      alt={`${product.name} - Image ${currentImageIndex + 1}`}
                      className="absolute inset-0 w-full h-full object-contain p-10 mix-blend-multiply dark:mix-blend-normal transition-transform duration-500 group-hover:scale-105"
                    />
                    
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-black/90 backdrop-blur text-black dark:text-white px-3 py-1.5 text-sm rounded-full font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 shadow-sm border border-gray-200 dark:border-gray-800 pointer-events-none">
                      <ZoomIn className="w-4 h-4" /> Zoom
                    </div>
                    
                    {images.length > 1 && (
                      <>
                        <button 
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/90 backdrop-blur text-black dark:text-white p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all outline-none opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-gray-800"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-black/90 backdrop-blur text-black dark:text-white p-2.5 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-all outline-none opacity-0 group-hover:opacity-100 border border-gray-200 dark:border-gray-800"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 font-medium tracking-wide">
                    No Image Available
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="flex items-center gap-3 mt-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                  {images.map((img, idx) => (
                    <button 
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden border-2 transition-all snap-start ${currentImageIndex === idx ? 'border-blue-500 shadow-md transform scale-[1.02]' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'}`}
                    >
                      <img src={img} alt="" className="absolute inset-0 w-full h-full object-contain p-2 bg-gray-50 dark:bg-[#1a1a1a] mix-blend-multiply dark:mix-blend-normal" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold uppercase tracking-widest mb-6 w-fit border border-green-100 dark:border-green-900/50">
                <CheckCircle2 className="w-4 h-4" />
                In Stock
              </div>
              
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>
              
              <p className="text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight mb-8">
                {formattedPrice}
              </p>

              {product.description && (
                <div className="mb-8 prose prose-gray dark:prose-invert">
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line text-lg">
                    {product.description}
                  </p>
                </div>
              )}

              <div className="space-y-6 border-y border-gray-100 dark:border-gray-800 py-10 mb-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-800">
                    <HardDrive className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Storage Capacity</h3>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{product.storage}</p>
                  </div>
                </div>

                {product.color && (
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-800">
                      <Palette className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Color Option</h3>
                      <p className="text-xl font-semibold text-gray-900 dark:text-white">{product.color}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-[#1a1a1a] flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-800">
                    <Shield className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-0.5">Coverage</h3>
                    <p className="text-xl font-semibold text-gray-900 dark:text-white">{product.warranty}</p>
                  </div>
                </div>
              </div>

              <a 
                href={currentUrl ? `https://wa.me/6281267250095?text=${encodeURIComponent(`Halo, saya tertarik untuk membeli produk *${product.name}*\n\nLink Produk: ${currentUrl}`)}` : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-full sm:w-auto px-10 py-4 bg-[#25D366] hover:bg-[#1EBE57] text-white rounded-full font-bold text-lg hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl shadow-[#25D366]/20"
              >
                Beli via WhatsApp
              </a>
            </div>
            
          </div>
        </div>
      </div>
    </>
  );
}
