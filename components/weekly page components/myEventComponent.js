import React from 'react';
import { Text } from 'react-native';
import WeekView from 'react-native-week-view';

const MyEventComponent = ({ event }) => (
  <>
    {/* <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{event.title}</Text> */}
    <Text style={{ fontSize: 15, fontFamily: 'spacemono-bold' }}>{event.description}</Text>
    {/* <Text style={{ fontSize: 15, fontFamily: 'spacemono-bold' }} >{event.startDate}</Text>
    <Text style={{ fontSize: 15, fontFamily: 'spacemono-bold' }}>{event.endDate}</Text> */}
  </>
);

export default MyEventComponent;
