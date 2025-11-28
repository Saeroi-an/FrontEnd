import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, FlatList, TouchableOpacity, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/infoStyles';
import { API_BASE_URL } from '../lib/api'; // 🔹 이 줄만 추가

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
      return Alert.alert('안내', '신체정보를 숫자로 입력해주세요.');
    }
    if (!gender) {
      return Alert.alert('안내', '성별을 선택해주세요.');
    }
    if (!year || !month || !day) {
      return Alert.alert('안내', '생년월일을 모두 입력해주세요.');
    }
    if (!nickname.trim()) {
      return Alert.alert('안내', '닉네임을 입력해주세요.');
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
      Alert.alert('저장 완료', '기본정보가 저장되었습니다.');
      navigation.replace('Tabs');
    } catch (e) {
      console.log('🔥 onComplete error:', e);
      setIsLoading(false);
      Alert.alert('오류', '저장에 실패했어요. 다시 시도해주세요.');
    }
  };


  return (
    <SafeAreaView style={styles.safe}>
      {/* 🔹 로딩 중일 때 표시되는 오버레이 */}
      {isLoading && (
        <View style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.8)',
          alignItems: 'center', justifyContent: 'center', zIndex: 10,
        }}>
          <ActivityIndicator size="large" color="#2F6FED" />
          <Text style={{ marginTop: 12, color: '#333' }}>잠시만 기다려주세요...</Text>
        </View>
      )}

      <View style={styles.container}>
        <Text style={styles.titleTop}>정확한 진단을 위해서</Text>
        <Text style={styles.titleMain}>기본정보를 알려주세요</Text>

        <ScrollView>

          {/* 성별 */}
          <Text style={styles.label}>성별</Text>
          <View style={styles.segmentRow}>
            <Segment
              active={gender === 'male'}
              onPress={() => setGender('male')}
              text="남성"
              icon={<Ionicons name="male" size={16} color={gender === 'male' ? '#2F6FED' : '#7B8AA0'} />}
            />
            <Segment
              active={gender === 'female'}
              onPress={() => setGender('female')}
              text="여성"
              icon={<Ionicons name="female" size={16} color={gender === 'female' ? '#2F6FED' : '#7B8AA0'} />}
            />
            <Segment
              active={gender === 'other'}
              onPress={() => setGender('other')}
              text="기타"
              icon={<Ionicons name="person" size={16} color={gender === 'other' ? '#2F6FED' : '#7B8AA0'} />}
            />
          </View>

          {/* 태어난 년도 */}
          <Text style={[styles.label, { marginTop: 18 }]}>태어난 년도</Text>
          <Pressable style={styles.select} onPress={() => setYearOpen(true)}>
            <Text style={[styles.selectText, !year && { color: '#B8BFC9' }]}>
              {year ? `${year}년` : '연도 선택'}
            </Text>
            <Ionicons name="chevron-down" size={18} color="#9AA0A6" />
          </Pressable>

          {/* 생일 */}
          <Text style={[styles.label, { marginTop: 18 }]}>생일</Text>
          <View style={styles.inlineInputs}>
            <UnderlineInput
              value={month}
              onChangeText={(v) => setMonth(v.replace(/[^0-9]/g, '').slice(0, 2))}
              placeholder="12"
              keyboardType="number-pad"
            />
            <Text style={styles.unit}>월</Text>
            <UnderlineInput
              value={day}
              onChangeText={(v) => setDay(v.replace(/[^0-9]/g, '').slice(0, 2))}
              placeholder="05"
              keyboardType="number-pad"
            />
            <Text style={styles.unit}>일</Text>
          </View>

          {/* 신체정보 */}
          <Text style={[styles.label, { marginTop: 18 }]}>신체정보</Text>
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
          <Text style={[styles.label, { marginTop: 22 }]}>닉네임</Text>
          <TextInput
            value={nickname}
            onChangeText={setNickname}
            placeholder="원하시는 닉네임을 입력해주세요"
            placeholderTextColor="#C5CBD4"
            style={styles.nickInput}
          />
        </ScrollView>


        {/* 완료 버튼 */}
        <Pressable style={styles.button} onPress={onComplete}>
          <Text style={styles.buttonText}>완료</Text>
        </Pressable>
      </View>

      {/* 연도 선택 모달 */}
      <Modal visible={yearOpen} animationType="slide" transparent onRequestClose={() => setYearOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>태어난 년도</Text>
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
                  <Text style={styles.yearText}>{item}년</Text>
                  {year === item && <Ionicons name="checkmark" size={20} color="#2F6FED" />}
                </TouchableOpacity>
              )}
              initialNumToRender={30}
              getItemLayout={(_, index) => ({ length: 48, offset: 48 * index, index })}
            />
          </View>
        </View>
      </Modal>
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
