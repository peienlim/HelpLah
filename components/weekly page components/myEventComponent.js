import React from 'react';
import { Text } from 'react-native';
import WeekView from 'react-native-week-view';

const MyEventComponent = ({ event }) => (
  <>
    <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{event.title}</Text>
    <Text style={{ fontSize: 16, }}>{event.description}</Text>
  </>
);

export default MyEventComponent;
