import { supabase } from '@/lib/supabaseClient';
import ProductDetailClient from '@/components/ProductDetailClient';
import Link from 'next/link';

// Generate dynamic metadata for SEO and WhatsApp sharing (Open Graph)
export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (!product) {
      return {
        title: 'Product Not Found | Aldrin Gadget',
        description: 'The requested product could not be found.',
      };
    }

    const formattedPrice = new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(product.price);

    const title = `${product.name} - ${formattedPrice} | Aldrin Gadget`;
    const description = product.description 
      ? (product.description.length > 150 ? product.description.substring(0, 147) + '...' : product.description)
      : `Beli ${product.name} dengan kapasitas ${product.storage} dan garansi ${product.warranty} di Aldrin Gadget.`;

    const imageUrl = product.images && product.images.length > 0 
      ? product.images[0]
      : '/logo.png';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `https://your-domain.com/product/${product.id}`,
        siteName: 'Aldrin Gadget',
        images: [
          {
            url: imageUrl,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
        locale: 'id_ID',
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return {
      title: 'Aldrin Gadget',
    };
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;

  let product = null;
  let fetchError = null;

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw error;
    product = data;
  } catch (error) {
    console.error('Error fetching product server-side:', error);
    fetchError = error;
  }

  if (!product || fetchError) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center bg-white dark:bg-[#121212] rounded-3xl mt-12 border border-gray-100 dark:border-gray-800 shadow-sm">
        <h2 className="text-3xl font-bold mb-6">Product Not Found</h2>
        <Link href="/" className="px-8 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full font-medium hover:scale-105 transition-transform inline-block">
          Return to Showcase
        </Link>
      </div>
    );
  }

  // Render the Client Component with fetched initial data
  return <ProductDetailClient initialProduct={product} />;
}
