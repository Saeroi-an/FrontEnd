// src/components/ChatHeader.js
import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/chatPrescriptionStyles";

export default function ChatHeader({ title, onBack }) {
  return (
    <View style={styles.header}>
      <Pressable hitSlop={8} onPress={onBack}>
        <Ionicons name="chevron-back" size={22} color="#111" />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
      <View style={{ width: 22 }} />
    </View>
  );
}
