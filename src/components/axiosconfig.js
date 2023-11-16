import axios from 'axios';

const baseURL = 'http://3.133.102.189:3000';

const axiosInstance = axios.create({
  baseURL,
});

export default axiosInstance;
