import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./counterSlice"; // Import the reducer

export const store = configureStore({
  reducer: {
    counter: counterReducer, // Single state reducer
  },
});


