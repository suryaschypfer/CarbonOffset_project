import axios from 'axios';

const baseURL = 'http://localhost:3306';

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
