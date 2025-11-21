import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/resultStyles';

export default function ResultScreen({ navigation, route }) {
  // const { answers } = route.params || {}; // 필요하면 사용

  const goHome = () => {
    // 탭 밖 루트 Stack 구조라면:
    navigation.navigate('Tabs');              // 탭 루트로 이동 (기본 Home 탭)
    // 또는 특정 탭 지정: navigation.navigate('Tabs', { screen: 'Home' });
    // 전체 스택 초기화하고 홈: navigation.reset({ index: 0, routes: [{ name: 'Tabs' }] });
  };

  const goSaved = () => {
    // 진단 저장 내역 화면으로 이동할 때 라우트 이름에 맞게 수정
    navigation.navigate('History');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>셀프 진단 체크</Text>
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
          <Image source={require('../../assets/images/result_thumb.png')} style={styles.thumb} />
        </View>

        <Text style={styles.title}>진단결과가{'\n'}저장되었습니다!</Text>

        {/* 버튼들 */}
        <Pressable style={[styles.btn, styles.btnPrimary]} onPress={goHome}>
          <Text style={styles.btnPrimaryText}>홈으로</Text>
        </Pressable>

        <Pressable style={[styles.btn, styles.btnGhost]} onPress={goSaved}>
          <Text style={styles.btnGhostText}>진단 저장 내역으로 가기</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
