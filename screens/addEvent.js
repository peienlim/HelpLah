import { View, Modal, Text, TouchableOpacity, StyleSheet, TextInput, Button, Platform, SafeAreaView } from 'react-native';
import React, {useState} from 'react'
 
import Ionicons from '@expo/vector-icons/Ionicons';

import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddEvent({navigation}) {
    const [modalVisible, setModalVisible] = useState(true);
    const [descr, setDescr] = useState('');
    const [date, setDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [dateType, setDateType] = useState('');
    const [mode, setMode] = useState('date');
    const [show, setShow] = useState(false);

    const handleSetDate = (event, selectedDate) => {
      const currentDate = selectedDate || date;
  
      setShow(Platform.OS === 'ios');
      setDate(currentDate);
    };

    const handleSetEndDate = (event, selectedDate) => {
      const currDate = selectedDate || endDate;

      setShow(Platform.OS === 'ios');
      setEndDate(currDate);
    }

    const showPicker = (pickerMode, dateType) => {
      setShow(true);
      setMode(pickerMode);
      setDateType(dateType);
    };
  
    const showDatePicker = (dateType) => {
      showPicker('date', dateType);
    };
  
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
                style = {{fontFamily: 'spacemono', flexGrow: 1, fontSize: 12}}
                placeholder = "Task description..."
                onChangeText = {(descr) => setDescr(descr)}
              />
            </View>

            <View style={styles.inputButton}>
              <Ionicons name="calendar" color='black' size={15} paddingRight={10} paddingTop={2}/>
              <Text>Start Date: </Text>
              <TouchableOpacity onPress={() => showDatePicker('start')} activeOpacity={1.5}>
                <Text>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputButton}>
              <Ionicons name="alarm" color='black' size={15} paddingRight={10} paddingTop={2}/>
              <Text>Start Time: </Text>
              <TouchableOpacity onPress={() => showTimePicker('start')} activeOpacity={1.5}>
                <Text>{date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:{date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputButton}>
              <Ionicons name="calendar" color='black' size={15} paddingRight={10} paddingTop={2}/>
              <Text>End Date: </Text>
              <TouchableOpacity onPress={() => showDatePicker('end')} activeOpacity={1.5}>
                <Text>{endDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.inputButton}>
              <Ionicons name="alarm" color='black' size={15} paddingRight={10} paddingTop={2}/>
              <Text>End Time: </Text>
              <TouchableOpacity onPress={() => showTimePicker('end')} activeOpacity={1.5}>
                <Text>{endDate.getHours() < 10 ? "0" + endDate.getHours() : endDate.getHours()}:{endDate.getMinutes() < 10 ? "0" + endDate.getMinutes() : endDate.getMinutes()}</Text>
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

            <View style={{paddingTop: 50}}>
              <TouchableOpacity style={styles.createButton} >
                <Text style={{fontFamily: 'spacemono-bold', fontSize:15}}>Add</Text>
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
      flexGrow: 1, 
      fontSize: 12,
    },
    createButton: {
      backgroundColor: '#9AC791',
      borderColor: '#9AC791',
      height: 35,
      width: 200,
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


