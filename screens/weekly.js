/* import React from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';
import AgendaScreen from '../components/agenda';

export default function WeeklyScreen({navigation}) { 
  return (
    <SafeAreaView>
      <AgendaScreen
      />
    </SafeAreaView>
  );
}; 

import React, { Component } from 'react';
import { Alert, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Agenda } from 'react-native-calendars';

export default class WeeklyScreen extends Component {
  state = {
    items: undefined,
  };

  render() {
    return (
      <Agenda
        items={this.state.items}
        loadItemsForMonth={this.loadItems}
        selected={'2023-05-16'}
        renderItem={this.renderItem}
        renderEmptyDate={this.renderEmptyDate}
        rowHasChanged={this.rowHasChanged}
        showClosingKnob={true}
      />
    );
  }

  loadItems = (day) => {
    const items = this.state.items || {};

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = this.timeToString(time);

        if (!items[strTime]) {
          items[strTime] = [];

          const numItems = Math.floor(Math.random() * 3 + 1);
          for (let j = 0; j < numItems; j++) {
            items[strTime].push({
              name: 'Item for ' + strTime + ' #' + j,
              height: Math.max(50, Math.floor(Math.random() * 150)),
              day: strTime,
            });
          }
        }
      }

      const newItems = {};
      Object.keys(items).forEach((key) => {
        newItems[key] = items[key];
      });
      this.setState({
        items: newItems,
      });
    }, 1000);
  };

  renderItem = (reservation, isFirst) => {
    const fontSize = isFirst ? 16 : 14;
    const color = isFirst ? 'black' : '#43515c';
    const fontFamily = "spacemono-bold"

    return (
      <TouchableOpacity
        style={[styles.item, { height: reservation.height }]}
        onPress={() => Alert.alert(reservation.name)}
      >
        <Text style={{ fontSize, color, fontFamily}}>{reservation.name}</Text>
      </TouchableOpacity>
    );
  };

  renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  rowHasChanged = (r1, r2) => {
    return r1.name !== r2.name;
  };

  timeToString(time) {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  }
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30,
  },
});
*/



/* const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white', 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
  },

}) */

import React, { Component, ReactElement } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import WeekView from "react-native-week-view";
import MyEventComponent from '../components/weekly page components/myEventComponent';
import CalendarStrip from 'react-native-calendar-strip';
import WeekScroll from '../components/weekly page components/weekScroll';


const myEvents = [
  {
    id: 1,
    startDate: new Date(2023, 1, 20, 9),
    endDate: new Date(2023, 1, 20, 11),
    color: '#D3D3D3',
    description: 'E1',
    // ... more properties if needed,
  },
  {
    id: 2,
    startDate: new Date(2023, 1, 22, 10),
    endDate: new Date(2023, 1, 22, 11, 30),
    color: '#D3D3D3',
    description: 'E2',
    title: 'hi',
  },
  // more events...
];


class WeeklyScreen extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>

          <WeekScroll 
            style={styles.exampleContainer}
          />

          <View style={styles.weekViewContainer}>
            <WeekView
              events={myEvents}
              EventComponent={MyEventComponent}
              selectedDate={new Date(2023, 1, 20, 12)}
              numberOfDays={1}
              pageStartAt={{ weekday: 1 }}
              headerStyle={styles.weekViewHeader}
              headerTextStyle={styles.headerText}
              hourTextStyle={styles.hourText}
              eventContainerStyle={styles.eventContainer}
              gridColumnStyle={styles.gridColumn}
              gridRowStyle={styles.gridRow}
              hourContainerStyle={styles.hourContainer}
              formatDateHeader='ddd D'
              allowScrollByDay={true}
              hoursInDisplay={6}
              timeStep={30}
              timesColumnWidth={0.16}
            />
          </View>

        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  exampleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    height: 100
  },
  calendarStrip: {
    flex: 1,
    paddingTop: 20,
    paddingBottom: 10,
    fontFamily: 'spacemono'
  },
  weekViewContainer: {
    flex: 1,
  },
  weekViewHeader: {
    height: 100,
  },
  headerText: {
    fontFamily: 'spacemono',
    fontSize: 10,
  },
  hourText: {
    fontFamily: 'spacemono',
  },
  eventContainer: {
    borderRadius: 10,

  },
  gridColumn: {
    
  }, 
  gridRow: {
    
  }, 
  hourContainer: {

  },
})

export default WeeklyScreen;
