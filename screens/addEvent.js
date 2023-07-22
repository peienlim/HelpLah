import { View, Modal, Text, TouchableOpacity, StyleSheet, TextInput, Button, Platform, SafeAreaView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react'
 
import Ionicons from '@expo/vector-icons/Ionicons';

import DateTimePicker from '@react-native-community/datetimepicker';
import { SelectList } from 'react-native-dropdown-select-list';

import { getAuth } from 'firebase/auth';
import { db } from '../firebaseConfigDB';
import { doc, setDoc, collection, onSnapshot } from 'firebase/firestore';
import { addFirestoreSubscription } from '../FirestoreManager';

import { generateUUID } from '../hook/generateUUID';


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

    const [uploadedBefore, setUploadedBefore] = useState(false);

    const [category, setCategory] = useState("");
    const categories = [
      {key: '1', value: 'class'},
      {key: '2', value: 'event'},
      {key: '3', value: 'others'},
      {key: '4', value: 'task'},
    ]

    const [selectedColour, setSelectedColour] = useState("grey");
    const [showColourPicker, setShowColourPicker] = useState(true);
     
    const colours = [
      {key: '1', value: 'red'},
      {key: '2', value: 'orange'},
      {key: '3', value: 'yellow'},
      {key: '4', value: 'green'},
      {key: '5', value: 'blue'},
      {key: '6', value: 'purple'},
      {key: '7', value: 'pink'},
      {key: '8', value: 'grey'},
    ];
    
    // Helper function to map color names to hex codes
    const mapColorsToHex = (color) => {
      if (color === 'red') {
        return '#FF9191';
      } else if (color === 'orange') {
        return '#FFC891';
      } else if (color === 'yellow') {
        return '#F7DC6F';
      } else if (color === 'green') {
        return '#9FE2BF';
      } else if (color === 'blue') {
        return '#AED6F1';
      } else if (color === 'purple') {
        return '#CCCCFF';
      } else if (color === 'pink') {
        return '#FADBD8';
      } else if (color === 'grey') {
        return '#808080';
      } else {
        return '#808080';
      }
    };

    // Retrieve User's email from Firebase authentication
    const auth = getAuth();
    const userEmail = auth.currentUser.email;

    const getDescr = (descr, category) => {
      if (category === 'task') {
        return 'T: ' + descr;
      } else if (category === 'event') {
        return 'E: ' + descr;
      } else if (category === 'class') {
        return 'C: ' + descr;
      } else if (category === 'others') {
        return 'O: ' + descr;
      } else {
        return descr;
      }
    }

    const [mod, setMod] = useState({});
    const [modules, setModules] = useState({});
    const [selectedMod, setSelectedMod] = useState('default');

    // get modules that user has uploaded 
    const getMods = () => {
      try {
        modsRef = collection(db, 'users', userEmail, 'modules') 

        const unsubscribe = onSnapshot(modsRef, (querySnapshot) => {
          const modData = querySnapshot.docs.map((doc) => doc.data());
          const moduleData = modData.map((entry, index) => ({
            key: index + 1,
            modName: entry.mod,
            colour: entry.colour,
            id: entry.id
          })); 

          if (moduleData.length > 0) {
            setUploadedBefore(true);
            setShowColourPicker(false);
          }

          setMod(moduleData);

          modsKVPairs = getModKVPair(moduleData);
          setModules(modsKVPairs);

        });

        addFirestoreSubscription(unsubscribe);
        return unsubscribe;

      } catch (error) {
        Alert.alert('Something went wrong: ', error);
        console.log(error);
      }
    }

    useEffect(() => {
      getMods();
    }, []);

    // get module kv pair for modules drop down bar 
    const getModKVPair = (moduleData) => {
      const updatedModules = moduleData.map((entry) => ({
        key: entry.key,
        value: entry.modName
      }));

      updatedModules.push({ key: (moduleData.length + 1).toString(), value: 'others'});
      return updatedModules;
    }


    // adds Event Data into a subcollection of users data
    async function handleAddEvent() {
      if (descr === "") {
        Alert.alert("Description needed!")
        return;
      }

      if (category === "") {
        Alert.alert("Category needed!")
        return;
      }

      if (date.getDate() > endDate.getDate()) {
        Alert.alert("StartDate is later than EndDate")
        return;
      }

      if (date.getDate() === endDate.getDate() && date.getTime() > endDate.getTime()) {
        Alert.alert("StartTime is later than EndTime")
        return;
      }

      if (date.getDate() === endDate.getDate() && date.getTime() === endDate.getTime()) {
        Alert.alert("StartDate and EndDate is exactly the same!")
        return;
      }

      if (selectedMod === "default" && uploadedBefore) {
        Alert.alert("Module needed!")
        return;
      }

      try {
        const uniqueID = generateUUID(15);
        const docRef = doc(db, 'users', userEmail, "events", uniqueID);
        await setDoc(docRef, {
          id: uniqueID,
          description: getDescr(descr, category),
          startDate: date,
          endDate: endDate,
          category: category,
          colour: selectedColour,
          completed: false, 
          nusmods: false, 
          module: selectedMod,
        });
        await navigation.goBack();
      } catch(error) {
        console.log(error);
      }
    }

    // helper function to set selected colour based on module chosen
    const setModAndColour = (modd) => {
      setSelectedMod(modd);
      const moduleEntry = mod.find((entry) => entry.modName === modd);

      if (moduleEntry) {
        setSelectedColour(moduleEntry.colour);
        return;
      }

      // to open colour picker for user to select colour 
      if (modd === 'others') {
        setShowColourPicker(true);
        return;
      }

      setSelectedColour('grey');
      return;

    }


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
        transparent={false}>
          
          <TouchableOpacity style={{ paddingLeft: 15, paddingTop: 30 }} onPress={() => navigation.goBack()}>
            <Ionicons name='arrow-back' color='black' size={25} paddingRight={10}/>
          </TouchableOpacity>

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>

            <Text style={{fontFamily:'spacemono-bold', fontSize: 25, paddingBottom: 35, paddingRight: 200}}>Add Task</Text>

            <View style={styles.inputButton}>
              <Ionicons name="happy-outline" color='black' size={15} paddingRight={10} paddingTop={2}/>
              <TextInput
                value={descr}
                style = {{fontFamily: 'spacemono', flexGrow: 1, fontSize: 13}}
                placeholder = "Event/Task description..."
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
                minuteInterval={5}
                display="default"
                onChange={dateType === 'start' ? handleSetDate : handleSetEndDate}
                themeVariant={'light'}
              />
            )}

            <Text style = {{fontFamily: 'spacemono', color:'#989898', fontSize: 13, paddingTop: 10 }}>Select Category...</Text>
            <SelectList
              setSelected={(val) => setCategory(val)}
              data = {categories}
              save = 'value'
              boxStyles = {{backgroundColor: '#E5E5E5', height: 40, borderColor: '#E5E5E5', flexDirection: 'row', width: 300, paddingTop: 7, paddingLeft: 15}}
              searchPlaceholder='Select Category...'
              searchicon = {<Ionicons name="cube-outline" color='black' paddingRight={5} size={15}/>}
              inputStyles={{fontFamily: 'spacemono', fontSize: 13, color: 'black'}}
              label = "Category..."
              dropdownTextStyles={{fontFamily: 'spacemono', fontSize: 13}}
            />

            {uploadedBefore && (
              <View style={{ alignItems: 'center', paddingTop: 10 }}> 
                <Text style = {{fontFamily: 'spacemono', color:'#989898', fontSize: 13 }}>Select Module...</Text>
                <SelectList
                  setSelected={(val) => setModAndColour(val)}
                  data = {modules}
                  save = 'value'
                  boxStyles = {{backgroundColor: '#E5E5E5', height: 40, borderColor: '#E5E5E5', flexDirection: 'row', width: 300, paddingTop: 7, paddingLeft: 15}}
                  searchPlaceholder='Select Module...'
                  searchicon = {<Ionicons name="cube-outline" color='black' paddingRight={5} size={15}/>}
                  inputStyles={{fontFamily: 'spacemono', fontSize: 13, color: 'black'}}
                  label = "Module..."
                  dropdownTextStyles={{fontFamily: 'spacemono', fontSize: 13}}
                />
              </View>
            )}

            {showColourPicker && (
              <View style={{ alignItems: 'center', paddingTop: 10 }}>
                <Text style = {{fontFamily: 'spacemono', color:'#989898', fontSize: 13 }}>Select Colour...</Text>
                <SelectList
                  setSelected={(val) => setSelectedColour(mapColorsToHex(val))}
                  data = {colours}
                  save = 'value'
                  boxStyles = {{backgroundColor: '#E5E5E5', height: 40, borderColor: '#E5E5E5', flexDirection: 'row', width: 300, paddingTop: 7, paddingLeft: 15}}
                  searchPlaceholder='Select Colour...'
                  searchicon = {<Ionicons name="color-palette" color='black' paddingRight={5} size={15}/>}
                  //defaultOption={{key: '8', value: 'grey'}}
                  inputStyles={{fontFamily: 'spacemono', fontSize: 13, color: selectedColour}}
                  label = "Colour..."
                  dropdownTextStyles={{fontFamily: 'spacemono', fontSize: 13}} 
                />
              </View>
            )}

            <View style={{paddingTop: 50}}>
              <TouchableOpacity style={styles.createButton} onPress={handleAddEvent}>
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
    dropdownOption: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 5,
      paddingHorizontal: 10,
    },
    dropdownOptionText: {
      fontFamily: 'spacemono',
      fontSize: 13,
      marginLeft: 5,
    }
      
});