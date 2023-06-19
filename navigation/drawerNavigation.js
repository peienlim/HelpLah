import { createDrawerNavigator} from '@react-navigation/drawer';

import HomeScreen from '../screens/home';
import ProfileScreen from '../screens/profile';

const Drawer = createDrawerNavigator();

export default function DrawerStack() {
  return (
    <Drawer.Navigator screenOptions={{headerShown:false}}>
      <Drawer.Screen name="Home" component= {HomeScreen} /> 
      <Drawer.Screen name="Profile" component= {ProfileScreen} />
    </Drawer.Navigator>
  );
}

