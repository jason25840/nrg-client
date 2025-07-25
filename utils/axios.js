import axios from 'axios';

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? 'https://your-production-api.com'
      : 'http://localhost:5001/api',
  withCredentials: true, // ✅ ensure cookies are sent on every request
});

export default instance;
