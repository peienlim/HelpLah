import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/login';
import SignUpScreen from '../screens/signUp';
import TabStack from './bottomTabNavigation';

const Stack = createStackNavigator();

export default function MainStack() {
    return (
   
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="TabStack" component={TabStack} />
    </Stack.Navigator>
   
    );
}