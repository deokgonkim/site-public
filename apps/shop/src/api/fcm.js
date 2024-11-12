import axios from 'axios';

export class FcmApi {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SHOP_API_URL || 'https://api.example.com',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async preCheck() {
    // nothing to do
  }

  async registerFcmToken(fcmToken) {
    await this.preCheck();
    const response = await this.api.post(`/fcm/register`, { fcmToken });
    return response.data;
  }
}

const fcmApi = new FcmApi();

export default fcmApi;
