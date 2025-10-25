import React from 'react';
import { View, Text, ScrollView, TextInput, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import styles from '../styles/homeStyles'; // 👈 스타일 분리

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/main_logo.png')}
          style={{ width: 91, height: 19, marginLeft: 150, }}
        />
        <Pressable>
          <Ionicons name="notifications-outline" size={20} color="#111" style={{ marginRight: 20, }} />
        </Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* 인사 + 서브텍스트 */}
        <View style={styles.greetBox}>
          <Text style={styles.greetTitle}>김성신님 안녕하세요!</Text>
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
        <Pressable style={styles.blueCard}>
          <Text style={styles.blueBadge}>어떻게 소통해야 할지 막막할 땐</Text>
          <Text style={styles.blueTitle}>실시간 통역 시작하기</Text>
          <View style={styles.blueIconRow}>
            <Image
              source={require('../../assets/images/translate_icon.png')}
              style={{ width: 100, height: 100, marginLeft: 150, }}
            />
          </View>
        </Pressable>

        {/* 섹션: 진단서 */}
        <Text style={styles.sectionTitle}>진단서</Text>
        <View style={styles.cardList}>
          <ArrowCard
            icon={<Ionicons name="calendar-outline" size={22} color="#FF7A59" />}
            title="셀프 진단 체크"
            subtitle="어디서든 혼자서 간편하게"
            onPress={() => { navigation.navigate('SelfCheck')}}
          />
          <ArrowCard
            icon={<Ionicons name="folder-open-outline" size={22} color="#5B7CFF" />}
            title="진단 저장 내역"
            subtitle="한눈에 알아보는"
            onPress={() => { navigation.navigate('History')}}
          />
        </View>

        {/* BMI 카드 */}
        <View style={styles.bmiCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.bmiRowText}><Text style={styles.bold}>키</Text> 160cm</Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.bmiRowText}><Text style={styles.bold}>몸무게</Text> 55kg</Text>
            <View style={styles.bmiChip}>
              <Text style={styles.bmiChipText}>BMI 21.48 · 정상</Text>
            </View>
          </View>

          <View style={styles.bmiCenter}>
            <Text style={styles.bmiBubble}>21.48 정상</Text>
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
          <HistoryItem title="병명예시" date="2025.09.25" onPress={() => { }} />
          <HistoryItem title="병명예시" date="2025.09.25" onPress={() => { }} />
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