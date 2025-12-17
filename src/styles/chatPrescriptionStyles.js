// styles/chatPrescriptionStyles.js
import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },
  cameraBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
  },
  cameraBtnText: {
    color: "#1d4ed8",
    fontWeight: "600",
  },
  listContainer: {
    paddingVertical: 12,
  },
  messageRow: {
    flexDirection: "row",
    paddingHorizontal: 12,
    marginVertical: 6,
  },
  msgBubbleUser: {
    maxWidth: "78%",
    backgroundColor: "#DCF2FF",
    padding: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  msgBubbleBot: {
    maxWidth: "78%",
    backgroundColor: "#F1F5F9",
    padding: 10,
    borderRadius: 12,
    overflow: "hidden",
  },
  msgText: {
    fontSize: 15,
    lineHeight: 21,
    color: "#0f172a",
  },
  imageBubble: {
    position: "relative",
    borderRadius: 12,
    overflow: "hidden",
  },
  msgImage: {
    width: 240,
    height: 320,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
  },
  retakeBtn: {
    position: "absolute",
    left: -36,
    top: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  inputBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  textInput: {
    flex: 1,
    height: 42,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: "#F8FAFC",
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  sendBtnActive: {
    backgroundColor: "#2563EB",
  },
  sendBtnDisabled: {
    backgroundColor: "#cbd5e1",
  },
  loadingBubble: {
    width: 80,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  infoNoticeContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginHorizontal: 16,
    alignItems: "center",
  },
  infoNoticeIcon: {
    marginBottom: 6,      // 🔥 세로 배치 핵심
  }, 
  infoNoticeText: {
    fontSize: 12,
    color: "#686868",
    lineHeight: 18,
    textAlign: "center",  // 🔥 세로 배치 필수
  },
});