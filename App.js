import './firebaseConfig';
import { StyleSheet } from 'react-native';
import React, {useEffect} from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator} from '@react-navigation/drawer';

import LoginScreen from './screens/login';
import SignUpScreen from './screens/signUp';
import HomeScreen from './screens/home';
import WeeklyScreen from './screens/weekly';
import StatisticsScreen from './screens/statistics';
import CommunityScreen from './screens/community';
import TaskAdderScreen from './screens/taskAdder';
import ProfileScreen from './screens/profile';
import LogOutScreen from './screens/logout';

import {useFonts} from "expo-font";
import * as SplashScreen from 'expo-splash-screen';

import Ionicons from '@expo/vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

function DrawerStack() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component= {HomeScreen} /> 
      <Drawer.Screen name="Profile" component= {ProfileScreen} />
      <Drawer.Screen name="LogOut" component= {LogOutScreen} />
    </Drawer.Navigator>
  );
}

const Tab = createBottomTabNavigator();

function TabStack() {
  return (
    <Tab.Navigator tabBarOptions= {{showLabel: false}} screenOptions={{tabBarActiveTintColor: '#9AC791', headerShown: false}}>
      <Tab.Screen 
          name="Drawer" 
          component = {DrawerStack} 
          options={{tabBarIcon: ({color, size}) => (<Ionicons name='home-outline' color={color} size={size} />),}}
      />
      <Tab.Screen 
          name="WeeklyScreen" 
          component = {WeeklyScreen} 
          options={{tabBarIcon: ({color, size}) => (<Ionicons name='calendar-outline' color={color} size={size} />),}}
      />
      <Tab.Screen 
          name="TaskAdderScreen" 
          component = {TaskAdderScreen} 
          options={{tabBarIcon: ({color, size}) => (<Ionicons name='add-circle-outline' color={color} size={size} />),}}
      />
      <Tab.Screen 
          name="StatisticsScreen" 
          component={StatisticsScreen} 
          options={{tabBarIcon: ({color, size}) => (<Ionicons name='bar-chart-outline' color={color} size={size} />), }}
      />
      <Tab.Screen 
          name="CommunityScreen" 
          component={CommunityScreen}
          options={{tabBarIcon: ({color, size}) => (<Ionicons name='people-outline' color={color} size={size} />), }}
      />
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
  },

  bottomBar: {

  }

});
