import React, {useState} from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, TextInput} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
      <SafeAreaView style={styles.background}>
               
        <Text style={styles.helplah}>HelpLah!</Text>

        <View style={styles.inputButton}>
            <Ionicons name='mail-outline' color='black' size={15} paddingRight={10}/>
            <TextInput
                value = {email} 
                style = {{fontFamily: 'spacemono', flexGrow: 1, paddingRight: 20}}
                placeholder = "Email..."
                onChangeText = {(email) => setEmail(email)}
            />
        </View>
        
        <View style = {styles.inputButton}>
            <Ionicons name='key-outline' color='black' size={15} paddingRight={10}/>
            <TextInput
                value = {password}
                style = {{fontFamily: 'spacemono', flexGrow: 1}}
                placeholder = "Password..."
                onChangeText = {(password) => setPassword(password)}
            />
        </View>
  
        <View style = {{ paddingTop: 15, paddingBottom: 15 }}>
          <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')} style={styles.signInButton}>
            <Text style={{fontFamily: 'spacemono-bold'}}>Sign In</Text>
          </TouchableOpacity>
        </View>
  
        <View style = {{ paddingTop: 10, paddingBottom: 15 }}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUpScreen')}>
            <Text style={{fontFamily: 'spacemono-bold', color: '#86C68C'}}>Sign Up</Text>
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

    helplah: {
        fontFamily: 'spacemono-bold', 
        fontSize: 25,
        paddingBottom: 70,
    },

    signInButton: {
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