import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, Text, ScrollView, TextInput, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/homeStyles';
import { fetchProfile } from "../lib/api";

export default function HomeScreen({ navigation }) {
  const { t } = useTranslation();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchProfile().then((data) => {
      setProfile(data);
    }).catch((err) => {
      console.log("프로필 불러오기 실패:", err);
    });
  }, []);


  // BMI 상태에 대한 번역 키 반환
function getBmiStatusKey(bmi) {
  if (bmi < 18.5) return "bmi_underweight";
  if (bmi < 23) return "bmi_normal";
  if (bmi < 25) return "bmi_overweight";
  if (bmi < 30) return "bmi_obese";
  return "bmi_extreme_obese";
}

  const bmi = profile
    ? profile.weight / Math.pow(profile.height / 100, 2)
    : null;

  const bmiRounded = bmi ? bmi.toFixed(2) : null;
  const bmiStatusKey = bmi ? getBmiStatusKey(bmi) : null;
  const bmiStatus = bmiStatusKey ? t(bmiStatusKey) : "";

  const height = profile ? profile.height : null;
  const weight = profile ? profile.weight : null;  

  //BMI 동적으로 이동하는 함수
  function getBmiPosition(bmi) {
    if (bmi <= 18.5) return (bmi / 18.5) * 20;                // 0~20%
    if (bmi <= 23) return 20 + ((bmi - 18.5) / (23 - 18.5)) * 20; // 20~40%
    if (bmi <= 25) return 40 + ((bmi - 23) / (25 - 23)) * 20; // 40~60%
    if (bmi <= 30) return 60 + ((bmi - 25) / (30 - 25)) * 20; // 60~80%
    return 80 + Math.min(((bmi - 30) / 5) * 20, 20);          // 80~100%
  }
  const bmiPosition = getBmiPosition(bmi);

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
          <Text style={styles.greetTitle}>
            {profile 
            ? t('home_greet_title', { name: profile.nickname })
            : t('home_greet_loading')}
          </Text>
          <Text style={styles.greetSub}>{t('home_greet_sub')}</Text>
        </View>

        {/* 검색창 */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#9AA1A9" />
          <TextInput
            placeholder={t('home_search_placeholder')}
            placeholderTextColor="#9AA1A9"
            style={styles.searchInput}
            returnKeyType="search"
          />
        </View>

        {/* 파란 배너 */}
        <Pressable style={styles.blueCard} onPress={() => { navigation.navigate('ChatPrescription') }}>
        <Text style={styles.blueBadge}>{t('home_banner_badge')}</Text>
        <Text style={styles.blueTitle}>{t('home_banner_title')}</Text>
          <View style={styles.blueIconRow}>
            <Image
              source={require('../../assets/images/note.png')}
              style={{ width: 90, height: 90, marginLeft: 160, marginBottom: 13, }}
            />
          </View>
        </Pressable>

        {/* 섹션: 진단서 */}
        <Text style={styles.sectionTitle}>{t('home_section_diagnosis')}</Text>
        <View style={styles.cardList}>
          <ArrowCard
            icon={<Ionicons name="calendar-outline" size={24} color="#FF7A59" />}
            title={t('home_selfcheck_title')}
            subtitle={t('home_selfcheck_sub')}
            onPress={() => { navigation.navigate('SelfCheck') }}
          />
          <ArrowCard
            icon={<Ionicons name="folder-open-outline" size={24} color="#5B7CFF" />}
            title={t('home_history_title')}
            subtitle={t('home_history_sub')}
            onPress={() => { navigation.navigate('History') }}
          />
        </View>

        {/* BMI 카드 */}
        <View style={styles.bmiCard}>
          <View style={styles.rowBetween}>
            <Text style={styles.bmiRowText}>
              <Text style={styles.bold}>{t('home_bmi_label_height')}</Text> {height}cm
              </Text>
            <Text style={styles.separator}>|</Text>

            <Text style={styles.bmiRowText}>
              <Text style={styles.bold}>{t('home_bmi_label_weight')}</Text> {weight}kg
              </Text>

            <View style={styles.bmiChip}>
              <Text style={styles.bmiChipText}>
                BMI {bmiRounded} · {bmiStatus}
              </Text>
            </View>
          </View>

          {/* BMI 구간 바 + 포인터 */}
          <View style={{ position: "relative", marginTop: 40, }}>

            {/* BMI 말풍선 */}
            <View
              style={[
                styles.bmiBubbleContainer,
                { left: `${bmiPosition}%` }
              ]}
            >
              <Text style={styles.bmiBubbleText}>
                {bmiRounded} {bmiStatus}
              </Text>
            </View>

            <View style={styles.scaleBar}>
              <View style={[styles.scaleSeg, { flex: 18.5, backgroundColor: '#E6F0FF' }]} />
              <View style={[styles.scaleSeg, { flex: 6.5, backgroundColor: '#CFE6FF' }]} />
              <View style={[styles.scaleSeg, { flex: 7, backgroundColor: '#FFE7BA' }]} />
              <View style={[styles.scaleSeg, { flex: 5, backgroundColor: '#FFD4D4' }]} />
              <View style={[styles.scaleSeg, { flex: 5, backgroundColor: '#FFB3B3' }]} />
            </View>

            <View style={styles.scaleLabels}>
              <Text style={styles.scaleLabel}>{t('bmi_underweight')}</Text>
              <Text style={styles.scaleLabel}>{t('bmi_normal')}</Text>
              <Text style={styles.scaleLabel}>{t('bmi_overweight')}</Text>
              <Text style={styles.scaleLabel}>{t('bmi_obese')}</Text>
              <Text style={styles.scaleLabel}>{t('bmi_extreme_obese')}</Text>
            </View>



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