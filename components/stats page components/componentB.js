import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { styles } from 'react-native-gifted-charts/src/BarChart/styles';
import { SafeAreaView } from 'react-native-safe-area-context';

import { VictoryPie } from 'victory-native';

export default function WeeklyComponent() {

    const wantedGraphicData = [{ x:'CS2030S', y: 10 }, { x: 'MA2001', y: 20 }, { x: 'GEA1000', y: 30 }, { x: 'CS2040S', y: 5 }, { x: 'IS2218', y: 10 }, { x: 'Others', y: 25 }]; // Data that we want to display
    const defaultGraphicData = [{ y: 0 }, { y: 0 }, { y: 0 }, { y: 0 }, { y: 0 }, { y: 100 }]; // Data used to make the animate prop work
    const graphicColor = ['#FF9191', '#FFC891', '#F7DC6F', '#9FE2BF','#AED6F1', '#CCCCFF', ];
    const mods = ['CS2030S', 'MA2001', 'GEA1000', 'CS2040S', 'IS2218', 'Others'];

    const [graphicData, setGraphicData] = useState(defaultGraphicData);

    useEffect(() => {
        setGraphicData(wantedGraphicData);
    }, []);

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={{backgroundColor: 'white', alignItems: 'center'}}>
                    <Text style={styless.pieHeading}></Text>
                    <VictoryPie 
                        data={graphicData} 
                        width={300} 
                        height={300}
                        colorScale={graphicColor} 
                        innerRadius={60} 
                        animate={{ easing: 'exp' }}
                        padAngle={3}
                        style={{labels: {fontSize: 12, }}}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    )
} 

const styless = StyleSheet.create({

    pieHeading: {
        fontFamily: 'spacemono',
        fontSize: 20,
        paddingVertical: 20
    }

})
