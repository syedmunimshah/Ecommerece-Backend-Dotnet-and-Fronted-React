import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { BLOG_POSTS } from "@/lib/content";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Blog" };

export default function BlogPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Blog" }]} />
      <h1 className="mb-2 text-3xl font-bold">EdgeCart Blog</h1>
      <p className="mb-10 text-muted">Tips, guides, and news from our marketplace</p>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className="card group overflow-hidden transition-shadow hover:shadow-glow">
            <div className="relative h-48 bg-elevated">
              <Image src={post.image} alt={post.title} fill className="object-cover transition-transform group-hover:scale-105" />
            </div>
            <div className="p-5">
              <span className="text-xs font-medium text-accent">{post.category}</span>
              <h2 className="mt-2 font-semibold group-hover:text-accent line-clamp-2">{post.title}</h2>
              <p className="mt-2 text-sm text-muted line-clamp-2">{post.excerpt}</p>
              <p className="mt-4 text-xs text-muted">{formatDate(post.date)} · {post.author}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
