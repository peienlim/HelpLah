import React, {useState} from 'react';
import { Text, View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUpScreen({ navigation }) {

    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[confirmPassword, setConfirmPassword] = useState('');
    
    const auth = getAuth();

    async function handleSignUp() {
        if (password != confirmPassword) {
            Alert.alert("Confirmed password deos not match");
            return;
        } 

        if (email==="" || password==="" || confirmPassword==="") {
            Alert.alert("All fields are required!");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            await navigation.goBack();
        } catch (error) {
            Alert.alert("Check the validility of your email!");
        }
    }

    return (
    <SafeAreaView style={styles.background}>
        
        <Text style={{fontFamily:'spacemono-bold', fontSize: 25, paddingBottom: 35, paddingRight: 200}}>Sign Up</Text>

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
             />
        </View>

        <View style={styles.inputButton}> 
            <Ionicons name='lock-closed-outline' color='black' size={15} paddingRight={10}/>
            <TextInput
                value = {confirmPassword} 
                style = {{fontFamily: 'spacemono', flexGrow: 1}}
                placeholder = "Confirm Password..."
                onChangeText = {(confirmPassword) => setConfirmPassword(confirmPassword)}
             />
        </View>

        <View style = {{paddingTop: 50}}>
            <TouchableOpacity style={styles.signUpButton} onPress = {handleSignUp}>
                <Text style={{fontFamily: 'spacemono-bold'}}>Sign Up</Text>
            </TouchableOpacity>
        </View>

    </SafeAreaView>
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
    