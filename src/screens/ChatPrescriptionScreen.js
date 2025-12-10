// src/screens/ChatPrescriptionScreen.js
import React, { useRef } from "react";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import styles from "../styles/chatPrescriptionStyles";
import ChatHeader from "../components/ChatHeader";
import ChatInputBar from "../components/ChatInputBar";
import PrescriptionMessageList from "../components/PrescriptionMessageList";
import { usePrescriptionChat } from "../hooks/usePrescriptionChat";
import { Ionicons } from "@expo/vector-icons";

export default function ChatPrescriptionScreen({ navigation }) {
  const listRef = useRef(null);
  const {
    messages,
    input,
    setInput,
    openingCamera,
    onSend,
    openCameraAndPushImage,
    retakeFor,
  } = usePrescriptionChat(listRef);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 8 : 0}
      >
        <ChatHeader
          title="처방전 인식하기"
          onBack={() => navigation.goBack()}
        />

        <PrescriptionMessageList
          messages={messages}
          listRef={listRef}
          onRetake={retakeFor}
          showNotice={true}
        />

        <ChatInputBar input={input} setInput={setInput} onSend={onSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
