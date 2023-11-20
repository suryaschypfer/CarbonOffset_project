import axios from 'axios';

const baseURL = 'http://18.118.218.56:3000';

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
