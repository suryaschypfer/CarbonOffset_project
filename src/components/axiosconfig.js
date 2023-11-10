import axios from 'axios';

const baseURL = 'http://52.14.4.189:3000';

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
