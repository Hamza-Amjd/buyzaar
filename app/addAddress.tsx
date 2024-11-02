import CustomButton from "@/components/CustomButton";
import CustomTextInput from "@/components/CustomTextInput";
import { ThemedView } from "@/components/ThemedView";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Button,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";

const AddAddressScreen = () => {
  const user = useAuth();
  const { address, edit } = useLocalSearchParams<{ address: string ,edit:string }>();
  const addres=JSON.parse(address)
  const [title, setTitle] = useState(addres.title || "");
  const [phoneNumber, setPhoneNumber] = useState(addres.phoneNumber || "");
  const [selectedLocation, setSelectedLocation] = useState({
    ...addres.coordinates,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [selectedLocationName, setSelectedLocationName] = useState<any>([]);

  const handleMapPress = async (event: any) => {
    setSelectedLocation(event.nativeEvent.coordinate);
    console.log(event.nativeEvent.coordinate);
    let regionName = await Location.reverseGeocodeAsync(
      event.nativeEvent.coordinate
    );
    setSelectedLocationName(regionName[0]);
    console.log(regionName);
  };

  useEffect(() => {
    (async () => {
      let regionName = await Location.reverseGeocodeAsync(selectedLocation);
      setSelectedLocationName(regionName[0]);
    })();
  }, []);

  const handleAddAddress = async () => {
    await axios
      .post(`https://buyzaar.vercel.app/api/users/address`, {
        userId: user.userId,
        address: {
          title,
          address: selectedLocationName.formattedAddress,
          city: selectedLocationName.city,
          country: selectedLocationName.country,
          countrycode: selectedLocationName.isoCountryCode,
          phoneNumber,
          coordinates: {
            longitude: selectedLocation.longitude,
            latitude: selectedLocation.latitude,
          },
        },
      })
      .then((response) => console.log(response.data))
      .then((res) => router.back())
      .catch((error) => console.log(error));
  };

  const handleUpdateAddress = async () => {
    let values={
      userId: user.userId,
      addressId:addres._id,
      updatedAddress: {
        title,
        address: selectedLocationName.formattedAddress,
        city: selectedLocationName.city,
        country: selectedLocationName.country,
        countrycode: selectedLocationName.isoCountryCode,
        phoneNumber,
        coordinates: {
          longitude: selectedLocation.longitude,
          latitude: selectedLocation.latitude,
        },
      },
    }
    console.log(values);
    await axios
      .put(`https://buyzaar.vercel.app/api/users/address`, values, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => console.log(response.data))
      .then((res) => router.back())
      .catch((error) => console.log(error));
  };
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={{ position: "absolute", top: 45, left: 20, zIndex: 100 }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={30} color={Colors.light.primary} />
      </TouchableOpacity>
      <MapView
        style={styles.map}
        initialRegion={selectedLocation}
        onPress={handleMapPress}
      >
        <Marker coordinate={selectedLocation} />
      </MapView>
      <View style={styles.form}>
        <CustomTextInput title="Title" value={title} handleChange={setTitle} />
        <CustomTextInput
          title="Mobile number"
          value={phoneNumber}
          handleChange={setPhoneNumber}
          keyboardType={"number-pad"}
        />
        <CustomTextInput
          title="Address"
          value={selectedLocationName?.formattedAddress}
          handleChange={(value:string)=>setSelectedLocationName((prev:any)=>{return {...prev,formattedAddress:value}})}
          numberOfLines={2}
        />
        <View style={{marginTop:10}}>
        {edit?
        <CustomButton
        title="Update Address"
        onPress={handleUpdateAddress}
        isValid={title.length>0 && phoneNumber.length>0}
      />
        :<CustomButton
          title="Add Address"
          onPress={handleAddAddress}
          isValid={title.length>0 && phoneNumber.length>0}
        />}</View>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  input: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
});

export default AddAddressScreen;
