import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import workflowReducer from "./slices/workflowSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workflow: workflowReducer,
  },
});
