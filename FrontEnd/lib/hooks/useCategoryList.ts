"use client";

import { useMemo } from "react";
import { useGetCategoriesQuery } from "@/lib/store/api/api";
import { asArray } from "@/lib/utils/paged";
import type { CategoryDto } from "@/lib/types/api";

export function useCategoryList() {
  const query = useGetCategoriesQuery();
  const categories = useMemo(
    () => asArray<CategoryDto>(query.data),
    [query.data],
  );
  return { ...query, categories };
}
