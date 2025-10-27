// CameraCaptureScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, Alert, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function CameraCaptureScreen({navigation}) {
    const [photoUri, setPhotoUri] = useState(null);
    const [showResult, setShowResult] = useState(false);

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

        if (result.canceled) return; // 사용자가 취소했으면 그대로 유지

        const uri = result.assets?.[0]?.uri;
        if (!uri) return;

        Alert.alert(
            '확인',
            '사진을 사용하시겠습니까?',
            [
                { text: '취소', style: 'cancel' },
                {
                    text: '사용하기',
                    onPress: () => {
                        setPhotoUri(uri);
                        setShowResult(true); // 같은 화면에 결과 표시
                    },
                },
            ]
        );
    }, []);

    // 진입 시 자동으로 카메라 실행
    useEffect(() => {
        openCamera();
    }, [openCamera]);

    const handleRetake = () => {
        setShowResult(false);
        setPhotoUri(null);
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
                            <Text style={{ color: '#2563eb', fontWeight: 'bold' }}>김성신</Text>님의 처방전 내용입니다
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

                        <View style={styles.card}>
                            <Text style={styles.cardTitle}>📄 처방전 인식결과</Text>
                            <InfoRow label="환자명" value="김성신" />
                            <InfoRow label="생년월일" value="2025년 10월 26일" />
                            <InfoRow label="처방일" value="2025년 10월 26일" />
                            <InfoRow label="병명" value="역류성 식도염" />
                            <InfoRow label="약품명" value="아스피린 100mg" />
                            <InfoRow label="복용법" value="하루 1회, 아침 식후" />
                            <InfoRow label="질병코드" value="Z031" />
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
            <Text style={styles.label}>{label}</Text>
            <Text>{value}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { alignItems: 'center', padding: 16 },
    title: { fontSize: 16, fontWeight: '500', marginBottom: 16, alignSelf: 'flex-start' },
    imageWrap: { width: '100%', alignItems: 'center', marginBottom: 20 },
    image: { width: 300, height: 300, borderRadius: 10, resizeMode: 'cover' },
    placeholder: { width: 300, height: 300, backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
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
    cardTitle: { fontWeight: '600', marginBottom: 12 },
    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    label: { fontWeight: '500', color: '#4b5563' },
    button: { backgroundColor: '#111827', paddingVertical: 12, paddingHorizontal: 18, borderRadius: 10 },
    btnText: { color: 'white', fontSize: 16, fontWeight: '600' },

  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E6E8EB',
    marginTop:50,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },
});
