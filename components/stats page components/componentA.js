import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';

import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';

import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';
import { width } from '@mui/system';

import { getDailyFocusHr } from '../../hook/getDailyFocusHr';
import { getDailyTaskCompleted } from '../../hook/getDailyTaskCompleted';
import { getTotalDailyTask } from '../../hook/getTotalDailyTask';

import { VictoryPie, VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';


const DailyComponent = () => {

    // BAR CHART DUMMY DATA 
    const data = [
        { time: '0000', hours: 20 },
        { time: '0100', hours: 60 },
        { time: '0200', hours: 60 },
        { time: '0300', hours: 60 },
        { time: '0400', hours: 45 },
        { time: '0500', hours: 30 },
        { time: '0600', hours: 5 },
        { time: '0700', hours: 35 },
        { time: '0800', hours: 5 },
        { time: '0900', hours: 45 },
        { time: '1000', hours: 45 },
        { time: '1100', hours: 45 },
        { time: '1200', hours: 45 },
        { time: '1300', hours: 45 },
        { time: '1400', hours: 45 },
        { time: '1500', hours: 45 },
        { time: '1600', hours: 45 },
        { time: '1700', hours: 45 },
        { time: '1800', hours: 45 },
        { time: '1900', hours: 45 },
        { time: '2000', hours: 45 },
        { time: '2100', hours: 45 },
        { time: '2200', hours: 45 },
        { time: '2300', hours: 45 },
    ];

    // colours array for completion rate pie chart - green for completed (index 0), grey for uncompleted (index 1)
    const completionRateColorArr = ['#AFE1AF', '#909090'];

    const [currentWeekStart, setCurrentWeekStart] = useState(moment().startOf('isoWeek'));
    const [currentWeekEnd, setCurrentWeekEnd] = useState(moment().endOf('isoWeek'));

    const [selectedDate, setSelectedDate] = useState(new Date());
    const isCurrentWeek = currentWeekStart.isSame(moment().startOf('isoWeek'), 'week');

    const [dailyFocusHour, setDailyFocusHour] = useState(0);
    const [dailyTaskCompleted, setDailyTaskCompleted] = useState(0);
    const [dailyTaskUncomplete, setDailyTaskUncomplete] = useState(0);

    // for completion rate pie chart 
    const [completionRateData, setCompletionRateData] = useState([]);
    const [greyCompletionRate, setGreyCompletionRate] = useState(false);



    const navigateToPreviousWeek = () => {
        const previousWeekStart = currentWeekStart.clone().subtract(1, 'week');
        if (previousWeekStart.isSameOrBefore(moment().startOf('isoWeek'))) {
            setCurrentWeekStart(previousWeekStart);
            setCurrentWeekEnd(previousWeekStart.clone().endOf('isoWeek'));
        }
    };

    const navigateToNextWeek = () => {
        const nextWeekStart = currentWeekStart.clone().add(1, 'week');
        if (nextWeekStart.isSameOrBefore(moment().startOf('isoWeek').add(1, 'week'))) {
            setCurrentWeekStart(nextWeekStart);
            setCurrentWeekEnd(nextWeekStart.clone().endOf('isoWeek'));
        }
    };

    const pickDate = (date) => {
        setSelectedDate(date);
        console.log('selected: ', selectedDate);
    }

    return (

        <View>

            <View style={styles.weekBar}>
                <TouchableOpacity onPress={navigateToPreviousWeek}>
                    <Ionicons name="chevron-back-outline" color='black' size={20} marginLeft={2}/>
                </TouchableOpacity>

                {Array.from({ length: 7 }).map((_, index) => {
                    const date = currentWeekStart.clone().add(index, 'days');
                    console.log('date: ', new Date(date));
                    const isCurrentDay = date.isSame(moment(), 'day');
                    return (
                        <TouchableOpacity key={index} style={styles.dayDate} onPress={() => pickDate(new Date(date))}>
                            <Text style={[styles.dateText, isCurrentDay && styles.currentDayText]}>{date.format('D')}</Text>
                            <Text style={[styles.dayText, isCurrentDay && styles.currentDayText]}>{date.format('ddd')}</Text>
                        </TouchableOpacity>
                    );
                })}

                <TouchableOpacity onPress={isCurrentWeek ? undefined : navigateToNextWeek}>
                    <Ionicons name="chevron-forward-outline" color={isCurrentWeek ? '#D3D3D3' : 'black'} size={20} marginRight={2}/>   
                </TouchableOpacity>

            </View>

            <ScrollView style={styles.scroll}>

                <View style={{backgroundColor: 'white', alignItems: 'center'}}>

                    <View style={styles.selectedDateContainer}>
                        <Text style={styles.selectedDateText}>
                            {moment(selectedDate).format('ddd, MMMM Do YYYY')}
                        </Text>
                    </View>

                    <View style={styles.overviewContainer}>
                        <View style={styles.overviewItem}>
                            <Text style={styles.overviewLabel}>Time Focused (min):</Text>
                            <Text style={styles.overviewValue}>{1}</Text>
                        </View>
                        <View style={styles.overviewItem}>
                            <Text style={styles.overviewLabel}>Items Completed:</Text>
                            <Text style={styles.overviewValue}>{1}</Text>
                        </View>
                        
                    </View>

                    

                    <View style={styles.chartBox}>
                        <Text style={styles.chartHeading}>Focus timings</Text>
                        <VictoryChart width={370} theme={VictoryTheme.material}>
                            <VictoryBar 
                                data={data} 
                                //x="quarter" 
                                y="hours" 
                                labels={['45.7', '4', '3', '5', '4.3', '4.9', '45.4']}
                                style={{
                                    data: { fill: "tomato", opacity: 0.7 },
                                }}
                            />
                            <VictoryAxis dependentAxis
                                style={{ 
                                    axis: {stroke: "transparent"}, 
                                    //ticks: {stroke: "transparent"},
                                    tickLabels: { fill:"transparent"} 
                                }} 
                            />
                            <VictoryAxis crossAxis
                                style={{ 
                                    axis: {stroke: "transparent"}, 
                                    ticks: {stroke: "transparent"},
                                    //tickLabels: { fill:"transparent"} 
                                }} 
                            />
                        </VictoryChart>

                    </View>

                        <Text style={styles.tasksHeading}>Task Data: </Text>
                        <View style={styles.tasksBox}>
                            <VictoryPie
                                data={[
                                    { x: "Tasks", y: 35 },
                                    { x: "Others", y: 40 },
                                    { x: "Events", y: 55 },
                                    { x: "Class", y: 55 },
                                ]}
                                width={200}
                                height={200}
                                innerRadius={30}
                                animate={{ easing: 'exp' }}
                                padAngle={3}
                                style={{ labels: { fontSize: 12 } }}
                            />
                        </View>
                    <View>
               
                    </View>
                    
                </View> 

            </ScrollView>
        </View>
    
    )
};

export default DailyComponent;


const styles = StyleSheet.create({

    scroll: {
        height: 600,
    },

    // top date bar component styles
    weekBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: 50
    },
    
    datesRow: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    
    dayDate: {
        alignItems: 'center',
        margin: 1.5,
    },

    dateText: {
        fontSize: 13,
        fontFamily: 'spacemono',
    },

    dayText: {
        fontSize: 11,
        fontFamily: 'spacemono',
    },

    
    // OverviewComponent styles
    overviewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 10,
        backgroundColor: '#E6E8E9',
        height: 70,
        width: 350,
        borderRadius: 10,
    },
    overviewItem: {
        alignItems: 'center',
    },
    overviewLabel: {
        fontFamily: 'spacemono',
        fontSize: 12,
        padding: 10,
    },
    overviewValue: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },

    selectedDateContainer: {
        alignItems: 'center',
        marginTop: 20,
        //backgroundColor: 'blue',
        //height: 30,
        width: 175
    },

    selectedDateText: {
        fontFamily: 'spacemono',
        fontSize: 14,
    },

    // pie chart components style
    box: {
        alignItems: 'center',
        backgroundColor: '#ABB0B8',
        marginTop: 20,
        marginHorizontal: 20,
        borderRadius: 10,
        height: 210
    },
    
    pieHeading: {
        fontFamily: 'spacemono',
        fontSize: 19,
        paddingTop: 20,
        paddingBottom: 10,
        flex: 1
    },

    pieContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        width: '100%',
        flex: 6,
    },
    
    horizontalSeparator: {
        borderBottomWidth: 2.5,
        borderColor: 'grey', 
        width: 300,
        //paddingTop: 10
    },

    verticalSeparator: {
        borderRightWidth: 2.5,
        borderColor: 'grey', 
        height: '80%', 
        marginLeft: 30, 
    },

    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    

    pieView: {
        flex: 1,
        alignItems: 'center',
        marginLeft: 10
    },

    infoView: {
        flex: 2,
        paddingLeft: 25,
    },

    infoViewText: {
        fontSize: 11
    },

    pie: {
        alignItems: 'center',
    },


    // chart style components

    chartBox: {
        alignItems: 'center'
    },

    chartHeading: {
        fontFamily: 'spacemono',
        fontSize: 20,
        paddingTop: 20,
    },

    // tasks style components
    tasksHeading: {
        fontFamily: 'spacemono',
        fontSize: 20,
        paddingTop: 20,
    },
    tasksBox: {
        backgroundColor: 'grey',
        width: 350,
        height: 500,
        borderRadius: 10,
        justifyContent: 'center',
        alignContent: 'center',
    }
})

