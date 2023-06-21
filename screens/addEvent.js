import { View, Modal, Text, TouchableOpacity, StyleSheet, TextInput, Button, Platform, SafeAreaView } from 'react-native';
import React, {useState} from 'react'
 
import Ionicons from '@expo/vector-icons/Ionicons';

import DateTimePicker from '@react-native-community/datetimepicker';

import {SelectList} from 'react-native-dropdown-select-list'


export default function AddEvent({navigation}) {
    // boolean value to set modal visibility
    const [modalVisible, setModalVisible] = useState(true);

    // Input fields for a Task Event
    const [descr, setDescr] = useState('');
    const [date, setDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [dateType, setDateType] = useState('');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const [selected, setSelected] = useState('');
    const colours = [
      {key: '1', value: 'red'},
      {key: '2', value: 'orange'},
      {key: '3', value: 'yellow'},
      {key: '4', value: 'green'},
      {key: '5', value: 'blue'},
      {key: '6', value: 'purple'},
      {key: '7', value: 'pink'},
      {key: '8', value: 'grey'},
    ]

    // Set the Start Date 
    const handleSetDate = (event, selectedDate) => {
      const currentDate = selectedDate || date;
  
      setShow(Platform.OS === 'ios');
      setDate(currentDate);
    };

    // Set the End Date
    const handleSetEndDate = (event, selectedDate) => {
      const currDate = selectedDate || endDate;

      setShow(Platform.OS === 'ios');
      setEndDate(currDate);
    }

    // Shows Picker, Sets Mode and Sets dateType
    const showPicker = (pickerMode, dateType) => {
      setShow(true);
      setMode(pickerMode);
      setDateType(dateType);
    };
  
    // Shows Date Picker
    const showDatePicker = (dateType) => {
      showPicker('date', dateType);
    };
  
    // Shows Time Picker
    const showTimePicker = (dateType) => {
      showPicker('time', dateType);
    };  

    return (

      <Modal 
        isVisible={modalVisible} 
        animationType='slide' 
        onRequestClose={()=> navigation.goBack()} 
        statusBarTranslucent={false} 
        transparent={true}>
  
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>

            <Text style={{fontFamily:'spacemono-bold', fontSize: 25, paddingBottom: 35, paddingRight: 200}}>Add Task</Text>

            <View style={styles.inputButton}>
              <Ionicons name="happy-outline" color='black' size={15} paddingRight={10} paddingTop={2}/>
              <TextInput
                value={descr}
                style = {{fontFamily: 'spacemono', flexGrow: 1, fontSize: 13}}
                placeholder = "Task description..."
                onChangeText = {(descr) => setDescr(descr)}
              />
            </View>

            <View style={styles.inputButton}>
              <Ionicons name="calendar" color='black' size={15} paddingRight={10} paddingTop={2}/>
              <Text style = {styles.textBold}>Start Date: </Text>
              <TouchableOpacity onPress={() => showDatePicker('start')} activeOpacity={1.5}>
                <Text style = {styles.text}>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputButton}>
              <Ionicons name="alarm" color='black' size={15} paddingRight={10} paddingTop={2}/>
              <Text style = {styles.textBold}>Start Time: </Text>
              <TouchableOpacity onPress={() => showTimePicker('start')} activeOpacity={1.5}>
                <Text style = {styles.text}>{date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:{date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputButton}>
              <Ionicons name="calendar" color='black' size={15} paddingRight={10} paddingTop={2}/>
              <Text style = {styles.textBold}>End Date: </Text>
              <TouchableOpacity onPress={() => showDatePicker('end')} activeOpacity={1.5}>
                <Text style = {styles.text}>{endDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputButton}>
              <Ionicons name="alarm" color='black' size={15} paddingRight={10} paddingTop={2}/>
              <Text style = {styles.textBold}>End Time: </Text>
              <TouchableOpacity onPress={() => showTimePicker('end')} activeOpacity={1.5}>
                <Text style = {styles.text}>{endDate.getHours() < 10 ? "0" + endDate.getHours() : endDate.getHours()}:{endDate.getMinutes() < 10 ? "0" + endDate.getMinutes() : endDate.getMinutes()}</Text>
              </TouchableOpacity>
            </View>

            {show && (
              <DateTimePicker
                value={dateType === 'start' ? date : endDate}
                mode={mode}
                is24Hour={true}
                display="default"
                onChange={dateType === 'start' ? handleSetDate : handleSetEndDate}
              />
            )}

            <Text style = {{fontFamily: 'spacemono', color:'#989898', fontSize: 13 }}>Select Colour...</Text>
            <SelectList
              setSelected={(val) => setSelected(val)}
              data = {colours}
              save = 'value'
              boxStyles = {{backgroundColor: '#E5E5E5', height: 40, borderColor: '#E5E5E5', flexDirection: 'row', width: 300, paddingTop: 7, paddingLeft: 15}}
              searchPlaceholder='Select Colour...'
              searchicon = {<Ionicons name="color-palette" color='black' paddingRight={5} size={15}/>}
              defaultOption={{key: '8', value: 'grey'}}
              inputStyles={{fontFamily: 'spacemono', fontSize: 13, color: selected}}
              label = "Colour..."
              dropdownTextStyles={{fontFamily: 'spacemono', fontSize: 13}}
            />

            <View style={{paddingTop: 50}}>
              <TouchableOpacity style={styles.createButton} >
                <Text style={{fontFamily: 'spacemono-bold', fontSize:13}}>Add</Text>
              </TouchableOpacity>
            </View>

          </View>
          
      </Modal>
    );
};        


const styles = StyleSheet.create({
    background: {
      backgroundColor: 'white', 
      flex: 1, 
      alignItems: 'center', 
      justifyContent: 'center',
    },
    text: {
      fontFamily: 'spacemono',  
      fontSize: 13,
    },
    textBold: {
      fontFamily: 'spacemono-bold',  
      fontSize: 13,
    },
    createButton: {
      backgroundColor: '#9AC791',
      borderColor: '#9AC791',
      height: 35,
      width: 150,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    },
  
    inputButton: {
      backgroundColor: '#E5E5E5', 
      height: 40,
      margin: 12,
      borderWidth: 1,
      padding: 10,
      borderColor: '#E5E5E5',
      width: 300,
      borderRadius: 10,
      flexDirection: 'row',
    },
});




  // submit data
    /* async function addEvent() {
  
       try { 
          const docRef = await addDoc(collection(db, "events"), {
            title: title,
            type: type,
            modType: modType,
            duration: duration,
        });
        console.log("Document written with ID: ", docRef.id);
      } catch(error) {
        console.log(error);
      }
    } */

/*     const [modalVisible, setModalVisible] = useState(true);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
      const currentDate = selectedDate;
      setShow(false);
      setDate(currentDate);
    };

    const showMode = (currentMode) => {
      if (Platform.OS === 'android') {
        setShow(false);
        // for iOS, add a button that closes the picker
      }
      setMode(currentMode);
    };
  
    const showDatepicker = () => {
      showMode('date');
    };
  
    const showTimepicker = () => {
      showMode('time');
    };  

    return (
  
        <Modal 
          isVisible={modalVisible} 
          animationType='fade' 
          onRequestClose={()=> navigation.goBack()} 
          statusBarTranslucent={false} 
          transparent={true}>
          
          <Button onPress={showDatepicker} title="Show date picker!" />
          <Button onPress={showTimepicker} title="Show time picker!" />
          <Text>selected: {date.toLocaleString()}</Text>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={date}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
              display={Platform.OS === 'ios' ? 'spinner': 'dafault'}
            />
          )}
  
        </Modal>
    );
}; */


