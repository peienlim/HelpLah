import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/login';
import SignUpScreen from '../screens/signUp';
import TabStack from './bottomTabNavigation';

import { View, Modal, Text, TouchableOpacity, StyleSheet, TextInput} from 'react-native';
import {useState} from 'react'
//import { TouchableOpacity } from 'react-native-gesture-handler';
import {db} from '../firebaseConfig2';
import { doc, setDoc, addDoc, collection } from "firebase/firestore"; 
import Ionicons from '@expo/vector-icons/Ionicons';

const CreateNew = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(true);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [modType, setModType] = useState('');
  const [duration, setDuration] = useState('');

  // submit data
  async function addEvent() {

     try { 
        const docRef = await addDoc(collection(db, "events"), {
          title: title,
          type: type,
          modType: modType,
          duration: duration,
      });
      console.log("Document written with ID: ", docRef.id);
    } catch(error) {
      console.log(error);
    }
  }
  
  return (

      <Modal isVisible={modalVisible} animationType='fade' onRequestClose={()=> navigation.goBack()} statusBarTranslucent={false} transparent={true}>
        
        <View style={styles.modalView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text>GO BACK</Text>
          </TouchableOpacity>

          <Text style= {{fontFamily: 'spacemono-bold'}}>Title</Text>

          <View style={styles.inputButton}>
              <TextInput
                  value = {title} 
                  style = {{fontFamily: 'spacemono', flexGrow: 1, paddingRight: 20}}
                  placeholder = "Name of event ..."
                  onChangeText = {(title) => setTitle(title)}
              />
          </View>

          <View style={styles.inputButton}>
              <TextInput
                  value = {type} 
                  style = {{fontFamily: 'spacemono', flexGrow: 1, paddingRight: 20}}
                  placeholder = "Task vs Event ..."
                  onChangeText = {(type) => setType(type)}
              />
          </View>

          <View style={styles.inputButton}>
              <TextInput
                  value = {modType} 
                  style = {{fontFamily: 'spacemono', flexGrow: 1, paddingRight: 20}}
                  placeholder = "Module vs Others..."
                  onChangeText = {(modType) => setModType(modType)}
              />
          </View>

          <View style={styles.inputButton}>
              <TextInput
                  value = {duration} 
                  style = {{fontFamily: 'spacemono', flexGrow: 1, paddingRight: 20}}
                  placeholder = "Duration ..."
                  onChangeText = {(duration) => setDuration(duration)}
              />
          </View>

          <View style = {{ paddingTop: 15, paddingBottom: 15 }}>
            <TouchableOpacity onPress={addEvent} style={styles.createButton}>
              <Text style={{fontFamily: 'spacemono-bold'}}>Create</Text>
            </TouchableOpacity>
          </View> 

        </View>

      </Modal>
  );
};

const Stack = createStackNavigator();

export default function MainStack() {
    return (
   
    <Stack.Navigator screenOptions={{headerShown:false}}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
      <Stack.Screen name="TabStack" component={TabStack} />
      <Stack.Screen name = "CreateNew" component={CreateNew} />
    </Stack.Navigator>
   
    );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },

  modalView: {
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    //justifyContent: 'center',
    flex: 1,
  },

  createButton: {
    backgroundColor: '#9AC791',
    borderColor: '#9AC791',
    height: 35,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  inputButton: {
    backgroundColor: '#E5E5E5', 
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderColor: '#E5E5E5',
    width: 300,
    borderRadius: 10,
    flexDirection: 'row',
  },
});