
/**
 * Kitabu Yetu API Client
 * Optimized for production deployment.
 */

const IS_PROD = window.location.hostname !== 'localhost' && !window.location.hostname.includes('127.0.0.1');
const BASE_URL = IS_PROD ? 'https://api.kitabuyetu.com/v1' : 'http://localhost:8000/v1';

const fetchWithTimeout = async (url: string, options: any = {}, timeout = 10000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

export const apiClient = {
  syncToSheets: async (payload: any) => {
    if (!IS_PROD) {
      // Mock successful sync in development
      return new Promise((resolve) => setTimeout(resolve, 800));
    }

    try {
      const response = await fetchWithTimeout(`${BASE_URL}/sync`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Tenant-ID': payload.currentTenantId
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Synchronization failed');
      }
      return await response.json();
    } catch (error) {
      console.warn('Sync attempt failed. Data remains cached locally.');
      throw error;
    }
  },

  fetchLatest: async (tenantId: string) => {
    if (!IS_PROD) return new Promise((resolve) => setTimeout(resolve, 500));
    const response = await fetchWithTimeout(`${BASE_URL}/sheets/${tenantId}`);
    if (!response.ok) throw new Error('Fetch failed');
    return await response.json();
  },

  recalculateSheet: async (cycleId: string) => {
    if (!IS_PROD) return new Promise((resolve) => setTimeout(resolve, 1000));
    return fetchWithTimeout(`${BASE_URL}/calculate/${cycleId}`, { method: 'POST' });
  }
};
