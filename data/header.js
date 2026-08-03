// data/header.js

export const NAV_ICONS = [
  { id: "search", src: "", href: "#", alt: "Search" },
  { id: "wishlistt", src: "/icons/wishlist.svg", href: "/wishlist", alt: "Wishlist" },
  { id: "cart", src: "/icons/cart.svg", href: "/cart", alt: "Cart" },
  { id: "user", src: "/icons/user.svg", href: "/login?register=true", alt: "User" },
];

export const NAV_DATA = [
  { id: 1, label: "Home", href: "/" },
  {
    id: 2,
    label: "For Women",
    isMegaMenu: true, 
    leftColumn: {
      title: "ALL WOMEN'S CATEGORIES",
      links: [
        { label: "Ethnic Wear", href: "/ethnic-wear" },
        { label: "Western Wear", href: "/western-wear" },
        { label: "Bridal Wear Enquiry", href: "/customize" },
      ],
    },
    rightColumn: {
      title: "CUSTOM BRIDAL WEAR",
      description: "Want to look special on your special day? Get our Custom Bridal Solution to Customize your Bridal Dress",
      buttonText: "Click here to fillup the form",
      buttonLink: "/customize",
    },
  },
  {
    id: 3,
    label: "For Men",
    categories: [
      { id: "men-ethnic", label: "Ethnic Wear", href: "/ethnic" },
      { id: "men-western", label: "Western Wear", href: "/western" },
      { id: "custom", label: "Custom Wear", href: "/customize" },
    ],
  },
  { id: 4, label: "About", href: "/about" },
  { id: 5, label: "Contact", href: "/contact" },
  { id: 6, label: "Blog", href: "/blog" },
];