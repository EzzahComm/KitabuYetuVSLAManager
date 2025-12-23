
/**
 * Kitabu Yetu API Client - Google Apps Script (GAS) Optimized
 */

declare const google: any;

const isGasEnvironment = typeof google !== 'undefined' && google.script && google.script.run;

const callGasFunction = (functionName: string, ...args: any[]): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!isGasEnvironment) {
      console.warn(`GAS Simulation: [${functionName}]`, args);
      setTimeout(() => resolve({ status: 'success', simulated: true }), 500);
      return;
    }

    google.script.run
      .withSuccessHandler((response: any) => resolve(response))
      .withFailureHandler((error: any) => reject(new Error(error.message || 'GAS Execution Error')))
      [functionName](...args);
  });
};

export const apiClient = {
  syncToSheets: async (state: any) => {
    return await callGasFunction('saveAppData', JSON.stringify(state));
  },
  fetchLatest: async () => {
    const data = await callGasFunction('getAppData');
    if (!data) return null;
    try {
      return typeof data === 'string' ? JSON.parse(data) : data;
    } catch (e) {
      return null;
    }
  }
};
