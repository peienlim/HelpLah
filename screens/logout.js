import React from 'react';
import { StyleSheet, Text, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import { getAuth, signOut } from "firebase/auth";

export default function LogOutScreen({navigation}) {

    const auth = getAuth();

    async function handleSignOut() {
      try {
        await signOut(auth);
        await navigation.navigate("LoginScreen")

      } catch(error) {
        Alert.alert("Try again")
      }
    }

    return (
      <SafeAreaView style={styles.background}>
        <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton} >
            <Text style={{fontFamily: 'spacemono-bold'}}>Sign Out</Text>
        </TouchableOpacity>
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

  signOutButton: {
    backgroundColor: '#9AC791',
    borderColor: '#9AC791',
    height: 35,
    width: 200,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
},

})