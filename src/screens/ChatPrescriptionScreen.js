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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/chatPrescriptionStyles";
import { API_ENDPOINTS } from "../lib/api";

// 메시지 유틸
const makeId = () => Math.random().toString(36).slice(2);

export default function ChatPrescriptionScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [openingCamera, setOpeningCamera] = useState(false);
  const listRef = useRef(null);

  // 카메라 권한 & 촬영
  const openCameraAndPick = useCallback(async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "권한 필요",
        "카메라 권한이 필요합니다. 설정에서 권한을 허용해주세요."
      );
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

  // MIME 추정
  const guessContentType = (uri) => {
    const lower = uri.split("?")[0].toLowerCase();
    if (lower.endsWith(".png")) return "image/png";
    if (lower.endsWith(".webp")) return "image/webp";
    if (lower.endsWith(".heic")) return "image/heic";
    if (lower.endsWith(".heif")) return "image/heif";
    return "image/jpeg";
  };

  // S3 업로드 API 호출
  const uploadPrescription = async (uri) => {
    console.log("🔵 uploadPrescription 호출, uri =", uri);

    const nameFromUri = uri.split("/").pop() || "photo.jpg";
    const contentType = guessContentType(uri);

    console.log("🟡 파일 이름:", nameFromUri, " / contentType:", contentType);

    const form = new FormData();
    form.append("file", { uri, name: nameFromUri, type: contentType });

    console.log(
      "🟣 FormData 준비 완료, endpoint =",
      API_ENDPOINTS.PRESCRIPTION_UPLOAD
    );

    const res = await fetch(API_ENDPOINTS.PRESCRIPTION_UPLOAD, {
      method: "POST",
      body: form, // Content-Type 자동
    });

    console.log("🟠 HTTP 응답 status =", res.status);
    const text = await res.text();
    console.log("📝 응답 원문 =", text);

    let json;
    try {
      json = JSON.parse(text);
    } catch (e) {
      throw new Error("JSON 파싱 실패: " + text);
    }

    if (!res.ok) {
      throw new Error(`업로드 실패(${res.status}) ${json?.message || ""}`);
    }
    if (!json?.success) {
      throw new Error(json?.message || "업로드 응답 에러");
    }

    console.log("✅ uploadPrescription 성공, data =", json.data);
    return json.data; // { id, file_url, original_filename, ai_analysis }
  };

  // 촬영 → 이미지 메시지 + S3 업로드 → 안내 텍스트 추가
  const openCameraAndPushImage = useCallback(async () => {
    console.log("🔴 openCameraAndPushImage 시작");
    try {
      setOpeningCamera(true);
      const uri = await openCameraAndPick();
      if (!uri) return;
      console.log("🟠 카메라에서 받은 uri:", uri);

      // 1) 유저 이미지 메시지 추가
      const imgMsg = {
        id: makeId(),
        role: "user",
        kind: "image",
        uri,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, imgMsg]);

      // 2) 👉 실제 S3 업로드
      const data = await uploadPrescription(uri);
      console.log("✅ S3 업로드 완료:", data.file_url);

      // 3) 업로드 완료 안내 텍스트 메시지 추가
      const botMsg = {
        id: makeId(),
        role: "assistant",
        kind: "text",
        content:
          "사진을 성공적으로 업로드했어요! 이제 처방전에 대해 궁금한 점을 채팅으로 물어보세요.",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      const errMsg = {
        id: makeId(),
        role: "assistant",
        kind: "text",
        content:
          "업로드 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, errMsg]);
      Alert.alert("에러", String(e?.message || e));
    } finally {
      setOpeningCamera(false);
      requestAnimationFrame(() => {
        listRef.current?.scrollToEnd({ animated: true });
      });
    }
  }, [openCameraAndPick]);

  // 진입 시 카메라 자동 오픈
  useEffect(() => {
    openCameraAndPushImage();
  }, [openCameraAndPushImage]);

  // 특정 이미지 메시지 재촬영 (S3 재업로드는 아직 안 함)
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

  // 사용자 질문 → demo 응답
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
        content: "__LOADING__", // 여기만 로딩 유지 (텍스트 질문용)
        createdAt: Date.now(),
      },
    ]);

    // 데모 응답 (AI 연동 전)
    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId ? { ...m, content: makeDemoAnswer(text) } : m
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
          style={
            isImage
              ? styles.imageBubble
              : isUser
              ? styles.msgBubbleUser
              : styles.msgBubbleBot
          }
        >
          {isImage ? (
            <View>
              <Image
                source={{ uri: item.uri }}
                style={styles.msgImage}
                resizeMode="cover"
              />
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
          {/* 필요하면 헤더 재촬영 버튼 활성화 */}
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
          onContentSizeChange={() =>
            listRef.current?.scrollToEnd({ animated: true })
          }
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
