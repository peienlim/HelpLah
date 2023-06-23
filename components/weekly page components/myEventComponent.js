import React from 'react';
import { Text } from 'react-native';
import WeekView from 'react-native-week-view';

const MyEventComponent = ({ event }) => (
  <>
    <Text style={{ fontSize: 15, fontFamily: 'spacemono-bold' }}>{event.description}</Text>
    <Text style={{ fontSize: 12, fontFamily: 'spacemono' }}>
      {event.startDate.getHours() < 10 ? "0" + event.startDate.getHours() : event.startDate.getHours()}:{event.startDate.getMinutes() < 10 ? "0" + event.startDate.getMinutes() : event.startDate.getMinutes()}
      - 
      {event.endDate.getHours() < 10 ? "0" + event.endDate.getHours() : event.endDate.getHours()}:{event.endDate.getMinutes() < 10 ? "0" + event.endDate.getMinutes() : event.endDate.getMinutes()}
    </Text>
  </>
);

export default MyEventComponent;
