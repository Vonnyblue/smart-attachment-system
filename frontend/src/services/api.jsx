import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (userData) => {
    const params = new URLSearchParams();
    params.append("name", userData.name);
    params.append("email", userData.email);
    params.append("password", userData.password);
    params.append("notification_frequency", userData.notification_frequency || "daily");
    params.append("role", userData.role || "student");

    if (userData.field) params.append("field", userData.field);
    if (userData.skills) params.append("skills", userData.skills);
    if (userData.preferred_location) params.append("preferred_location", userData.preferred_location);
    if (userData.bio) params.append("bio", userData.bio);

    const response = await api.post("/auth/register", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
  },

  login: async (credentials) => {
    const params = new URLSearchParams();
    params.append("email", credentials.email);
    params.append("password", credentials.password);

    const response = await api.post("/auth/login", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    return response.data;
  },
};

export const userAPI = {
  getProfile: async () => {
    const response = await api.get("/user/me");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/user/update-profile", profileData);
    return response.data;
  },

  updateNotification: async (notificationData) => {
    const response = await api.put("/user/update-notification", notificationData);
    return response.data;
  },
};

export const internshipAPI = {
  searchInternships: async ({ query = "", location, page = 1 }) => {
    const params = new URLSearchParams({ query, page: String(page) });
    if (location) params.append("location", location);
    const response = await api.get(`/internships/search?${params.toString()}`);
    return response.data;
  },

  matchInternships: async ({ field = "", skills, location, page = 1 }) => {
    const params = new URLSearchParams({ field, page: String(page) });
    if (skills) params.append("skills", skills);
    if (location) params.append("location", location);
    const response = await api.get(`/internships/match?${params.toString()}`);
    return response.data;
  },
};

export const adminAPI = {
  getOverview: async () => {
    const response = await api.get("/admin/overview");
    return response.data;
  },

  getUsers: async () => {
    const response = await api.get("/admin/users");
    return response.data;
  },
};

export async function searchInternships({ query = "", location, page = 1 }) {
  return internshipAPI.searchInternships({ query, location, page });
}

export async function matchInternships({ field = "", skills, location, page = 1 }) {
  return internshipAPI.matchInternships({ field, skills, location, page });
}

export default api;
