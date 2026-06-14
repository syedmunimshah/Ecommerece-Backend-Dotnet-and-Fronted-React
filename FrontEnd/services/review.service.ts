import "server-only";
import { makeServerApi } from "./api";
import type { PagedResponse } from "@/types/api";
import type { CreateReviewDto, ReviewDto } from "@/types/review";

export async function listProductReviews(
  productId: number,
  pageNumber = 1,
  pageSize = 10,
  token?: string | null,
): Promise<PagedResponse<ReviewDto>> {
  const api = makeServerApi(token);
  const { data } = await api.get<PagedResponse<ReviewDto>>(
    `/api/products/${productId}/reviews`,
    { params: { PageNumber: pageNumber, PageSize: pageSize } },
  );
  return data;
}

export async function createReview(
  token: string,
  dto: CreateReviewDto,
): Promise<ReviewDto> {
  const api = makeServerApi(token);
  const { data } = await api.post<ReviewDto>("/api/reviews", dto);
  return data;
}

export async function deleteReview(token: string, id: number): Promise<void> {
  const api = makeServerApi(token);
  await api.delete(`/api/reviews/${id}`);
}
