import CustomButton from "@/components/ui/CustomButton";
import { ThemedView } from "@/components/ui/ThemedView";
import { router} from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Animated, useColorScheme } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useUser } from "@clerk/clerk-expo";
import { useRoute } from "@react-navigation/native";
import { isValidPhoneNumber } from "@/utils/healper";
import { AddAddressService, UpdateAddressService} from "@/services/api/addressServices";
import CustomInput from "@/components/ui/CustomInput";
import { darkMapStyle } from "@/constants/Constants";

const Page = () => {
  const { user } = useUser();
  const route:any =useRoute();
  const colorScheme = useColorScheme()
  const mapRef = useRef<MapView>(null);
  const item = route.params;

  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: 31.592419806574995,
    longitude:74.38634617254138,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [selectedLocationName, setSelectedLocationName] = useState<any>({});
  const markerAnimation = useRef(new Animated.Value(0)).current;



  const handleRegionChange = async (region: any) => {
    // Start animation
    Animated.sequence([
      Animated.timing(markerAnimation, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(markerAnimation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setCoordinates(region);
    let regionName = await Location.reverseGeocodeAsync({
      latitude: region.latitude,
      longitude: region.longitude,
    });
    setSelectedLocationName(regionName[0]);
  };

  useEffect(() => {
    const setData=async () => {
      if (item.title) {
        setTitle(item?.title);
        setPhoneNumber(item.phoneNumber);
        // setCoordinates({latitude:item.coordinates.latitude,longitude:coordinates.longitude,longitudeDelta:0.005,latitudeDelta:0.005});
      }
      let regionName = await Location.reverseGeocodeAsync(coordinates);
      setSelectedLocationName(regionName[0]);
      mapRef.current?.animateToRegion(coordinates);
    }
    setData();
  }, []);

  const handleAddressSubmit = async () => {
      setIsLoading(true);
      if (!isValidPhoneNumber(phoneNumber)) {
        throw new Error("Please enter a valid phone number");
      }

      const addressData:any = {
        title,
        phoneNumber,
        address: selectedLocationName.formattedAddress,
        city: selectedLocationName.city,
        country: selectedLocationName.country,
        countrycode: selectedLocationName.isoCountryCode,
        coordinates: {
          longitude: coordinates.longitude,
          latitude: coordinates.latitude,
        },
      };
      if (item.title) {
        await UpdateAddressService(user?.id,item._id ,addressData)
      } else {
        await AddAddressService(user?.id, addressData)
      }
      router.back();
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={()=>router.back()}>
        <Ionicons name="arrow-back" size={30} color={"white"}/>
      </TouchableOpacity>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={coordinates}
          onRegionChangeComplete={handleRegionChange}
          ref={mapRef}
          customMapStyle={colorScheme==="dark"?darkMapStyle:[]}
        />
        <Animated.View
          style={[
            styles.markerFixed,
            {
              transform: [
                {
                  translateY: markerAnimation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
            },
          ]}
        >
          <FontAwesome5 name="map-marker-alt" size={40} color={"red"} />
        </Animated.View>
      </View>

      <View style={styles.form}>
        <CustomInput
          label="Title"
          value={title}
          onChangeText={setTitle}
        />
        <CustomInput
          label="Mobile number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          validationMessage="Invalid mobile number"
          keyboardType="phone-pad"
          placeholder="Enter your phone number"
          validationFunction={isValidPhoneNumber}
        />
        <CustomInput
          label="Address"
          value={selectedLocationName?.formattedAddress}
          onChangeText={(value: string) =>
            setSelectedLocationName((prev: any) => {
              return { ...prev, formattedAddress: value };
            })
          }
          numberOfLines={2}
          placeholder="Select location on map"
        />

        <View style={styles.buttonContainer}>
          <CustomButton
            title={item.title ? "Update Address" : "Add Address"}
            onPress={handleAddressSubmit}
            isValid={title.length > 0 && isValidPhoneNumber(phoneNumber)}
            isLoading={isLoading}
          />
        </View>
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
  backButton: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 100,
    padding: 5,
    borderRadius: 30,
    backgroundColor: "rgba(175, 175, 175, 0.7)",
  },
  buttonContainer: {
    marginTop: 20,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  markerFixed: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -40,
  },
});

export default Page;
