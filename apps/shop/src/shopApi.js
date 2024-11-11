import axios from 'axios';
import { isValidAccessToken, refresh } from './api';
import { setCurrentShopUid, setProfile } from './session';

export class ShopApi {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SHOP_API_URL || 'https://api.example.com',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async preCheck() {
    if (!isValidAccessToken()) {
      await refresh().then(() => {
        this.api.defaults.headers.Authorization = `Bearer ${sessionStorage.getItem('accessToken')}`;
      });
    } else {
      this.api.defaults.headers.Authorization = `Bearer ${sessionStorage.getItem('accessToken')}`;
    }
  }

  async getProfile() {
    await this.preCheck();
    const response = await this.api.get('/shop/profile');
    setProfile(response.data);
    const firstShop = response.data.userShops[0];
    setCurrentShopUid(firstShop.shopUid);
    return response.data;
  }

  async getOrders(shopUid) {
    await this.preCheck();
    const response = await this.api.get(`/shop/${shopUid}/orders`);
    return response.data;
  }
}

const shopApi = new ShopApi();

export default shopApi;
