import React from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';

export default function WeeklyScreen({navigation}) {

  return (
      <SafeAreaView style={styles.background}>
        <Text style={{fontFamily: 'spacemono-bold'}}>Weekly Page</Text>
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