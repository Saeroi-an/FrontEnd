import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Pressable, FlatList, Image, KeyboardAvoidingView, Platform, TouchableOpacity, ActivityIndicator, Alert, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import styles from "../styles/chatPrescriptionStyles";
import { Ionicons } from "@expo/vector-icons";
import { API_ENDPOINTS, getAccessToken } from "../lib/api";

// 메시지 ID 생성
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

  // MIME 타입 추정
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

    try {
      const token = await getAccessToken();
      console.log("🔑 Access Token:", token ? "존재함" : "없음");

      if (!token) {
        throw new Error("로그인 토큰이 없습니다.");
      }

      const nameFromUri = uri.split("/").pop() || "photo.jpg";
      const contentType = guessContentType(uri);
      console.log("🟡 파일 이름:", nameFromUri, " / contentType:", contentType);

      const form = new FormData();
      form.append("file", { uri, name: nameFromUri, type: contentType });

      console.log("🟣 FormData 준비 완료, endpoint =", API_ENDPOINTS.PRESCRIPTION_UPLOAD);

      const res = await fetch(API_ENDPOINTS.PRESCRIPTION_UPLOAD, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
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
        const errorMsg = `업로드 실패(${res.status}) ${json?.detail || json?.message || ""}`;
        throw new Error(errorMsg);
      }

      console.log("✅ uploadPrescription 성공, data =", json);
      return json;
    } catch (error) {
      console.log("❌ uploadPrescription 에러:", error);
      throw error;
    }
  };

  // 촬영 → 이미지 메시지 + S3 업로드 → AI 응답 추가
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

      // 2) S3 업로드 & AI 분석
      const data = await uploadPrescription(uri);
      console.log("✅ S3 업로드 완료:", data);

      // 3) AI 응답 메시지 추가
      const botMsg = {
        id: makeId(),
        role: "assistant",
        kind: "text",
        content: data.ai_response || "처방전이 업로드되었습니다! 무엇이든 물어보세요.",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      console.error(e);
      const errMsg = {
        id: makeId(),
        role: "assistant",
        kind: "text",
        content: "업로드 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
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

  // 텍스트 채팅 API 호출
  const sendChatMessage = async (text) => {
    try {
      const token = await getAccessToken();
      if (!token) {
        throw new Error("로그인 토큰이 없습니다.");
      }

      const res = await fetch(API_ENDPOINTS.PRESCRIPTION_CHAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json?.detail || "채팅 전송 실패");
      }

      return json.ai_response;
    } catch (error) {
      console.error("❌ sendChatMessage 에러:", error);
      throw error;
    }
  };

  // 텍스트 전송
  const onSend = useCallback(async () => {
    const text = input.trim();
    if (!text) return;

    // 사용자 메시지 추가
    const userMsg = {
      id: makeId(),
      role: "user",
      kind: "text",
      content: text,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // 로딩 메시지 추가
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

    try {
      // 백엔드 API 호출
      const aiResponse = await sendChatMessage(text);

      // 로딩 메시지를 실제 응답으로 교체
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId ? { ...m, content: aiResponse } : m
        )
      );
    } catch (error) {
      // 에러 시 에러 메시지로 교체
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId
            ? { ...m, content: "죄송합니다. 오류가 발생했습니다." }
            : m
        )
      );
    }

    requestAnimationFrame(() => {
      listRef.current?.scrollToEnd({ animated: true });
    });
  }, [input]);

  // 채팅 아이템 렌더링
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
              {/* 재촬영 버튼 */}
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
        </View>

        {/* 안내문구 */}
        <View style={styles.infoNoticeContainer}>
          <Ionicons
            name="information-circle-outline"
            size={15}
            color="#3276EB"
            style={styles.infoNoticeIcon}
          />
          <Text style={styles.infoNoticeText}>
            새로이안은 이전 대화 내용을 기억합니다.{"\n"}
            이전에 질문한 내용도 다시 질문해 보세요!
          </Text>
        </View>
        {/* 안내문구 */}


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