import React from 'react';
import { StyleSheet, Text, SafeAreaView, ScrollView, View } from 'react-native';
import { color } from 'react-native-reanimated';
import { withSafeAreaInsets } from 'react-native-safe-area-context';

import DailyView from '../components/home page components/dailyView';
import Event from '../components/home page components/Event';
import Class from '../components/home page components/Class';


export default function HomeScreen({navigation}) {

  return (
      <SafeAreaView style={styles.background}>

        <View style={styles.top}> 
          <Text style={styles.hello}>Hello Lily!</Text>
          <Text style={styles.date}>Mon, 12 June 2023</Text>
        </View>

        <View style={styles.todayce}>

          <View style={{flex:1}}>
            <View>
              <Text style={styles.header}>Today's Classes</Text>
              <ScrollView>
                <Class/>
                <Class/>
                <Class/>
              </ScrollView>
            </View>
          </View>

          <View style={{flex:1}}>
            <View>
              <Text style={styles.header}>Today's Events</Text>
              <ScrollView>
                <Event/>
                <Event/>
                <Event/>
                <Event/>
              </ScrollView>
            </View>
          </View>
          
        </View>


        <DailyView/>

        <View style={styles.phc}>
          <View style={{flex:1}}>
            <Text style={styles.header}>Productive Hours:</Text>
            <View style={styles.phccontainer}>
              <Text style={styles.phctext}>3 hours!</Text>
            </View>
          </View>

          <View style={{flex:1}}>
            <Text style={styles.header}>Completed:</Text>
            <View style={styles.phccontainer}>
              <Text style={styles.phctext}>3/5!</Text>
            </View>
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
  },
  top: {
    flex: 1,
    paddingTop: 20,
  },
  hello: {
    fontFamily: 'spacemono-bold',
    fontSize: 25,
  },
  date: {
    fontFamily:"spacemono",
    fontSize: 12
  },
  
  todayce: {
    flexDirection:"row",
    flex: 2,
  },

  phc: {
    paddingTop: 15,
    flexDirection:"row",
    flex: 1,
  },
  phccontainer: {
    flex: 0.8,
    backgroundColor: "#E5E5E5",
    width: "78%",
    borderRadius: 10,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center",
    paddingLeft: 6,
  },
  phctext: {
    fontFamily:"spacemono",
    fontSize: 12
  },
  header: {
    fontFamily:"spacemono-bold", 
    fontSize:13.5,

  }, 


})