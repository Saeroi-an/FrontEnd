import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/languageStyles'; // 👈 스타일 분리


const LANG_OPTIONS = [
  { code: 'ko', label: 'Korean', sub: '한국어', flag: require('../../assets/flag/flag_kr.png') },
  { code: 'zh', label: 'Simplified Chinese', sub: '중국어 (간체)', flag: require('../../assets/flag/flag_cn.png') },
  { code: 'en', label: 'English', sub: '영어', flag: require('../../assets/flag/flag_en.png') },
];

export default function LanguageScreen({ navigation }) {
  const [selected, setSelected] = useState('ko'); // 기본값: 중국어

  const onNext = async () => {
    try {
      await AsyncStorage.setItem('app_language', selected);
    } catch (e) {
      console.warn('언어 저장 실패', e);
    }
    navigation.replace('Info'); // ✅ 언어 설정 후 로그인 화면으로 이동
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>언어를 선택해주세요</Text>
        <Text style={styles.subtitle}>Please choose your language</Text>

        <View style={styles.list}>
          {LANG_OPTIONS.map(lang => {
            const active = selected === lang.code;
            return (
              <Pressable
                key={lang.code}
                style={[styles.item, active && styles.itemActive]}
                onPress={() => setSelected(lang.code)}
              >
                <View style={styles.flagBox}>
                  <Image source={lang.flag} style={styles.flag} resizeMode="contain" />
                </View>
                <View style={styles.textBox}>
                  <Text style={[styles.label, active && styles.activeText]}>{lang.label}</Text>
                  <Text style={[styles.sub, active && styles.activeText]}>{lang.sub}</Text>
                </View>
                {active && <Ionicons name="checkmark" size={22} color="#2F6FED" />}
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={onNext} style={styles.btn}>
          <Text style={styles.btnText}>완료</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}


