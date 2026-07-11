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
        items: [
          { label: "Ethnic Wear", href: "/woman/ethnic-wear" },
          { label: "Western Wear", href: "/woman/western-wear" },
          { label: "Bridal Wear", href: "/woman/bridal-wear" },
        ],
      },
      {
        id: "cat-men",
        label: "Men",
        items: [
          { label: "Ethnic Wear", href: "/men/ethnic-wear" },
          { label: "Indo-Western", href: "/men/indo-western" },
          { label: "Western Wear", href: "/men/western-wear" },
        ],
      },
      {
        id: "cat-kids",
        label: "Kids",
        items: [
          { label: "Party Wear", href: "/kids/party-wear" },
          { label: "Ethnic Wear", href: "/kids/ethnic-wear" },
          { label: "Casual Wear", href: "/kids/casual-wear" },
        ],
      },
    ],
  },
  {
    id: 4,
    label: "Customize",
    type: "simple-menu",
    categories: [
      { label: "Custom Bridal", href: "/customize/bridal" },
      { label: "Custom Kids", href: "/customize/kids" },
    ],
  },
  { id: 5, label: "Blog", href: "/blog" },
  { id: 6, label: "Contact Us", href: "/contact" },
];