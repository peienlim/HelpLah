import { createDrawerNavigator} from '@react-navigation/drawer';

import HomeScreen from '../screens/home';
<<<<<<< HEAD
/* import ProfileScreen from '../screens/profile'; */
import LogOutScreen from '../screens/logout';
=======
import ProfileScreen from '../screens/profile';
>>>>>>> beverley_branch

const Drawer = createDrawerNavigator();

export default function DrawerStack() {
  return (
    <Drawer.Navigator screenOptions={{headerShown:true}}>
      <Drawer.Screen name="Home" component= {HomeScreen} /> 
<<<<<<< HEAD
      {/* <Drawer.Screen name="Profile" component= {ProfileScreen} /> */}
      <Drawer.Screen name="LogOut" component= {LogOutScreen} />
=======
      <Drawer.Screen name="Profile" component= {ProfileScreen} />
>>>>>>> beverley_branch
    </Drawer.Navigator>
  );
}

