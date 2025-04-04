import { parseJwt } from './jwt';

const backendStorage = localStorage;

/**
 * Checks if the user is authenticated by verifying the presence of an idToken in backendStorage.
 *
 * @deprecated Use the `useAuth` hook from `src/provider/auth.js` instead.
 * @returns {boolean} True if the user is authenticated, false otherwise.
 */
export const isAuthenticated = () => {
  const idToken = backendStorage.getItem('idToken');
  return !!idToken;
};

/**
 * @typedef {Object} User
 * @property {string} at_hash
 * @property {string} sub
 * @property {boolean} email_verified
 * @property {string} iss
 * @property {boolean} phone_number_verified
 * @property {string} cognito:username
 * @property {string} origin_jti
 * @property {string} aud
 * @property {string} token_use
 * @property {number} auth_time
 * @property {string} phone_number
 * @property {number} exp
 * @property {number} iat
 * @property {string} jti
 * @property {string} email
 */

/**
 * Retrieves the current user by parsing the idToken stored in backendStorage.
 *
 * @returns {User|null} The current user object if authenticated, otherwise null.
 */
export const currentUser = () => {
  const idToken = backendStorage.getItem('idToken');
  if (!idToken) {
    return null;
  }
  return parseJwt(idToken);
};

export const getItemFromStorage = (key) => {
  return backendStorage.getItem(key);
};

export const setItemToStorage = (key, value) => {
  backendStorage.setItem(key, value);
};

export const setProfile = (profile) => {
  backendStorage.setItem('profile', JSON.stringify(profile, null, 2));
};

export const getProfile = () => {
  return JSON.parse(backendStorage.getItem('profile'));
};

export const setCurrentShopUid = (shopUid) => {
  backendStorage.setItem('currentShop', shopUid);
};

export const getCurrentShopUid = () => {
  return backendStorage.getItem('currentShop');
};

export const clearSession = () => {
  backendStorage.clear();
};
