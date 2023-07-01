import React, {useState} from 'react';
import { StyleSheet, Text, SafeAreaView, View, StatusBar} from 'react-native';

import CountDownTimer from '../components/countdownTimer';

export default function FocusScreen({navigation}) {
  
  return (
    <SafeAreaView style ={styles.background}>

      <View style={{paddingTop: 300}}>
        <Text style={{fontFamily: "spacemono-bold", fontSize: 25}}>FOCUS TIMER</Text>
      </View>

      <View style={{paddingBottom: 300}}>
        <CountDownTimer duration={60}/>
      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white', 
    alignItems: 'center', 
    justifyContent: 'center',
    flex: 1,
    marginTop: StatusBar.currentHeight
  },
});