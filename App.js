import './firebaseConfig';
import { StyleSheet } from 'react-native';
import React, {useEffect} from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import LoginScreen from './screens/login';
import SignUpScreen from './screens/signUp';
import HomeScreen from './screens/home';
import WeeklyScreen from './screens/weekly';
import StatisticsScreen from './screens/statistics';
import CommunityScreen from './screens/community';
import TaskAdderScreen from './screens/taskAdder';

import {useFonts} from "expo-font";
import * as SplashScreen from 'expo-splash-screen';

const Tab = createBottomTabNavigator();

function TabStack() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeScreen" component = {HomeScreen} />
      <Tab.Screen name="WeeklyScreen" component = {WeeklyScreen} />
      <Tab.Screen name="TaskAdderScreen" component = {TaskAdderScreen} />
      <Tab.Screen name="StatisticsScreen" component={StatisticsScreen} />
      <Tab.Screen name="CommunityScreen" component={CommunityScreen} />
    </Tab.Navigator>
  );
}


const Stack = createStackNavigator();

function MainStack() {
    return (
   
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="TabStack" component={TabStack} />
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
        <MainStack />
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
