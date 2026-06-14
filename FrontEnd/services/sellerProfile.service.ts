import "server-only";
import { makeServerApi } from "./api";
import type { PagedResponse } from "@/types/api";
import type {
  CreateSellerProfileDto,
  SellerProfileDto,
} from "@/types/seller";

export async function createSellerProfile(
  token: string,
  dto: CreateSellerProfileDto,
): Promise<SellerProfileDto> {
  const api = makeServerApi(token);
  const { data } = await api.post<SellerProfileDto>(
    "/api/sellerprofiles/create",
    dto,
  );
  return data;
}

export async function listAllSellers(
  token: string,
  pageNumber = 1,
  pageSize = 10,
): Promise<PagedResponse<SellerProfileDto>> {
  const api = makeServerApi(token);
  const { data } = await api.get<PagedResponse<SellerProfileDto>>(
    "/api/sellerprofiles/getall",
    { params: { PageNumber: pageNumber, PageSize: pageSize } },
  );
  return data;
}

export async function listPendingSellers(
  token: string,
  pageNumber = 1,
  pageSize = 10,
): Promise<PagedResponse<SellerProfileDto>> {
  const api = makeServerApi(token);
  const { data } = await api.get<PagedResponse<SellerProfileDto>>(
    "/api/sellerprofiles/getallpendingseller",
    { params: { PageNumber: pageNumber, PageSize: pageSize } },
  );
  return data;
}

export async function approveSeller(
  token: string,
  id: number,
): Promise<SellerProfileDto> {
  const api = makeServerApi(token);
  const { data } = await api.post<SellerProfileDto>(
    "/api/sellerprofiles/pendingsellerrequestaccept",
    null,
    { params: { id } },
  );
  return data;
}

export async function rejectSeller(
  token: string,
  id: number,
): Promise<SellerProfileDto> {
  const api = makeServerApi(token);
  const { data } = await api.post<SellerProfileDto>(
    "/api/sellerprofiles/pendingsellerrequestreject",
    null,
    { params: { id } },
  );
  return data;
}
