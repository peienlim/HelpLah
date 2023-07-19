import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Class() {
  return (
      <View style={styles.container}>
        <Text style={styles.class}>Class</Text>
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
class: {
  flex: 1,
  fontFamily: 'spacemono',
  fontSize: 10,
  marginLeft: 3,
}
}
)