import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';
import 'react-native-get-random-values';
import * as WebBrowser from 'expo-web-browser';

import HomeScreen from './src/screens/HomeScreen';
import HospitalScreen from './src/screens/HospitalScreen';
import MyPageScreen from './src/screens/MyPageScreen';
import SelfCheckScreen from './src/screens/SelfCheckScreen';
import QuestionStep from './src/screens/QuestionStep';
import ResultScreen from './src/screens/ResultScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import LoginScreen from './src/screens/LoginScreen';
import LanguageScreen from './src/screens/LanguageScreen';
import InfoScreen from './src/screens/InfoScreen';
import CameraCaptureScreen from './src/screens/CameraCaptureScreen';
import HistoryDetailScreen from './src/screens/HistoryDetailScreen';
import ChatPrescriptionScreen from './src/screens/ChatPrescriptionScreen';

import { initI18n } from './src/i18n/i18n'; // ⭐ 방금 만든 i18n 초기화 함수

WebBrowser.maybeCompleteAuthSession();
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused }) => {
          const icons = {
            Home: focused
              ? require('./assets/icon/home_ch.png')
              : require('./assets/icon/home_un.png'),
            Hospital: focused
              ? require('./assets/icon/hospital_ch.png')
              : require('./assets/icon/hospital_un.png'),
            MyPage: focused
              ? require('./assets/icon/mypage_ch.png')
              : require('./assets/icon/mypage_un.png'),
          };
          return <Image source={icons[route.name]} style={{ width: 21, height: 21 }} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '홈' }} />
      <Tab.Screen name="Hospital" component={HospitalScreen} options={{ tabBarLabel: '근처병원' }} />
      <Tab.Screen name="MyPage" component={MyPageScreen} options={{ tabBarLabel: '마이페이지' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const setup = async () => {
      await initI18n();   // 🔥 번역 엔진 초기화 (저장된 언어 or 기기 언어 적용)
      setReady(true);
    };
    setup();
  }, []);

  if (!ready) {
    // i18n 준비되기 전에 잠깐 로딩 화면
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Language" component={LanguageScreen} />
        <Stack.Screen name="Info" component={InfoScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen
          name="ChatPrescription"
          component={ChatPrescriptionScreen}
          options={{ title: '처방전 인식하기' }}
        />
        <Stack.Screen
          name="CameraCapture"
          component={CameraCaptureScreen}
          options={{ title: '처방전 인식하기' }}
        />
        <Stack.Screen name="SelfCheck" component={SelfCheckScreen} />
        <Stack.Screen name="QuestionStep" component={QuestionStep} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="HistoryDetail" component={HistoryDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
