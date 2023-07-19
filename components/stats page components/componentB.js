import React, { useEffect, useState } from 'react'
import { Touchable } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';

import Ionicons from '@expo/vector-icons/Ionicons';

import { VictoryPie, VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';


import { getCompletedItemsWeek } from '../../hook/stats page/weekly section/getCompletedItemsWeek';

export default function WeeklyComponent() {

    //PIE CHART DUMMY DATA 
    //const wantedGraphicData = [{ x: 'CS2030S', y: 10 }, { x: 'MA2001', y: 20 }, { x: 'GEA1000', y: 30 }, { x: 'CS2040S', y: 5 }, { x: 'IS2218', y: 10 }, { x: 'Others', y: 25 }]; 
    const wantedGraphicData = [{ x: ' ', y: 10 }, { x: ' ', y: 20 }, { x: ' ', y: 30 }, { x: ' ', y: 5 }, { x: ' ', y: 10 }, { x: ' ', y: 25 }];
    const defaultGraphicData = [{ y: 0 }, { y: 0 }, { y: 0 }, { y: 0 }, { y: 0 }, { y: 100 }]; 
    const graphicColor = ['#FF9191', '#FFC891', '#F7DC6F', '#9FE2BF','#AED6F1', '#CCCCFF', ];

    //const wantedGraphicData2 = [{ x: 'classes', y: 10 }, { x: 'events', y: 20 }, { x: 'tasks', y: 30 }, { x: 'others', y: 40 }]; 
    const wantedGraphicData2 = [{ x: ' ', y: 10 }, { x: ' ', y: 20 }, { x: ' ', y: 30 }, { x: ' ', y: 40 }]; 
    const defaultGraphicData2 = [{ y: 0 }, { y: 0 }, { y: 0 }, { y: 100 }]; 
    const graphicColor2 = ['#FF9191', '#FFC891', '#F7DC6F', '#9FE2BF'];

    const [graphicData, setGraphicData] = useState(defaultGraphicData);
    const [graphicData2, setGraphicData2] = useState(defaultGraphicData2);
    
    useEffect(() => {
        setGraphicData(wantedGraphicData);
    }, []);

    useEffect(() => {
        setGraphicData2(wantedGraphicData2);
    }, []);
    
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

    const weekData = getCompletedItemsWeek(weekStart, weekEnd);
    
    console.log('Number of Completed Events:', weekData.numComplete);
    console.log('Number of Incompleted Events:', weekData.numIncomplete);
    console.log('Modules Pie Labels:', weekData.modsPieLabel);
    console.log('Modules Pie Data:', weekData.modsPieData);
    console.log('Categories Pie Labels:', weekData.categoriesPieLabel);
    console.log('Categories Pie Data:', weekData.categoriesPieData);

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
                            <Text style={styles.overviewValue}>{weekData.numComplete}</Text>
                        </View>
                    </View>

                    <View style={styles.box}>
                        <Text style={styles.pieHeading}>Mods task distribution</Text>
                        <View style={styles.pieContainer}>
                            <View style={styles.pieView}>
                                <View style={styles.pie}>
                                    <VictoryPie
                                        data={graphicData}
                                        width={200}
                                        height={200}
                                        colorScale={graphicColor}
                                        innerRadius={30}
                                        animate={{ easing: 'exp' }}
                                        padAngle={3}
                                        style={{ labels: { fontSize: 12 } }}
                                    />
                                </View>
                            </View>
                            <View style={styles.infoView}>
                                <Text>Completed tasks in hours based on module</Text>
                            </View>
                        </View>
                    </View>
                    
                    <View style={styles.box}>
                        <Text style={styles.pieHeading}>Categories task distribution</Text>
                        <View style={styles.pieContainer}>
                            <View style={styles.pieView}>
                                <View style={styles.pie}>
                                    <VictoryPie
                                        data={graphicData2}
                                        width={200}
                                        height={200}
                                        colorScale={graphicColor2}
                                        innerRadius={30}
                                        animate={{ easing: 'exp' }}
                                        padAngle={3}
                                        style={{ labels: { fontSize: 12 } }}
                                    />
                                </View>
                            </View>
                            <View style={styles.infoView}>
                                <Text>Completed tasks in hours based category (class, event, task, others)</Text>
                            </View>
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
        backgroundColor: '#AAAAAA',
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
        backgroundColor: '#D3D3D3',
        marginTop: 20,
        marginHorizontal: 20,
        borderRadius: 10,
        height: 210
    },
    
    pieHeading: {
        fontFamily: 'spacemono',
        fontSize: 20,
        paddingTop: 20,
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
