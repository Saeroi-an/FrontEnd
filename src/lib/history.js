// src/lib/history.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuid } from 'uuid';
import 'react-native-get-random-values';
import { CATEGORY_TITLES } from '../data/categoryTitles';

const STORAGE_KEY = 'diagnosis_history';

/**
 * 진단 세션 저장: 선택한 부위별로 항목(카드) 생성 + 오늘 날짜
 * @param {Object} params
 * @param {string[]} params.selectedParts - ['eye','teeth',...]
 * @param {Object}   params.answers       - 누적 답변 맵 { qid: value, ... } (옵션)
 * @param {string=}  params.dateISO       - 지정 날짜(옵션, 기본: now)
 * @returns {Promise<Array>} 저장된 항목 배열(방금 추가된 것들)
 */
export async function saveDiagnosisSession({ selectedParts = [], answers = {}, dateISO }) {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  const list = raw ? JSON.parse(raw) : [];

  const nowISO = dateISO || new Date().toISOString();

  // 부위별로 "중첩(여러 개)" 항목 생성 — History 리스트에 각각 뜨게
  const entries = selectedParts.map((partKey) => ({
    id: uuid(),
    part: partKey,                               // 원본 키 보존
    title: CATEGORY_TITLES[partKey] || partKey,  // 리스트에 보일 텍스트
    dateISO: nowISO,                             // 저장 날짜
    answers,                                     // 필요시 상세에서 사용
  }));

  const next = [...entries, ...list];            // 최신이 위로 오도록 prepend
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return entries;
}

/** 진단 내역 불러오기 (그냥 배열 반환) */
export async function loadHistory() {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

/** 전체 삭제(디버깅용) */
export async function clearHistory() {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
}
