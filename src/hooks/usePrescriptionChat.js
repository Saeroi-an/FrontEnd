// src/hooks/usePrescriptionChat.js
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { uploadPrescription } from "../utils/prescriptionUpload";

const makeId = () => Math.random().toString(36).slice(2);

export function usePrescriptionChat(listRef) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [openingCamera, setOpeningCamera] = useState(false);

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

  // 데모용 응답
  const makeDemoAnswer = (q) => {
    if (/중국|중국어|번역/.test(q))
      return "복용법 중국어 예시: 每天三次，饭后30分钟服用500mg对乙酰氨基酚。请避免饮酒与驾驶。";
    if (/언제|시간|횟수|몇/.test(q))
      return "일반 예시: 하루 3회, 아침·점심·저녁 식후 30분에 복용하세요.";
    if (/주의|조심|부작용|술|운전/.test(q))
      return "주의사항 예시: 음주를 피하고, 졸릴 수 있으니 운전은 삼가세요.";
    return `“${q}”에 대한 예시 답변입니다. 실제 서비스에서는 백엔드에서 처방전 인식/요약 후 정확한 답변을 반환하도록 연동하세요.`;
  };

  const scrollToEnd = () => {
    requestAnimationFrame(() => {
      listRef?.current?.scrollToEnd?.({ animated: true });
    });
  };

  // 촬영 → 이미지 메시지 + 업로드 → 안내 텍스트
  const openCameraAndPushImage = useCallback(async () => {
    console.log("🔴 openCameraAndPushImage 시작");
    try {
      setOpeningCamera(true);
      const uri = await openCameraAndPick();
      if (!uri) return;
      console.log("🟠 카메라에서 받은 uri:", uri);

      const imgMsg = {
        id: makeId(),
        role: "user",
        kind: "image",
        uri,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, imgMsg]);

      const data = await uploadPrescription(uri);
      console.log("✅ S3 업로드 완료:", data.file_url);

      const botMsg = {
        id: makeId(),
        role: "assistant",
        kind: "text",
        content:
          "사진을 성공적으로 업로드했어요! 이제 처방전에 대해 궁금한 점을 채팅으로 물어보세요.",
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, botMsg]);
      scrollToEnd();
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
    }
  }, [openCameraAndPick, listRef]);

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

  // 텍스트 질문 보내기
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

    setTimeout(() => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === pendingId ? { ...m, content: makeDemoAnswer(text) } : m
        )
      );
      scrollToEnd();
    }, 800);
  }, [input]);

  return {
    messages,
    input,
    setInput,
    openingCamera,
    onSend,
    openCameraAndPushImage,
    retakeFor,
  };
}
