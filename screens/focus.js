import React, {useState} from 'react';
import { StyleSheet, Text, SafeAreaView, View, StatusBar, TouchableOpacity, Modal, Button, TextInput } from 'react-native';

import CountDownTimer from '../components/countdownTimer';
import DateTimePicker from '@react-native-community/datetimepicker';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import {SelectList} from 'react-native-dropdown-select-list';
import Ionicons from '@expo/vector-icons/Ionicons';


export default function FocusScreen({navigation}) {
  const [showModal, setShowModal] = useState(false);
  /* const [selectedTime, setSelectedTime] = useState(new Date()); */
  const [min, setMin] = useState(0);
  
  const minIntervals = [
    {key: '1', value: 5},
    {key: '2', value: 10},
    {key: '3', value: 15},
    {key: '4', value: 20},
    {key: '5', value: 25},
    {key: '6', value: 30},
    {key: '7', value: 35},
    {key: '8', value: 40},
    {key: '9', value: 45},
    {key: '10', value: 50},
    {key: '11', value: 55},
    {key: '12', value: 60},
    {key: '13', value: 65},
    {key: '14', value: 70},
    {key: '15', value: 75},
    {key: '16', value: 80},
    {key: '17', value: 85},
    {key: '18', value: 90},
    {key: '19', value: 95},
    {key: '20', value: 100},
    {key: '21', value: 105},
    {key: '22', value: 110},
    {key: '23', value: 115},
    {key: '24', value: 120},
  ]


  //duration should be in seconds
  return (
    <SafeAreaView style ={styles.background}>

      <View style={{paddingTop: 300}}>
        <Text style={{fontFamily: "spacemono-bold", fontSize: 25}}>FOCUS TIMER</Text>
      </View>

      <TouchableOpacity onPress={() => setShowModal(true)}>
          <Text style={{fontFamily: 'spacemono', color: '#9AC791'}}>Select Time</Text>
      </TouchableOpacity>

      
      <Modal
          visible={showModal}
          animationType="slide"
          transparent={false}
          onRequestClose={() => setShowModal(false)}
          animation='slide'
        >
          <View style={styles.modalContainer}>
            
            <Text style ={{fontFamily: 'spacemono', padding: 10}}>Number of mins...</Text>
            <SelectList
              setSelected={(val) => setMin(val)}
              data = {minIntervals}
              save = 'value'
              boxStyles = {{backgroundColor: '#E5E5E5', height: 40, borderColor: '#E5E5E5', flexDirection: 'row', width: 150, paddingTop: 7, paddingLeft: 15}}
              searchPlaceholder='min'
              searchicon = {<Ionicons name="alarm" color='black' paddingRight={5} size={15}/>}
              inputStyles={{fontFamily: 'spacemono', fontSize: 13, color: 'black'}}
              label = "Min"
              dropdownTextStyles={{fontFamily: 'spacemono', fontSize: 13}}
            />

            <View style={{padding: 15}}>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Text style={{fontFamily: 'spacemono-bold', color: '#9AC791'}}>Done</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Modal>

      <View style={{paddingBottom: 300}}>
        
        <CountDownTimer duration={min > 0 ? min * 60 : 15 * 60}/> 
         
      </View>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  background: {
    backgroundColor: 'white', 
    alignItems: 'center', 
    justifyContent: 'center',
    flex: 1,
    marginTop: StatusBar.currentHeight
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignItems: 'center'
  },
});