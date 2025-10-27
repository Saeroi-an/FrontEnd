import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, TextInput, Modal, FlatList, TouchableOpacity, Alert, } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import styles from '../styles/infoStyles';

const STORAGE_KEY = 'user_basic_info';

const YEARS = (() => {
    const thisYear = new Date().getFullYear();
    const arr = [];
    for (let y = thisYear; y >= 1920; y--) arr.push(String(y));
    return arr;
})();

export default function InfoScreen({ navigation }) {
    const [gender, setGender] = useState(null);     // 'male' | 'female' | 'other'
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');

    const [yearOpen, setYearOpen] = useState(false);

    const birthISO = useMemo(() => {
        if (!year || !month || !day) return '';
        const mm = String(month).padStart(2, '0');
        const dd = String(day).padStart(2, '0');
        return `${year}-${mm}-${dd}`;
    }, [year, month, day]);

    const onComplete = async () => {
        // 선택하지 않을 시 안내문구
        // if (!gender) return Alert.alert('안내', '성별을 선택해주세요.');
        // if (!year) return Alert.alert('안내', '태어난 연도를 선택해주세요.');
        // if (!month || !day) return Alert.alert('안내', '생일(월/일)을 입력해주세요.');
        
        const h = Number(height);
        const w = Number(weight);
        if (Number.isNaN(h) || Number.isNaN(w)) {
            return Alert.alert('안내', '신체정보를 숫자로 입력해주세요.');
        }

        const payload = {
            gender,          // 'male' | 'female' | 'other'
            birthYear: year, // '1999'
            birthISO,        // '1999-12-05'
            height: h,       // cm
            weight: w,       // kg
            savedAt: new Date().toISOString(),
        };

        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            // 다음 화면으로 (원하는 곳으로 변경하세요)
            navigation.replace('Tabs'); // 혹은 'Tabs'
        } catch (e) {
            Alert.alert('오류', '저장에 실패했어요. 다시 시도해주세요.');
        }
    };

    return (
        <SafeAreaView style={styles.safe}>
            <View style={styles.container}>
                <Text style={styles.titleTop}>정확한 진단을 위해서</Text>
                <Text style={styles.titleMain}>기본정보를 알려주세요</Text>

                {/* 성별 */}
                <Text style={styles.label}>성별</Text>
                <View style={styles.segmentRow}>
                    <Segment
                        active={gender === 'male'}
                        onPress={() => setGender('male')}
                        text="남성"
                        icon={<Ionicons name="male" size={16} color={gender === 'male' ? '#2F6FED' : '#7B8AA0'} />}
                    />
                    <Segment
                        active={gender === 'female'}
                        onPress={() => setGender('female')}
                        text="여성"
                        icon={<Ionicons name="female" size={16} color={gender === 'female' ? '#2F6FED' : '#7B8AA0'} />}
                    />
                    <Segment
                        active={gender === 'other'}
                        onPress={() => setGender('other')}
                        text="기타"
                        icon={<Ionicons name="person" size={16} color={gender === 'other' ? '#2F6FED' : '#7B8AA0'} />}
                    />
                </View>

                {/* 태어난 년도 */}
                <Text style={[styles.label, { marginTop: 18 }]}>태어난 년도</Text>
                <Pressable style={styles.select} onPress={() => setYearOpen(true)}>
                    <Text style={[styles.selectText, !year && { color: '#B8BFC9' }]}>
                        {year ? `${year}년` : '연도 선택'}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#9AA0A6" />
                </Pressable>

                {/* 생일 */}
                <Text style={[styles.label, { marginTop: 18 }]}>생일</Text>
                <View style={styles.inlineInputs}>
                    <UnderlineInput
                        value={month}
                        onChangeText={(v) => setMonth(v.replace(/[^0-9]/g, '').slice(0, 2))}
                        placeholder="12"
                        keyboardType="number-pad"
                    />
                    <Text style={styles.unit}>월</Text>
                    <UnderlineInput
                        value={day}
                        onChangeText={(v) => setDay(v.replace(/[^0-9]/g, '').slice(0, 2))}
                        placeholder="05"
                        keyboardType="number-pad"
                    />
                    <Text style={styles.unit}>일</Text>
                </View>

                {/* 신체정보 */}
                <Text style={[styles.label, { marginTop: 18 }]}>신체정보</Text>
                <View style={styles.inlineInputs}>
                    <UnderlineInput
                        value={height}
                        onChangeText={(v) => setHeight(v.replace(/[^0-9]/g, '').slice(0, 3))}
                        placeholder="160"
                        keyboardType="number-pad"
                    />
                    <Text style={styles.unit}>cm</Text>
                    <UnderlineInput
                        value={weight}
                        onChangeText={(v) => setWeight(v.replace(/[^0-9]/g, '').slice(0, 3))}
                        placeholder="50"
                        keyboardType="number-pad"
                    />
                    <Text style={styles.unit}>kg</Text>
                </View>

                {/* 완료 버튼 */}
                <Pressable style={styles.button} onPress={onComplete}>
                    <Text style={styles.buttonText}>완료</Text>
                </Pressable>
            </View>

            {/* 연도 선택 모달 */}
            <Modal visible={yearOpen} animationType="slide" transparent onRequestClose={() => setYearOpen(false)}>
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalSheet}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>태어난 년도</Text>
                            <Pressable onPress={() => setYearOpen(false)} hitSlop={8}>
                                <Ionicons name="close" size={22} color="#111" />
                            </Pressable>
                        </View>
                        <FlatList
                            data={YEARS}
                            keyExtractor={(y) => y}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.yearRow}
                                    onPress={() => {
                                        setYear(item);
                                        setYearOpen(false);
                                    }}
                                >
                                    <Text style={styles.yearText}>{item}년</Text>
                                    {year === item && <Ionicons name="checkmark" size={20} color="#2F6FED" />}
                                </TouchableOpacity>
                            )}
                            initialNumToRender={30}
                            getItemLayout={(_, index) => ({ length: 48, offset: 48 * index, index })}
                        />
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

/* ---------- 작은 컴포넌트들 ---------- */

function Segment({ active, onPress, text, icon }) {
    return (
        <Pressable
            onPress={onPress}
            style={[styles.segment, active && styles.segmentActive]}
        >
            <Text style={[styles.segmentText, active && styles.segmentTextActive]}>{text} </Text>
            {icon}
        </Pressable>
    );
}

function UnderlineInput(props) {
    return (
        <TextInput
            {...props}
            style={[styles.underlineInput, props.style]}
            placeholderTextColor="#C5CBD4"
        />
    );
}