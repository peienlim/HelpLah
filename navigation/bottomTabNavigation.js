import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DrawerStack from './drawerNavigation';
import WeeklyScreen from '../screens/weekly';
import FocusScreen from '../screens/statistics';
import CommunityScreen from '../screens/community';


import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';

const Tab = createBottomTabNavigator();
const NewPlaceHolder = () => <View style= {{flex: 1, backgroundColor:"pink"}}></View>

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
          name="Add" 
          component = {NewPlaceHolder} 
          options={{tabBarIcon: ({color, size}) => (<Ionicons name='add-circle-outline' color={color} size={size} />),}}
          listeners={({navigation}) => ({tabPress: event => event.preventDefault() & navigation.navigate("CreateNew") })}
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