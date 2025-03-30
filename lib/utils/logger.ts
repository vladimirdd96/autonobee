/**
 * Debug logger for development environment
 */
export const logDebug = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data ? data : '');
  }
};

/**
 * Error logger
 */
export const logError = (message: string, error?: any) => {
  console.error(`[ERROR] ${message}`, error ? error : '');
};

/**
 * Info logger
 */
export const logInfo = (message: string, data?: any) => {
  console.log(`[INFO] ${message}`, data ? data : '');
};

/**
 * Warning logger
 */
export const logWarning = (message: string, data?: any) => {
  console.warn(`[WARN] ${message}`, data ? data : '');
}; 