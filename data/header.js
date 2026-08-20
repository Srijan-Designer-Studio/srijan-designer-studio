// data/header.js

export const NAV_ICONS = [
  // { id: "search", src: "", href: "#", alt: "Search" },
  { id: "wishlistt", src: "/icons/wishlist.svg", href: "/wishlist", alt: "Wishlist" },
  { id: "cart", src: "/icons/cart.svg", href: "/cart", alt: "Cart" },
  { id: "user", src: "/icons/user.svg", href: "/login?register=true", alt: "User" },
];

export const NAV_DATA = [
  { id: 1, label: "Home", href: "/" },
  { id: 2, label: "About", href: "/about-us" },
  {
    id: 3,
    label: "Products",
    type: "nested-menu",
    categories: [
      { id: "cat-women", label: "For Women", href: "/buy-designer-outfits-for-women-online" },
      { id: "cat-men", label: "For Men", href: "/buy-designer-outfits-for-men-online" },

    ],
  },
  {
    id: 4,
    label: "Customize",
    type: "simple-menu",
    categories: [
      { label: "Create Custom Dress", href: "/create-designer-dress" },
      { label: "Custom Wedding Wear", href: "/create-custom-wedding-wear" },
      { label: "Custom Kids Wear", href: "/create-custom-kids-wear" },
    ],
  },
  { id: 5, label: "Blog", href: "/blog" },
  { id: 6, label: "Contact Us", href: "/contact-us" },
];