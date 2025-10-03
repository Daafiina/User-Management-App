import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";

const store = configureStore({
  reducer: {
    users: userReducer,
  },
});

export default store;
