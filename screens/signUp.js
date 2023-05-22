import React, {useState} from 'react';
import { Text, View, SafeAreaView, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function SignUpScreen({ navigation }) {

    //const[name, setName] = useState('');
    const[email, setEmail] = useState('');
    const[password, setPassword] = useState('');
    const[confirmPassword, setConfirmPassword] = useState('');


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
            <TouchableOpacity style={styles.signUpButton} onPress = {() => navigation.goBack()}>
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
    