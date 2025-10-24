import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { PARTS } from '../data/parts';
import styles from '../styles/selfCheckStyles';
  

export default function SelfCheckScreen({ navigation }) {
  const [selected, setSelected] = useState(new Set());

  const toggle = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const allSelected = selected.size > 0;

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>셀프 진단 체크</Text>
        <View style={{ width: 22 }} />
      </View>

      {/* 진행바 */}
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      {/* 타이틀 */}
      <View style={styles.titleBox}>
        <Text style={styles.title}>진단 부위</Text>
        <Text style={styles.subtitle}>현재 불편하신 부위를 모두 선택해주세요!</Text>
      </View>

      {/* 6개 선택 카드 */}
      <View style={styles.grid}>
        {PARTS.map((p) => {
          const isOn = selected.has(p.id);
          return (
            <Pressable
              key={p.id}
              onPress={() => toggle(p.id)}
              style={[styles.tile, isOn && styles.tileOn]}
            >
              {/* 아이콘 자리 (원하면 Image로 교체) */}
              <Image source={isOn ? p.iconOn : p.iconOff} style={styles.tileImage} />
              <Text style={[styles.tileLabel, isOn && styles.tileLabelOn]}>
                {p.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 다음 버튼 */}
      <Pressable
        style={[styles.nextBtn, allSelected ? styles.nextBtnOn : styles.nextBtnOff]}
        onPress={() => {
            navigation.navigate('QuestionStep', {
              selectedParts: Array.from(selected), // ['nose','surgery']
              idx: 0,
              answers: {}, // 누적 답안 저장용
            });
          }}
        disabled={!allSelected}
      >
        <Text style={styles.nextText}>다음</Text>
      </Pressable>
    </SafeAreaView>
  );
}
