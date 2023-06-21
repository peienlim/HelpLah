import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';

export default function DailyView() {
    return (
        <View style={styles.dailyview}>
          <Text style={styles.header}>Today's Schedule</Text>
          <ScrollView>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
            <Text>contents for scrolling</Text>
          </ScrollView>
        </View>
    )

}

const styles = StyleSheet.create({
    dailyview: {
        paddingTop: 20,
        flex: 6.5,
        // backgroundColor:"blue"
    }, 
    header: {
      fontFamily: "spacemono-bold", 
      fontSize: 13.5,
    }
}
)