// src/components/PrescriptionMessageList.js
import React from "react";
import { FlatList, View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PrescriptionMessageItem from "./PrescriptionMessageItem";
import styles from "../styles/chatPrescriptionStyles";
export default function PrescriptionMessageList({ messages, listRef, onRetake }) {
  return (
    <FlatList
      ref={listRef}
      data={messages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PrescriptionMessageItem item={item} onRetake={onRetake} />
      )}
      contentContainerStyle={styles.listContainer}
      ListHeaderComponent={
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 10,
            // backgroundColor: "#F4F6FA",
            borderRadius: 10,
            marginHorizontal: 16,
            marginTop: 0,
            marginBottom: 10,
            alignItems: "center", // 🔥 View 자체 가운데 정렬
          }}
        >
          <Ionicons
            name="information-circle-outline"
            size={15}
            color="#3276EB"
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: 12,
              color: "#686868",
              lineHeight: 18,
            }}
          >
            새로이안은 이전 대화 내용을 기억합니다.{"\n"}
            이전에 질문한 내용도 다시 질문해 보세요!
          </Text>
        </View>
      }
    />
  );
}
