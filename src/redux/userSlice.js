import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
  },
  reducers: {
    setUsers(state, action) {
      state.users = action.payload;
    },
    addUser(state, action) {
      state.users = [action.payload, ...state.users];
    },
    updateUser(state, action) {
      const { id, name, email, company } = action.payload;
      const index = state.users.findIndex((user) => user.id === id);
      if (index !== -1) {
        state.users[index] = { ...state.users[index], name, email, company };
      }
    },
    deleteUser(state, action) {
      state.users = state.users.filter((user) => user.id !== action.payload);
    },
  },
});

export const { setUsers, addUser, deleteUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
