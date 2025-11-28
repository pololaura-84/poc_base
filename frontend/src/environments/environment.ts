export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8000',
  enableAuth: false,
  azureAd: {
    clientId: 'YOUR_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: 'http://localhost:4200'
  }
};
