// src/screens/LoginScreen.js
import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { API_ENDPOINTS } from '../lib/api';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }) {
    const onGoogleSignIn = async () => {
        try {
            // 백엔드 Google 로그인 페이지 열기
            const result = await WebBrowser.openAuthSessionAsync(
                API_ENDPOINTS.GOOGLE_LOGIN,
                'exp://192.168.35.21:8081'
            );

            if (result.type === 'success' && result.url) {
                // URL에서 토큰 추출
                const url = new URL(result.url);
                const accessToken = url.searchParams.get('access_token');
                const refreshToken = url.searchParams.get('refresh_token');

                if (accessToken && refreshToken) {
                    // 토큰 저장
                    await AsyncStorage.setItem('access_token', accessToken);
                    await AsyncStorage.setItem('refresh_token', refreshToken);
                    
                    Alert.alert('로그인 성공', '로그인이 완료되었습니다.');
                    navigation.replace('Language');
                } else {
                    Alert.alert('로그인 오류', '토큰을 받지 못했습니다.');
                }
            } else {
                Alert.alert('로그인 취소', '로그인이 취소되었습니다.');
            }
        } catch (error) {
        console.error('Google login error:', error);
        Alert.alert('로그인 오류', '로그인 중 문제가 발생했습니다.');
    }
};

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.wrap}>

                {/* 로고 영역 */}
                <View style={styles.logoBox}>
                    <View style={styles.brandRow}>
                        <Image source={require('../../assets/images/main_logo.png')} style={styles.logo} />
                    </View>
                    <Text style={styles.subtitle}>당신의 편안한 진료를 위해</Text>
                </View>

                {/* 구글 로그인 버튼 */}
                <Pressable onPress={onGoogleSignIn} style={styles.googleBtn}>
                    <Image source={require('../../assets/icon/google.png')} style={styles.google} />
                    <Text style={styles.googleText}>구글 계정으로 로그인</Text>
                </Pressable>

                {/* 여백 채우기 */}
                <View style={{ height: 40 }} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#fff' },
    wrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 48,
    },

    // 로고
    logoBox: { alignItems: 'center', marginTop: 240 },
    brandRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    subtitle: { marginTop: 10, fontSize: 16, color: '#555' },
    logo: { width:210, height:44, },

    // 구글 버튼
    googleBtn: {
        position: 'absolute',
        bottom: 240,
        left: 20,
        right: 20,
        height: 56,
        borderRadius: 8,
        backgroundColor: '#EEEEEE',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    google: {width:18,height:18,},
    googleText: { fontSize: 14, fontWeight: '600', color: '#222' },
});
