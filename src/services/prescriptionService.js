// src/services/prescriptionService
import { API_ENDPOINTS } from '../lib/api';

export const uploadPrescription = async (imageUri, userId = 'test_user_123') => {
  const formData = new FormData();
  
  // 이미지 파일 추가
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'prescription.jpg',
  });
  
  // user_id 추가
  formData.append('user_id', userId);

  const response = await fetch(API_ENDPOINTS.UPLOAD_PRESCRIPTION, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`업로드 실패: ${errorText}`);
  }

  return await response.json();
};