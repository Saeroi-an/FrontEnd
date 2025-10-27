import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { QUESTION_SETS } from '../data/questions';
import styles from '../styles/questionStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CATEGORY_TITLES } from '../data/categoryTitles';
import { v4 as uuid } from 'uuid';
import { saveDiagnosisSession } from '../lib/history';

const CATEGORY_LABELS = {
    eye: '👀 눈',
    nose: '👃🏻 코/호흡기/내과',
    bandage: '🩹 외상/외과',
    bone: '🦴 뼈/관절',
    teeth: '🦷 치아',
    female: '👩‍⚕️ 여성',
};

export default function QuestionStep({ route, navigation }) {
    const { selectedParts, idx, answers } = route.params;

    // 선택된 부위들의 질문을 하나 배열로 합치기
    const questions = useMemo(
        () => selectedParts.flatMap(p => QUESTION_SETS[p] || []),
        [selectedParts]
    );

    const q = questions[idx];
    const categoryKey = q?.id?.split('_')?.[0];
    const categoryLabel = CATEGORY_LABELS[categoryKey] ?? null;
    const [choice, setChoice] = useState(answers[q?.id] ?? null);

    if (!q) {
        // 방어: 질문이 없으면 결과로
        navigation.replace('Result', { answers });
        return null;
    }

    const onNext = async () => {
        const nextAnswers = { ...answers, [q.id]: choice };
        const nextIdx = idx + 1;
        if (nextIdx < questions.length) {
            navigation.push('QuestionStep', {
                selectedParts,
                idx: nextIdx,
                answers: nextAnswers,
            });
            console.log({ nextAnswers })
        } else {
            try {
                // ✅ 저장: 선택 부위 각각 1개의 엔트리 생성, answers 포함
                await appendHistoryByParts(selectedParts, {
                    answers: nextAnswers,
                    selectedParts,
                });
            } catch (e) {
                console.warn('appendHistory error', e);
            }
            const afterRaw = await AsyncStorage.getItem('diagnosis_history');
            console.log('after save count =', afterRaw ? JSON.parse(afterRaw).length : 0);
            navigation.replace('Result', { answers: nextAnswers });
            console.log({ nextAnswers })
        }
    };

    const onPrev = () => navigation.goBack();

    const STORAGE_KEY = 'diagnosis_history';

    async function appendHistoryByParts(selectedParts = [], extra = {}) {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const nowISO = new Date().toISOString();

        // 부위별로 한 항목씩 생성 (중복 허용)
        const entries = selectedParts.map((partKey) => ({
            id: uuid(),
            part: partKey,                                  // 원본 키
            title: CATEGORY_TITLES[partKey] || partKey,     // 리스트에 보일 텍스트(부위명)
            dateISO: nowISO,                                 // 날짜
            ...extra,                                       // 필요 시 answers 등 추가
        }));

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...entries, ...list]));
    }

    return (
        <SafeAreaView style={styles.safe}>

            {/* 상단 헤더 (셀프진단체크 밑 화살표) */}
            <View style={styles.header}>
                <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color="#111" />
                </Pressable>
                <Text style={styles.headerTitle}>셀프 진단 체크</Text>
                <View style={{ width: 22 }} />
            </View>

            {/* 진행바 */}
            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${((idx + 1) / questions.length) * 100}%` }]} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.qBox}>
                    {categoryLabel ? <Text style={styles.categoryText}>{categoryLabel} 질문</Text> : null}
                    {/* 질문앞에 번호 표시하고싶을 시 */}
                    {/* <Text style={styles.qText}>{idx + 1}. {q.question}</Text> */}
                    <Text style={styles.qText}>{q.question}</Text>

                    {q.options.map(opt => {
                        const active = choice === opt;
                        return (
                            <Pressable
                                key={opt}
                                onPress={() => setChoice(opt)}
                                style={[styles.optBtn, active ? styles.optActive : styles.optInactive]}
                            >
                                {/* 텍스트 */}
                                <Text style={[styles.optText, active && styles.optTextActive]}>
                                    {opt}
                                </Text>

                                {/* 체크 아이콘 (항상 오른쪽 끝 고정) */}
                                <Ionicons
                                    name="checkmark"
                                    size={22}
                                    color={active ? '#007AFF' : '#ccc'}
                                    style={styles.optCheck}
                                />

                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.bottomBox}>
                {/* <Pressable onPress={onPrev} style={[styles.btn, styles.btnPrev]}>
                    <Text style={styles.btnTextBlack}>이전</Text>
                </Pressable> */}
                <Pressable
                    disabled={!choice}
                    onPress={onNext}
                    style={[styles.btn, choice ? styles.btnNextOn : styles.btnNextOff]}
                >
                    <Text style={styles.btnTextWhite}>다음</Text>
                </Pressable>
            </View>
        </SafeAreaView>

    );
}
