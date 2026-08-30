"use client";

import { Heart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { toggleWishlist as toggleWishlistServer } from "@/app/actions/shopping";

export default function WishlistButton({ product }) {
  const { wishlistItems, toggleWishlist } = useCart();
  const isWishlisted = wishlistItems?.some((item) => item.id === product.id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    toggleWishlist(product);
    try {
      await toggleWishlistServer(product.id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button
      onClick={(e) => handleWishlistToggle(e, product)}
      className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 bg-white/90 backdrop-blur-md rounded-full shadow-sm hover:shadow-md transition-all z-10 cursor-pointer"
    >
      <Heart
        className={`w-5 h-5 sm:w-[30px] sm:h-[30px] transition-colors duration-300 ${isWishlisted ? 'fill-[#00c3ff] text-[#00c3ff]' : 'text-gray-400 hover:text-[#00c3ff]'
          }`}
      />
    </button>
  );
}