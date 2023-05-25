import { createDrawerNavigator} from '@react-navigation/drawer';

import HomeScreen from '../screens/home';
import ProfileScreen from '../screens/profile';
import LogOutScreen from '../screens/logout';

const Drawer = createDrawerNavigator();

export default function DrawerStack() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component= {HomeScreen} /> 
      <Drawer.Screen name="Profile" component= {ProfileScreen} />
      <Drawer.Screen name="LogOut" component= {LogOutScreen} />
    </Drawer.Navigator>
  );
}

