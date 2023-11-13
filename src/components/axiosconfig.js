import axios from 'axios';

const baseURL = 'http://3.139.84.108:3000';

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
