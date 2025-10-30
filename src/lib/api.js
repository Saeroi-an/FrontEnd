// src/lib/api.js
const API_BASE_URL = `http://10.0.2.2:8000`;

export const API_ENDPOINTS = {
  GOOGLE_LOGIN: `${API_BASE_URL}/api/auth/google/login`,
  GOOGLE_CALLBACK: `${API_BASE_URL}/api/auth/google/callback`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/me/profile`,
  HOSPITALS: `${API_BASE_URL}/hospitals`,
};