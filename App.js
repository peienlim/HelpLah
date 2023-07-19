import './firebaseConfig';
import { StyleSheet } from 'react-native';
import React, {useEffect} from 'react';

import { NavigationContainer } from '@react-navigation/native';

import {useFonts} from "expo-font";
import * as SplashScreen from 'expo-splash-screen';

import MainStack from './navigation/stackNavigation';

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
    <NavigationContainer >
        <MainStack testID="main-stack"/>
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
  },

  bottomBar: {

  }

});
