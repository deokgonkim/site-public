import packageJson from '../package.json';

export const config = {
  hostedUiUrl:
    process.env.REACT_APP_COGNITO_LOGIN_URL ||
    'https://example.auth.us-east-1.amazoncognito.com',
  clientId: process.env.REACT_APP_COGNITO_CLIENT_ID || 'example',
};
// console.log('Amazon Cognito hosted UI URL: ', config.hostedUiUrl);
// console.log('Amazon Cognito client ID: ', config.clientId);

export const basePath = packageJson.homepage || '';

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
