import axios from 'axios';

const baseURL = 'http://3.19.65.137:3000';

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
