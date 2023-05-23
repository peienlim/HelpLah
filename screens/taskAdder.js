import React from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';

export default function TaskAdderScreen({navigation}) {

  return (
      <SafeAreaView style={styles.background}>
        <Text style={{fontFamily: 'spacemono-bold'}}>Task Adder</Text>
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