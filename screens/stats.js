import React, {useState} from 'react';
import { StyleSheet, Text, SafeAreaView, View, TouchableOpacity, StatusBar} from 'react-native';
import DailyComponent from '../components/stats page components/componentA';
import WeeklyComponent from '../components/stats page components/componentB';
import Spinner from 'react-native-loading-spinner-overlay';

export default function StatisticsScreen({navigation}) {

  const [selectedTab, setSelectedTab] = useState('A');
  const [loading, setLoading] = useState(false);

  const DailyComponentMemoized = React.memo(DailyComponent);
  const WeeklyComponentMemoized = React.memo(WeeklyComponent);


  const SelectedTab = () => {
    switch (selectedTab) {
      case 'A': 
        //return <DailyComponent />;
        return <DailyComponentMemoized />
      case 'B':
        //return <WeeklyComponent />;
        return <WeeklyComponentMemoized />
      default: 
        //return <DailyComponent />;
        return <DailyComponentMemoized />
    }
  };

  return (
    <SafeAreaView style={styles.background}>

      <View style={styles.tabsToggle}>

        <View style={styles.back}></View>

        <TouchableOpacity 
            style={selectedTab === 'A' ? styles.tabChosen : styles.tabNotChosen} onPress={() => { setSelectedTab('A');}}>
          <Text style={selectedTab === 'A' ? styles.tabTextChosen : styles.tabTextNotChosen}>Daily</Text>
        </TouchableOpacity>

        <TouchableOpacity style={selectedTab === 'B' ? styles.tabChosen : styles.tabNotChosen} onPress={() => { setSelectedTab('B')}}>
          <Text style={selectedTab === 'B' ? styles.tabTextChosen : styles.tabTextNotChosen}>Weekly</Text>
        </TouchableOpacity>

      </View>

      <SelectedTab style={styles.selectedTab}/>

      <Spinner
        visible={loading}
        textContent={'Updating...'}
        textStyle={{fontFamily: 'spacemono', fontSize: 17, color: 'white',}}
        size={"large"}
      />

    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({

  background: {
    flex: 1,
    marginTop: StatusBar.currentHeight
  },

  selectedTab: {
    flex: 1,
  },

  tabsToggle: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#9AC791',
    //flex: 1,
  },

  back: {
    position: 'absolute',
    top: 20,
    left: 45,
    right: 45,
    bottom: 20,
    borderRadius: 15,
    backgroundColor: '#808080'
  },

  tabChosen: {
    //margin: 20,
    backgroundColor: '#cee2cd',
    height: 50,
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },

  tabNotChosen: {
    //margin: 20,
    backgroundColor: '#808080',
    height: 50,
    width: 150,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    
  },
  
  wholeTab: {
    height: 60,
    backgroundColor: 'blue',
  },

  tabTextChosen: {
    fontFamily: 'spacemono-bold',
    fontSize: 15,
    color: 'black',
  }, 

  tabTextNotChosen: {
    fontFamily: 'spacemono',
    fontSize: 15,
    color: 'white',
  }

})