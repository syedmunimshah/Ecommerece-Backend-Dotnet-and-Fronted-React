import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATIC_PAGES } from "@/lib/content/static-pages";
import { StaticPage } from "@/components/pages/StaticPage";

const SLUGS = Object.keys(STATIC_PAGES);

export async function generateStaticParams() {
  return SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = STATIC_PAGES[slug];
  return { title: page?.title ?? "Page" };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!STATIC_PAGES[slug]) notFound();
  return <StaticPage slug={slug as keyof typeof STATIC_PAGES} />;
}
