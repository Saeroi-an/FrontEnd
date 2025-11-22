// src/screens/HomeScreen
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/homeStyles'; // 👈 스타일 분리
import { API_ENDPOINTS, authenticatedFetch } from '../lib/api';

// BMI 계산 함수
function calculateBMI(height, weight) {
  if (!height || !weight) return '0.00';
  const heightInMeters = height / 100;
  const bmi = weight / (heightInMeters * heightInMeters);
  return bmi.toFixed(2);
}

// BMI 상태 판정 함수
function getBMIStatus(height, weight) {
  if (!height || !weight) return '정보없음';
  const bmi = parseFloat(calculateBMI(height, weight));
  
  if (bmi < 18.5) return '저체중';
  if (bmi < 23) return '정상';
  if (bmi < 25) return '과체중';
  if (bmi < 30) return '비만';
  return '고도비만';
}

export default function HomeScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // 🔹 사용자 정보 가져오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 🔹 토큰 확인
        const token = await AsyncStorage.getItem('access_token');
        console.log('저장된 토큰:', token ? '있음' : '없음');
        console.log('토큰 길이:', token?.length);
        
        console.log('API 호출 시작:', API_ENDPOINTS.GET_PROFILE);
        
        const response = await authenticatedFetch(API_ENDPOINTS.GET_PROFILE);
        
        console.log('응답 상태:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('받은 데이터:', data);
          setUserInfo(data);
        }
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        console.error('에러 타입:', error.constructor.name);
        console.error('에러 메시지:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  // 🔹 로딩 중
  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2F6FED" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/main_logo.png')}
          style={{ width: 91, height: 19, marginLeft: 150 }}
        />
        <Pressable>
          <Ionicons name="notifications-outline" size={20} color="#111" style={{ marginRight: 20 }} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* 🔹 닉네임 표시 */}
        <View style={styles.greetBox}>
          <Text style={styles.greetTitle}>
            {userInfo?.nickname || userInfo?.name || '사용자'}님 안녕하세요!
          </Text>
          <Text style={styles.greetSub}>건강고민, 새로이안에게 맡겨 보세요!</Text>
        </View>

        {/* 검색창 */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#9AA1A9" />
          <TextInput
            placeholder="감기, 코로나, 역류성 식도염"
            placeholderTextColor="#9AA1A9"
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>

        {/* 파란 배너 */}
        <Pressable style={styles.blueCard} onPress={() => { navigation.navigate('ChatPrescription')}}>
          <Text style={styles.blueBadge}>읽기 힘든 처방전을 한눈에!</Text>
          <Text style={styles.blueTitle}>처방전 인식하기</Text>
          <View style={styles.blueIconRow}>
            <Image
              source={require('../../assets/images/note.png')}
              style={{ width: 90, height: 90, marginLeft: 160, marginBottom:13,}}
            />
          </View>
        </Pressable>

        {/* 섹션: 진단서 */}
        <Text style={styles.sectionTitle}>진단서</Text>
        <View style={styles.cardList}>
          <ArrowCard
            icon={<Ionicons name="calendar-outline" size={24} color="#FF7A59" />}
            title="셀프 진단 체크"
            subtitle="어디서든 혼자서 간편하게"
            onPress={() => { navigation.navigate('SelfCheck')}}
          />
          <ArrowCard
            icon={<Ionicons name="folder-open-outline" size={24} color="#5B7CFF" />}
            title="진단 저장 내역"
            subtitle="한눈에 알아보는"
            onPress={() => { navigation.navigate('History')}}
          />
        </View>

        {/* BMI 카드 */}
        <View style={styles.bmiCard}>
          {/* 상단 행: 키, 몸무게, BMI 칩 표시 */}
          <View style={styles.rowBetween}>
            {/* 키 표시 - DB에서 가져온 userInfo.height 사용, 없으면 기본값 160 */}
            <Text style={styles.bmiRowText}>
              <Text style={styles.bold}>키</Text> {userInfo?.height || 160}cm
            </Text>
            
            {/* 구분선 */}
            <Text style={styles.separator}>|</Text>
            
            {/* 몸무게 표시 - DB에서 가져온 userInfo.weight 사용, 없으면 기본값 55 */}
            <Text style={styles.bmiRowText}>
              <Text style={styles.bold}>몸무게</Text> {userInfo?.weight || 55}kg
            </Text>
            
            {/* BMI 결과 칩 - 계산된 BMI 값과 상태(정상/비만 등) 표시 */}
            <View style={styles.bmiChip}>
              <Text style={styles.bmiChipText}>
                BMI {calculateBMI(userInfo?.height, userInfo?.weight)} · {getBMIStatus(userInfo?.height, userInfo?.weight)}
              </Text>
            </View>
          </View>
          
          {/* 중앙 BMI 버블 - BMI 값과 상태를 크게 표시 */}
          <View style={styles.bmiCenter}>
            <Text style={styles.bmiBubble}>
              {calculateBMI(userInfo?.height, userInfo?.weight)} {getBMIStatus(userInfo?.height, userInfo?.weight)}
            </Text>
          </View>

          {/* 간단한 구간 바 */}
          <View style={styles.scaleBar}>
            <View style={[styles.scaleSeg, { flex: 18.5, backgroundColor: '#E6F0FF' }]} />
            <View style={[styles.scaleSeg, { flex: 6.5, backgroundColor: '#CFE6FF' }]} />
            <View style={[styles.scaleSeg, { flex: 7, backgroundColor: '#FFE7BA' }]} />
            <View style={[styles.scaleSeg, { flex: 5, backgroundColor: '#FFD4D4' }]} />
            <View style={[styles.scaleSeg, { flex: 5, backgroundColor: '#FFB3B3' }]} />
          </View>

          <View style={styles.scaleLabels}>
            <Text style={styles.scaleLabel}>저체중</Text>
            <Text style={styles.scaleLabel}>정상</Text>
            <Text style={styles.scaleLabel}>과체중</Text>
            <Text style={styles.scaleLabel}>비만</Text>
            <Text style={styles.scaleLabel}>고도비만</Text>
          </View>
        </View>

        {/* 최근 진단 내용 */}
        {/* <Text style={styles.sectionTitle}>최근 진단 내용</Text>
        <View style={styles.cardList}>
          <HistoryItem title="병명예시" date="2025.09.25" onPress={() => { }} />
          <HistoryItem title="병명예시" date="2025.09.25" onPress={() => { }} />
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
}

function ArrowCard({ icon, title, subtitle, onPress }) {
  return (
    <Pressable style={styles.arrowCard} onPress={onPress}>
      <View style={styles.arrowLeft}>
        <View style={styles.leadingIcon}>{icon}</View>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardSubtitle}>{subtitle}</Text>
          <Text style={styles.cardTitle}>{title}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9AA1A9" />
    </Pressable>
  );
}

function HistoryItem({ title, date, onPress }) {
  return (
    <Pressable style={styles.historyCard} onPress={onPress}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{title}</Text>
        <View style={styles.historyMeta}>
          <Ionicons name="time-outline" size={14} color="#9AA1A9" />
          <Text style={styles.metaText}>{date}</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#9AA1A9" />
    </Pressable>
  );
}