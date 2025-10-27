import React, { useMemo } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// 프로젝트 경로에 맞게 수정하세요
import { QUESTION_SETS } from '../data/questions';
import { CATEGORY_TITLES } from '../data/categoryTitles';
import styles from '../styles/historyDetailStyles'; // 없으면 인라인로 해도 됨

const CATEGORY_LABELS = {
    eye: '👀 눈',
    nose: '👃🏻 코/호흡기/내과',
    bandage: '🩹 외상/외과',
    bone: '🦴 뼈/관절',
    teeth: '🦷 치아',
    female: '👩‍⚕️ 여성',
};

// 답 라벨 구하기(옵션이 객체/배열/문자열 어떤 형태든 최대한 잘 표시)
function getAnswerLabel(q, value) {
    if (!q) return String(value);
    // choices: ['하루 이내', ...] or [{label:'하루 이내', value:'<code>'}, ...]
    const choices = q.choices || q.options;
    if (!choices) return String(value);

    if (Array.isArray(choices)) {
        // 문자열 배열
        if (typeof choices[0] === 'string') return String(value);
        // 객체 배열
        const hit = choices.find(c =>
            ('value' in c ? c.value : c.label) === value || c.label === value
        );
        return hit ? (hit.label ?? hit.value ?? String(value)) : String(value);
    }
    return String(value);
}

// 특정 부위(part)의 Q/A만 뽑기 (질문ID prefix로 필터)
function rowsForPart(partKey, answers, questionById) {
    const rows = [];
    Object.entries(answers || {}).forEach(([qid, val]) => {
        // 질문 id 가 'eye_1' 처럼 부위 prefix 라는 전제
        if (qid.startsWith(partKey + '_')) {
            const q = questionById[qid];
            rows.push({
                qid,
                qtext: q?.question || q?.text || qid,
                answer: getAnswerLabel(q, val),
            });
        }
    });
    // 질문 원래 순서대로 정렬
    rows.sort((a, b) => {
        const ai = questionById[a.qid]?.order ?? 9999;
        const bi = questionById[b.qid]?.order ?? 9999;
        return ai - bi;
    });
    return rows;
}

export default function HistoryDetailScreen({navigation}) {
    const route = useRoute();
    const entry = route.params?.item || route.params?.entry || {};
    const { dateISO, answers = {}, part, parts } = entry;

    // id -> 질문 객체 맵
    const questionById = useMemo(() => {
        const all = Object.values(QUESTION_SETS || {}).flat();
        return all.reduce((acc, q) => {
            acc[q.id] = q; // q: { id, question/text, choices/options, order? }
            return acc;
        }, {});
    }, []);

    // 보여줄 섹션들 만들기 (A: part 1개 / B: parts 배열 여러 개)
    const sections = useMemo(() => {
        const keys = part ? [part] : Array.isArray(parts) ? parts : [];
        return keys.map(k => ({
            key: k,
            title: `${CATEGORY_LABELS[k] ?? CATEGORY_TITLES[k] ?? k} 진단내역`,
            rows: rowsForPart(k, answers, questionById),
        })).filter(s => s.rows.length > 0);
    }, [part, parts, answers, questionById]);

    const headerTitle = entry.title || (part
        ? (CATEGORY_LABELS[part] ?? CATEGORY_TITLES[part] ?? part)
        : (Array.isArray(parts) ? parts.map(k => CATEGORY_TITLES[k] ?? k).join(' / ') : '진단 내역'));

    const dateLabel = dateISO ? new Date(dateISO).toLocaleDateString() : '';

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>

            {/* 상단 헤더 */}
            <View style={styles.header}>
                <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
                    <Ionicons name="chevron-back" size={22} color="#111" />
                </Pressable>
                <Text style={styles.headerTitle}>진단 저장 내역</Text>
                <View style={{ width: 22 }} />
            </View>

            {/* 상단 타이틀 */}
            <Text style={{ fontSize: 20, fontWeight: '700', color: '#1f2937' }}>
                {headerTitle}
            </Text>
            {!!dateLabel && (
                <Text style={{ marginTop: 4, color: '#6b7280' }}>
                    {dateLabel}에 진단한 내역이에요
                </Text>
            )}

            {/* 섹션들 */}
            {sections.map((sec) => (
                <View
                    key={sec.key}
                    style={{
                        marginTop: 16,
                        backgroundColor: '#fff',
                        borderRadius: 16,
                        padding: 14,
                        shadowColor: '#000',
                        shadowOpacity: 0.06,
                        shadowRadius: 8,
                        elevation: 2,
                    }}
                >
                    {/* 섹션 헤더 (예: 👀 눈 진단내역) */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Ionicons name="ellipse-outline" size={16} color="#6b7280" />
                        <Text style={{ marginLeft: 6, fontSize: 16, fontWeight: '700' }}>
                            {sec.title}
                        </Text>
                    </View>

                    <FlatList
                        data={sec.rows}
                        keyExtractor={(it) => it.qid}
                        ItemSeparatorComponent={() => (
                            <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 10 }} />
                        )}
                        renderItem={({ item }) => (
                            <View>
                                {/* Q. 질문 */}
                                <Text style={{ fontWeight: '700', marginBottom: 6 }}>
                                    Q. {item.qtext}
                                </Text>
                                {/* A. 환자의 대답: ○○ */}
                                <Text style={{ color: '#374151' }}>
                                    <Text style={{ color: '#6b7280' }}>A. 환자의 대답: </Text>
                                    {item.answer}
                                </Text>
                            </View>
                        )}
                        ListEmptyComponent={
                            <Text style={{ color: '#9ca3af' }}>이 부위에 해당하는 답변이 없습니다.</Text>
                        }
                    />
                </View>
            ))}

            {/* 섹션이 하나도 없을 때(방어) */}
            {sections.length === 0 && (
                <View style={{ marginTop: 24 }}>
                    <Text>표시할 답변이 없습니다.</Text>
                </View>
            )}
        </View>
    );
}
