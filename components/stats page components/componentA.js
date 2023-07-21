import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { useIsFocused } from '@react-navigation/native';

import { getAuth } from 'firebase/auth';
import { db } from '../../firebaseConfigDB';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

import Ionicons from '@expo/vector-icons/Ionicons';
import moment from 'moment';

import { VictoryPie, VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';


export default function DailyComponent() {

    const auth = getAuth();
    const userEmail = auth.currentUser.email;

    const isFocused = useIsFocused();

    useEffect(() => {
        // Fetch data for today whenever the screen is focused or re-rendered
        const today = new Date();
        pickDate(today);
    }, [isFocused]);

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
    
    const isCurrentWeek = currentWeekStart.isSame(moment().startOf('isoWeek'), 'week');
    
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [today, setToday] = useState(false);

    const [dailyFocusHour, setDailyFocusHour] = useState(0);
    const [dailyTaskCompleted, setDailyTaskCompleted] = useState(0);
    const [dailyTotalTask, setDailyTotalTask] = useState(0);

    // for completion rate pie chart 
    const [completionRateData, setCompletionRateData] = useState([]);
    const [label, setLabel] = useState([]);
    const [greyCompletionRate, setGreyCompletionRate] = useState(false);

    const [completedBlocks, setCompletedBlocks] = useState([]);
    const [uncompletedBlocks, setUncompletedBlocks] = useState([]);


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

    const getDailyFocusHr = async (dt) => {

        const eventsRef = collection(db, 'users', userEmail, 'focusMode');

        try {
            const querySnapshot = await getDocs(eventsRef);
            const focusData = querySnapshot.docs.map((doc) => doc.data());
        
            const filteredData = focusData.filter((focusEvent) => {
              const focusEventDate = focusEvent.timeStarted.toDate();
              return focusEventDate.toDateString() === dt.toDateString();
            });
        
            const sumOfDurations = filteredData.reduce((sum, focusEvent) => {
              return sum + focusEvent.duration;
            }, 0);
        
            return sumOfDurations;

          } catch (error) {
            console.error('Error fetching focus events: ', error);
            throw error; 
          }
    }

    const getTotalDailyTask = async (dt) => {
        const eventsRef = collection(db, 'users', userEmail, 'events');

        try {
            const querySnapshot = await getDocs(eventsRef);
            const eventsData = querySnapshot.docs.map((doc) => doc.data());
        
            const filteredData = eventsData.filter((event) => {
                const eventDate = event.startDate.toDate();
                const eventType = event.category;
                const isNusMod = event.nusmods;
                return eventDate.toDateString() === dt.toDateString() && isNusMod === false;
            });
        
            return filteredData.length;
        
        } catch (error) {
            console.error('Error fetching events data: ', error);
            throw error; 
        }
    
    }

    const getDailyTaskCompleted = async (dt) => {

        const eventsRef = collection(db, 'users', userEmail, 'events');

        try {
            const querySnapshot = await getDocs(eventsRef);
            const eventsData = querySnapshot.docs.map((doc) => doc.data());
        
            const filteredData = eventsData.filter((event) => {
              const completeStatus = event.completed;
              const eventDate = event.startDate.toDate();
              const isNusMod = event.nusmods;
              return completeStatus === true && eventDate.toDateString() === dt.toDateString() && isNusMod === false;
            });
        
            return filteredData.length;
        
        } catch (error) {
            console.error('Error fetching events data: ', error);
            throw error; 
        }
    
    }

    const unsubscribeFunctions = [];

    const getBlocksToDisplay = async (dt) => {
        
        try {

            unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
            unsubscribeFunctions.length = 0; // Clear the array

            const eventsRef = collection(db, 'users', userEmail, 'events');
            let eventsData = []; // Initialize the variable to an empty array

            unsubscribeFunctions.forEach(unsubscribe => unsubscribe());

            const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
                eventsData = querySnapshot.docs.map((doc) => doc.data());

                const weekEvents = eventsData.filter((event) => { 
                    const eventStartDate = event.startDate.toDate();
                    //console.log(eventStartDate);
                    return eventStartDate.toDateString() === dt.toDateString();
                }); 

                const completedEvents = weekEvents.filter((event) => {
                    return event.completed === true;
                })  

                const complete = completedEvents.map((event) => ({
                    category: event.category,
                    startDate: event.startDate.toDate(),
                    endDate: event.endDate.toDate(),
                    color: event.colour,
                    description: event.description.slice(3),
                    module: event.module,
                }));

                console.log('completed events: ', complete);
                setCompletedBlocks(complete);

                const uncompletedEvents = weekEvents.filter((event) => {
                    return event.completed === false;
                })  

                const uncomplete = uncompletedEvents.map((event) => ({
                    category: event.category,
                    startDate: event.startDate.toDate(),
                    endDate: event.endDate.toDate(),
                    color: event.colour,
                    description: event.description.slice(3),
                    module: event.module,
                }));

                console.log('uncompleted events: ', uncomplete);
                setUncompletedBlocks(uncomplete);

            });

            unsubscribeFunctions.push(unsubscribe);

            // Return an unsubscribe function to stop listening for updates
            return unsubscribe;

        } catch (error) {
            console.error('error getting blocks to displayy: ', error);
        }

    }

    const getReqData = async (date) => {
        setSelectedDate(date);
        console.log('selected: ', selectedDate);

        try {
            const dfh = await getDailyFocusHr(date);
            console.log('daily focus hour: ', dfh);

            const dtc = await getDailyTaskCompleted(date);
            console.log('daily tasks completed: ', dtc);

            const tdt = await getTotalDailyTask(date);
            console.log('daily TOTAL tasks: ', tdt);

            setDailyFocusHour(dfh);
            setDailyTaskCompleted(dtc);
            setDailyTotalTask(tdt);

            await getBlocksToDisplay(date);

            console.log('completed blocks: ', completedBlocks);
            console.log('uncompleted blocks: ', uncompletedBlocks);

            return {
                dfh,
                dtc,
                tdt
            }

        } catch (error) {
            console.error('error getting req data: ', error);
            throw error; 
        }

    }

    const pickDate = async (date) => {

        const selectedDateLocal = moment(selectedDate).local();
        const currentDateLocal = moment().startOf('day');

        if (selectedDateLocal.isSame(currentDateLocal, 'day')) {
            setToday(true);
        }

        setGreyCompletionRate(true);

        const arr = await getReqData(date);
        console.log('arr: ', arr);

        const focusHour = arr.dfh;
        console.log('focus: ', focusHour);

        const tasksCompleted = arr.dtc;
        console.log('tasks completed: ', tasksCompleted);

        const totalTasks = arr.tdt;
        console.log('total tasks: ', totalTasks);

        if (totalTasks > 0) {
            setCompletionRateData([{'x': ' ', 'y': tasksCompleted}, { 'x': ' ', 'y': totalTasks - tasksCompleted}]);
            setLabel([' ', ' ']);
            setGreyCompletionRate(false);
        } else {
            setGreyCompletionRate(true);
            setCompletionRateData([{'x': ' ', 'y': 1}])
        }

    }


    useEffect(() => {
        pickDate(selectedDate);

        return () => {
            unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
        };
    }, [selectedDate]);

    const TaskBox = ({ description, duration, category, color, module }) => {
        return (
          <View style={[styles.taskContainer, { backgroundColor: color, opacity: 0.9 }]}>
            <Text style={styles.taskDescription}>{description}</Text>
            <Text style={styles.smallText}>Duration: {duration} minutes</Text>
            <Text style={styles.smallText}>Module: {module}</Text>
            <Text style={styles.smallText}>Category: {category}</Text>
          </View>
        );
      };

    return (

        <View>

            <View style={styles.weekBar}>
                <TouchableOpacity onPress={navigateToPreviousWeek}>
                    <Ionicons name="chevron-back-outline" color='black' size={20} marginLeft={2}/>
                </TouchableOpacity>

                {Array.from({ length: 7 }).map((_, index) => {
                    const date = currentWeekStart.clone().add(index, 'days');
                    //console.log('date: ', new Date(date));
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
                            <Text style={styles.overviewValue}>{(dailyFocusHour/60)}</Text>
                        </View>
                        <View style={styles.overviewItem}>
                            <Text style={styles.overviewLabel}>Items Completed:</Text>
                            <Text style={styles.overviewValue}>{dailyTaskCompleted}</Text>
                        </View>
                        
                    </View>

                    <View style={styles.box}>
                        <Text style={styles.pieHeading}>Completion rate</Text>
                        <View style={styles.horizontalSeparator}/>
                        {!greyCompletionRate ? (
                            <Text style={{ paddingTop: 7 }}>Completion rate of scheduled blocks</Text>
                        ) : (
                            <Text style={{ paddingTop: 7 }}>No completed blocks for this date</Text>
                        )}

                        <View style={[styles.pieContainer, { height: 600 }]}>
                            <View style={styles.pieView}>
                                <View style={styles.pie}>
                                    <VictoryPie
                                        data={completionRateData}
                                        width={200}
                                        height={200}
                                        colorScale={greyCompletionRate ? ['#939799'] : completionRateColorArr}
                                        innerRadius={30}
                                        animate={greyCompletionRate ? {} : { easing: 'exp', duration: 2000 }}
                                        padAngle={3}
                                        style={{ labels: { fontSize: 12 } }}
                                        labels={[' ', ' ']}
                                    />
                                </View>
                            </View>
                            <View style={styles.verticalSeparator}/>

                            {!greyCompletionRate && dailyTotalTask > 0 && (
                                <View style={styles.infoView}>
                                    <Text style={{ paddingBottom: 7, fontSize: 12 }}>
                                        { today ? (
                                            `You are ${Math.round((dailyTaskCompleted / dailyTotalTask) * 100)}% done!`
                                        ) : (
                                            `You completed ${Math.round((dailyTaskCompleted / dailyTotalTask) * 100)}% of scheduled blocks!`
                                        )}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 2 }}>
                                        <View style={{ width: 15, height: 15, backgroundColor: completionRateColorArr[0], marginRight: 5 }} />
                                        <Text style={styles.infoViewText}>{`${dailyTaskCompleted} blocks completed`}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 2 }}>
                                        <View style={{ width: 15, height: 15, backgroundColor: completionRateColorArr[1], marginRight: 5 }} />
                                        <Text style={styles.infoViewText}>{`${dailyTotalTask - dailyTaskCompleted} blocks incomplete`}</Text>
                                    </View>
                                </View>
                            )}
                            
                            {greyCompletionRate && (
                                <View style={styles.infoView}>
                                    <Text style={{fontFamily: 'spacemono', fontSize: 12, color: 'grey', paddingLeft: 30 }}>No data (yet)!</Text>
                                </View>
                            )}
                            
                        </View>
                    </View>

                    {/* Display Completed Tasks */}
                    {completedBlocks.length > 0 && (
                        <View style={styles.tasksBox}>
                        <Text style={styles.tasksHeading}>Completed Tasks</Text>
                        <View style={styles.horizontalSeparator}/>
                        {completedBlocks.map((task, index) => (
                            <TaskBox
                                key={index}
                                description={task.description}
                                duration={moment(task.endDate).diff(moment(task.startDate), 'minutes')}
                                category={task.category}
                                color={task.color}
                                module={task.module}
                            />
                        ))}
                        </View>
                    )}

                    {/* Display Uncompleted Tasks */}
                    {uncompletedBlocks.length > 0 && (
                        <View style={styles.tasksBox}>
                        <Text style={styles.tasksHeading}>Uncompleted Tasks</Text>
                        <View style={styles.horizontalSeparator}/>
                        {uncompletedBlocks.map((task, index) => (
                            <TaskBox
                                key={index}
                                description={task.description}
                                duration={moment(task.endDate).diff(moment(task.startDate), 'minutes')}
                                category={task.category}
                                color={task.color}
                                module={task.module}
                            />
                        ))}
                        </View>
                    )}
                    
                </View> 

            </ScrollView>
        </View>
    
    )
};


const styles = StyleSheet.create({

    scroll: {
        height: 578,
        backgroundColor: 'white'
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
        marginBottom: 10,
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


    // tasks style components
    taskContainer: {
        width: '90%',
        padding: 10,
        marginTop: 15,
        borderRadius: 5,
    },

    taskDescription: {
        fontFamily: 'spacemono',
        fontSize: 15,
        marginBottom: 5,
    },

    smallText: {
        fontFamily: 'spacemono',
        fontSize: 11,
        color: '#424347',
        marginBottom: 5,
    },

    taskCategory: {
        fontFamily: 'spacemono',
        fontSize: 11,
        color: '#424347',
    },

    tasksBox: {
        backgroundColor: '#86888e',
        width: '90%',
        padding: 20,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10,
    },

    tasksHeading: {
        fontFamily: 'spacemono',
        fontSize: 19,
        color: 'black',
        marginBottom: 10,
        alignSelf: 'center',
    },
})

