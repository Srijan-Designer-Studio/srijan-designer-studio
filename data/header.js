// Right side icons
export const NAV_ICONS = [
  { id: "heart", src: "/icons/heart.svg", alt: "Heart" },
  { id: "wishlist", src: "/icons/wishlist.svg", alt: "Wishlist" },
  { id: "user", src: "/icons/user.svg", alt: "User" },
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