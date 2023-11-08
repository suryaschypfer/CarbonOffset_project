import axios from 'axios';

const baseURL = 'http://18.222.228.43:3000';

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
