import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';

const CountryButton = ({ selectedCountry, countryText, onCountrySelect }) => {

  const btnStyle = selectedCountry === countryText ? styles.countryActive : styles.countryBtn;

  return (
    <TouchableWithoutFeedback onPress={onCountrySelect}>
      <View style={btnStyle}>
        <Text style={{color: 'white'}}>{countryText}</Text>
      </View>
    </TouchableWithoutFeedback>
  )
};

const styles = StyleSheet.create({
  countryBtn: {
    backgroundColor: '#8EA2C2',
    marginLeft: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#8EA2C2'
  },
  countryActive: {
    backgroundColor: '#8B64FF',
    marginLeft: 20,
    height: 50,
    width: 50,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white'
  }
});

export default CountryButton;