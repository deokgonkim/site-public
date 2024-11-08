import axios from 'axios';
import { isValidAccessToken, refresh } from './api';

const shopApi = axios.create({
  baseURL: process.env.REACT_APP_SHOP_API_URL || 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
  },
});

export const getProfile = async () => {
  if (!isValidAccessToken()) {
    await refresh().then(() => {
      shopApi.defaults.headers.Authorization = `Bearer ${sessionStorage.getItem('accessToken')}`;
    });
  }
  const response = await shopApi.get('/shop/profile');
  return response.data;
};
