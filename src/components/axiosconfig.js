import axios from "axios";

const baseURL = "http://3.141.36.125:3000";
// const baseURL = "http://localhost:3000";
const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
