// src/screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage'; // ⭐ 추가
import styles from '../styles/homeStyles';
import { getProfile, calculateBMI, getBMIStatus } from '../services/userService';

export default function HomeScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bmi, setBmi] = useState(null);
  const [bmiStatus, setBmiStatus] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      // ⭐ AsyncStorage에서 사용자 정보 가져오기
      const userName = await AsyncStorage.getItem('user_name');
      const userId = await AsyncStorage.getItem('user_id');

      console.log('저장된 이름:', userName); // 
      console.log('저장된 ID:', userId);    // 
      
      // API로 추가 정보 가져오기 (키, 체중)
      try {
        const response = await getProfile(null);
        const userData = response.data ? response.data : response;
        
        setProfile({
          ...userData,
          name: userName || userData.name || '사용자' // ⭐ AsyncStorage 우선
        });

        // BMI 계산
        if (userData.height && userData.weight) {
          const calculatedBMI = calculateBMI(userData.height, userData.weight);
          setBmi(calculatedBMI);
          setBmiStatus(getBMIStatus(calculatedBMI));
        }
      } catch (apiError) {
        // API 실패 시 AsyncStorage 정보만 사용
        console.log('API 호출 실패, AsyncStorage 정보 사용');
        setProfile({
          name: userName || '사용자',
          height: 0,
          weight: 0,
        });
      }
      
    } catch (error) {
      console.error('프로필 로드 실패:', error);
      setProfile({
        name: '사용자',
        height: 0,
        weight: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#2563eb" />
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
        {/* 인사 + 서브텍스트 */}
        <View style={styles.greetBox}>
          <Text style={styles.greetTitle}>
            {profile?.name || '사용자'}님 안녕하세요!
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
        <Pressable style={styles.blueCard} onPress={() => navigation.navigate('CameraCapture')}>
          <Text style={styles.blueBadge}>읽기 힘든 처방전을 한눈에!</Text>
          <Text style={styles.blueTitle}>처방전 인식하기</Text>
          <View style={styles.blueIconRow}>
            <Image
              source={require('../../assets/images/note.png')}
              style={{ width: 90, height: 90, marginLeft: 160, marginBottom: 13 }}
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
            onPress={() => navigation.navigate('SelfCheck')}
          />
          <ArrowCard
            icon={<Ionicons name="folder-open-outline" size={24} color="#5B7CFF" />}
            title="진단 저장 내역"
            subtitle="한눈에 알아보는"
            onPress={() => navigation.navigate('History')}
          />
        </View>

        {/* BMI 카드 */}
        <View style={styles.bmiCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.bmiRowText}>
              <Text style={styles.bold}>키</Text> {profile?.height || 0}cm
            </Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.bmiRowText}>
              <Text style={styles.bold}>몸무게</Text> {profile?.weight || 0}kg
            </Text>
            <View style={styles.bmiChip}>
              <Text style={styles.bmiChipText}>
                BMI {bmi || '0.00'} · {bmiStatus || '-'}
              </Text>
            </View>
          </View>
          <View style={styles.bmiCenter}>
            <Text style={styles.bmiBubble}>
              {bmi || '0.00'} {bmiStatus || '-'}
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
        <Text style={styles.sectionTitle}>최근 진단 내용</Text>
        <View style={styles.cardList}>
          <HistoryItem title="병명예시" date="2025.09.25" onPress={() => {}} />
          <HistoryItem title="병명예시" date="2025.09.25" onPress={() => {}} />
        </View>
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