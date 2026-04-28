import { createSlice } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");
let initialToken = null;

const normalizeToken = (rawToken) => {
  if (!rawToken) return null;

  let token = rawToken;
  try {
    token = JSON.parse(rawToken);
  } catch (_) {
    token = rawToken;
  }

  if (typeof token !== "string") return null;

  token = token.trim().replace(/^['"]+|['"]+$/g, "");
  while (/^Bearer\s+/i.test(token)) {
    token = token.replace(/^Bearer\s+/i, "").trim();
  }
  token = token.replace(/^['"]+|['"]+$/g, "");

  if (!token || token === "undefined" || token === "null") return null;
  return token;
};

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload?.exp) return false;
    return Date.now() >= payload.exp * 1000;
  } catch (_) {
    return true;
  }
};

if (storedToken) {
  initialToken = normalizeToken(storedToken);
}

if (initialToken && isTokenExpired(initialToken)) {
  initialToken = null;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

const initialState = {
  signupData: null,
  loading: false,
  token: initialToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setSignupData(state, value) {
      state.signupData = value.payload;
    },
    setLoading(state, value) {
      state.loading = value.payload;
    },
    setToken(state, value) {
      state.token = value.payload;
    },
  },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;

export default authSlice.reducer;
