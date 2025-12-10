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
import { useTranslation } from 'react-i18next';   // ⭐ i18n 추가

// 카테고리 라벨 키
const CATEGORY_LABEL_KEYS = {
    eye: 'selfcheck_category_eye',
    nose: 'selfcheck_category_nose',
    bandage: 'selfcheck_category_bandage',
    bone: 'selfcheck_category_bone',
    teeth: 'selfcheck_category_teeth',
    female: 'selfcheck_category_female',
};

export default function QuestionStep({ route, navigation }) {
    const { selectedParts, idx, answers } = route.params;
    const { t } = useTranslation();       // ⭐ i18n 사용
    const [choice, setChoice] = useState(null);

    // 선택 부위 질문 합치기
    const questions = useMemo(
        () => selectedParts.flatMap(p => QUESTION_SETS[p] || []),
        [selectedParts]
    );

    const q = questions[idx];
    const categoryKey = q?.id?.split('_')?.[0];
    const categoryLabelKey = CATEGORY_LABEL_KEYS[categoryKey] ?? null;

    useMemo(() => {
        setChoice(answers[q?.id] ?? null);
    }, [q]);

    if (!q) {
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
        } else {
            try {
                // 저장
                await appendHistoryByParts(selectedParts, {
                    answers: nextAnswers,
                    selectedParts,
                });
            } catch (e) {
                console.warn('appendHistory error', e);
            }

            navigation.replace('Result', { answers: nextAnswers });
        }
    };

    const STORAGE_KEY = 'diagnosis_history';

    async function appendHistoryByParts(selectedParts = [], extra = {}) {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const nowISO = new Date().toISOString();

        const entries = selectedParts.map((partKey) => ({
            id: uuid(),
            part: partKey,
            // CATEGORY_TITLES → key로 변환됨, 화면에서 t() 적용됨
            title: CATEGORY_TITLES[partKey] || partKey,
            dateISO: nowISO,
            ...extra,
        }));

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...entries, ...list]));
    }

    return (
        <SafeAreaView style={styles.safe}>
            {/* 상단 헤더 */}
            <View style={styles.header}>
                <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color="#111" />
                </Pressable>
                <Text style={styles.headerTitle}>{t('selfcheck_header_title')}</Text>
                <View style={{ width: 22 }} />
            </View>

            {/* 진행바 */}
            <View style={styles.progressTrack}>
                <View
                    style={[
                        styles.progressFill,
                        { width: `${((idx + 1) / questions.length) * 100}%` },
                    ]}
                />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.qBox}>
                    {/* 카테고리 라벨 */}
                    {categoryLabelKey && (
                        <Text style={styles.categoryText}>
                            {t(categoryLabelKey)} {t('selfcheck_question_label')}
                        </Text>
                    )}

                    {/* 질문 */}
                    <Text style={styles.qText}>{t(q.questionKey)}</Text>

                    {/* 선택지 */}
                    {q.optionKeys.map(key => {
                        const active = choice === key;
                        return (
                            <Pressable
                                key={key}
                                onPress={() => setChoice(key)}
                                style={[styles.optBtn, active ? styles.optActive : styles.optInactive]}
                            >
                                <Text style={[styles.optText, active && styles.optTextActive]}>
                                    {t(key)}
                                </Text>

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

            {/* 하단 버튼 */}
            <View style={styles.bottomBox}>
                <Pressable
                    disabled={!choice}
                    onPress={onNext}
                    style={[
                        styles.btn,
                        choice ? styles.btnNextOn : styles.btnNextOff,
                    ]}
                >
                    <Text style={styles.btnTextWhite}>{t('selfcheck_next')}</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}
