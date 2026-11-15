declare global {
  interface Window {
    __APP_CONFIG__?: {
      apiBaseUrl?: string;
    };
  }
}

export const environment = {
  production: true,
  apiBaseUrl: typeof window === 'undefined' ? '/api/v1' : window.__APP_CONFIG__?.apiBaseUrl ?? '/api/v1',
  useMockApi: typeof window !== 'undefined' && window.location.hostname.endsWith('github.io')
};