import axios from 'axios';

const baseURL = 'http://3.129.148.50:3000';

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
