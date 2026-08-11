// data/header.js
// data/header.js

export const NAV_ICONS = [
  { id: "search", src: "", href: "#", alt: "Search" },
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
    isTabbedMegaMenu: true,
    tabs: [
      {
        id: "women",
        label: "For Women",
        leftColumn: {
          title: "ALL WOMEN'S CATEGORIES",
          links: [
            { label: "Ethnic Wear", href: "/ethnic-wear" },
            { label: "Western Wear", href: "/western-wear" },
            { label: "Bridal Wear", href: "/wedding" },
          ],
        },
        rightColumn: {
          title: "CUSTOM BRIDAL WEAR",
          description: "Want to look special on your special day? Get our Custom Bridal Solution to Customize your Bridal Dress",
          buttonText: "Click here to fillup the form",
          buttonLink: "/create-designer-dress",
        },
      },
      {
        id: "men",
        label: "For Men",
        leftColumn: {
          title: "ALL MEN'S CATEGORIES",
          links: [
            { label: "Ethnic Wear", href: "/ethnic-wear" },
            { label: "Western Wear", href: "/western-wear" },
            { label: "Custom Wear", href: "/create-designer-dress" },
          ],
        },
        rightColumn: {
          title: "CUSTOM MEN'S WEAR",
          description: "Elevate your style with bespoke ethnic and western wear tailored to perfection for any occasion.",
          buttonText: "Design Men's Outfit",
          buttonLink: "/cuscreate-designer-dresstomize",
        },
      },
      {
        id: "kids",
        label: "For Kids",
        leftColumn: {
          title: "ALL KIDS' CATEGORIES",
          links: [
            { label: "Party Wear", href: "/kids/party" },
            { label: "Ethnic Wear", href: "/kids/ethnic" },
            { label: "Casual Wear", href: "/kids/casual" },
          ],
        },
        rightColumn: {
          title: "CUSTOM KIDS WEAR",
          description: "Make every celebration extra special with adorable custom outfits designed for your little ones.",
          buttonText: "Design Kids Outfit",
          buttonLink: "/create-custom-kids-wear",
        },
      }
    ]
  },
  {
    id: 4,
    label: "Customize",
    categories: [
      { id: "cust-women", label: "For Women", href: "/custocreate-designer-dressmize" },
      { id: "cust-men", label: "For Men", href: "/create-designer-dress" },
      { id: "cust-kids", label: "For Kids", href: "/create-custom-kids-wear" },
    ],
  },
  { id: 5, label: "Blog", href: "/blog" },
  { id: 6, label: "Contact Us", href: "/contact-us" },
];