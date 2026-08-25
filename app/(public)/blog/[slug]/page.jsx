import { getBlogBySlug } from "@/app/actions/blogs";
import BlogClient from "./BlogClient";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found | SRIJAN Fashion",
      description: "The requested blog post could not be found."
    };
  }

  const currentUrl = `https://www.srijandesignerstudio.com/blog/${slug}`;

  return {
    title: blog.meta_title || `${blog.title} | SRIJAN Fashion`,
    description: blog.meta_description || "Read this amazing blog post on Srijan Fashion.",
    keywords: blog.keywords || "srijan fashion, fashion blog, trending clothes",
    alternates: {
      canonical: blog.canonical_tag || currentUrl,
    },
    openGraph: {
      title: blog.meta_title || blog.title,
      description: blog.meta_description || "Read this amazing blog post on Srijan Fashion.",
      url: currentUrl,
      siteName: 'Srijan Fashion',
      images: [
        {
          url: blog.image_url || '/images/logo3.jpg',
          width: 1200,
          height: 630,
          alt: blog.cover_img_alt || blog.title,
        }
      ],
      locale: 'en_IN',
      type: 'article',
      publishedTime: blog.published_at || blog.created_at,
      authors: [blog.author || 'Admin'],
    }
  };
}

export default async function BlogDetails({ params }) {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) return <div className="text-center py-20 font-bold text-gray-500 mt-20">Blog not found.</div>;

  const currentUrl = `https://www.srijandesignerstudio.com/blog/${slug}`;

  return (
    <>
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
            },{
              "@type": "ListItem", 
              "position": 3, 
              "name": blog.title,
              "item": currentUrl  
            }]
          })
        }}
      />
      {blog.schema_markup ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: blog.schema_markup }}
        />
      ) : (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": currentUrl
              },
              "headline": blog.title,
              "description": blog.meta_description || "",
              "image": blog.image_url || "https://srijandesignerstudio.com/images/logo3.jpg",  
              "author": {
                "@type": "Person",
                "name": blog.author || "Admin"
              },  
              "publisher": {
                "@type": "Organization",
                "name": "Srijan Fashion",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://srijandesignerstudio.com/images/logo5.webp"
                }
              },
              "datePublished": blog.published_at || blog.created_at || new Date().toISOString()
            })
          }}
        />
      )}
      
      <BlogClient blog={blog} />
    </>
  );
}