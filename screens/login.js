import React, {useState} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, TextInput, Alert, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTogglePwVisibility } from '../hook/useTogglePwVisibility';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const { pwVisibility, rightIcon, handlePwVisibility } =
      useTogglePwVisibility();
    const [password, setPassword] = useState('');
    
    async function handleSignIn() {
      if (email === '' || password === '') {
        Alert.alert("Both email and password are required!");
        return;
      }

      try {
        await signInWithEmailAndPassword(auth, email, password);
        await navigation.navigate('TabStack');
        setEmail("");
        setPassword("");

      } catch(error) {
        Alert.alert("Check your email and password!");
      }
    }

    return (
      <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
      }}>
        <SafeAreaView style={styles.background}>
                  
          <Text style={styles.helplah}>HelpLah!</Text>

          <View style={styles.inputButton}>
              <Ionicons name='mail-outline' color='black' size={15} paddingRight={10}/>
              <TextInput
                  value = {email} 
                  style = {{fontFamily: 'spacemono', flexGrow: 1, paddingRight: 20, fontSize: 13}}
                  placeholder = "Email..."
                  onChangeText = {(email) => setEmail(email)}
              />
              
          </View>
          
          <View style = {styles.inputButton}>
              <Ionicons name='key-outline' color='black' size={15} paddingRight={10}/>
              <TextInput
                  value = {password}
                  style = {{fontFamily: 'spacemono', flexGrow: 1, fontSize: 13}}
                  placeholder = "Password..."
                  onChangeText = {(password) => setPassword(password)}
                  secureTextEntry={pwVisibility}
              />
              <Pressable onPress={handlePwVisibility}>
                <Ionicons name={rightIcon == 'eye' ? 'eye' : 'eye-off'} color='black' size={15} paddingRight={10}/>
              </Pressable>
          </View>

          <View style = {{ paddingTop: 15, paddingBottom: 15 }}>
            <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
              <Text style={{fontFamily: 'spacemono-bold', fontSize: 13}}>Sign In</Text>
            </TouchableOpacity>
          </View>

          <View style = {{ paddingTop: 10, paddingBottom: 15 }}>
            <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
              <Text style={{fontFamily: 'spacemono-bold', color: '#86C68C', fontSize: 13}}>Sign Up</Text>
            </TouchableOpacity>
          </View>
      
        </SafeAreaView>
      </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'white', 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
    },

    helplah: {
        fontFamily: 'spacemono-bold', 
        fontSize: 25,
        paddingBottom: 70,
    },

    signInButton: {
        backgroundColor: '#9AC791',
        borderColor: '#9AC791',
        height: 35,
        width: 175,
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