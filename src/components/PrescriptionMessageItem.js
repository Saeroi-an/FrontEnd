// src/components/PrescriptionMessageItem.js
import React from "react";
import {
  View,
  Image,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "../styles/chatPrescriptionStyles";

export default function PrescriptionMessageItem({ item, onRetake }) {
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
            <TouchableOpacity
              onPress={() => onRetake?.(item.id)}
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
}
