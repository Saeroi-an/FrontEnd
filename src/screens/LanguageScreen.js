import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';          // ⭐ 추가
import { changeLanguage } from '../i18n/i18n';          // ⭐ 추가
import styles from '../styles/languageStyles';

// 중국어만 쓸 거면 ko / zh만 남겨도 됨
const LANG_OPTIONS = [
  { code: 'ko', label: 'Korean', sub: '한국어', flag: require('../../assets/flag/flag_kr.png') },
  { code: 'zh', label: '简体中文', sub: '중국어 (간체)', flag: require('../../assets/flag/flag_cn.png') },
];

export default function LanguageScreen({ navigation }) {
  const { t, i18n } = useTranslation(); // ⭐ 번역 훅
  const [selected, setSelected] = useState(i18n.language || 'ko'); // 현재 언어 기준 기본값

  const onNext = async () => {
    try {
      // ✅ i18n + AsyncStorage 둘 다 반영
      await changeLanguage(selected);
    } catch (e) {
      console.warn('언어 저장/변경 실패', e);
    }
    navigation.replace('Info');
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
          {/* 🔥 버튼 텍스트도 번역 키 사용 */}
          <Text style={styles.btnText}>선택 완료</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
