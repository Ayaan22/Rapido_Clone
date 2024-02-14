import {Alert, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {apiKey} from '../utils/apiKey';
import { getDistance } from 'geolib';

const Destination = ({navigation, route}) => {
  const userLocation=route?.params?.userLocation
  const {latitude,longitude}=userLocation
  console.log(latitude,longitude,'from origin');

const handlePlaceClick=(data,details=null)=>{
const {geometry}=details
if (geometry&&geometry.location) {
  const {lat:destLat,lng:destLong}=geometry.location
  const distance=getDistance({latitude:latitude,longitude:longitude},{
    latitude:destLat,longitude:destLong
  })
  const fromMetersToKms=distance/1000
  console.log(fromMetersToKms,'kms');
  if (fromMetersToKms<=50) {
    navigation.navigate('Home', {details,fromMetersToKms});
  }else{
    Alert.alert("The destination is too far away.")
  }
} 

}



  return (
    <View style={{flex: 1, padding: 20, gap: 20}}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Ionicons
          name="chevron-back"
          size={25}
          color="black"
          onPresS={() => navigation.goBack()}
        />
        <Text
          style={{color: 'black', fontSize: 20, textAlign: 'center', flex: 1}}>
          Select Destination
        </Text>
      </View>
      <GooglePlacesAutocomplete
        placeholder="Search"
        onPress={handlePlaceClick}
        // onPress={(data, details = null) => {
        //   navigation.navigate('Home', {details});
        // }}
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
