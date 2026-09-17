import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const API = axios.create({
  baseURL: API_BASE_URL,
});

export const analyzeComplaint = async (complaintText) => {
  const response = await API.post("/complaints/analyze", {
    complaint_text: complaintText,
  });

  return response.data;
};

export const createComplaint = async (complaintData) => {
  const response = await API.post("/complaints", complaintData);

  return response.data;
};

export const getComplaints = async () => {
  const response = await API.get("/complaints");

  return response.data;
};

export const getComplaint = async (id) => {
  const response = await API.get(`/complaints/${id}`);

  return response.data;
};

export const getComplaintStats = async () => {
  const response = await API.get("/complaints/stats");

  return response.data;
};

export default API;
