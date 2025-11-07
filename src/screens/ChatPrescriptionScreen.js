// ChatPrescriptionScreen.js
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/chatPrescriptionStyles";

// 메시지 유틸
const makeId = () => Math.random().toString(36).slice(2);

export default function ChatPrescriptionScreen({navigation}) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [openingCamera, setOpeningCamera] = useState(false);
  const listRef = useRef(null);

  // 진입 시 카메라 자동 오픈 + 안내 메시지
  useEffect(() => {
    openCameraAndPushImage();
  }, []);

  // 카메라 권한 & 촬영
  const openCameraAndPick = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      alert("카메라 권한이 필요합니다. 설정에서 권한을 허용해주세요.");
      return null;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });
    if (result.canceled) return null;
    const asset = result.assets?.[0];
    return asset?.uri ?? null;
  }, []);

  // 촬영 → 유저 이미지 메시지 추가 → (백엔드 호출 자리)
  const openCameraAndPushImage = useCallback(async () => {
    try {
      setOpeningCamera(true);
      const uri = await openCameraAndPick();
      if (!uri) return;

      const imgMsg = {
        id: makeId(),
        role: "user",
        kind: "image",
        uri,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, imgMsg]);

      const pendingId = makeId();
      setMessages((prev) => [
        ...prev,
        {
          id: pendingId,
          role: "assistant",
          kind: "text",
          content: "__LOADING__",
          createdAt: Date.now(),
        },
      ]);

      // TODO: 여기서 이미지 업로드/분석 API 호출
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === pendingId
              ? {
                  ...m,
                  content:
                    "사진을 확인했어요. 예: 아세트아미노펜 500mg, 하루 3회(식후 30분) 복용 등으로 보입니다. 어떤 점이 궁금하신가요?",
                }
              : m
          )
        );
      }, 1200);
    } finally {
      setOpeningCamera(false);
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [openCameraAndPick]);

  // 특정 이미지 메시지 재촬영
  const retakeFor = useCallback(
    async (messageId) => {
      const uri = await openCameraAndPick();
      if (!uri) return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, uri, createdAt: Date.now() } : m
        )
      );
    },
    [openCameraAndPick]
  );

  // 사용자 질문 → assistant 응답(여러 번 가능)
  const onSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;

    const userMsg = {
      id: makeId(),
      role: "user",
      kind: "text",
      content: text,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    const pendingId = makeId();
    setMessages((prev) => [
      ...prev,
      {
        id: pendingId,
        role: "assistant",
        kind: "text",
        content: "__LOADING__",
        createdAt: Date.now(),
      },
    ]);

    // TODO: 여기서 실제 챗봇 API 호출
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? { ...m, content: makeDemoAnswer(text) }
            : m
        )
      );
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }, 800);
  }, [input]);

  // 데모용 응답
  function makeDemoAnswer(q) {
    if (/중국|중국어|번역/.test(q))
      return "복용법 중국어 예시: 每天三次，饭后30分钟服用500mg对乙酰氨基酚。请避免饮酒与驾驶。";
    if (/언제|시간|횟수|몇/.test(q))
      return "일반 예시: 하루 3회, 아침·점심·저녁 식후 30분에 복용하세요.";
    if (/주의|조심|부작용|술|운전/.test(q))
      return "주의사항 예시: 음주를 피하고, 졸릴 수 있으니 운전은 삼가세요.";
    return `“${q}”에 대한 예시 답변입니다. 실제 서비스에서는 백엔드에서 처방전 인식/요약 후 정확한 답변을 반환하도록 연동하세요.`;
  }

  // 채팅 아이템
  const renderItem = ({ item }) => {
    const isUser = item.role === "user";
    const isImage = item.kind === "image";
    const isLoading = item.kind === "text" && item.content === "__LOADING__";

    return (
      <View
        style={[
          styles.messageRow,
          { justifyContent: isUser ? "flex-end" : "flex-start" },
        ]}
      >
        <View
          style={isImage ? styles.imageBubble : isUser ? styles.msgBubbleUser : styles.msgBubbleBot}
        >
          {isImage ? (
            <View>
              <Image source={{ uri: item.uri }} style={styles.msgImage} resizeMode="cover" />
              {/* 사진 왼쪽 카메라 아이콘 = 재촬영 */}
              <TouchableOpacity
                onPress={() => retakeFor(item.id)}
                style={styles.retakeBtn}
              >
                <Ionicons name="camera" size={18} color="#111827" />
              </TouchableOpacity>
            </View>
          ) : isLoading ? (
            <View style={styles.loadingBubble}>
              <ActivityIndicator />
            </View>
          ) : (
            <Text style={styles.msgText}>{item.content}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        {/* 헤더 */}
        <View style={styles.header}>
        <Pressable hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color="#111" />
        </Pressable>
        <Text style={styles.headerTitle}>처방전 인식하기</Text>
        <View style={{ width: 22 }} />
          {/* 하단 주석 해제 시 헤더에 재촬영 버튼 생김 */}
          {/* <Pressable
            onPress={openCameraAndPushImage}
            style={styles.cameraBtn}
            disabled={openingCamera}
          >
            <Ionicons name="camera" size={15} color="#1d4ed8" />
            <Text style={styles.cameraBtnText}>
              {openingCamera ? "카메라 여는 중..." : "재촬영"}
            </Text>
          </Pressable> */}
        </View>


        {/* 채팅 목록 */}
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          onLayout={() => listRef.current?.scrollToEnd({ animated: true })}
        />

        {/* 입력 바 */}
        <View style={styles.inputBar}>
          <TextInput
            placeholder="처방전에 대해 무엇이든 물어보세요"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={onSend}
            returnKeyType="send"
            style={styles.textInput}
          />
          <Pressable
            onPress={onSend}
            style={[
              styles.sendBtn,
              input.trim() ? styles.sendBtnActive : styles.sendBtnDisabled,
            ]}
          >
            <Ionicons name="arrow-up" size={18} color="white" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
