import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import GetLocation from 'react-native-get-location';
import axios from 'axios';
import {apiKey} from '../utils/apiKey';

const Home = ({navigation, route}) => {
  const destination = route?.params?.details;
  const geometry = destination?.geometry;
  const location = geometry?.location;
  const latitude = location?.lat;
  const longitude = location?.lng;

  const formatted_address = destination?.formatted_address;

  console.log(latitude, longitude, formatted_address, '--from home');

  const mapRef = useRef();
  const [userLocation, setuserLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [origin, setorigin] = useState(null);

  useEffect(() => {
    const getLocation = () => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 10000,
      })
        .then(async location => {
        
          setuserLocation({
            latitude: location.latitude,
            longitude: location.longitude,
          });

          if (mapRef) {
            mapRef.current.animateToRegion({
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005,
            });
          }

          const {data} =
            await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.latitude},${location.longitude}&key=${apiKey}
          `);
          console.log(data.results[0].formatted_address,'--from current location');
          setorigin(data.results[0].formatted_address);
        })
        .catch(error => {
          const {code, message} = error;
          console.warn(code, message);
        });
    };
    getLocation();
  }, []);

  useEffect(() => {
    if (latitude && longitude) {
      const coordinates = [
        {latitude: userLocation.latitude, longitude: userLocation.longitude},
        {
          latitude: latitude,
          longitude: longitude,
        },
      ];

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: {top: 50, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }, [latitude, longitude, userLocation]);

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      {/* ///First Box/// */}
      <View style={{flex: 0.7}}>
        <MapView
          ref={mapRef}
          style={{flex: 1}}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={false}
          showsMyLocationButton={false}
          initialRegion={{
            latitude: userLocation ? userLocation?.latitude : 37.78825,
            longitude: userLocation ? userLocation?.longitude : -122.4324,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker
            coordinate={{
              latitude: userLocation?.latitude,
              longitude: userLocation?.longitude,
            }}
          />

          {longitude && latitude && (
            <Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              pinColor="green"
            />
          )}
        </MapView>
        {/* ////Menu box//// */}

        <View
          style={{
            position: 'absolute',
            right: 20,
            top: 35,
            left: 20,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}>
          <View
            style={{
              height: 40,
              width: 40,
              borderRadius: 100,
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Ionicons name="menu" size={27} color="grey" />
          </View>

          <View
            style={{
              backgroundColor: 'white',
              flex: 1,
              borderRadius: 20,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
            }}>
            <Entypo name="circle" size={18} color="green" />
            <TextInput
              style={{flex: 1}}
              value={origin}
              numberOfLines={1}
              placeholder="Current Location"
            />
          </View>
        </View>
      </View>

      {/* ///Second Box/// */}
      <View
        style={{
          flex: 0.3,
          padding: 20,
        }}>
        <View
          style={{
            backgroundColor: '#EEEEEE',
            flex: 1,
            borderRadius: 25,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Destination')}
            style={{
              backgroundColor: 'white',
              margin: 10,
              borderRadius: 15,
              paddingHorizontal: 10,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
            <Ionicons name="search" color="black" size={25} />
            <TextInput
              style={{flex: 1, color: 'black'}}
              value={formatted_address}
              placeholder="Where are you going ?"
              placeholderTextColor={'grey'}
              editable={false}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
