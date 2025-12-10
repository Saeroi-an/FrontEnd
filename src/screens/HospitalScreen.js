import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/hospitalStyles';
import { API_ENDPOINTS } from '../lib/api';

export default function HospitalScreen({ navigation }) {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const LIMIT = 20;

  // 병원 데이터 가져오기
  const fetchHospitals = async () => {
    try {
      const url = `${API_ENDPOINTS.HOSPITALS}?limit=${LIMIT}&offset=${offset}`;
      console.log('🔍 요청 URL:', url);  // 추가
      
      const response = await fetch(url);
      console.log('✅ 응답 상태:', response.status);  // 추가
      
      const data = await response.json();
      // console.log('📦 데이터:', data); 
      
      setHospitals(prev => [...prev, ...data.hospitals]);
      setOffset(prev => prev + LIMIT);
    } catch (error) {
      console.error('❌ 병원 데이터 로드 실패:', error);
      console.error('❌ 에러 상세:', error.message);  // 추가
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable 
      style={styles.card} 
      // 병원 상세 페이지 만들경우
      // onPress={() => navigation.navigate('HospitalDetail', { id: item.id })}
    >
      {/* 병원 이미지 */}
      <Image 
        source={{ uri: item.image_url }} 
        style={styles.thumb}
      />
      
      {/* 정보 */}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.metaRow}>
          <Ionicons name="call-outline" size={12} color="#8A8F98" />
          <Text style={styles.metaText}>{item.phone}</Text>
        </View>
        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={12} color="#8A8F98" />
          <Text style={styles.metaText}>{item.address}</Text>
        </View>
      </View>
      
      {/* 화살표 */}
      <Ionicons name="chevron-forward" size={18} color="#9AA1A9" />
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={hospitals}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={<Text style={styles.title}>근처병원</Text>}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchHospitals}  // 무한 스크롤
        onEndReachedThreshold={0.5}
      />
    </SafeAreaView>
  );
}