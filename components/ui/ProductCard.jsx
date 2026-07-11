import Image from "next/image";
import Link from "next/link";

export default function ProductCard({ product }) {
  const { id, name, price, originalPrice, image, slug, badge } = product;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg bg-white transition-shadow hover:shadow-md">
      {/* Product Image */}
      <Link href={`/products/${slug || id}`} className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
        {badge && (
          <span className="absolute left-2 top-2 z-10 rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white">
            {badge}
          </span>
        )}
        <Image
          src={image || "/images/product-placeholder.png"}
          alt={name || "Product Image"}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </Link>

      {/* Product Details */}
      <div className="flex flex-col gap-1 p-4">
        <Link href={`/products/${slug || id}`}>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-1 hover:underline">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-gray-900">
            ${price?.toFixed(2)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-500 line-through">
              ${originalPrice?.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}