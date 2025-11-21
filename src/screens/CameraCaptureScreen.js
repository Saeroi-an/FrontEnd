import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, Alert, Pressable, ActivityIndicator, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/cameraCaptureStyles';
import { API_ENDPOINTS } from '../lib/api';

export default function CameraCaptureScreen({ navigation }) {
  const [photoUri, setPhotoUri] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverData, setServerData] = useState(null);

  const openCamera = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 권한을 허용해주세요.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) return;

    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    Alert.alert('확인', '사진을 사용하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '사용하기',
        onPress: async () => {
          setIsLoading(true); // 🔹 로딩 시작
          setPhotoUri(uri);

          // 실제론 여기에 업로드나 AI 분석 요청이 들어감
          await new Promise((r) => setTimeout(r, 2000)); // 예시: 2초 로딩
          setIsLoading(false); // 🔹 로딩 종료
          setShowResult(true);
          try {
            setIsLoading(true);
            setPhotoUri(uri);
            const data = await uploadPrescription(uri);  // 🔹 실제 업로드
            setServerData(data);                         // 🔹 필요 시 화면에서 활용
            Alert.alert('완료', 'S3 업로드 성공!');
            console.log('✅ 업로드 성공:', data.file_url);
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

  useEffect(() => {
    openCamera();
  }, [openCamera]);

  const guessContentType = (uri) => {
    const lower = uri.split('?')[0].toLowerCase();
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.webp')) return 'image/webp';
    if (lower.endsWith('.heic')) return 'image/heic';
    if (lower.endsWith('.heif')) return 'image/heif';
    return 'image/jpeg';
  };

  const uploadPrescription = async (uri) => {
    const nameFromUri = uri.split('/').pop() || 'photo.jpg';
    const contentType = guessContentType(uri);

    const form = new FormData();
    // ⚠️ RN은 file object를 이렇게 넣어야 함
    form.append('file', { uri, name: nameFromUri, type: contentType });

    const res = await fetch(API_ENDPOINTS.PRESCRIPTION_UPLOAD, {
      method: 'POST',
      body: form, // 🔸 Content-Type은 자동 설정 (절대 수동 지정 X)
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`업로드 실패(${res.status}) ${txt}`);
    }

    const json = await res.json();
    if (!json?.success) {
      throw new Error(json?.message || '업로드 응답 에러');
    }

    return json.data; // { id, file_url, original_filename, ai_analysis }
  };


  const handleRetake = () => {
    setShowResult(false);
    setPhotoUri(null);
    setServerData(null);
    openCamera();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>진단 저장 내역</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* 🔹 로딩 화면 */}
        {isLoading && (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <ActivityIndicator size="large" color="#2F6FED" />
            <Text style={{ marginTop: 10, color: '#555' }}>AI가 처방전을 분석 중입니다...</Text>
          </View>
        )}

        {!isLoading && showResult && (
          <>
            <View style={styles.imageWrap}>
              {photoUri ? (
                 <Image
                   source={{ uri: (serverData?.file_url || photoUri) + `?t=${Date.now()}` }}
                   style={styles.image}
                 />
              ) : (
                <View style={styles.placeholder}>
                  <Text>처방전 사진</Text>
                </View>
              )}
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>📄 처방전 인식결과</Text>
              <View style={styles.cardtext}>
                <InfoRow label="환자명" value="최예린" />
                <InfoRow label="생년월일" value="1995년 03월 08일" />
                <InfoRow label="처방일" value="2025년 10월 17일" />
                <InfoRow label="병명" value="갑상선기능저하증" />
                <InfoRow label="약품명" value="레보티록신 50mcg" />
                <InfoRow label="복용법" value="하루 2회, 식전" />
                <InfoRow label="질병코드" value="E03" />
              </View>
            </View>

            <Pressable style={[styles.button, { marginTop: 16 }]} onPress={handleRetake}>
              <Text style={styles.btnText}>재촬영</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function InfoRow({ label, value }) {
  return (
    <View style={styles.infoRow}>
      <View style={{ flexDirection: 'row' }}>
        <Entypo name="dot-single" size={20} color="#4b5563" />
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}
