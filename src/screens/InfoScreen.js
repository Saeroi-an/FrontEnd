import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, FlatList, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/infoStyles';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { API_BASE_URL } from '../lib/api';
const STORAGE_KEY = 'user_basic_info';

const YEARS = (() => {
  const thisYear = new Date().getFullYear();
  const arr = [];
  for (let y = thisYear; y >= 1920; y--) arr.push(String(y));
  return arr;
})();

export default function InfoScreen({ navigation }) {
  const [gender, setGender] = useState(null);
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [nickname, setNickname] = useState(''); // 🔹 닉네임 추가
  const [yearOpen, setYearOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 🔹 로딩 상태 추가

  const birthISO = useMemo(() => {
    if (!year || !month || !day) return '';
    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }, [year, month, day]);

  const onComplete = async () => {
    console.log('👉 API_BASE_URL:', API_BASE_URL);
    const h = Number(height);
    const w = Number(weight);

    if (Number.isNaN(h) || Number.isNaN(w)) {
      Alert.alert(t('info_alert_notice_title'), t('info_alert_notice_body_invalid_number'))
    }
    if (!gender) {
      Alert.alert(t('info_alert_notice_title'), t('info_alert_notice_body_no_gender'))
    }
    if (!year || !month || !day) {
      Alert.alert(t('info_alert_notice_title'), t('info_alert_notice_body_no_birth'))
    }
    if (!nickname.trim()) {
      Alert.alert(t('info_alert_notice_title'), t('info_alert_notice_body_no_nickname'))
    }

    // 🔹 백엔드 스펙에 맞는 body
    const apiBody = {
      nickname: nickname.trim(),
      gender,                      // "female" / "male" / "other"
      birth_year: Number(year),
      birth_month: Number(month),
      birth_day: Number(day),
      height: h,
      weight: w,
    };

    // 🔹 로컬에 저장할 payload
    const payload = {
      ...apiBody,
      birthISO,
      savedAt: new Date().toISOString(),
    };

    try {
      setIsLoading(true);

      // ✅ 토큰 가져오기 (키 이름은 너 프로젝트에 맞게 수정 가능)
      const token = await AsyncStorage.getItem('access_token');

      // ✅ 1) 백엔드에 프로필 저장
      const res = await fetch(`${API_BASE_URL}/users/me/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(apiBody),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        console.log('❌ profile update error:', errText);
        throw new Error('프로필 저장 실패');
      }

      // ✅ 2) 로컬 AsyncStorage에도 저장
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      setIsLoading(false);
      Alert.alert(t('info_alert_save_success_title'), t('info_alert_save_success_body'))
      navigation.replace('Tabs');
    } catch (e) {
      console.log('🔥 onComplete error:', e);
      setIsLoading(false);
      Alert.alert('오류', '저장에 실패했어요. 다시 시도해주세요.');
    }
  };

  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <View style={styles.container}>
          <Text style={styles.titleTop}>{t('info_title_top')}</Text>
          <Text style={styles.titleMain}>{t('info_title_main')}</Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: 120 }}
          >
            {/* 성별 */}
            <Text style={styles.label}>{t('info_gender_label')}</Text>
            <View style={styles.segmentRow}>
              <Segment
                active={gender === 'male'}
                onPress={() => setGender('male')}
                text={t('info_gender_male')}
                icon={<Ionicons name="male" size={16} color={gender === 'male' ? '#2F6FED' : '#7B8AA0'} />}
              />
              <Segment
                active={gender === 'female'}
                onPress={() => setGender('female')}
                text={t('info_gender_female')}
                icon={<Ionicons name="female" size={16} color={gender === 'female' ? '#2F6FED' : '#7B8AA0'} />}
              />
              <Segment
                active={gender === 'other'}
                onPress={() => setGender('other')}
                text={t('info_gender_other')}
                icon={<Ionicons name="person" size={16} color={gender === 'other' ? '#2F6FED' : '#7B8AA0'} />}
              />
            </View>

            {/* 태어난 년도 */}
            <Text style={[styles.label, { marginTop: 18 }]}>{t('info_birth_year_label')}</Text>
            <Pressable style={styles.select} onPress={() => setYearOpen(true)}>
              <Text style={[styles.selectText, !year && { color: '#B8BFC9' }]}>
                {year ? `${year}` : t('info_birth_year_placeholder')}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#9AA0A6" />
            </Pressable>

            {/* 생일 */}
            <Text style={[styles.label, { marginTop: 18 }]}>{t('info_birth_label')}</Text>
            <View style={styles.inlineInputs}>
              <UnderlineInput
                value={month}
                onChangeText={(v) => setMonth(v.replace(/[^0-9]/g, '').slice(0, 2))}
                placeholder="12"
                keyboardType="number-pad"
              />
              <Text style={styles.unit}>{t('info_month_unit')}</Text>
              <UnderlineInput
                value={day}
                onChangeText={(v) => setDay(v.replace(/[^0-9]/g, '').slice(0, 2))}
                placeholder="05"
                keyboardType="number-pad"
              />
              <Text style={styles.unit}>{t('info_day_unit')}</Text>
            </View>

            {/* 신체정보 */}
            <Text style={[styles.label, { marginTop: 18 }]}>{t('info_body_label')}</Text>
            <View style={styles.inlineInputs}>
              <UnderlineInput
                value={height}
                onChangeText={(v) => setHeight(v.replace(/[^0-9]/g, '').slice(0, 3))}
                placeholder="160"
                keyboardType="number-pad"
              />
              <Text style={styles.unit}>cm</Text>
              <UnderlineInput
                value={weight}
                onChangeText={(v) => setWeight(v.replace(/[^0-9]/g, '').slice(0, 3))}
                placeholder="50"
                keyboardType="number-pad"
              />
              <Text style={styles.unit}>kg</Text>
            </View>

            {/* 닉네임 */}
            <Text style={[styles.label, { marginTop: 22 }]}>{t('info_nickname_label')}</Text>
            <TextInput
              value={nickname}
              onChangeText={setNickname}
              placeholder={t('info_nickname_placeholder')}
              placeholderTextColor="#C5CBD4"
              style={styles.nickInput}
            />
          </ScrollView>


        </View>

        {/* 연도 선택 모달 (ScrollView 밖에 있어야 안전) */}
        <Modal
          visible={yearOpen}
          animationType="slide"
          transparent
          onRequestClose={() => setYearOpen(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.modalSheet}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{t('info_modal_year_title')}</Text>
                <Pressable onPress={() => setYearOpen(false)} hitSlop={8}>
                  <Ionicons name="close" size={22} color="#111" />
                </Pressable>
              </View>
              <FlatList
                data={YEARS}
                keyExtractor={(y) => y}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.yearRow}
                    onPress={() => {
                      setYear(item);
                      setYearOpen(false);
                    }}
                  >
                    <Text style={styles.yearText}>{item}</Text>
                    {year === item && <Ionicons name="checkmark" size={20} color="#2F6FED" />}
                  </TouchableOpacity>
                )}
                initialNumToRender={30}
                getItemLayout={(_, index) => ({ length: 48, offset: 48 * index, index })}
              />
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>

      {/* 완료 버튼 */}
      <Pressable style={styles.button} onPress={onComplete}>
        <Text style={styles.buttonText}>{t('info_button_done')}</Text>
      </Pressable>
    </SafeAreaView>
  );
}

/* ---------- 작은 컴포넌트들 ---------- */
function Segment({ active, onPress, text, icon }) {
  return (
    <Pressable onPress={onPress} style={[styles.segment, active && styles.segmentActive]}>
      <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{text} </Text>
      {icon}
    </Pressable>
  );
}

function UnderlineInput(props) {
  return (
    <TextInput
      {...props}
      style={[styles.underlineInput, props.style]}
      placeholderTextColor="#C5CBD4"
      returnKeyType="done"
      blurOnSubmit={true}
    />
  );
}
