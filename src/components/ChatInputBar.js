// src/components/ChatInputBar.js
import React from "react";
import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/chatPrescriptionStyles";

export default function ChatInputBar({ input, setInput, onSend }) {
  const disabled = !input.trim();

  return (
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
          disabled ? styles.sendBtnDisabled : styles.sendBtnActive,
        ]}
        disabled={disabled}
      >
        <Ionicons name="arrow-up" size={18} color="white" />
      </Pressable>
    </View>
  );
}
