// src/lib/api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = `http://13.125.99.207:8000`;

export const API_ENDPOINTS = {
  GOOGLE_LOGIN: `${API_BASE_URL}/api/auth/google/login`,
  GOOGLE_CALLBACK: `${API_BASE_URL}/api/auth/google/callback`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/me/profile`,
  GET_PROFILE: `${API_BASE_URL}/users/me/profile`,
  UPLOAD_PRESCRIPTION: `${API_BASE_URL}/prescriptions/upload`,
  GET_PRESCRIPTION: (id) => `${API_BASE_URL}/prescriptions/${id}`,
  GET_USER_PRESCRIPTIONS: (userId) => `${API_BASE_URL}/prescriptions/user/${userId}`,
  HOSPITALS: `${API_BASE_URL}/hospitals`,
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

// 사용자 정보를 가져오는 헬퍼 함수
export const getUserInfo = async () => {
  try {
    const response = await authenticatedFetch(API_ENDPOINTS.GET_PROFILE);
    
    if (response.ok) {
      const data = await response.json();
      
      // AsyncStorage에도 저장
      await AsyncStorage.setItem('user_id', data.id?.toString() || '');
      await AsyncStorage.setItem('user_name', data.name || '');
      await AsyncStorage.setItem('user_email', data.email || '');
      
      return data;
    } else {
      // API 실패 시 AsyncStorage에서 가져오기
      const userId = await AsyncStorage.getItem('user_id');
      const userName = await AsyncStorage.getItem('user_name');
      const userEmail = await AsyncStorage.getItem('user_email');
      
      console.log('API 호출 실패, AsyncStorage 정보 사용');
      console.log('저장된 이름:', userName);
      console.log('저장된 ID:', userId);
      
      return {
        id: userId,
        name: userName,
        email: userEmail,
      };
    }
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error);
    
    // 에러 발생 시에도 AsyncStorage에서 시도
    const userId = await AsyncStorage.getItem('user_id');
    const userName = await AsyncStorage.getItem('user_name');
    const userEmail = await AsyncStorage.getItem('user_email');
    
    return {
      id: userId,
      name: userName,
      email: userEmail,
    };
  }
};