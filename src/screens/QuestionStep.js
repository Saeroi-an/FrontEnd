import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { QUESTION_SETS } from '../data/questions';
import styles from '../styles/questionStyles';

export default function QuestionStep({ route, navigation }) {
    const { selectedParts, idx, answers } = route.params;

    // 선택된 부위들의 질문을 하나 배열로 합치기
    const questions = useMemo(
        () => selectedParts.flatMap(p => QUESTION_SETS[p] || []),
        [selectedParts]
    );

    const q = questions[idx];
    const [choice, setChoice] = useState(answers[q?.id] ?? null);

    if (!q) {
        // 방어: 질문이 없으면 결과로
        navigation.replace('Result', { answers });
        return null;
    }

    const onNext = () => {
        const nextAnswers = { ...answers, [q.id]: choice };
        const nextIdx = idx + 1;
        if (nextIdx < questions.length) {
            navigation.push('QuestionStep', {
                selectedParts,
                idx: nextIdx,
                answers: nextAnswers,
            });
        } else {
            navigation.replace('Result', { answers: nextAnswers });
        }
    };

    const onPrev = () => navigation.goBack();

    return (
        <SafeAreaView style={styles.safe}>
            {/* 진행바 */}
            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${((idx + 1) / questions.length) * 100}%` }]} />
            </View>

            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.qBox}>
                    <Text style={styles.qText}>{idx + 1}. {q.question}</Text>

                    {q.options.map(opt => {
                        const active = choice === opt;
                        return (
                            <Pressable
                                key={opt}
                                onPress={() => setChoice(opt)}
                                style={[styles.optBtn, active ? styles.optActive : styles.optInactive]}
                            >
                                <Text style={[styles.optText, active && styles.optTextActive]}>{opt}</Text>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.bottomBox}>
                <Pressable onPress={onPrev} style={[styles.btn, styles.btnPrev]}>
                    <Text style={styles.btnTextBlack}>이전</Text>
                </Pressable>
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
