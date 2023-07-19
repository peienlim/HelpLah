import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DrawerStack from './drawerNavigation';
import WeeklyScreen from '../screens/weekly';
import FocusScreen from '../screens/focus';
import StatisticsScreen from '../screens/stats';


import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();
const NewPlaceHolder = () => <View style= {{flex: 1, backgroundColor:"pink"}}></View>

export default function TabStack() {
  return (
    <Tab.Navigator screenOptions={{tabBarActiveTintColor: '#9AC791', headerShown: false, showLabel: false}}>
      <Tab.Screen 
          name="Main" 
          component = {DrawerStack} 
          options={{tabBarIcon: ({color, size}) => (<Ionicons name='home-outline' color={color} size={size} />),}}
      />
      <Tab.Screen 
          name="Weekly" 
          component = {WeeklyScreen} 
          options={{tabBarIcon: ({color, size}) => (<Ionicons name='calendar-outline' color={color} size={size} />),}}
      />
      <Tab.Screen 
          name="Add" 
          component = {NewPlaceHolder} 
          options={{tabBarIcon: ({color, size}) => (<Ionicons name='add-circle-outline' color={color} size={size} />),}}
          listeners={({navigation}) => ({tabPress: event => event.preventDefault() & navigation.navigate("AddEvent") })}
      />
      <Tab.Screen 
          name="Focus" 
          component={FocusScreen} 
          options={{tabBarIcon: ({color, size}) => (<Ionicons name='happy-outline' color={color} size={size} />), }}
      />
      <Tab.Screen 
          name="Stats" 
          component={StatisticsScreen}
          options={{tabBarIcon: ({color, size}) => (<Ionicons name='stats-chart-outline' color={color} size={size} />), }}
      />
    </Tab.Navigator>
  );
}