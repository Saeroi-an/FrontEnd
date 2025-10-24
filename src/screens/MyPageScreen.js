import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/mypageStyles';

export default function MyPageScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* 제목 */}
        <Text style={styles.title}>마이페이지</Text>

        {/* 프로필 */}
        <View style={styles.profileRow}>
          <View style={styles.avatar} />
          <View style={{ flex: 1, marginLeft:7, }}>
            <Text style={styles.name}>김성신님</Text>
            <Text style={styles.subText}>만 21세{'\n'}160cm 55kg</Text>
          </View>
        </View>

        {/* 설정 카드 */}
        <View style={styles.card}>
          <Row label="계정" onPress={() => {}} />
          <Row label="언어 설정" onPress={() => {}} />
          <Row label="버전" right="ver 1.00" disabled />
        </View>

        {/* 로그아웃 */}
        <Pressable style={styles.logoutRow} onPress={() => {}}>
          <Ionicons name="settings-outline" size={18} color="#4B5563" />
          <Text style={styles.logoutText}>로그아웃</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function Row({ label, right, onPress, disabled }) {
  return (
    <Pressable style={styles.row} onPress={onPress} disabled={disabled}>
      <Text style={styles.rowLabel}>{label}</Text>
      {right ? (
        <Text style={styles.rowRightDim}>{right}</Text>
      ) : (
        <Ionicons name="chevron-forward" size={16} color="#9AA1A9" />
      )}
    </Pressable>
  );
}
