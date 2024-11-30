import CustomButton from "@/components/CustomButton";
import CustomTextInput from "@/components/CustomTextInput";
import { ThemedView } from "@/components/ThemedView";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";

const addAddress = () => {
  const { user } = useUser();
  const mapRef = useRef<MapView>(null);
  const { address, edit } = useLocalSearchParams<{
    address: string;
    edit: string;
  }>();

  const [isLoading, setIsLoading] = useState(false);

  const parsedAddress = React.useMemo(() => {
    try {
      return address ? JSON.parse(address) : {};
    } catch (e) {
      console.error("Failed to parse address:", e);
      return {};
    }
  }, [address]);

  const [title, setTitle] = useState(parsedAddress.title || "");
  const [phoneNumber, setPhoneNumber] = useState(
    parsedAddress.phoneNumber || ""
  );
  const [coordinates, setCoordinates] = useState({
    ...parsedAddress.coordinates,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  });
  const [selectedLocationName, setSelectedLocationName] = useState<any>({});
  const markerAnimation = useRef(new Animated.Value(0)).current;

  const isValidPhoneNumber = (number: string) => {
    return /^\+?[\d\s-]{10,}$/.test(number);
  };

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
    (async () => {
      let regionName = await Location.reverseGeocodeAsync(coordinates);
      setSelectedLocationName(regionName[0]);
    })();
    mapRef.current?.animateToRegion(coordinates);
  }, []);

  const handleAddressSubmit = async () => {
    try {
      setIsLoading(true);

      if (!isValidPhoneNumber(phoneNumber)) {
        throw new Error("Please enter a valid phone number");
      }

      const addressData = {
        title,
        address: selectedLocationName.formattedAddress,
        city: selectedLocationName.city,
        country: selectedLocationName.country,
        countrycode: selectedLocationName.isoCountryCode,
        phoneNumber,
        coordinates: {
          longitude: coordinates.longitude,
          latitude: coordinates.latitude,
        },
      };

      const endpoint = "https://buyzaar.vercel.app/api/users/address";
      if (edit) {
        await axios.put(endpoint, {
          userId: user?.id,
          addressId: parsedAddress._id,
          updatedAddress: addressData,
        });
      } else {
        await axios.post(endpoint, {
          userId: user?.id,
          address: addressData,
        });
      }

      router.back();
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={()=>router.back()}>
        <Ionicons name="arrow-back" size={35} color={"grey"}/>
      </TouchableOpacity>
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={coordinates}
          onRegionChangeComplete={handleRegionChange}
          region={coordinates}
          showsMyLocationButton
          showsUserLocation
          ref={mapRef}
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
        <CustomTextInput
          title="Title"
          value={title}
          handleChange={setTitle}
          placeholder="Enter address title (e.g., Home, Office)"
        />
        <CustomTextInput
          title="Mobile number"
          value={phoneNumber}
          handleChange={setPhoneNumber}
          keyboardType="phone-pad"
          placeholder="Enter your phone number"
          error={phoneNumber.length > 0 && !isValidPhoneNumber(phoneNumber)}
          errorText="Please enter a valid phone number"
        />
        <CustomTextInput
          title="Address"
          value={selectedLocationName?.formattedAddress}
          handleChange={(value: string) =>
            setSelectedLocationName((prev: any) => {
              return { ...prev, formattedAddress: value };
            })
          }
          numberOfLines={2}
          placeholder="Select location on map"
        />

        <View style={styles.buttonContainer}>
          <CustomButton
            title={edit ? "Update Address" : "Add Address"}
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
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
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

export default addAddress;
