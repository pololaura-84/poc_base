export const environment = {
  production: true,
  apiBaseUrl: '/api',
  enableAuth: true,
  azureAd: {
    clientId: 'YOUR_CLIENT_ID',
    authority: 'https://login.microsoftonline.com/YOUR_TENANT_ID',
    redirectUri: 'https://intranet.volotea.com/bases'
  }
};
