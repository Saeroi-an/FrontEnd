// src/utils/prescriptionUpload.js
import { API_ENDPOINTS } from '../lib/api';

// MIME 추정 유틸
export const guessContentType = (uri) => {
  const lower = uri.split("?")[0].toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".heic")) return "image/heic";
  if (lower.endsWith(".heif")) return "image/heif";
  return "image/jpeg";
};

// S3 업로드 API 호출
export const uploadPrescription = async (uri) => {
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
    throw new Error(`업로드 실패(${res.status}) ${json?.message || ""}`);
  }
  if (!json?.success) {
    throw new Error(json?.message || "업로드 응답 에러");
  }

  console.log("✅ uploadPrescription 성공, data =", json.data);
  return json.data; // { id, file_url, ... }
};
