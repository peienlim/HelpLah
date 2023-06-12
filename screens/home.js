import React from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, View } from 'react-native';
import { color } from 'react-native-reanimated';
import { withSafeAreaInsets } from 'react-native-safe-area-context';


export default function HomeScreen({navigation}) {

  return (
      <SafeAreaView style={styles.background}>

        <View style={styles.top}> 
          <Text style={{fontFamily: 'spacemono-bold'}}>Home Page</Text>
          <Text style={styles.hello}>Hello Lily!</Text>
          <Text style={styles.date}>Mon, 12 June 2023</Text>
        </View>

        <View style={styles.todayce}>
          <ScrollView>
            <Text style={{justifyContent:"flex-start"}}>classes</Text>
          </ScrollView>
          <ScrollView>
            <Text style={{justifyContent:"flex-end"}}>today's events:</Text>
          </ScrollView>
        </View>

        <View style={styles.dailyview}>
          <Text>daily view</Text>
          <ScrollView>
            <Text>contents for scrolling</Text>
          </ScrollView>
        </View>

        <View style={styles.phc}>
          <View style={{flex:1}}>
            <Text style={{justifyContent:"flex-start"}}>productive hours:</Text>
          </View>

          <View style={{flex:1}}>
            <Text style={{justifyContent:"flex-end"}}>completed:</Text>
          </View>
        </View>

      </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white', 
    flex: 1, 
    paddingTop: 40,
    paddingHorizontal: 20,
    // justifyContent: 'flex-start'
    // alignItems: 'center', 
    // justifyContent: 'center',
  },
  top: {
    flex: 1,
    // backgroundColor: 'red'
  },
  hello: {
    // flex: 1
  },
  date: {
    // flex: 1
  },
  todayce: {
    flexDirection:"row",
    flex: 2,
    // backgroundColor:"white"
  },
  dvheader: {
    flex: 1
  },
  dailyview: {
    flex: 5,
    // backgroundColor:"blue"
  }, 
  phc: {
    flexDirection:"row",
    flex: 2,
    // backgroundColor:'green'
  }


})