import {StyleSheet, Text, View, Image, StatusBar} from 'react-native';
import React, {useEffect} from 'react';

const Splash = ({navigation}) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Home');
    }, 3000);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <StatusBar hidden />
      <Image
        style={{height: 250, width: '100%', resizeMode: 'contain'}}
        source={{
          uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSO13yO3VMNr-BkLalM84P0vCkkgxhjUe75S1kVabSdKA&s',
        }}
      />
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({});
