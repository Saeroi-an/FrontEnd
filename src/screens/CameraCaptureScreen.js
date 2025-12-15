// 처방전 촬영 및 업로드 화면
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, Alert, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/cameraCaptureStyles';
import { API_ENDPOINTS, getAccessToken } from '../lib/api';

export default function CameraCaptureScreen({ navigation }) {
  // 📸 촬영한 사진 URI
  const [photoUri, setPhotoUri] = useState(null);
  
  // 📄 업로드 결과 화면 표시 여부
  const [showResult, setShowResult] = useState(false);
  
  // ⏳ 업로드 중 로딩 상태
  const [isLoading, setIsLoading] = useState(false);
  
  // 💾 서버 응답 데이터 (prescription_id 등)
  const [serverData, setServerData] = useState(null);

  /**
   * 📸 카메라 촬영 및 확인 프로세스
   * 1. 카메라 권한 요청
   * 2. 카메라 실행
   * 3. 촬영된 사진 확인
   * 4. 사용자가 "사용하기" 선택 시 업로드
   */
  const openCamera = useCallback(async () => {
    // 1️⃣ 카메라 권한 요청
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 권한을 허용해주세요.');
      return;
    }

    // 2️⃣ 카메라 실행
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,  // 편집 기능 비활성화
      quality: 1,            // 최고 화질
    });

    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    // 3️⃣ 촬영 확인 다이얼로그
    Alert.alert('확인', '사진을 사용하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '사용하기',
        onPress: async () => {
          try {
            setIsLoading(true);
            setPhotoUri(uri);
            
            // 4️⃣ 백엔드로 업로드
            const data = await uploadPrescription(uri);
            setServerData(data);
            console.log('✅ 업로드 성공:', data);
            
            // 결과 화면 표시
            setShowResult(true);
          } catch (e) {
            console.error(e);
            Alert.alert('업로드 실패', String(e?.message || e));
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  }, []);

  // 🚀 화면 진입 시 자동으로 카메라 실행
  useEffect(() => {
    openCamera();
  }, [openCamera]);

  /**
   * 🔍 파일 확장자로 MIME 타입 추정
   * @param {string} uri - 이미지 파일 경로
   * @returns {string} MIME 타입 (예: 'image/jpeg')
   */
  const guessContentType = (uri) => {
    const lower = uri.split('?')[0].toLowerCase();
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.webp')) return 'image/webp';
    if (lower.endsWith('.heic')) return 'image/heic';
    if (lower.endsWith('.heif')) return 'image/heif';
    return 'image/jpeg';  // 기본값
  };

  /**
   * 📤 처방전 이미지 업로드 API 호출
   * @param {string} uri - 촬영한 이미지 URI
   * @returns {Promise<Object>} 서버 응답 (prescription_id, ai_response 등)
   */
  const uploadPrescription = async (uri) => {
    console.log("🔵 uploadPrescription 호출, uri =", uri);
    
    try {
      // 1️⃣ AsyncStorage에서 JWT 토큰 가져오기
      const token = await getAccessToken();
      console.log("🔑 Access Token:", token ? "존재함" : "없음");
      
      if (!token) {
        throw new Error("로그인 토큰이 없습니다.");
      }
      
      // 2️⃣ 파일 정보 준비
      const nameFromUri = uri.split('/').pop() || 'photo.jpg';
      const contentType = guessContentType(uri);
      console.log("🟡 파일 이름:", nameFromUri, " / contentType:", contentType);
      
      // 3️⃣ FormData 생성 (multipart/form-data)
      const form = new FormData();
      form.append('file', { 
        uri,              // 파일 경로
        name: nameFromUri, // 파일 이름
        type: contentType  // MIME 타입
      });
      
      console.log("🟣 FormData 준비 완료, endpoint =", API_ENDPOINTS.PRESCRIPTION_UPLOAD);
      
      // 4️⃣ 백엔드 API 호출
      const res = await fetch(API_ENDPOINTS.PRESCRIPTION_UPLOAD, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,  // JWT 토큰
        },
        body: form,
      });
      
      console.log("🟠 HTTP 응답 status =", res.status);
      
      // 5️⃣ 응답 텍스트 읽기
      const text = await res.text();
      console.log("📝 응답 원문 =", text);
      
      // 6️⃣ JSON 파싱
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        throw new Error("JSON 파싱 실패: " + text);
      }
      
      // 7️⃣ HTTP 에러 체크
      if (!res.ok) {
        const errorMsg = `업로드 실패(${res.status}) ${json?.detail || json?.message || ""}`;
        throw new Error(errorMsg);
      }
      
      // 8️⃣ 성공!
      console.log("✅ uploadPrescription 성공, data =", json);
      return json;  // ChatResponse 객체 반환
      
    } catch (error) {
      console.log("❌ uploadPrescription 에러:", error);
      throw error;
    }
  };

  /**
   * 🔄 재촬영 버튼 핸들러
   * 상태 초기화 후 카메라 다시 실행
   */
  const handleRetake = () => {
    setShowResult(false);
    setPhotoUri(null);
    setServerData(null);
    openCamera();
  };

  /**
   * 💬 채팅 화면으로 이동
   * 업로드된 처방전에 대해 질문할 수 있도록 안내
   */
  const goToChat = () => {
    navigation.navigate('ChatPrescription');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* 📱 헤더 영역 */}
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>처방전 촬영</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* ⏳ 로딩 화면 */}
        {isLoading && (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <ActivityIndicator size="large" color="#2F6FED" />
            <Text style={{ marginTop: 10, color: '#555' }}>처방전을 업로드 중입니다...</Text>
          </View>
        )}

        {/* ✅ 업로드 완료 화면 */}
        {!isLoading && showResult && (
          <>
            {/* 📸 촬영한 이미지 표시 */}
            <View style={styles.imageWrap}>
              {photoUri ? (
                <Image
                  source={{ uri: photoUri }}
                  style={styles.image}
                />
              ) : (
                <View style={styles.placeholder}>
                  <Text>처방전 사진</Text>
                </View>
              )}
            </View>

            {/* 💡 안내 메시지 */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>✅ 처방전이 업로드되었습니다</Text>
              <Text style={{ color: '#666', marginTop: 12, lineHeight: 22, fontSize: 14 }}>
                AI가 처방전을 분석 중입니다.{'\n'}
                채팅에서 처방전에 대해 무엇이든 물어보세요!
              </Text>
            </View>

            {/* 💬 채팅으로 이동 버튼 */}
            <Pressable 
              style={[styles.button, { marginTop: 16, backgroundColor: '#2F6FED' }]} 
              onPress={goToChat}
            >
              <Text style={styles.btnText}>채팅으로 이동</Text>
            </Pressable>

            {/* 🔄 재촬영 버튼 */}
            <Pressable 
              style={[styles.button, { marginTop: 8, backgroundColor: '#e5e7eb' }]} 
              onPress={handleRetake}
            >
              <Text style={[styles.btnText, { color: '#374151' }]}>재촬영</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}