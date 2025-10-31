// CameraCaptureScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Image, Alert, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import * as ImagePicker from 'expo-image-picker';
import styles from '../styles/cameraCaptureStyles'; // 👈 스타일 분리

export default function CameraCaptureScreen({ navigation }) {
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

            <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
                {!showResult ? (
                    <>
                        {/* 카메라  */}
                        {/* <Text style={styles.title}>카메라 준비 중...</Text> */}
                        {/* <Pressable style={styles.button} onPress={openCamera}>
                            <Text style={styles.btnText}>다시 촬영하기</Text>
                        </Pressable> */}
                    </>
                ) : (
                    <>

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
                            <View style={styles.cardtext}>
                                <InfoRow label="환자명" value="김성신" />
                                <InfoRow label="생년월일" value="2025년 10월 26일" />
                                <InfoRow label="처방일" value="2025년 10월 26일" />
                                <InfoRow label="병명" value="역류성 식도염" />
                                <InfoRow label="약품명" value="아스피린 100mg" />
                                <InfoRow label="복용법" value="하루 1회, 아침 식후" />
                                <InfoRow label="질병코드" value="Z031" />
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
            <View style={{flexDirection:'row'}}>
            <Entypo name="dot-single" size={20} color="#4b5563" />                
            <Text style={styles.label}>{label}</Text>
            </View>
            <Text style={styles.value}>{value}</Text>
        </View>
    );
}

