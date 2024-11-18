import axios from 'axios';
import { isValidAccessToken, refresh } from './api';
import {
  getCurrentShopUid,
  getItemFromStorage,
  setCurrentShopUid,
  setProfile,
} from './session';

export const GUEST_URL_BASE =
  process.env.REACT_APP_GUEST_URL_BASE || 'https://example.com';

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
        this.api.defaults.headers.Authorization = `Bearer ${getItemFromStorage('accessToken')}`;
      });
    } else {
      this.api.defaults.headers.Authorization = `Bearer ${getItemFromStorage('accessToken')}`;
    }
  }

  async getProfile() {
    await this.preCheck();
    const response = await this.api.get('/shop/profile');
    setProfile(response.data);
    if (!getCurrentShopUid()) {
      const firstShop = response.data.userShops[0];
      setCurrentShopUid(firstShop.shopUid);
    }
    return response.data;
  }

  async getShop(shopUid) {
    await this.preCheck();
    const response = await this.api.get(`/shop/${shopUid}`);
    return response.data;
  }

  async getMyShops() {
    await this.preCheck();
    const response = await this.api.get('/shop/my-shops');
    return response.data;
  }

  async updateShop(shopUid, data) {
    await this.preCheck();
    const response = await this.api.patch(`/shop/${shopUid}`, data);
    return response.data;
  }

  async getCustomers(shopUid) {
    await this.preCheck();
    const response = await this.api.get(`/shop/${shopUid}/customers`);
    return response.data;
  }

  async getCustomer(shopUid, customerId) {
    await this.preCheck();
    const response = await this.api.get(
      `/shop/${shopUid}/customers/${customerId}`
    );
    return response.data;
  }

  async deleteCustomer(shopUid, customerId) {
    await this.preCheck();
    const response = await this.api.delete(
      `/shop/${shopUid}/customers/${customerId}`
    );
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

  async deleteOrder(shopUid, orderId) {
    await this.preCheck();
    const response = await this.api.delete(
      `/shop/${shopUid}/orders/${orderId}`
    );
    return response.data;
  }

  async printOrder(shopUid, orderId) {
    await this.preCheck();
    const response = await this.api.post(
      `/shop/${shopUid}/orders/${orderId}/print`
    );
    return response.data;
  }

  async requestPayment(shopUid, orderId, { amount }) {
    await this.preCheck();
    const response = await this.api.post(
      `/shop/${shopUid}/orders/${orderId}/request-payment`,
      {
        amount,
      }
    );
    return response.data;
  }

  async cancelPayment(shopUid, orderId, paymentId) {
    await this.preCheck();
    const response = await this.api.post(
      `/shop/${shopUid}/orders/${orderId}/cancel-payment`,
      {
        paymentId,
      }
    );
    return response.data;
  }

  async deletePayment(shopUid, orderId, paymentId) {
    await this.preCheck();
    const response = await this.api.delete(
      `/shop/${shopUid}/orders/${orderId}/payments/${paymentId}`
    );
    return response.data;
  }

  async registerFcmToken(fcmToken) {
    await this.preCheck();
    const response = await this.api.post(`/shop/fcm/register`, {
      fcmToken,
    });
    return response.data;
  }
}

const shopApi = new ShopApi();

export default shopApi;
