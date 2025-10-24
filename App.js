import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Image } from 'react-native';

import HomeScreen from './src/screens/HomeScreen';
import HospitalScreen from './src/screens/HospitalScreen';
import MyPageScreen from './src/screens/MyPageScreen';
import SelfCheckScreen from './src/screens/SelfCheckScreen';
import QuestionStep from './src/screens/QuestionStep';
import ResultScreen from './src/screens/ResultScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
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
    })}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '홈' }} />
      <Tab.Screen name="Hospital" component={HospitalScreen} options={{ tabBarLabel: '근처병원' }} />
      <Tab.Screen name="MyPage" component={MyPageScreen} options={{ tabBarLabel: '마이페이지' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Tabs" component={Tabs} />
        <Stack.Screen name="SelfCheck" component={SelfCheckScreen} />
        <Stack.Screen name="QuestionStep" component={QuestionStep} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
