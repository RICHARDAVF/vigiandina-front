import { api } from './api';
import { API_ENDPOINTS } from '@/utils/constants';

export const dashboardService = {
  getDashboardStats: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.STATS);
      return response;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getWorkersInsideList: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.WORKERS_INSIDE_LIST);
      return response;
    } catch (error) {
      console.error('Error fetching workers inside list:', error);
      throw error;
    }
  },

  getVisitorsInsideList: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.VISITORS_INSIDE_LIST);
      return response;
    } catch (error) {
      console.error('Error fetching visitors inside list:', error);
      throw error;
    }
  },

  getWorkerEntriesTodayList: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.WORKER_ENTRIES_TODAY_LIST);
      return response;
    } catch (error) {
      console.error('Error fetching worker entries today list:', error);
      throw error;
    }
  },

  getTotalVisitsTodayList: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DASHBOARD.TOTAL_VISITS_TODAY_LIST);
      return response;
    } catch (error) {
      console.error('Error fetching total visits today list:', error);
      throw error;
    }
  },

  getReportCompanies: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORTS.COMPANIES);
      return response;
    } catch (error) {
      console.error('Error fetching report companies:', error);
      throw error;
    }
  },

  generateReport: async (params) => {
    try {
      const response = await api.get(API_ENDPOINTS.REPORTS.GENERATE, { params });
      return response;
    } catch (error) {
      console.error('Error generating report:', error);
      throw error;
    }
  },

  downloadReport: async (params) => { // Make it async
    try {
      // Use api.get to make an authenticated request
      const response = await api.get(API_ENDPOINTS.REPORTS.DOWNLOAD, {
        params,
        responseType: 'blob', // Important: tell axios to expect a binary response
      });

      // Check if the response is an error object (e.g., from error.response in api.js)
      // If the backend returns a 401, api.get will return error.response, which is not a blob.
      if (response && response.data && response.data.type === 'application/json') {
        // This means the server returned a JSON error (e.g., 401, 400)
        const errorText = await response.data.text();
        const errorJson = JSON.parse(errorText);
        console.error('Error downloading report:', errorJson);
        throw new Error(errorJson.detail || 'Error desconocido al descargar el reporte.');
      }


      // Extract filename from Content-Disposition header if available
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'reporte';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      } else {
        // Fallback filename based on format
        filename = `reporte.${params.format}`;
      }

      // Create a Blob from the response data
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename); // Set the download filename
      document.body.appendChild(link);
      link.click(); // Simulate click to trigger download
      link.parentNode.removeChild(link); // Clean up the DOM
      window.URL.revokeObjectURL(url); // Release the object URL
    } catch (error) {
      console.error('Error in downloadReport:', error);
      throw error; // Re-throw to be caught by the frontend component
    }
  },
};