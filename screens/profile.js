import React from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';

export default function ProfileScreen({navigation}) {

  return (
      <SafeAreaView style={styles.background}>
        <Text style={{fontFamily: 'spacemono-bold'}}>Profile Page</Text>
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

})