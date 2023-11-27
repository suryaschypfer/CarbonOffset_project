import axios from "axios";

// const baseURL = "http://3.15.156.179:3000";
const baseURL = "http://18.189.11.24:3000";
const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
