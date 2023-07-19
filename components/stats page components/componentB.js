import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';

import { getAuth } from 'firebase/auth';
import { db } from '../../firebaseConfigDB';
import { collection, onSnapshot } from 'firebase/firestore';

import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import moment from 'moment';

import Ionicons from '@expo/vector-icons/Ionicons';

import { VictoryPie, VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';

export default function WeeklyComponent() {
    const auth = getAuth();
    const userEmail = auth.currentUser.email;

    // colours array for category distribution pie chart 
    const catPieColorArr = ['#FF9191', '#FFC891', '#F7DC6F', '#9FE2BF'];
    
    // colours array for module distribution pie chart 
    const modPieColorArr = ['#FF9191', '#FFC891', '#F7DC6F', '#9FE2BF','#AED6F1', '#CCCCFF' ];

    // colours array for completion rate pie chart - green for completed (index 0), grey for uncompleted (index 1)
    const completionRateColorArr = ['#AFE1AF', '#909090'];

    const [thisWeek, setThisWeek] = useState(false);

    const [completionRateData, setCompletionRateData] = useState([]);

    const [greyMods, setGreyMods] = useState(false);
    const [greyCats, setGreyCats] = useState(false);
    const [greyCompletionRate, setGreyCompletionRate] = useState(false);

    const [modPieData, setModPieData] = useState([]);
    const [categoryPieData, setCategoryPieData] = useState([]);

    const [modPieLabel, setModPieLabel] = useState([]);
    const [categoryPieLabel, setCategoryPieLabel] = useState([]);

    const [numComplete, setNumComplete] = useState(0);
    const [numIncomplete, setNumIncomplete] = useState(0);

    const [defaultModPieLabel, setDefaultModPieLabel] = useState([]);
    const [defaultCategoryPieLabel, setDefaultCategoryPieLabel] = useState([]);

    const MODULE_ENTRY_HEIGHT = 30;

    const numModEntries = modPieLabel.length;
    const numCatEntries = categoryPieLabel.length;
    const modPieContainerHeight = numModEntries * MODULE_ENTRY_HEIGHT + 30;
    const catPieContainerHeight = numCatEntries * MODULE_ENTRY_HEIGHT + 30;


    // BAR CHART DUMMY DATA 
    const data = [
        { day: 'Mon', earnings: 13000 },
        { day: 'Tues', earnings: 16500 },
        { day: 'Wed', earnings: 14250 },
        { day: 'Thurs', earnings: 19000 },
        { day: 'Fri', earnings: 15908 },
        { day: 'Sat', earnings: 18493 },
        { day: 'Sun', earnings: 12398 },
    ];
  
    const [weekStart, setWeekStart] = useState(moment().startOf('isoWeek')); // Current week start
    const [weekEnd, setWeekEnd] = useState(moment().endOf('isoWeek')); // Current week end
    
    const weekText = `${weekStart.format('MMM D')} - ${weekEnd.format('MMM D')}`;
    const isCurrentWeek = weekStart.isSame(moment().startOf('isoWeek'), 'week');
    
    const navigateToPreviousWeek = () => {
        const previousWeekStart = weekStart.clone().subtract(1, 'week');
        if (previousWeekStart.isSameOrBefore(moment().startOf('isoWeek'))) {
            setWeekStart(previousWeekStart);
            setWeekEnd(previousWeekStart.clone().endOf('isoWeek'));
        }
    };

    const navigateToNextWeek = () => {
        const nextWeekStart = weekStart.clone().add(1, 'week');
        if (nextWeekStart.isSameOrBefore(moment().startOf('isoWeek').add(1, 'week'))) {
            setWeekStart(nextWeekStart);
            setWeekEnd(nextWeekStart.clone().endOf('isoWeek'));
        }
    };

    const calculateDurationInHours = (startDate, endDate) => {
        const start = moment(startDate);
        const end = moment(endDate);
        const durationInMs = end.diff(start);
        const durationInHours = moment.duration(durationInMs).asHours();
        return durationInHours;
    };

    const unsubscribeFunctions = [];

    const getCompletedItemsWeek = async (start, end) => {
        try {

            const eventsRef = collection(db, 'users', userEmail, 'events');

            unsubscribeFunctions.forEach(unsubscribe => unsubscribe());

            const unsubscribe = onSnapshot(eventsRef, (querySnapshot) => {
                const eventsData = querySnapshot.docs.map((doc) => doc.data());

                const weekEvents = eventsData.filter((event) => { 
                    const eventStartDate = moment(event.startDate.toDate());
                    //console.log(eventStartDate);
                    return eventStartDate.isBetween(start, end, null, '[]');
                }); 

                // get number of completed events
                const completedEvents = weekEvents.filter((event) => {
                    return event.completed === true;
                })  

                setNumComplete(completedEvents.length);


                // get number of uncompleted events
                const uncompletedEvents = weekEvents.filter((event) => {
                    return event.completed === false;
                })  

                setNumIncomplete(uncompletedEvents.length);

                // get completion rate data 
                if (completedEvents.length === 0 && uncompletedEvents.length === 0) {
                    setGreyCompletionRate(true);
                    setCompletionRateData([{'x': ' ', 'y': 1}])
                } else {
                    const completionRate = [{'x': ' ', 'y': completedEvents.length}, {'x': ' ', 'y': uncompletedEvents.length}];
                    setCompletionRateData(completionRate);
                    
                    setGreyCompletionRate(false);
                }

                // get mods task distribution
                if (completedEvents.length === 0) { // if no completed events, show grey pie chart 
                    setGreyMods(true);
                    setModPieData([{'x': ' ', 'y': 1}]);
                    
                } else {
                    //setGrey(true);
                    const moduleHoursMap = completedEvents.reduce((acc, event) => {
                        const moduleName = event.module;
                        const durationInHours = calculateDurationInHours(event.startDate.toDate(), event.endDate.toDate());
                        acc[moduleName] = (acc[moduleName] || 0) + durationInHours;
                        return acc;
                    }, {});

                    const modNamesArray = Object.keys(moduleHoursMap);
                    setModPieLabel(modNamesArray);
                    console.log('mod names: ', modPieLabel);
                    console.log('corresponding colours: ', modPieColorArr);

                    const modTransformedData = Object.values(moduleHoursMap);
                    console.log('mod transformed data: ', modTransformedData);
                    const modPieData = modTransformedData.map((hours) => {
                        return { x: ' ', y: hours };
                    })
                    setModPieData(modPieData);

                    setGreyMods(false);
                }


                // get categories task distribution
                if (completedEvents.length === 0) { // if no completed events, show grey pie chart 
                    setGreyCats(true);
                    setCategoryPieData([{'x': ' ', 'y': 1}]);

                } else {
                    //setGrey(true);
                    const categoriesHoursMap = completedEvents.reduce((acc, event) => {
                        const category = event.category;
                        const durationInHours = calculateDurationInHours(event.startDate.toDate(), event.endDate.toDate());
                        acc[category] = (acc[category] || 0) + durationInHours;
                        return acc;
                    }, {});

                    const catNamesArray = Object.keys(categoriesHoursMap);
                    setCategoryPieLabel(catNamesArray);
                    console.log('cat names: ', categoryPieLabel);
                    console.log('corresponding colours: ', catPieColorArr);

                    

                    const catTransformedData = Object.values(categoriesHoursMap);
                    console.log('cat transformed data: ', catTransformedData);
                    const categoryPieData = catTransformedData.map((hours) => {
                        return { x: ' ', y: hours };
                    })
                    setCategoryPieData(categoryPieData);
                    console.log('here');
                    
                    setGreyCats(false);
                }
                
            });

            unsubscribeFunctions.push(unsubscribe);

            // Return an unsubscribe function to stop listening for updates
            return unsubscribe;

        } catch (error) {
            console.log('hi: ', error);
        }
    };  

    

    const getWeekData = async () => {
        try {

            if (weekStart.isSame(moment().startOf('isoWeek'), 'isoWeek')) {
                setThisWeek(true);
            }

            setGreyMods(true);
            setGreyCats(true);
            setGreyCompletionRate(true);

            await getCompletedItemsWeek(weekStart, weekEnd);

            console.log('Number of Completed Events:', numComplete);
            console.log('Number of Incompleted Events:', numIncomplete);
   

        } catch (error) {
            console.log(error);
        }
            
    }
      
    useEffect(() => {
        getWeekData();

        // Cleanup function to unsubscribe from Firebase Firestore listeners when the component unmounts.
        return () => {
            unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
        };
    }, [weekStart, weekEnd]);

    const getInfoViewText = (label) => {
        return `${label} - ${modPieData[index].y.toFixed(2)} hrs`
    }

    return (
        <View>

            <View style={styles.weekBar}>
                <TouchableOpacity onPress={navigateToPreviousWeek}>
                    <Ionicons 
                        name="chevron-back-outline" 
                        color='black' 
                        size={20} 
                        margin={10} 
                        paddingRight={90} 
                        paddingTop={2}
                    />
                </TouchableOpacity>
                <Text style={styles.weekText}>{weekText}</Text>
                <TouchableOpacity onPress={isCurrentWeek ? undefined : navigateToNextWeek}>
                    <Ionicons 
                        name="chevron-forward-outline" 
                        color={isCurrentWeek ? '#D3D3D3' : 'black'} 
                        size={20} 
                        margin={10} 
                        paddingLeft={90} 
                        paddingTop={2}
                    />   
                </TouchableOpacity>

            </View>

            <ScrollView style={styles.scroll}>

                <View style={{backgroundColor: 'white', alignItems: 'center'}}>

                    <View style={styles.overviewContainer}>
                        <View style={styles.overviewItem}>
                            <Text style={styles.overviewLabel}>Total Time Focused (h):</Text>
                            <Text style={styles.overviewValue}>{0}</Text>
                        </View>
                        <View style={styles.overviewItem}>
                            <Text style={styles.overviewLabel}>Total Items Completed:</Text>
                            <Text style={styles.overviewValue}>{numComplete}</Text>
                        </View>
                    </View>
                    
                    <View style={styles.box}>
                        <Text style={styles.pieHeading}>Category Distribution</Text>
                        <View style={styles.horizontalSeparator}/>
                        {!greyCats ? (
                            <Text style={{ paddingTop: 7 }}>Completed blocks based on category type</Text>
                        ) : (
                            <Text style={{ paddingTop: 7 }}>No completed blocks for this week</Text>
                        )}
                        
                        <View style={[styles.pieContainer, { height: catPieContainerHeight }]}>
                            <View style={styles.pieView}>
                                <View style={styles.pie}>
                                    <VictoryPie
                                        data={categoryPieData}
                                        width={200}
                                        height={200}
                                        colorScale={greyCats ? ['#939799'] : catPieColorArr}
                                        innerRadius={30}
                                        animate={greyCats ? {} : { easing: 'exp', duration: 2000 }}
                                        padAngle={3}
                                        style={{ labels: { fontSize: 12 } }}
                                        labels={defaultCategoryPieLabel}
                                    />
                                </View>
                            </View>
                            <View style={styles.verticalSeparator}/>

                            {!greyCats && categoryPieData.length > 0 && (
                                <View style={styles.infoView}>
                                    <Text style={{ paddingBottom: 5, fontSize: 12 }}>{`Total hours: ${categoryPieData.reduce((total, dataPoint) => total + dataPoint.y, 0).toFixed(1)} hrs`}</Text>
                                    {categoryPieLabel.map((label, index) => (
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center', margin: 2 }}>
                                            <View style={{ width: 15, height: 15, backgroundColor: catPieColorArr[index], marginRight: 5 }} />
                                            <Text style={styles.infoViewText}>{`${label} - ${categoryPieData[index].y.toFixed(1)} hrs`}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                            {greyCats && (
                                <View style={styles.infoView}>
                                    <Text style={{fontFamily: 'spacemono', fontSize: 12, color: 'grey', paddingLeft: 30 }}>No data (yet)!</Text>
                                </View>
                            )}
                            
                        </View>
                    </View>

                    <View style={styles.box}>
                        <Text style={styles.pieHeading}>Module distribution</Text>
                        <View style={styles.horizontalSeparator}/>
                        {!greyMods ? (
                            <Text style={{ paddingTop: 7 }}>Completed blocks based on module type</Text>
                        ) : (
                            <Text style={{ paddingTop: 7 }}>No completed blocks for this week</Text>
                        )}

                        <View style={[styles.pieContainer, { height: modPieContainerHeight }]}>
                            <View style={styles.pieView}>
                                <View style={styles.pie}>
                                    <VictoryPie
                                        data={modPieData}
                                        width={200}
                                        height={200}
                                        colorScale={greyMods ? ['#939799'] : modPieColorArr}
                                        innerRadius={30}
                                        animate={greyMods ? {} : { easing: 'exp', duration: 2000 }}
                                        padAngle={3}
                                        style={{ labels: { fontSize: 12 } }}
                                        labels={defaultModPieLabel}
                                    />
                                </View>
                            </View>
                            <View style={styles.verticalSeparator}/>

                            {!greyMods && modPieData.length > 0 && (
                                <View style={styles.infoView}>
                                    <Text style={{ paddingBottom: 5, fontSize: 12 }}>{`Total hours: ${modPieData.reduce((total, dataPoint) => total + dataPoint.y, 0).toFixed(1)} hrs`}</Text>
                                    {modPieLabel.map((label, index) => (
                                        <View key={index} style={{ flexDirection: 'row', alignItems: 'center' , margin: 2}}>
                                            <View style={{ width: 15, height: 15, backgroundColor: modPieColorArr[index], marginRight: 5 }} />
                                            <Text style={styles.infoViewText}>{`${label} - ${modPieData[index].y.toFixed(1)} hrs`}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}
                            
                            {greyMods && (
                                <View style={styles.infoView}>
                                    <Text style={{fontFamily: 'spacemono', fontSize: 12, color: 'grey', paddingLeft: 30 }}>No data (yet)!</Text>
                                </View>
                            )}
                            
                        </View>
                    </View>

                    <View style={styles.box}>
                        <Text style={styles.pieHeading}>Completion rate</Text>
                        <View style={styles.horizontalSeparator}/>
                        {!greyCompletionRate ? (
                            <Text style={{ paddingTop: 7 }}>Completion rate of scheduled blocks this week</Text>
                        ) : (
                            <Text style={{ paddingTop: 7 }}>No completed blocks for this week</Text>
                        )}

                        <View style={[styles.pieContainer, { height: modPieContainerHeight }]}>
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

                            {!greyCompletionRate && completionRateData.length > 0 && (
                                <View style={styles.infoView}>
                                    <Text style={{ paddingBottom: 7, fontSize: 12 }}>
                                        { thisWeek ? (
                                            `You are ${Math.round((numComplete / (numComplete + numIncomplete)) * 100)}% done!`
                                        ) : (
                                            `You completed ${Math.round((numComplete / (numComplete + numIncomplete)) * 100)}% of scheduled blocks!`
                                        )}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 2 }}>
                                        <View style={{ width: 15, height: 15, backgroundColor: completionRateColorArr[0], marginRight: 5 }} />
                                        <Text style={styles.infoViewText}>{`${numComplete} blocks completed`}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', margin: 2 }}>
                                        <View style={{ width: 15, height: 15, backgroundColor: completionRateColorArr[1], marginRight: 5 }} />
                                        <Text style={styles.infoViewText}>{`${numIncomplete} blocks incomplete`}</Text>
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

                    <View style={styles.chartBox}>
                        <Text style={styles.chartHeading}>Focus hours for the week</Text>
                        <VictoryChart width={330} theme={VictoryTheme.material}>
                            <VictoryBar 
                                data={data} 
                                //x="quarter" 
                                y="earnings" 
                                labels={['2.7', '4', '3', '5', '4.3', '4.9', '2.4']}
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
                    
                </View> 

            </ScrollView>
        </View>

    )
};

const styles = StyleSheet.create({

    scroll: {
        height: 600,
    },

    // top week bar component styles
    weekBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    weekText: {
        fontSize: 15,
        fontFamily: 'spacemono',
    },

    // OverviewComponent styles
    overviewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginTop: 20,
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
});
