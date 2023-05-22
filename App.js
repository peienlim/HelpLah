import './firebaseConfig';
import { StyleSheet} from 'react-native';
import React, {useEffect} from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from './screens/home';
import LoginScreen from './screens/login';
import SignUpScreen from './screens/signUp';

import {useFonts} from "expo-font";
import * as SplashScreen from 'expo-splash-screen';


const Stack = createStackNavigator();

function LoginStack() {
    return (
   
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
   
    );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'spacemono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    'spacemono-bold': require('./assets/fonts/SpaceMono-Bold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }

  return (
    <NavigationContainer>
        <LoginStack />
    </NavigationContainer>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  background: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  }

});
