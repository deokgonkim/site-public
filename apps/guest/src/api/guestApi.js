import axios from "axios";
// import { isValidAccessToken, refresh } from "./api";
// import { setCurrentShopUid, setProfile } from "./session";

export class GuestApi {
  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_SHOP_API_URL || "https://api.example.com",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  async getShop(shopUid) {
    const response = await this.api.get(`/guest/${shopUid}`);
    return response.data;
  }

  async createOrder(shopUid, payload) {
    const response = await this.api.post(
      `/guest/${shopUid}/orders`,
      JSON.stringify(payload, null, 4)
    );
    return response.data;
  }
}

const guestApi = new GuestApi();

export default guestApi;
