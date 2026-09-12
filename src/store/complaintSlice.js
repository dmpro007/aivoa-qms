import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  complaint: {
    customerName: "",
    organization: "",
    email: "",
    country: "",

    productName: "",
    materialType: "",
    dosageForm: "",
    strength: "",
    batchNumber: "",
    manufacturingDate: "",
    expiryDate: "",

    category: "",
    description: "",
    source: "",
  },

  aiResult: {
    summary: "",
    riskLevel: "",
    riskScore: null,
    completenessScore: null,
    missingFields: [],
    rootCause: [],
    capa: [],
  },

  loading: false,
};

const complaintSlice = createSlice({
  name: "complaint",
  initialState,

  reducers: {
    updateComplaintField: (state, action) => {
      const { field, value } = action.payload;

      state.complaint[field] = value;
    },

    setComplaint: (state, action) => {
      state.complaint = {
        ...state.complaint,
        ...action.payload,
      };
    },

    setAIResult: (state, action) => {
      state.aiResult = action.payload;
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    resetComplaint: () => initialState,
  },
});

export const {
  updateComplaintField,
  setComplaint,
  setAIResult,
  setLoading,
  resetComplaint,
} = complaintSlice.actions;

export default complaintSlice.reducer;