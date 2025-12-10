import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { QUESTION_SETS } from '../data/questions';
import { CATEGORY_TITLES } from '../data/categoryTitles';
import { useTranslation } from 'react-i18next';   // ✅ 추가

import styles from '../styles/historyDetailStyles';
import i18n from '../i18n/i18n';

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
            const qKey = q?.questionKey || q?.id || qid;  // ← i18n에서 쓸 키
            // 🔥 정답 키 찾기 (val이 'q_eye_q1_opt2' 또는 2일 수 있음)
            let answerKey = null;

            if (q?.optionKeys) {
                // 1) 직접 키로 들어온 경우
                if (typeof val === 'string' && q.optionKeys.includes(val)) {
                    answerKey = val;
                }
                // 2) 숫자(옵션 index)로 저장된 경우
                else if (!isNaN(val)) {
                    const idx = Number(val);
                    answerKey = q.optionKeys[idx];
                }
            }

            rows.push({
                qid,
                qKey,                                 // ⭐ 질문 번역용 key
                qtext: q?.question || q?.text || qid, // 한국어 원문 (나중에 의사용으로 쓸 수도 있음)
                answerKey: answerKey,
                answer: getAnswerLabel(q, val),       // 답 라벨
            });
        }
    });
    rows.sort((a, b) => {
        const ai = questionById[a.qid]?.order ?? 9999;
        const bi = questionById[b.qid]?.order ?? 9999;
        return ai - bi;
    });
    return rows;
}

export default function HistoryDetailScreen({ navigation }) {
    const route = useRoute();
    const entry = route.params?.item || route.params?.entry || {};
    const { dateISO, answers = {}, part, parts } = entry;

    const { t, i18n } = useTranslation();              // ✅ 여기!
    const isChineseUser = i18n.language.startsWith('zh'); // 'zh', 'zh-CN' 등

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
                <Text style={styles.headerTitle}>
                    {t('history_header_title')}
                </Text>
                <View style={{ width: 22 }} />
            </View>


            <View style={{ padding: 20 }}>
                {/* 상단 타이틀 */}
                <Text style={{ fontSize: 24, fontWeight: '700', color: '#3276EB', marginLeft: 10, marginTop: 15, }}>
                    {t(`part_${part}`)}
                </Text>
                {!!dateLabel && (
                    <Text style={{ marginTop: 4, color: '#6b7280', marginLeft: 10 }}>
                        {t('detail_date_desc', { date: dateLabel })}
                    </Text>
                )}

                {/* 섹션들 */}

                {isChineseUser ? (
                    <>
                        {/* ① 중국어 버전 Q/A */}
                        {sections.map((sec) => (
                            <View
                                key={`zh_${sec.key}`}
                                style={{
                                    marginTop: 16,
                                    backgroundColor: '#fff',
                                    borderRadius: 16,
                                    padding: 20,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.06,
                                    shadowRadius: 8,
                                    elevation: 2,
                                }}
                            >
                                <FlatList
                                    data={sec.rows}
                                    keyExtractor={(it) => it.qid}
                                    ItemSeparatorComponent={() => (
                                        <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 19 }} />
                                    )}
                                    renderItem={({ item }) => (
                                        <View>
                                            {/* Q. (중국어) */}
                                            <Text style={{ fontWeight: '700', marginBottom: 6 }}>
                                                Q. {t(item.qKey || item.qtext)}
                                            </Text>
                                            {/* A. (중국어로 번역하려면 answer도 키 기반으로 바꿔야 함) */}
                                            <Text style={{ color: '#374151' }}>
                                                <Text style={{ color: '#6b7280' }}>
                                                    {t('history_detail_answer_prefix')}
                                                </Text>
                                                {/* 지금은 answer가 한국어라서, 필요하다면 나중에 answer도 i18n 키로 리팩터링 */}
                                                {item.answerKey ? t(item.answerKey) : item.answer}
                                            </Text>
                                        </View>
                                    )}
                                />
                            </View>
                        ))}

                        {/* ② 안내 문구 + 한국어 버전 */}
                        <View style={{ marginTop: 24 }}>
                            <Text style={styles.translationnotice}>
                                {t('ko_notice')}
                            </Text>
                            <Text style={styles.translatiosubnotice}>
                                이 부분은 한국어 번역입니다. {'\n'}의사에게 보여주세요.
                            </Text>
                        </View>

                        {sections.map((sec) => (
                            <View
                                key={`ko_${sec.key}`}
                                style={{
                                    marginTop: 16,
                                    backgroundColor: '#fff',
                                    borderRadius: 16,
                                    padding: 20,
                                    shadowColor: '#000',
                                    shadowOpacity: 0.06,
                                    shadowRadius: 8,
                                    elevation: 2,
                                }}
                            >
                                <FlatList
                                    data={sec.rows}
                                    keyExtractor={(it) => it.qid}
                                    ItemSeparatorComponent={() => (
                                        <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 19 }} />
                                    )}
                                    renderItem={({ item }) => (
                                        <View>
                                            {/* Q. 한국어 버전 */}
                                            <Text style={{ fontWeight: '700', marginBottom: 6 }}>
                                                Q. {i18n.getFixedT('ko')(item.qKey)}
                                            </Text>

                                            {/* A. 한국어 버전 */}
                                            <Text style={{ color: '#374151' }}>
                                                <Text style={{ color: '#6b7280' }}>A. 환자의 대답: </Text>
                                                {item.answerKey
                                                    ? i18n.getFixedT('ko')(item.answerKey)
                                                    : item.answer
                                                }
                                            </Text>
                                        </View>
                                    )}
                                />
                            </View>
                        ))}
                    </>
                ) : (
                    /* 🇰🇷 중국어가 아닐 때 기존 한국어 한 번만 */
                    sections.map((sec) => (
                        <View
                            key={sec.key}
                            style={{
                                marginTop: 16,
                                backgroundColor: '#fff',
                                borderRadius: 16,
                                padding: 20,
                                shadowColor: '#000',
                                shadowOpacity: 0.06,
                                shadowRadius: 8,
                                elevation: 2,
                            }}
                        >
                            <FlatList
                                data={sec.rows}
                                keyExtractor={(it) => it.qid}
                                ItemSeparatorComponent={() => (
                                    <View style={{ height: 1, backgroundColor: '#eee', marginVertical: 19 }} />
                                )}
                                renderItem={({ item }) => (
                                    <View>
                                        <Text style={{ fontWeight: '700', marginBottom: 6 }}>
                                            Q. {item.qtext}
                                        </Text>
                                        <Text style={{ color: '#374151' }}>
                                            <Text style={{ color: '#6b7280' }}>A. 환자의 대답: </Text>
                                            {item.answer}
                                        </Text>
                                    </View>
                                )}
                            />
                        </View>
                    ))
                )}



                {/* 섹션이 하나도 없을 때(방어) */}
                {sections.length === 0 && (
                    <View style={{ marginTop: 24 }}>
                        <Text>표시할 답변이 없습니다.</Text>
                    </View>
                )}
            </View>
        </View>

    );
}
