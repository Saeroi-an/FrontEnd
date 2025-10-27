import React from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/hospitalStyles';

const MOCK = Array.from({ length: 6 }).map((_, i) => ({
  id: String(i + 1),
  name: '성신병원',
  phone: '043-283-8850',
  distance: '100m내',
}));

export default function HospitalScreen({ navigation }) {
  const renderItem = ({ item }) => (
    <Pressable style={styles.card} onPress={() => { navigation.navigate('HospitalDetail', { id: item.id }) }}>
      {/* 썸네일 자리 */}
      <View style={styles.thumb} />

      {/* 정보 */}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>

        <View style={styles.metaRow}>
          <Ionicons name="call-outline" size={14} color="#8A8F98" />
          <Text style={styles.metaText}>{item.phone}</Text>
        </View>

        <View style={styles.metaRow}>
          <Ionicons name="location-outline" size={14} color="#8A8F98" />
          <Text style={styles.metaText}>{item.distance}</Text>
        </View>
      </View>

      {/* 화살표 */}
      <Ionicons name="chevron-forward" size={18} color="#9AA1A9" />
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        contentContainerStyle={styles.listContent}
        data={MOCK}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListHeaderComponent={<Text style={styles.title}>근처병원</Text>}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}
