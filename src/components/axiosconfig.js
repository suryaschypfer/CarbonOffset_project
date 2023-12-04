import axios from "axios";
const baseURL = "http://18.224.17.131:3000";
const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
