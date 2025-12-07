import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';   // ⭐ 추가
import styles from '../styles/resultStyles';

export default function ResultScreen({ navigation, route }) {
  // const { answers } = route.params || {}; // 필요하면 사용
  const { t } = useTranslation();               // ⭐ 추가

  const goHome = () => {
    navigation.navigate('Tabs');
    // 또는: navigation.navigate('Tabs', { screen: 'Home' });
  };

  const goSaved = () => {
    navigation.navigate('History');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>
          {t('selfcheck_header_title')}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      {/* 진행바 (완료) */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: '100%' }]} />
      </View>

      {/* 본문 */}
      <View style={styles.body}>
        {/* 결과 이미지 */}
        <View style={styles.thumbBox}>
          <Image
            source={require('../../assets/images/result_thumb.png')}
            style={styles.thumb}
          />
        </View>

        <Text style={styles.title}>
          {t('selfcheck_result_title')}
        </Text>

        {/* 버튼들 */}
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={goHome}>
          <Text style={styles.btnPrimaryText}>
            {t('selfcheck_result_home')}
          </Text>
        </Pressable>

        <Pressable style={[styles.btn, styles.btnGhost]} onPress={goSaved}>
          <Text style={styles.btnGhostText}>
            {t('selfcheck_result_history')}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
