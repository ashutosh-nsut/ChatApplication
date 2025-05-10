import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    authUser: null, // Store only necessary user info like user ID, username, etc.
    otherUsers: null, 
    selectedUser: null,
    onlineUsers: null,
  },
  reducers: {
    setAuthUser: (state, action) => {
      // Make sure the payload contains only serializable data
      state.authUser = action.payload;
    },
    setOtherUsers: (state, action) => {
      state.otherUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
  },
});

export const { setAuthUser, setOtherUsers, setSelectedUser, setOnlineUsers } = userSlice.actions;
export default userSlice.reducer;
