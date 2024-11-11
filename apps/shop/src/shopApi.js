import axios from 'axios';
import { isValidAccessToken, refresh } from './api';
import { setCurrentShopUid, setProfile } from './session';

export const NEXT_ACTION_MAP = {
  created: 'confirm',
  confirmed: 'complete',
};

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

  async updateShop(shopUid, data) {
    await this.preCheck();
    const response = await this.api.patch(`/shop/${shopUid}`, data);
    return response.data;
  }

  async getOrders(shopUid) {
    await this.preCheck();
    const response = await this.api.get(`/shop/${shopUid}/orders`);
    return response.data;
  }

  async getOrder(shopUid, orderId) {
    await this.preCheck();
    const response = await this.api.get(`/shop/${shopUid}/orders/${orderId}`);
    return response.data;
  }

  async processOrder(shopUid, orderId, action) {
    await this.preCheck();
    const response = await this.api.patch(
      `/shop/${shopUid}/orders/${orderId}`,
      {
        action,
      }
    );
    return response.data;
  }
}

const shopApi = new ShopApi();

export default shopApi;
