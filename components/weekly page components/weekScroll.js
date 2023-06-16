import React from 'react';
import { StyleSheet, View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';

const WeekScroll = () => (
    <View style={styles.exampleContainer}>
      <CalendarStrip
        scrollable
        style={styles.calendarStrip}
        calendarColor={'#5a5a5a'}
        calendarHeaderStyle={{color: 'white', fontFamily: 'spacemono-bold'}}
        dateNumberStyle={{color: 'white', fontFamily: 'spacemono'}}
        dateNameStyle={{color: 'white', fontFamily: 'spacemono'}}
        iconContainer={{flex: 0.1}}
      />
    </View>
);


const styles = StyleSheet.create({
    exampleContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        height: 99
    },
    calendarStrip: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 10,
        fontFamily: 'spacemono'
    },
})

export default WeekScroll;