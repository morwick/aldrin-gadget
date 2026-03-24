import Link from 'next/link';
import { HardDrive, Shield } from 'lucide-react';

export default function ProductCard({ product }) {
  // Format price
  const formattedPrice = new Intl.NumberFormat('id-ID', { 
    style: 'currency', 
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(product.price);

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="bg-white dark:bg-[#121212] rounded-3xl overflow-hidden border border-gray-100 dark:border-gray-800 transition-all duration-500 hover:shadow-2xl hover:shadow-black/5 dark:hover:shadow-white/5 hover:-translate-y-1.5 h-full flex flex-col">
        {/* Aspect ratio container for the image */}
        <div className="relative w-full pt-[100%] bg-gray-50 dark:bg-gray-900/50 group-hover:bg-gray-100 dark:group-hover:bg-gray-900 transition-colors duration-500">
          {product.images && product.images.length > 0 ? (
            <img 
              src={product.images[0]} 
              alt={product.name} 
              className="absolute inset-0 w-full h-full object-contain p-8 mix-blend-multiply dark:mix-blend-normal transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-600 font-medium">
              No Image
            </div>
          )}
        </div>
        
        <div className="p-6 flex flex-col flex-1">
          <div className="pb-4 flex-1">
            <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-1.5 line-clamp-2 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {product.name}
            </h3>
            <p className="text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
              {formattedPrice}
            </p>
          </div>
          
          <div className="pt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full">
              <HardDrive className="w-3.5 h-3.5" />
              <span className="font-medium">{product.storage}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5" />
              <span className="font-medium">{product.warranty}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
