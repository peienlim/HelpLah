import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Button, Easing} from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

const PomodoroTimer = () => {
  const [time, setTime] = useState(25 * 60); // 25 minutes in seconds
  const [initial, setInitial] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [delayTime, setDelayTime] = useState(60* 60000) // set delay time to 1 hr

  const circularProgressRef = useRef(null);
  
  useEffect(() => {
    let interval = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      // Pomodoro timer is completed
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, time]);

  const startTimer = () => {
        setIsActive(true);
        setDelayTime(0);
        setTime(1 * 60);
        setInitial(1 * 60);
        //circularProgressRef.current.animate(0, 1*60*1000,'linear')
  };

  const resetTimer = () => {
    setIsActive(false);
    setTime(25 * 60); // Reset to 25 minutes
    setDelayTime(60 * 60000)
  };

  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <View style={styles.container}>

        {/* <CircularProgress
            value={time}
            initialValue={initial}
            radius={130}
            duration={time}
            delay= {delayTime}
            progressValueColor={'#9AC791'}
            maxValue={time}
            title={'min'}
            titleColor={'black'}
            titleStyle={{fontWeight: 'bold', fontFamily:'spacemono'}}
            activeStrokeColor='#9AC791'
            activeStrokeWidth={15}
            inActiveStrokeWidth={15}
        >
        {() => <Text style={styles.timerText}>{formatTime(time)}</Text>}
        </CircularProgress> */}

      <AnimatedCircularProgress
        ref={circularProgressRef}
        duration={initial * 1000} 
        size={200}
        width={10}
        tintColor="red"
        backgroundColor="#d3d3d3"
        fill={(time/initial) * 100}
        delay={delayTime}
        arcSweepAngle={360}
        rotation= {0}
      >
       {() => <Text style={styles.timerText}>{formatTime(time)}</Text>}
      </AnimatedCircularProgress>

     {/*  {!isActive ? (
        <View style={styles.buttonContainer}>
          <Button title="Start" onPress={startTimer} />
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <Button title="Reset" onPress={resetTimer} />
        </View>
      )} */}
        <View style={styles.buttonContainer}>
          <Button title="Start" onPress={startTimer} />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Reset" onPress={resetTimer} />
        </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default PomodoroTimer;
