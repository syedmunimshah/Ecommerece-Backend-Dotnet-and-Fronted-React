import type { Metadata } from "next";
import { CategoriesPageClient } from "./CategoriesPageClient";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  return <CategoriesPageClient />;
}
