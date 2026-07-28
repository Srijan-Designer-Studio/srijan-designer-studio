// Right side icons
export const NAV_ICONS = [
  { id: "search", src: "", href: "#", alt: "Search" },
  { id: "wishlistt", src: "/icons/wishlist.svg", href: "/wishlist", alt: "Wishlist" },
  { id: "cart", src: "/icons/cart.svg", href: "/cart", alt: "Cart" },
  { id: "user", src: "/icons/user.svg", href: "/login?register=true", alt: "User" },
];

// Main navigation data structure[cite: 2]
export const NAV_DATA = [
  { id: 1, label: "Home", href: "/" },
  { id: 2, label: "About", href: "/about" },
  {
    id: 3,
    label: "Products",
    type: "nested-menu", // New type for nested dropdowns
    categories: [
      {
        id: "cat-women",
        label: "Women",
        href:"/women"
      },
      {
        id: "cat-men",
        label: "Men",
        href:"/men"
      },
      {
        id: "cat-kids",
        label: "Kids",
        href:"/kids"
      },
    ],
  },
  {
    id: 4,
    label: "Customize",
    type: "simple-menu",
    categories: [
      { label: "Custom Dress", href: "/customize" },
      { label: "Custom Kids", href: "/kids" },
    ],
  },
  { id: 5, label: "Blog", href: "/blog" },
  { id: 6, label: "Contact Us", href: "/contact" },
];