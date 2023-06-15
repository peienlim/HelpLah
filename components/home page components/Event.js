import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Event() {
  return (
      <View style={styles.container}>
        <Text style={styles.event}>Event</Text>
      </View>
  );

}

const styles = StyleSheet.create({
container: {
  backgroundColor: '#D3D3D3',
  borderRadius: 10,
  width: "85%",
  padding: 5,
  height: 22,
  alignContent: "center",
  marginVertical: 2,
},
event: {
  flex: 1,
  fontFamily: 'spacemono',
  fontSize: 10,
  marginLeft: 3,
}
}
)