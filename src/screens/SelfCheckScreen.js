import React, { useState } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';    // ⭐ 추가
import { PARTS } from '../data/parts';
import styles from '../styles/selfCheckStyles';

export default function SelfCheckScreen({ navigation }) {
  const { t } = useTranslation();                 // ⭐ 추가
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
        <Text style={styles.headerTitle}>
          {t('selfcheck_header_title')}
        </Text>
        <View style={{ width: 22 }} />
      </View>

      {/* 진행바 */}
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>

      {/* 타이틀 */}
      <View style={styles.titleBox}>
        <Text style={styles.title}>{t('selfcheck_title')}</Text>
        <Text style={styles.subtitle}>
          {t('selfcheck_subtitle')}
        </Text>
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
              <Image
                source={isOn ? p.iconOn : p.iconOff}
                style={styles.tileImage}
              />
              <Text style={[styles.tileLabel, isOn && styles.tileLabelOn]}>
              {t(p.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* 다음 버튼 */}
      <Pressable
        style={[
          styles.nextBtn,
          allSelected ? styles.nextBtnOn : styles.nextBtnOff,
        ]}
        onPress={() => {
          navigation.navigate('QuestionStep', {
            selectedParts: Array.from(selected),
            idx: 0,
            answers: {},
          });
        }}
        disabled={!allSelected}
      >
        <Text style={styles.nextText}>{t('selfcheck_next')}</Text>
      </Pressable>
    </SafeAreaView>
  );
}
