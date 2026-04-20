import { createSlice } from "@reduxjs/toolkit";

const storedToken = localStorage.getItem("token");
let initialToken = null;

if (storedToken) {
  try {
    initialToken = JSON.parse(storedToken);
  } catch (_) {
    initialToken = storedToken;
  }
}

if (
  initialToken === "undefined" ||
  initialToken === "null" ||
  initialToken === ""
) {
  initialToken = null;
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