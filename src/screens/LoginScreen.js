// src/screens/LoginScreen.js
import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen({ navigation }) {
    const onGoogleSignIn = async () => {
        // TODO: 구글 로그인 로직 연결 (expo-auth-session or firebase)
        // 성공 후 메인 탭으로 이동
        navigation.replace('Language');
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
