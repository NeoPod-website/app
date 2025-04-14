import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,
  email: null,
  address: null,
  username: null,
  login_method: null,
};

const userSlice = createSlice({
  name: "user",

  initialState,

  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },

    setEmail: (state, action) => {
      state.email = action.payload;
    },

    setAddress: (state, action) => {
      state.address = action.payload;
    },

    setUsername: (state, action) => {
      state.username = action.payload;
    },

    setUserInfo: (state, action) => {
      state.user = action.payload;
    },

    setLoginMethod: (state, action) => {
      state.login_method = action.payload;
    },

    setUserState: (state, action) => {
      Object.assign(state, action.payload);
    },

    logout: (state) => {
      state.userInfo = {};
      state.email = null;
      state.address = null;
      state.username = null;
      state.login_method = null;
    },
  },
});

export const {
  logout,
  setRole,
  setEmail,
  setAddress,
  setUserInfo,
  setUsername,
  setLoginMethod,
  setUserState,
} = userSlice.actions;

export default userSlice.reducer;
