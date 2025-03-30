import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.WEB_SERVICE_URI || "http://localhost:5001/api";


// Create axios instance with auth token
const axiosAuth = axios.create({
  baseURL: API_URL,
});

axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const createWorkflow = createAsyncThunk("workflow/create", async (workflowData, { rejectWithValue }) => {
  try {
    const response = await axiosAuth.post("/workflows", workflowData);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

export const getWorkflows = createAsyncThunk("workflow/getAll", async (_, { rejectWithValue }) => {
  try {
    const response = await axiosAuth.get("/workflows");
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

const initialState = {
  workflows: [],
  currentWorkflow: null,
  loading: false,
  error: null,
};

const workflowSlice = createSlice({
  name: "workflow",
  initialState,
  reducers: {
    setCurrentWorkflow: (state, action) => {
      state.currentWorkflow = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Workflow
      .addCase(createWorkflow.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWorkflow.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows.push(action.payload);
      })
      .addCase(createWorkflow.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      })
      // Get Workflows
      .addCase(getWorkflows.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWorkflows.fulfilled, (state, action) => {
        state.loading = false;
        state.workflows = action.payload;
      })
      .addCase(getWorkflows.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.error;
      });
  },
});

export const { setCurrentWorkflow, clearError } = workflowSlice.actions;
export default workflowSlice.reducer;
