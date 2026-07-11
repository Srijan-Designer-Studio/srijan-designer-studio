# Srijan E-commerce – Restructure Guide

This ZIP preserves the existing project and adds the recommended scalable folders.

Next steps:
1. Move Header/Navbar/Footer into components/layout.
2. Move home-only sections into components/home.
3. Consolidate product cards into components/product/ProductCard.
4. Move product/category data from app/data to root data after updating imports.
5. Rename `ethic` to `ethnic` and `Westrn` files to `Western`.
6. Add cart, wishlist, checkout and account routes incrementally.
7. Run `npm install` and `npm run dev`, then fix imports one group at a time.

Important: Existing files were not automatically moved or renamed, to avoid breaking current imports.
