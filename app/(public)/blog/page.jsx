export const dynamic = 'force-dynamic';

import BlogHero from "@/components/blog/BlogHero";
import LatestBlogs from "@/components/blog/LatestBlogs";
import { getAllBlogs } from "@/app/actions/blogs";

export const metadata = {
  title: "Blog - Fashion Trends, Tips & Style Guides | SRIJAN Fashion",
  description: "Read our blogs for insights on latest fashion trends, styling tips, outfit ideas and expert insights to help you discover new styles and dress with confidence.",
  alternates: {
    canonical: 'https://www.srijandesignerstudio.com/blog',
  },
  openGraph: {
    title: 'Blog - Fashion Trends, Tips & Style Guides | SRIJAN Fashion',
    description: 'Read our blogs for insights on latest fashion trends, styling tips, outfit ideas and expert insights to help you discover new styles and dress with confidence.',
    url: 'https://www.srijandesignerstudio.com/blog',
    siteName: 'Srijan Fashion',
    images: [
      {
        url: '/images/logo3.jpg', 
        width: 1200,
        height: 630,
        alt: 'Srijan Fashion Blog',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default async function BlogPage() {
  const blogs = await getAllBlogs();

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/", 
            "@type": "BreadcrumbList", 
            "itemListElement": [{
              "@type": "ListItem", 
              "position": 1, 
              "name": "Home",
              "item": "https://srijandesignerstudio.com"  
            },{
              "@type": "ListItem", 
              "position": 2, 
              "name": "Blog",
              "item": "https://www.srijandesignerstudio.com/blog"  
            }]
          })
        }}
      />
      <BlogHero />
      <LatestBlogs blogs={blogs} />
    </main>
  );
}