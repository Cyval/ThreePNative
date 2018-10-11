import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const ChartPeriodButton = ({ selectedChartPeriod, periodText, onChartPeriodSelect }) => {

  const btnStyle = selectedChartPeriod === periodText ? styles.chartPeriodActive : styles.chartPeriodBtn;

  return (
    <TouchableWithoutFeedback onPress={onChartPeriodSelect}>
      <View style={btnStyle}>
        <Text style={{color: 'white'}}>{periodText}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
};

const styles = StyleSheet.create({
  chartPeriodBtn: {
    padding: 5,
    backgroundColor: '#8EA2C2',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#8EA2C2'
  },
  chartPeriodActive: {
    padding: 5,
    backgroundColor: '#8B64FF',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'white'
  }
});

export default ChartPeriodButton;