'use client';

import Image from 'next/image';
import { Trash2, ShoppingCart } from 'lucide-react';

export default function WishlistPage() {
  // Mock wishlist data
  const wishlistItems = [
    { id: 1, name: 'Premium Hand Embroidered Lehenga', price: '₹24,990', status: 'In Stock', image: '/images/man1.png' },
    { id: 2, name: 'Silk Saree Collection', price: '₹6,490', status: 'In Stock', image: '/images/man1.png' },
    { id: 3, name: 'Designer Anarkali Suit', price: '₹8,990', status: 'Low Stock', image: '/images/man1.png' },
    { id: 4, name: 'Embroidered Kurta Set', price: '₹4,490', status: 'Out of Stock', image: '/images/man1.png' },
  ];

  return (
    <div className="max-w-6xl pt-[100px] lg:pt-[120px space-y-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-sm text-gray-500 mt-1">Items you have saved for later ({wishlistItems.length} items).</p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlistItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-shadow">
            
            {/* Image Container */}
            <div className="relative h-64 w-full bg-gray-100 overflow-hidden">
              <Image 
                src={item.image} 
                alt={item.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              
              {/* Delete Button overlaying the image */}
              <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-500 hover:text-red-500 hover:bg-white transition-colors shadow-sm">
                <Trash2 size={16} />
              </button>

              {/* Status Badge */}
              <div className="absolute bottom-3 left-3">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-md shadow-sm ${
                  item.status === 'In Stock' ? 'bg-white text-green-600' : 
                  item.status === 'Low Stock' ? 'bg-white text-yellow-600' : 'bg-white text-red-600'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>

            {/* Product Details */}
            <div className="p-4 flex flex-col h-[140px] justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
                  {item.name}
                </h3>
                <p className="text-sm font-bold text-[#cfa874] mt-2">{item.price}</p>
              </div>

              <button 
                disabled={item.status === 'Out of Stock'}
                className={`w-full py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                  item.status === 'Out of Stock' 
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800 shadow-sm'
                }`}
              >
                <ShoppingCart size={14} />
                {item.status === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}