// src/lib/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://saeroi-an.com';

export const API_ENDPOINTS = {
  GOOGLE_LOGIN: `${API_BASE_URL}/api/auth/google/login`,
  GOOGLE_CALLBACK: `${API_BASE_URL}/api/auth/google/callback`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/me/profile`,
  GET_PROFILE: `${API_BASE_URL}/users/me/profile`,
  HOSPITALS: `${API_BASE_URL}/hospitals`,
  PRESCRIPTION_UPLOAD: `${API_BASE_URL}/prescriptions/upload`,
};

// 인증 헤더를 자동으로 추가하는 fetch 함수
export const authenticatedFetch = async (url, options = {}) => {
  try {
    const accessToken = await AsyncStorage.getItem('access_token');
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
    
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    return response;
  } catch (error) {
    console.error('API 호출 오류:', error);
    throw error;
  }
};