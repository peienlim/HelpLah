import React, {useState} from 'react';
import { StyleSheet, Text, SafeAreaView, Animated, TextInput} from 'react-native';
import Svg, {G, Circle} from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedInput = Animated.createAnimatedComponent(TextInput);

export default function ProgressCircle({
    percentage = 75,
    radius = 40,
    strokeWidth = 10,
    duration = 500, // duration of entire animation
    colour = "#9AC791",
    delay = 500,
    textColour,
    max = 100,
 }) { 
    const animatedValue = React.useRef(new Animated.Value(0)).current;
    const circleRef = React.useRef();
    const inputRef = React.useRef();
    
    const [timer, setTimer] = useState(0);
    //const [formattedTimer, setFormattedTimer] = useState()

    const halfCircle = radius + strokeWidth;
    const circleCircumference = 2 * Math.PI * radius;

    const animation = (toValue) => {
        return Animated.timing(animatedValue, {toValue, duration, delay, useNativeDriver: true,})
                    .start(({finished}) => {
                        if (finished && toValue == max) {
                            return;
                        }
                        animation(toValue === 0 ? percentage : 0)
                    });
    };

  React.useEffect(()=>{
    animation(percentage);

    animatedValue.addListener((v) => {
      if (circleRef?.current) {
        const maxPerc = (100 * v.value) / max;
        const strokeDashoffset = circleCircumference - (circleCircumference * maxPerc) /100;
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }

      if (inputRef?.current) {
        inputRef.current.setNativeProps({
          text: `${Math.round(v.value)}`
        });
      };
    });

    const timerInterval = setInterval(() => {
        setTimer((prevTimer) => prevTimer + 1);
      }, 1000);

    return () => {
      animatedValue.removeAllListeners();
    };
  }, [max, percentage]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
      <SafeAreaView style={styles.background}>
        <Svg width={radius*2} height={radius*2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
          <G rotation= '-90' origin={`${halfCircle}, ${halfCircle}`}>
            <Circle
              cx ='50%'
              cy = '50%'
              stroke={colour}
              strokeWidth={strokeWidth} 
              r = {radius}
              fill = 'transparent'
              strokeOpacity={0.2}
            />
            <AnimatedCircle 
              ref = {circleRef}
              cx ='50%'
              cy = '50%'
              stroke={colour}
              strokeWidth={strokeWidth} 
              r = {radius}
              fill = 'transparent'
              strokeDasharray={circleCircumference}
              strokeDashoffset={circleCircumference}
              strokeLinecap='round'
            />
          </G>
        </Svg>
        <AnimatedInput
        ref = {inputRef}
        underlineColorAndroid='transparent'
        editable={false}
        defaultValue={0}
        style={[ 
          StyleSheet.absoluteFillObject,
          {fontSize: radius / 2, color: textColour ?? colour},
          {fontWeight: 'bold', textAlign: 'center'}
        ]}
        /> // change the countdown prop to an animated countdown prop?

      </SafeAreaView>
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
        fontSize: 24,
        fontWeight: 'bold',
    },
});