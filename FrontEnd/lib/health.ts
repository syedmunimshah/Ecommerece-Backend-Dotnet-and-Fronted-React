import "server-only";
import axios from "axios";

export async function isBackendOnline(): Promise<boolean> {
  const base = process.env.BACKEND_API_URL;
  if (!base) return false;
  try {
    await axios.get(`${base}/api/product/getall`, {
      params: { PageNumber: 1, PageSize: 1 },
      timeout: 3000,
    });
    return true;
  } catch {
    return false;
  }
}
