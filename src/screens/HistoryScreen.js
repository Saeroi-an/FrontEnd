// screens/HistoryScreen.js
import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, SectionList, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/historyStyles';

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
    // 최신 연도부터
    return [...map.entries()]
        .sort((a, b) => b[0] - a[0])
        .map(([year, data]) => ({
            title: `${year}년`,
            data: data.sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO)),
        }));
}

export default function HistoryScreen({ navigation }) {
    const [sections, setSections] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

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
                    {item.title}
                </Text>
                {/* 필요하면 > 아이콘 유지 */}
                {/* <Ionicons name="chevron-forward" size={18} color="#9AA0A6" /> */}
            </View>

            {/* ② 날짜 */}
            <View style={styles.cardMetaRow}>
                {/* <Ionicons name="time-outline" size={14} color="#9AA0A6" /> */}
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
                <Text style={styles.headerTitle}>진단 저장 내역</Text>
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
                        <Text style={styles.emptyTitle}>저장된 진단이 없어요</Text>
                        <Text style={styles.emptySub}>홈에서 셀프 진단을 완료해 보세요.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}
