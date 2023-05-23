import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/home';
import WeeklyScreen from '../screens/weekly';
import StatisticsScreen from '../screens/statistics';
import CommunityScreen from '../screens/community';


export default function DefaultScreen({navigation}) {
    
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeScreen" component = {HomeScreen} />
      <Tab.Screen name="WeeklyScreen" component = {WeeklyScreen} />
      <Tab.Screen name="StatisticsScreen" component={StatisticsScreen} />
      <Tab.Screen name="CommunityScreen" component={CommunityScreen} />
    </Tab.Navigator>
  );
}

