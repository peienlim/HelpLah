import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DrawerStack from './drawerNavigation';
import WeeklyScreen from '../screens/weekly';
import TaskAdderScreen from '../screens/taskAdder';
import FocusScreen from '../screens/statistics';
import CommunityScreen from '../screens/community';

import Ionicons from '@expo/vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export default function TabStack() {
  return (
    <Tab.Navigator screenOptions={{tabBarActiveTintColor: '#9AC791', headerShown: false, showLabel: false}}>
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
          name="FocusScreen" 
          component={FocusScreen} 
          options={{tabBarIcon: ({color, size}) => (<Ionicons name='happy-outline' color={color} size={size} />), }}
      />
      <Tab.Screen 
          name="CommunityScreen" 
          component={CommunityScreen}
          options={{tabBarIcon: ({color, size}) => (<Ionicons name='people-outline' color={color} size={size} />), }}
      />
    </Tab.Navigator>
  );
}