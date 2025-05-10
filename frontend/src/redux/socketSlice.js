import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socketId: null,      // Store socket ID instead of the full socket object
    isConnected: false,  // Store connection status
  },
  reducers: {
    setSocketId: (state, action) => {
      state.socketId = action.payload;  // Store the socket ID
    },
    setConnectionStatus: (state, action) => {
      state.isConnected = action.payload;  // Store connection status (true/false)
    },
  },
});

export const { setSocketId, setConnectionStatus } = socketSlice.actions;

export default socketSlice.reducer;
