/**
 * API Configuration
 * 
 * Set EXPO_PUBLIC_API_URL in your .env file or app.json
 * Example: EXPO_PUBLIC_API_URL=http://localhost:3000/api
 * 
 * For development on physical device:
 * - iOS: Use your Mac's IP address (e.g., http://192.168.1.100:3000/api)
 * - Android: Use your computer's IP address (e.g., http://192.168.1.100:3000/api)
 * 
 * For production:
 * - Use your production API URL (e.g., https://api.neoori.com/api)
 */

export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api',
  TIMEOUT: 30000, // 30 seconds
};

export default API_CONFIG;

