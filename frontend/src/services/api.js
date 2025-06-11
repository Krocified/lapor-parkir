import { API_BASE_URL } from "../config/api";

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const error = await response
          .json()
          .catch(() => ({ error: "Network error" }));
        throw new Error(error.error || `HTTP ${response.status}`);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Get all reports
  async getReports() {
    const response = await this.request("/reports");
    return response.reports || [];
  }

  // Create a new report
  async createReport(reportData) {
    return await this.request("/reports", {
      method: "POST",
      body: JSON.stringify(reportData),
    });
  }

  // Get a specific report
  async getReport(id) {
    return await this.request(`/reports/${id}`);
  }

  // Delete a report
  async deleteReport(id) {
    return await this.request(`/reports/${id}`, {
      method: "DELETE",
    });
  }

  // Health check
  async healthCheck() {
    return await this.request("/");
  }
}

export default new ApiService();
