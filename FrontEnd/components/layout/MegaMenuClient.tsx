"use client";

import { useQuery } from "@tanstack/react-query";
import { bffApi } from "@/services/api";
import type { CategoryDto } from "@/types/category";
import type { PagedResponse } from "@/types/api";
import { MegaMenu } from "./MegaMenu";

export function MegaMenuClient() {
  const { data } = useQuery({
    queryKey: ["categories", "nav"],
    queryFn: async () => {
      const { data: res } = await bffApi.get<PagedResponse<CategoryDto>>("/categories", {
        params: { PageNumber: 1, PageSize: 20 },
      });
      return res.Data ?? [];
    },
    staleTime: 60_000,
    retry: false,
  });

  return <MegaMenu categories={data ?? []} />;
}
