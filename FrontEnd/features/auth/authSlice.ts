import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserDto } from "@/lib/types/api";
import { TOKEN_KEY } from "@/lib/api/config";
import { isTokenExpired } from "@/lib/utils/jwt";

const LEGACY_REFRESH_KEY = "edgecart-refresh-token";

export interface AuthState {
  token: string | null;
  user: UserDto | null;
}

function loadToken(): string | null {
  if (typeof window === "undefined") return null;
  localStorage.removeItem(LEGACY_REFRESH_KEY);
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token || isTokenExpired(token)) {
    localStorage.removeItem(TOKEN_KEY);
    return null;
  }
  return token;
}

const initialState: AuthState = {
  token: null,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth(state) {
      state.token = loadToken();
    },
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user?: UserDto | null }>,
    ) {
      state.token = action.payload.token;
      if (action.payload.user !== undefined) {
        state.user = action.payload.user;
      }
      if (typeof window !== "undefined") {
        localStorage.setItem(TOKEN_KEY, action.payload.token);
        localStorage.removeItem(LEGACY_REFRESH_KEY);
      }
    },
    setUser(state, action: PayloadAction<UserDto | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(LEGACY_REFRESH_KEY);
      }
    },
  },
});

export const { hydrateAuth, setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
