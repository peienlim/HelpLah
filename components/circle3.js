import React, {useEffect, useState, useRef} from 'react';
import {Text, TouchableOpacity, StyleSheet, View, Animated, Easing} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg';

//import { AnimatedCircularProgress } from 'react-native-circular-progress';
import CircularProgress, {ProgressRef} from 'react-native-circular-progress-indicator';
import CountDown from 'react-native-countdown-component';

const CountDownTimer = ({duration}) => { // duration units is in seconds
    const [time, setTime] = useState(duration); //duration should be in seconds
    const [isActive, setIsActive] = useState(false);
    
    //const animatedValue = useRef(new Animated.Value(0)).current;
    //const [strokeDashArray, setStrokeDashArray] = useState([0, 2*Math.PI * 80]);
    //const AnimatedCircle = Animated.createAnimatedComponent(Circle);

    /* const circularProgress = useRef(null);
    const [delayValue, setDelayValue] = useState(60*60*1000);  */// 1 hour in miliseconds

    const [pausedState, setPausedState] = useState(true);
    const [delayTime, setDelayTime] = useState(60*60*1000);
    const progressRef = useRef(null);

    const [runningState, setRunningState] = useState(false);
    console.log(runningState);

    useEffect(() => {
        let interval = null;

        if (isActive && time > 0) {
        interval = setInterval(() => {
            setTime((prevTime) => prevTime - 1);
        }, 1000);
        } else if (isActive && time === 0) {
        // Pomodoro timer is completed
        clearInterval(interval);
        setTime(duration);
        setIsActive(false);
        }

        return () => clearInterval(interval);
    }, [isActive, time]);

    /* useEffect(() => {
        animatedValue.addListener((progress) => {
            const strokeLength = progress.value * 2 * Math.PI * 80;
            setStrokeDashArray([strokeLength, 2 * Math.PI * 80]);
        });
      
        return () => {
            animatedValue.removeAllListeners();
        };
    }, []);
 */
   /*  useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: time * 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start();
    }, [time]); */


    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    const startTimer = () => {
        setIsActive(true);
        setDelayTime(0);
        progressRef.current.play();
        setRunningState(true);

        //circularProgress.animate(100, duration, Easing.quad());

        /* animatedValue.setValue(0); // Reset the animated value to 0
        Animated.timing(animatedValue, {
            toValue: 1,
            duration: time * 1000,
            easing: Easing.linear,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
            // Animation completed
            setIsActive(false);
            setTime(duration);
            }
        }); */
    };

    const stopTimer = () => {
        setIsActive(false);
        setPausedState(true);
        progressRef.current.pause();
        //animatedValue.stopAnimation();
    };

    const resetTimer = () => {
        setIsActive(false);
        setTime(duration);
        progressRef.current.reAnimate();
        setDelayTime(1*60*60*1000);
        //animatedValue.setValue(0);
    };

    /* const circumference = 2 * Math.PI * 80;

    const animatedStroke = animatedValue.interpolate({
        inputRange:[0, 1],
        outputRange: ['0', `${circumference}`],
    });
 */
    return (
        <View style={styles.background}>
           {/*  <Svg width={200} height={200}>
                <Circle
                cx={100}
                cy={100}
                r={80}
                stroke="gray"
                strokeWidth={8}
                fill="transparent"
                />
                <AnimatedCircle
                cx={100}
                cy={100}
                r={80}
                stroke="blue"
                strokeWidth={8}
                fill="transparent"
                strokeDasharray={strokeDashArray}
                />
            </Svg> */}
{/* 
            <AnimatedCircularProgress
                ref = {circularProgress}
                size={200}
                width={3}
                fill={(time/duration)*100}
                tintColor="#00e0ff"
                backgroundColor="#3d5875"
                rotation={0}
                duration={duration*1000}
                onFillChange={(time) => formatTime(time)}
                delay={delayValue}
                >
            {
                (fill) => (
                    <Text>
                    {formatTime(time)}
                    </Text>
                )
            }
            </AnimatedCircularProgress> */}

            <CircularProgress
                ref ={progressRef}
                value={0}
                radius={120}
                maxValue={duration/60}
                initialValue={duration/60}
                progressValueColor={'black'}
                activeStrokeWidth={15}
                inActiveStrokeWidth={15}
                duration={duration*1000} // duration prop should be in miliseconds
                onAnimationComplete={() => alert('time out')}
                delay = {delayTime}
                //startInPausedState = {pausedState}
                activeStrokeColor='green'
                //progressFormatter={(value: number)}
                subtitle='min'
            />

           {/*  <CountDown
                until={duration}
                onFinish={() => alert('finished')}
                onPress={() => alert('hello')}
                size={20}
                running={runningState}
            /> */}

            <TouchableOpacity>
                <Text style={styles.timerText}> {formatTime(time)} </Text>
            </TouchableOpacity>

            <View style={{padding: 10}}>
                <TouchableOpacity style={styles.button} onPress={startTimer}>
                    <Text style={{fontFamily:'spacemono-bold'}}>Start</Text>
                </TouchableOpacity>
            </View>

            <View style={{padding: 10}}>
                <TouchableOpacity style={styles.button} onPress={stopTimer}>
                    <Text style={{fontFamily:'spacemono-bold'}}>Stop</Text>
                </TouchableOpacity>
            </View>

            <View style={{padding: 10}}>
                <TouchableOpacity style={styles.button} onPress={resetTimer}>
                    <Text style={{fontFamily:'spacemono-bold'}}>Reset</Text>
                </TouchableOpacity>
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
        width: 175,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },

});

export default CountDownTimer;