import { supabase } from '@/lib/supabaseClient';
import { Camera, CheckCircle2, ShieldCheck, Star } from 'lucide-react';

export const metadata = {
  title: 'Galeri Testimoni | Aldrin Gadget',
  description: 'Galeri kejujuran dan kepercayaan pelanggan Aldrin Gadget yang telah bertransaksi bersama kami.',
};

export const revalidate = 60; // revalidate every 60 seconds

export default async function TestimonialsPage() {
  let testimonials = [];
  let dbError = null;

  try {
    const { data, error } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      if (error.code === '42P01' || error.code === 'PGRST205') {
        // Table doesn't exist yet, we'll use dummy data
      } else {
        throw error;
      }
    } else {
      testimonials = data || [];
    }
  } catch (error) {
    dbError = error;
    console.error('Error fetching testimonials:', error);
  }

  // Dummy data fallback for when the database is empty or the table is not created yet
  const dummyData = [
    {
      id: 'd1',
      customer_name: 'Budi Santoso',
      product_name: 'iPhone 15 Pro Max 256GB Titanium',
      image_url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=800&fit=crop',
    },
    {
      id: 'd2',
      customer_name: 'Siti Aminah',
      product_name: 'Samsung Galaxy S24 Ultra',
      image_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&h=400&fit=crop',
    },
    {
      id: 'd3',
      customer_name: 'Andi Pratama',
      product_name: 'iPad Pro M2 11-inch',
      image_url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=900&fit=crop',
    },
    {
      id: 'd4',
      customer_name: 'Reza R.',
      product_name: 'MacBook Air M2',
      image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=600&fit=crop',
    },
    {
      id: 'd5',
      customer_name: 'Dewi Kurniati',
      product_name: 'iPhone 13 128GB Pink',
      image_url: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=500&h=750&fit=crop',
    },
  ];

  const displayData = testimonials.length > 0 ? testimonials : dummyData;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      
      {/* Header Section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-sm font-bold tracking-widest mb-6 border border-blue-100 dark:border-blue-900/50 uppercase">
          <ShieldCheck className="w-4 h-4" />
          Wall of Trust
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
          Galeri Testimoni
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          Ratusan gadget premium telah kami antarkan dengan selamat. Inilah momen kebahagiaan mereka bersama perangkat barunya.
        </p>
      </div>

      {/* Masonry Grid */}
      {/* Tailwind v4 supports CSS columns: `columns-1 sm:columns-2 lg:columns-3 gap-6` */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {displayData.map((item, idx) => (
          <div 
            key={item.id} 
            className="break-inside-avoid relative group rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800"
          >
            {/* Image */}
            <div className="cursor-pointer relative before:absolute before:inset-0 before:bg-gradient-to-t before:from-black/80 before:via-black/20 before:to-transparent before:z-10 before:opacity-100 sm:before:opacity-0 sm:group-hover:before:opacity-100 before:transition-opacity before:duration-300">
              <img 
                src={item.image_url} 
                alt={`Testimoni ${item.customer_name || 'Pelanggan'}`} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            {/* Overlay Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-20 translate-y-0 opacity-100 sm:translate-y-4 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end pointer-events-none">
              <div className="flex items-center gap-1 text-yellow-400 mb-2">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              
              {item.customer_name && (
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-white text-lg">{item.customer_name}</h3>
                  <CheckCircle2 className="w-4 h-4 text-blue-400" />
                </div>
              )}
              
              {item.product_name && (
                <p className="text-gray-200 text-sm font-medium flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  {item.product_name}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {testimonials.length === 0 && !dbError && (
        <div className="mt-12 text-center p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl border border-yellow-200 dark:border-yellow-900/50">
          <p className="text-yellow-800 dark:text-yellow-200 text-sm font-medium">
            Tampilan di atas adalah data contoh (Dummy Data). Tabel "testimonials" di Supabase masih kosong atau belum disiapkan.
          </p>
        </div>
      )}
    </div>
  );
}
