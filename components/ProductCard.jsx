import Link from 'next/link';
import { HardDrive, Shield, BadgeCheck, ArrowUpRight } from 'lucide-react';

export default function ProductCard({ product }) {
  const formattedPrice = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <Link href={`/product/${product.id}`} className="group block h-full">
      <div className="relative bg-white dark:bg-[#121212] rounded-3xl overflow-hidden border border-gray-200/70 dark:border-gray-800 transition-all duration-500 hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-white/5 hover:-translate-y-1.5 hover:border-gray-300 dark:hover:border-gray-700 h-full flex flex-col">

        {/* Verified badge */}
        <div className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 dark:bg-black/70 backdrop-blur border border-gray-200/70 dark:border-gray-700/70 text-[10px] font-bold uppercase tracking-wider text-gray-700 dark:text-gray-200 shadow-sm">
          <BadgeCheck className="w-3 h-3 text-blue-500" />
          Original
        </div>

        {/* Hover indicator arrow */}
        <div className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/90 dark:bg-white/90 text-white dark:text-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
          <ArrowUpRight className="w-4 h-4" />
        </div>

        {/* Image */}
        <div className="relative w-full pt-[100%] bg-gradient-to-br from-gray-50 to-gray-100/60 dark:from-gray-900/50 dark:to-gray-900 group-hover:from-gray-100 group-hover:to-gray-200/60 dark:group-hover:from-gray-900 dark:group-hover:to-gray-800 transition-colors duration-500">
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
            <h3 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white mb-2 line-clamp-2 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {product.name}
            </h3>
            <div className="flex items-baseline gap-2">
              <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white tracking-tight">
                {formattedPrice}
              </p>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-2.5 py-1.5 rounded-full">
              <HardDrive className="w-3.5 h-3.5" />
              <span className="font-medium">{product.storage}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-800/50 px-2.5 py-1.5 rounded-full">
              <Shield className="w-3.5 h-3.5" />
              <span className="font-medium">{product.warranty}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
