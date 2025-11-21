import { API_ENDPOINTS } from '../lib/api';

// 프로필 조회
export const getProfile = async (token) => {
  const response = await fetch(API_ENDPOINTS.GET_PROFILE, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`, // 토큰 구현 시
    },
  });

  if (!response.ok) {
    throw new Error('프로필 조회 실패');
  }

  return await response.json();
};

// 프로필 업데이트 ⭐ 백엔드 스키마에 맞게 수정
export const updateProfile = async (profileData, token) => {
  // 백엔드 형식에 맞게 변환
  const requestData = {
    gender: profileData.gender,
    birth_year: profileData.birth_year,
    birth_month: profileData.birth_month,
    birth_day: profileData.birth_day,
    height: profileData.height,
    weight: profileData.weight,
  };

  const response = await fetch(API_ENDPOINTS.UPDATE_PROFILE, {
    method: 'PATCH', // ⭐ PUT → PATCH
    headers: {
      'Content-Type': 'application/json',
      // Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    throw new Error('프로필 업데이트 실패');
  }

  return await response.json();
};

// BMI 계산
export const calculateBMI = (height, weight) => {
  if (!height || !weight) return null;
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(2);
};

// BMI 상태 판정
export const getBMIStatus = (bmi) => {
  if (!bmi) return '-';
  const bmiNum = parseFloat(bmi);
  if (bmiNum < 18.5) return '저체중';
  if (bmiNum < 23) return '정상';
  if (bmiNum < 25) return '과체중';
  if (bmiNum < 30) return '비만';
  return '고도비만';
};

// 생년월일을 문자열로 변환
export const formatBirthDate = (year, month, day) => {
  if (!year || !month || !day) return null;
  return `${year}년 ${month}월 ${day}일`;
};