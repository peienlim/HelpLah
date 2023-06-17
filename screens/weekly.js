import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import WeekView from "react-native-week-view";
import MyEventComponent from '../components/weekly page components/myEventComponent';
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
    startDate: new Date(2023, 5, 17, 10),
    endDate: new Date(2023, 5, 17, 11, 30),
    color: '#D3D3D3',
    description: 'E2',
    title: 'hi',
  },
  // more events...
];


class WeeklyScreen extends Component {

  constructor(props) {
    super(props);

    this.state = { 
      selectedDate: new Date(),
    }

    this.calendarStripRef = React.createRef();
    this.weekViewRef = React.createRef();
  };

  handleDateSelected = (date) => {
    this.weekViewRef.current.goToDate(date, { animated: true });
    this.weekViewRef.current.scrollToTime(7.8*60, { animated: true });
  };

  handleSwipeNext = (date) => {
    this.setState({ selectedDate: date }); 
    this.weekViewRef.current.scrollToTime(7.8*60, { animated: true });
  };
  
  handleSwipePrev = (date) => {
    this.setState({ selectedDate: date }); 
    this.weekViewRef.current.scrollToTime(7.8*60, { animated: true });
  }

  render() {
    const { selectedDate } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.contentContainer}>

          <WeekScroll 
            forwardedRef={this.calendarStripRef}
            style={styles.exampleContainer}
            onDateSelected={this.handleDateSelected}
            selectedDate={selectedDate}
          />

          <View style={styles.weekViewContainer}>
            <WeekView
              events={myEvents}
              EventComponent={MyEventComponent}
              selectedDate={selectedDate}
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
              ref={this.weekViewRef}
              onSwipeNext={this.handleSwipeNext}
              onSwipePrev={this.handleSwipePrev}
              startHour={7.8}
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
    height: 90,
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
