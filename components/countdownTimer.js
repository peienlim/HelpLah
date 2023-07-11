import React, {useEffect, useState, useRef} from 'react';
import {Text, TouchableOpacity, StyleSheet, View, Animated, Easing, Alert} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';
//import { useNavigation } from '@react-navigation/native';

const CountDownTimer = ({duration, closeModal}) => { // duration units is in seconds
    const [time, setTime] = useState(duration); //duration should be in seconds
    const [isActive, setIsActive] = useState(false);
    //const navigation = useNavigation();

    useEffect(() => {
        let interval = null;
      
        if (isActive && time > 0) {
          interval = setInterval(() => {
            setTime(prevTime => {
              if (prevTime <= 1) {
                // Pomodoro timer is completed
                Alert.alert("You've completed a focus session!", undefined, [
                    {
                      text: 'OK',
                      onPress: () => {
                        clearInterval(interval);
                        setIsActive(false);
                        if (closeModal && typeof closeModal === 'function') {
                            closeModal(); // Close the modal
                        }
                      },
                    },
                  ]);
                return duration;
              }
              return prevTime - 1;
            });
          }, 1000);
        }
      
        return () => clearInterval(interval);
      }, [isActive, time, duration, closeModal]);
      

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const startTimer = () => {
        setTime(duration);
        setIsActive(true);
    };

    /* const stopTimer = () => {
        setIsActive(false);
    };

    const resetTimer = () => {
        setIsActive(false);
        setTime(duration);
    }; */

    return (
        <View style={styles.background}>

            <View style={{padding: 5}}>
                <Text style={{fontFamily: 'spacemono'}}>{moment().format("ddd, DD MMMM YYYY")}</Text>
            </View>

            <TouchableOpacity testID='countdown-timer'>
                <Text style={styles.timerText}> {formatTime(time)} </Text>
            </TouchableOpacity>

            <View style={{flexDirection: "row", paddingTop: 25}}>
                <View style={{padding: 10}}>
                    <TouchableOpacity style={styles.button} onPress={startTimer} testID= 'start-button'>
                        <Text style={{fontFamily:'spacemono-bold'}}>Start</Text>
                    </TouchableOpacity>
                </View>

                {/* <View style={{padding: 10}}>
                    <TouchableOpacity style={styles.button} onPress={stopTimer}>
                        <Text style={{fontFamily:'spacemono-bold'}}>Pause</Text>
                    </TouchableOpacity>
                </View> */}

                {/* <View style={{padding: 10}}>
                    <TouchableOpacity style={styles.button} onPress={resetTimer}>
                        <Text style={{fontFamily:'spacemono-bold'}}>Reset</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        backgroundColor: 'white', 
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
    },
    timerText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'spacemono-bold',
    },
    button: {

        backgroundColor: '#9AC791',
        borderColor: '#9AC791',
        height: 35,
        width: 100,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
    },

});

export default CountDownTimer;