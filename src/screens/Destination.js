import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {apiKey} from '../utils/apiKey';

const Destination = ({navigation}) => {
  return (
    <View style={{flex: 1, padding: 20, gap: 20}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Ionicons name="chevron-back" size={25} color="black" onPresS={()=>navigation.goBack()} />
        <Text
          style={{color: 'black', fontSize: 20, textAlign: 'center', flex: 1}}>
          Select Destination
        </Text>
      </View>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={(data, details = null) => {
        navigation.navigate('Home',{details})
      
        }}
        query={{
          key: apiKey,
          language: 'en',
        }}
        fetchDetails
      />
    </View>
  );
};

export default Destination;

const styles = StyleSheet.create({});
