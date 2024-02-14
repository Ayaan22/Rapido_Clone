import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import GetLocation from 'react-native-get-location';
import axios from 'axios';
import {apiKey} from '../utils/apiKey';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {getDistance} from 'geolib';

const Home = ({navigation, route}) => {
  const destination = route?.params?.details;
  const fromMetersToKms = route?.params?.fromMetersToKms;
  const geometry = destination?.geometry;
  const location = geometry?.location;
  const latitude = location?.lat;
  const longitude = location?.lng;

  const [isRideSelected, setisRideSelected] = useState(false);
  const [captain, setcaptain] = useState([]);
  const [rideData, setrideData] = useState([]);

  console.log(captain, '----riderr');

  // Generate 5 persons data around the given latitude and longitude
  const captainData = [
    {id: 1, lat: 37.3821571, long: -122.0923715, name: 'Person 1'},
    {id: 2, lat: 37.3887415, long: -122.08536930000001, name: 'Person 2'},
    {id: 3, lat: 37.3827878, long: -122.077937, name: 'Person 3'},
    {id: 4, lat: 37.3782852, long: -122.0866501, name: 'Person 4'},
    {id: 5, lat: 37.3770582, long: -122.0816042, name: 'Person 5'},
  ];

  const formatted_address = destination?.formatted_address;

  const mapRef = useRef();
  const [userLocation, setuserLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const [origin, setorigin] = useState(null);

  const coordinates = [
    {latitude: userLocation.latitude, longitude: userLocation.longitude},
    {
      latitude: latitude,
      longitude: longitude,
    },
  ];

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
          console.log(
            data.results[0].formatted_address,
            '--from current location',
          );
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
        edgePadding: {top: 200, right: 50, bottom: 50, left: 50},
        animated: true,
      });
    }
  }, [latitude, longitude, userLocation]);

  const handleGetCaptain = ({title, getRideModePrice}) => {
    setrideData({title: title, getRideModePrice: getRideModePrice});

    let closedCaptain = null;
    let minDistance = Infinity;
    captainData.forEach(captain => {
      const distacne = getDistance(
        {latitude: captain.lat, longitude: captain.long},
        {latitude: userLocation?.latitude, longitude: userLocation?.longitude},
      );
      if (distacne < minDistance) {
        minDistance = distacne;
        closedCaptain = captain;
      }
    });

    setisRideSelected(true);
    setcaptain(closedCaptain);
    console.log(closedCaptain, '---->captain');
  };

  const getOpt = () => {
    const otp = Math.floor(Math.random() * 9000) + 1000;
    return otp.toString();
  };

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

          {captainData &&
            captainData.map((item, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: item?.lat,
                  longitude: item?.long,
                }}
                pinColor="yellow"
              />
            ))}

          {longitude && latitude && (
            <Marker
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              pinColor="green"
            />
          )}

          {longitude && latitude && (
            <Polyline
              coordinates={coordinates}
              strokeColor="black" // fallback for when `strokeColors` is not supported by the map-provider
              strokeWidth={1.7}
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
          flex: 0.35,
          padding: 20,
        }}>
        <View
          style={{
            backgroundColor: '#EEEEEE',
            flex: 1,
            borderRadius: 25,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('Destination', {userLocation})}
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

          {/* ////Ride Options /// */}

          {longitude && latitude && !isRideSelected && (
            <View style={{}}>
              <RideOption
                icon={'bicycle'}
                title={'Bike'}
                fromMetersToKms={fromMetersToKms}
                onPress={handleGetCaptain}
              />
              <RideOption
                icon={'car-sport-sharp'}
                title={'Car'}
                fromMetersToKms={fromMetersToKms}
                onPress={handleGetCaptain}
              />
              <RideOption
                icon={'car'}
                title={'Auto'}
                fromMetersToKms={fromMetersToKms}
                onPress={handleGetCaptain}
              />
            </View>
          )}

          {isRideSelected && (
            <View>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 17,
                  color: 'black',
                  fontWeight: '800',
                }}>
                Captain name: {captain.name}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 17,
                  color: 'black',
                  fontWeight: '800',
                }}>
                Ride Mode: {rideData?.title}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 17,
                  color: 'black',
                  fontWeight: '800',
                }}>
                Ride Price: $ {rideData?.getRideModePrice()}
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 17,
                  color: 'black',
                  fontWeight: '800',
                }}>
                Ride OTP: {getOpt()}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});

const RideOption = ({title, onPress, icon, fromMetersToKms}) => {
  const getRideModePrice = () => {
    if (title == 'Bike') {
      return Math.round(9 * fromMetersToKms);
    } else if (title == 'Car') {
      return Math.round(25 * fromMetersToKms);
    } else {
      return Math.round(20 * fromMetersToKms);
    }
  };
  return (
    <TouchableOpacity
      onPress={() =>
        onPress({title: title, getRideModePrice: getRideModePrice})
      }
      style={{
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 5,
        borderRadius: 5,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <Ionicons name={icon} size={20} color="black" />
        <Text style={{color: 'black', fontSize: 15, fontWeight: '600'}}>
          {title}
        </Text>
      </View>

      <Text style={{color: 'black', fontSize: 15, fontWeight: '600'}}>
        ₹ {getRideModePrice()}
      </Text>
    </TouchableOpacity>
  );
};
