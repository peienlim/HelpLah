import React, {useState} from 'react';
import { Text, View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Alert, Pressable, TouchableWithoutFeedback, Keyboard } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useTogglePwVisibility } from '../hook/useTogglePwVisibility';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { db } from '../firebaseConfigDB';
import { doc, setDoc } from 'firebase/firestore';

export default function SignUpScreen({ navigation }) {
    
    const [name, setName] = useState('');
    const[email, setEmail] = useState('');
    const { pwVisibility, rightIcon, handlePwVisibility } =
      useTogglePwVisibility();
    const[password, setPassword] = useState('');
    const[confirmPassword, setConfirmPassword] = useState('');
    
    const auth = getAuth();

    // Firebase authentication & add user data to firestore
    async function handleSignUp() {
        if (password != confirmPassword) {
            Alert.alert("Confirmed password does not match");
            return;
        } 

        if (email==="" || password==="" || confirmPassword==="") {
            Alert.alert("All fields are required!");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await navigation.navigate("LoginScreen");
            await addUser();
        } catch (error) {
            Alert.alert("Check the validity of your email/Password length!");
        }
    }

    async function addUser() {
        try {
            await setDoc(doc(db, "users", email),{
                name: name,
                email: email,
            });
            console.log("New Document for user created");
        } catch(error) {
            console.log(error);
        }
    }

    return (
    <TouchableWithoutFeedback onPress={() => {
        Keyboard.dismiss();
    }}>
        <SafeAreaView style={styles.background}>
            
            <Text style={{fontFamily:'spacemono-bold', fontSize: 25, paddingBottom: 35, paddingRight: 200}}>Sign Up</Text>

            <View style={styles.inputButton}> 
                <Ionicons name='happy-outline' color='black' size={15} paddingRight={10}/>
                <TextInput
                    value = {name} 
                    style = {{fontFamily: 'spacemono', flexGrow: 1}}
                    placeholder = "Name..."
                    onChangeText = {(name) => setName(name)}
                />
            </View>

            <View style={styles.inputButton}> 
                <Ionicons name='mail-outline' color='black' size={15} paddingRight={10}/>
                <TextInput
                    value = {email} 
                    style = {{fontFamily: 'spacemono', flexGrow: 1}}
                    placeholder = "Email..."
                    onChangeText = {(email) => setEmail(email)}
                />
            </View>

            <View style={styles.inputButton}> 
                <Ionicons name='key-outline' color='black' size={15} paddingRight={10}/>
                <TextInput
                    value = {password} 
                    style = {{fontFamily: 'spacemono', flexGrow: 1}}
                    placeholder = "Password..."
                    onChangeText = {(password) => setPassword(password)}
                    secureTextEntry = {pwVisibility}
                />
                <Pressable onPress={handlePwVisibility}>
                <Ionicons name={rightIcon == 'eye' ? 'eye' : 'eye-off'} color='black' size={15} paddingRight={10}/>
                </Pressable>
            </View>

            <View style={styles.inputButton}> 
                <Ionicons name='lock-closed-outline' color='black' size={15} paddingRight={10}/>
                <TextInput
                    value = {confirmPassword} 
                    style = {{fontFamily: 'spacemono', flexGrow: 1}}
                    placeholder = "Confirm Password..."
                    onChangeText = {(confirmPassword) => setConfirmPassword(confirmPassword)}
                    secureTextEntry={pwVisibility}
                />
                <Pressable onPress={handlePwVisibility}>
                <Ionicons name={rightIcon == 'eye' ? 'eye' : 'eye-off'} color='black' size={15} paddingRight={10}/>
                </Pressable>
            </View>

            <View style = {{paddingTop: 50}}>
                <TouchableOpacity style={styles.signUpButton} onPress = {handleSignUp}>
                    <Text style={{fontFamily: 'spacemono-bold'}}>Sign Up</Text>
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

    signUpButton: {
        backgroundColor: '#9AC791',
        borderColor: '#9AC791',
        height: 35,
        width: 200,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
});
    