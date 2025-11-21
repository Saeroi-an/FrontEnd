// src/lib/api.js
const API_BASE_URL = 'https://kennedi-unalternating-nontransparently.ngrok-free.dev';

export const API_ENDPOINTS = {
  GOOGLE_LOGIN: `${API_BASE_URL}/api/auth/google/login`,
  GOOGLE_CALLBACK: `${API_BASE_URL}/api/auth/google/callback`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/me/profile`,
  HOSPITALS: `${API_BASE_URL}/hospitals`,
  PRESCRIPTION_UPLOAD: `${API_BASE_URL}/prescriptions/upload`,
};