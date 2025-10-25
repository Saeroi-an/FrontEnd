// CameraConfirmScreen.js
import React, { useState } from 'react';
import { View, Text, Image, Alert, Pressable, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function CameraConfirmScreen() {
  const [photoUri, setPhotoUri] = useState(null);

  const askAndShoot = async () => {
    // 1) 카메라 권한 확인/요청
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 권한을 허용해주세요.');
      return;
    }

    // 2) 카메라 실행(촬영)
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled) return;

    const uri = result.assets?.[0]?.uri;
    if (!uri) return;

    // 3) 확인 창
    Alert.alert(
      '확인',
      '카메라 촬영하고 사진 사용하시겠습니까?',
      [
        { text: '아니오', style: 'cancel' },
        {
          text: '네, 사용',
          onPress: () => setPhotoUri(uri),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>카메라 촬영 & 확인</Text>

      <Pressable style={styles.button} onPress={askAndShoot}>
        <Text style={styles.btnText}>촬영하기</Text>
      </Pressable>

      {photoUri ? (
        <View style={styles.previewWrap}>
          <Text style={styles.previewLabel}>선택한 사진</Text>
          <Image source={{ uri: photoUri }} style={styles.preview} />
        </View>
      ) : (
        <Text style={styles.hint}>아직 선택한 사진이 없어요.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 16 },
  button: { backgroundColor: '#111827', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10 },
  btnText: { color: 'white', fontSize: 16, fontWeight: '600' },
  previewWrap: { marginTop: 24, alignItems: 'center' },
  previewLabel: { marginBottom: 8, color: '#374151' },
  preview: { width: 240, height: 240, borderRadius: 12, backgroundColor: '#e5e7eb' },
  hint: { marginTop: 16, color: '#6b7280' },
});
