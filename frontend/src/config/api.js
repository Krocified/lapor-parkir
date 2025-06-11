// API Configuration
const config = {
  development: {
    API_BASE_URL: "http://localhost:3000/api",
  },
  production: {
    API_BASE_URL: "http://localhost:3000/api", // Update this when deploying
  },
};

// Detect environment - in React Native/Expo, __DEV__ is available
const isDevelopment = __DEV__ || process.env.NODE_ENV === "development";
const currentConfig = isDevelopment ? config.development : config.production;

export const API_BASE_URL = currentConfig.API_BASE_URL;

export default currentConfig;
