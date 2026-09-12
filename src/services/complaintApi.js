import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
});


export const analyzeComplaint = async (complaintText) => {

  const response = await API.post(
    "/complaints/analyze",
    {
      complaint_text: complaintText,
    }
  );

  return response.data;
};

export const createComplaint = async (complaintData) => {
  const response = await API.post(
    "/complaints",
    complaintData
  );

  return response.data;
};