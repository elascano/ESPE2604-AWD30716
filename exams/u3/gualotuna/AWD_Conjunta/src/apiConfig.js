// Dynamic backend URL builder supporting local dev and AWS deployment
export const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  // Auto-detect current hostname so accessing via AWS Public IP works seamlessly
  if (typeof window !== 'undefined' && window.location.hostname) {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}:3009`;
  }
  return 'http://localhost:3009';
};
