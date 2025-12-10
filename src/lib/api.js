import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'https://saeroi-an.com';

export const API_ENDPOINTS = {
  GOOGLE_LOGIN: `${API_BASE_URL}/api/auth/google/login`,
  GOOGLE_CALLBACK: `${API_BASE_URL}/api/auth/google/callback`,
  UPDATE_PROFILE: `${API_BASE_URL}/users/me/profile`,
  GET_PROFILE: `${API_BASE_URL}/users/me/profile`,
  HOSPITALS: `${API_BASE_URL}/hospitals`,
};

export async function getAccessToken() {
  try {
    const token = await AsyncStorage.getItem("access_token");
    console.log("▶ getAccessToken / token:", token);
    return token;
  } catch (e) {
    console.log("▶ getAccessToken 에러:", e);
    return null;
  }
}

export async function fetchProfile() {
  const token = await getAccessToken();
  console.log("▶ access token:", token);

  if (!token) {
    throw new Error("로그인이 필요합니다. (토큰 없음)");
  }

  const res = await fetch(API_ENDPOINTS.GET_PROFILE, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });

  console.log("▶ status:", res.status);

  const data = await res.json().catch(() => null);
  console.log("▶ resp json:", data);

  if (!res.ok) {
    throw new Error("프로필 조회 실패");
  }

  return data;
}
