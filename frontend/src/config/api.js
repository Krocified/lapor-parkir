// API Configuration
import { BACKEND_API_URL } from "@env";

// Default to localhost in development
const DEFAULT_API_URL = "http://localhost:3000/api";

// Use environment variable if available, otherwise fallback to default
const API_BASE_URL = BACKEND_API_URL || DEFAULT_API_URL;

// Log the API URL in development for debugging
if (__DEV__) {
  console.log("API Base URL:", API_BASE_URL);
}

export { API_BASE_URL };
export default { API_BASE_URL };
