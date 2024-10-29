import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { View, StyleSheet, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const AddAddressScreen = () => {
  const {locationCords} = useLocalSearchParams<{locationCords:string}>();
   console.log( JSON.parse(locationCords));
  const [selectedLocation, setSelectedLocation] = useState(JSON.parse(locationCords));

  const handleMapPress = (event:any) => {
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  const handleConfirmLocation = () => {
    // TODO: Handle the confirmed location (e.g., save to state, navigate back)
    console.log('Confirmed location:', selectedLocation);
    router.back();
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={selectedLocation}
        onPress={handleMapPress}
      >
        <Marker coordinate={selectedLocation} />
      </MapView>
      <Button title="Confirm Location" onPress={handleConfirmLocation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});

export default AddAddressScreen;

