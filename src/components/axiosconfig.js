import axios from "axios";

// const baseURL = "http://3.15.156.179:3000";
const baseURL = "http://localhost:3000";
const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
