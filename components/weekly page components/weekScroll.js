import React, { forwardRef, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';

const WeekScroll = forwardRef(({ onDateSelected, selectedDate }, ref ) => {

    const customDatesStyles = [];
    let startDate = Date(); 
    for (let i = 0; i < 6; i++) {
        customDatesStyles.push({
            date: startDate,
            dateNameStyle: styles.dateNameStyle,
            dateNumberStyle: styles.dateNumberStyle,
            dateContainerStyle: { backgroundColor: '#d3d3d3' },
        });
    }

    return (
        <View style={styles.exampleContainer}>
            <CalendarStrip
                scrollable
                style={styles.calendarStrip}
                calendarColor={'#5a5a5a'}
                calendarHeaderStyle={{color: 'white', fontFamily: 'spacemono-bold' }}
                dateNumberStyle={{color: 'white', fontFamily: 'spacemono'}}
                dateNameStyle={{color: 'white', fontFamily: 'spacemono'}}
                iconContainer={{flex: 0.1}}
                startingDate={new Date()}
                onDateSelected={onDateSelected}
                selectedDate={selectedDate}
                customDatesStyles={customDatesStyles}
                ref={ref} 
            />
        </View>
    );
});


const styles = StyleSheet.create({
    dateNameStyle: {
        fontSize: 9, 
        color: 'black',
    },
    dateNumberStyle: {
        fontSize: 12,
        color: 'black',
    },
    exampleContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1,
        height: 90
    },
    calendarStrip: {
        flex: 1,
        paddingTop: 20,
        paddingBottom: 10,
        fontFamily: 'spacemono'
    },
});


export default WeekScroll;