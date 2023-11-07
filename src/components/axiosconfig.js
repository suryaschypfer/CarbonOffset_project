import axios from 'axios';

const baseURL = 'http://3.129.128.210:3000';

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
