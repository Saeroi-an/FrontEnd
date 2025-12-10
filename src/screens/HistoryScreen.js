// screens/HistoryScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SectionList, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/historyStyles';
import { Alert } from 'react-native';
import i18n from '../i18n/i18n';

const STORAGE_KEY = 'diagnosis_history';

function formatDate(iso) {
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
}

function groupByYear(items) {
    const map = new Map();
    items.forEach((it) => {
        const y = new Date(it.dateISO).getFullYear();
        if (!map.has(y)) map.set(y, []);
        map.get(y).push(it);
    });
    const yearSuffix = i18n.t('history_year_suffix');

    // 최신 연도부터
    return [...map.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([year, data]) => ({
            title: `${year}${yearSuffix}`, 
            data: data.sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO)),
        }));
}

export default function HistoryScreen({ navigation }) {
    const [sections, setSections] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // useEffect(() => {
    //     // ⚠️ 실행 후에는 꼭 주석 처리하세요!
    //     AsyncStorage.removeItem('diagnosis_history').then(() =>
    //       console.log('진단내역 전체 삭제 완료')
    //     );
      
    //     const unsub = navigation.addListener('focus', load);
    //     load();
    //     return unsub;
    //   }, [navigation, load]);


    const load = useCallback(async () => {
        try {
          const raw = await AsyncStorage.getItem(STORAGE_KEY);
          const list = raw ? JSON.parse(raw) : [];
          setSections(groupByYear(list));
          console.log('History loaded:', list.length);
        } catch (e) {
          console.warn('History load failed', e);
          setSections([]);
        }
      }, []);

      useEffect(() => {
        const unsub = navigation.addListener('focus', load);
        load(); // 최초 1회
        return unsub;
      }, [navigation, load]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await load();
        setRefreshing(false);
    }, [load]);

    const renderItem = ({ item }) => (
        <Pressable
            onPress={() => navigation.navigate('HistoryDetail', { item })} // 나중에 요약 화면
            style={styles.card}
        >
            <View style={styles.cardRow}>
                {/* ① 선택한 부위 (title) */}
                <Text style={styles.cardTitle} numberOfLines={1}>
                {i18n.t(item.title)}
                </Text>
                {/* 필요하면 > 아이콘 유지 */}
                {/* <Ionicons name="chevron-forward" size={18} color="#9AA0A6" /> */}
            </View>

            {/* ② 날짜 */}
            <View style={styles.cardMetaRow}>
                <Ionicons name="time-outline" size={14} color="#9AA0A6" style={styles.dateicon}/>
                <Text style={styles.cardMetaText}>{formatDate(item.dateISO)}</Text>
            </View>
        </Pressable>
    );

    const renderSectionHeader = ({ section }) => (
        <Text style={styles.yearHeader}>{section.title}</Text>
    );

    return (
        <SafeAreaView style={styles.safe}>
            {/* 상단 헤더 */}
            <View style={styles.header}>
                <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color="#111" />
                </Pressable>
                <Text style={styles.headerTitle}>
                {i18n.t('history_header_title')}
                </Text>
                <View style={{ width: 22 }} />
            </View>

            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                renderSectionHeader={renderSectionHeader}
                contentContainerStyle={styles.listContainer}
                stickySectionHeadersEnabled={false}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                // ListHeaderComponent={
                //     <Text style={styles.pageTitle}>셀프 진단 내력이에요</Text>
                // }
                ListEmptyComponent={
                    <View style={styles.emptyBox}>
                        <Text style={styles.emptyTitle}>
                        {i18n.t('history_empty_title')}

                        </Text>
                        <Text style={styles.emptySub}>  
                        {i18n.t('history_empty_sub')}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
