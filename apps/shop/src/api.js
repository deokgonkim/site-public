import packageJson from '../package.json';
import { parseJwt } from './jwt';
import { clearSession, getItemFromStorage, setItemToStorage } from './session';

export const config = {
  hostedUiUrl:
    process.env.REACT_APP_COGNITO_LOGIN_URL ||
    'https://example.auth.us-east-1.amazoncognito.com',
  clientId: process.env.REACT_APP_COGNITO_CLIENT_ID || 'example',
};
// console.log('Amazon Cognito hosted UI URL: ', config.hostedUiUrl);
// console.log('Amazon Cognito client ID: ', config.clientId);

export const basePath = packageJson.homepage || '';

export const logout = async () => {
  clearSession();
  document.location.href = `${basePath}/`;
};

export const isValidAccessToken = () => {
  const accessToken = getItemFromStorage('accessToken');
  const parsed = parseJwt(accessToken);
  return parsed && parsed.exp * 1000 > Date.now();
};

export const refresh = async () => {
  const url = config.hostedUiUrl + '/oauth2/token';
  const params = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: config.clientId,
    refresh_token: getItemFromStorage('refreshToken'),
  });
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  const body = await response.json();
  // console.log("Refresh token response: ", body);
  if (body.id_token) {
    setItemToStorage('idToken', body.id_token);
  }
  if (body.access_token) {
    setItemToStorage('accessToken', body.access_token);
  }
  if (body.refresh_token) {
    setItemToStorage('refreshToken', body.refresh_token);
  }
  return body;
};

export const oauth2Token = async (code) => {
  const url = config.hostedUiUrl + '/oauth2/token';
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: config.clientId,
    code,
    redirect_uri: document.location.origin + `${basePath}/return`,
  });
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  const body = await response.json();
  // console.log("OAuth2 token response: ", body);
  return body;
};
