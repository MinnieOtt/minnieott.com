export const BUILD_TIME = ((import.meta as unknown as { env?: { VITE_BUILD_TIME?: string } }).env?.VITE_BUILD_TIME) || new Date().toISOString();
