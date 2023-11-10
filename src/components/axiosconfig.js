import axios from 'axios';

const baseURL = 'http://3.136.83.126:3000';

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
