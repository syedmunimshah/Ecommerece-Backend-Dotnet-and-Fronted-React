import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getBlogPost } from "@/lib/content";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { formatDate } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  return { title: post?.title ?? "Blog Post" };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <article className="container-page py-10">
      <Breadcrumb items={[{ label: "Blog", href: "/blog" }, { label: post.title }]} />
      <div className="mx-auto max-w-3xl">
        <span className="text-sm font-medium text-accent">{post.category}</span>
        <h1 className="mt-2 text-4xl font-bold">{post.title}</h1>
        <p className="mt-4 text-sm text-muted">
          {formatDate(post.date)} · By {post.author}
        </p>
        <div className="relative my-8 aspect-video overflow-hidden rounded-lg bg-elevated">
          <Image src={post.image} alt={post.title} fill className="object-cover" />
        </div>
        <div className="prose prose-invert max-w-none leading-relaxed text-foreground/90">
          <p>{post.content}</p>
        </div>
      </div>
    </article>
  );
}
