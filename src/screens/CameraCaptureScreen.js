// CameraCaptureScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, Alert, Pressable, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { uploadPrescription } from '../services/prescriptionService';

// ⭐ 파싱 함수 추가
const parseAnalysisResult = (text) => {
  if (!text) return null;
  
  const extractField = (label) => {
    const regex = new RegExp(`${label}[:\\s]*([^\\n]+)`, 'i');
    const match = text.match(regex);
    return match ? match[1].trim() : '-';
  };

  return {
    patientName: extractField('환자명'),
    birthDate: extractField('생년월일'),
    prescriptionDate: extractField('처방일'),
    diagnosis: extractField('병명'),
    medication: extractField('약품명'),
    dosage: extractField('복용법'),
    diseaseCode: extractField('질병코드'),
  };
};

export default function CameraCaptureScreen({navigation}) {
    const [photoUri, setPhotoUri] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState(null);

    const openCamera = useCallback(async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('권한 필요', '카메라 권한을 허용해주세요.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: false,
            quality: 0.7,
        });

        if (result.canceled) return;

        const uri = result.assets?.[0]?.uri;
        if (!uri) return;

        Alert.alert(
            '확인',
            '사진을 사용하시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '사용하기',
                    onPress: () => handleUpload(uri),
                },
            ]
        );
    }, []);

    // ⭐ 업로드 함수 수정
    const handleUpload = async (uri) => {
        setPhotoUri(uri);
        setShowResult(true);
        setAnalysisResult(null);
        setUploading(true);

        try {
            console.log('업로드 시작:', uri);
            
            const response = await uploadPrescription(uri, 'test_user_123');
            console.log('업로드 성공:', response);
            
            // ⭐ AI 분석 결과 파싱
            const rawText = response.data.ai_analysis;
            const parsedData = parseAnalysisResult(rawText);
            
            console.log('파싱 결과:', parsedData);
            setAnalysisResult(parsedData);
            
            Alert.alert('분석 완료', '처방전 분석이 완료되었습니다!');
        } catch (error) {
            console.error('업로드 실패:', error);
            console.error('에러 메시지:', error.message);
            Alert.alert(
                '오류', 
                `처방전 업로드에 실패했습니다.\n${error.message}`
            );
        } finally {
            setUploading(false);
        }
    };

    useEffect(() => {
        openCamera();
    }, [openCamera]);

    const handleRetake = () => {
        setShowResult(false);
        setPhotoUri(null);
        setAnalysisResult(null);
        openCamera();
    };

    return (
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
            <View style={styles.header}>
                <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color="#111" />
                </Pressable>
                <Text style={styles.headerTitle}>처방전 인식하기</Text>
                <View style={{ width: 22 }} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                {!showResult ? (
                    <>
                        <Text style={styles.title}>카메라 준비 중...</Text>
                        <Pressable style={styles.button} onPress={openCamera}>
                            <Text style={styles.btnText}>다시 촬영하기</Text>
                        </Pressable>
                    </>
                ) : (
                    <>
                        <Text style={styles.title}>
                            <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>
                                {analysisResult?.patientName || '사용자'}
                            </Text>님의 처방전 내용입니다
                        </Text>

                        <View style={styles.imageWrap}>
                            {photoUri ? (
                                <Image source={{ uri: photoUri }} style={styles.image} />
                            ) : (
                                <View style={styles.placeholder}>
                                    <Text>처방전 사진</Text>
                                </View>
                            )}
                        </View>

                        {/* ⭐ 로딩 표시 */}
                        {uploading ? (
                            <View style={styles.loadingBox}>
                                <ActivityIndicator size="large" color="#2563eb" />
                                <Text style={styles.loadingText}>AI 분석 중...</Text>
                                <Text style={styles.loadingSubtext}>최대 2분 정도 소요됩니다</Text>
                            </View>
                        ) : (
                            <View style={styles.card}>
                                <Text style={styles.cardTitle}>📄 처방전 인식결과</Text>
                                
                                {/* ⭐ 파싱된 데이터 표시 */}
                                {analysisResult ? (
                                    <>
                                        <InfoRow label="환자명" value={analysisResult.patientName} />
                                        <InfoRow label="생년월일" value={analysisResult.birthDate} />
                                        <InfoRow label="처방일" value={analysisResult.prescriptionDate} />
                                        <InfoRow label="병명" value={analysisResult.diagnosis} />
                                        <InfoRow label="약품명" value={analysisResult.medication} />
                                        <InfoRow label="복용법" value={analysisResult.dosage} />
                                        <InfoRow label="질병코드" value={analysisResult.diseaseCode} />
                                    </>
                                ) : (
                                    <Text style={styles.analysisText}>분석 결과 없음</Text>
                                )}
                            </View>
                        )}

                        <Pressable 
                            style={[styles.button, { marginTop: 16 }]} 
                            onPress={handleRetake}
                            disabled={uploading}
                        >
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
            <Text style={styles.label}>{label}</Text>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', padding: 16 },
    title: { fontSize: 16, fontWeight: '500', marginBottom: 16, alignSelf: 'flex-start' },
    imageWrap: { width: '100%', alignItems: 'center', marginBottom: 20 },
    image: { width: 300, height: 300, borderRadius: 10, resizeMode: 'cover' },
    placeholder: { 
        width: 300, 
        height: 300, 
        backgroundColor: '#e5e7eb', 
        alignItems: 'center', 
        justifyContent: 'center', 
        borderRadius: 10 
    },
    card: {
        backgroundColor: '#fff',
        width: '100%',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
    },
    cardTitle: { fontWeight: '600', marginBottom: 12, fontSize: 16 },
    infoRow: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        marginBottom: 8,
        paddingVertical: 4,
    },
    label: { fontWeight: '500', color: '#4b5563' },
    value: { color: '#111', textAlign: 'right', flex: 1, marginLeft: 16 },
    button: { 
        backgroundColor: '#111827', 
        paddingVertical: 12, 
        paddingHorizontal: 18, 
        borderRadius: 10 
    },
    btnText: { color: 'white', fontSize: 16, fontWeight: '600', textAlign: 'center' },
    header: {
        height: 48,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E6E8EB',
        marginTop: 50,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
    },
    loadingBox: {
        alignItems: 'center',
        padding: 32,
        width: '100%',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        color: '#111',
    },
    loadingSubtext: {
        marginTop: 8,
        fontSize: 14,
        color: '#6b7280',
    },
    analysisText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#6b7280',
        textAlign: 'center',
        paddingVertical: 20,
    },
});