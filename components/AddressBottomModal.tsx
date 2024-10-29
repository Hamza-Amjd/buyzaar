import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { BottomModal, ModalContent } from "react-native-modals";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import useLocation from "@/hooks/useLocation";
import { router } from "expo-router";

type addressModalProps = {
  isVisible: boolean;
  handleClose: () => void;
};

export default function AddressBottomModal({
  isVisible,
  handleClose,
}: addressModalProps) {
  const colorScheme = useColorScheme();
  const { location, locationCords } = useLocation();
  const [selectedAddress, setSelectedAddress] = useState<number>(0);
  const addresses = [
    { id: 1, title: "Home", address: "WAPDA Hospital Dispensary Lahore" },
    { id: 2, title: "Work", address: "WAPDA Hospital Dispensary Lahore" },
    { id: 3, title: "Hamza", address: "WAPDA Hospital Dispensary Lahore" },
  ];

  return (
    <BottomModal
      visible={isVisible}
      onTouchOutside={handleClose}
      onSwipeOut={handleClose}
      style={{borderRadius: 100}}
    >
      <ModalContent
        style={{ backgroundColor: Colors[colorScheme ?? "light"].background }}
      >
        {locationCords ? (
          <MapView
            style={styles.map}
            initialRegion={locationCords}
            scrollEnabled={false}
          >
            <Marker coordinate={locationCords} />
          </MapView>
        ) : (
          <View style={styles.map} />
        )}
        <ThemedView style={styles.content}>
          <TouchableOpacity onPress={()=>setSelectedAddress(0)} style={styles.currentLocation}>
            <MaterialIcons
              name="my-location"
              color={selectedAddress === 0 ? Colors[colorScheme ?? "light"].primary : Colors[colorScheme ?? "light"].text}
              size={24}
            />
            <View style={styles.locationThemedText}>
              <ThemedText type="defaultSemiBold">Current Location</ThemedText>
              <ThemedText style={styles.text}>
                {location?.formattedAddress?.slice(10)}
              </ThemedText>
            </View>
          </TouchableOpacity>
          <ScrollView style={styles.addressList}>
            {addresses.map((address) => (
              <TouchableOpacity onPress={()=>setSelectedAddress(address.id)} key={address.id} style={styles.addressItem}>
                {selectedAddress === address.id ? (
                  <FontAwesome5
                    name="dot-circle"
                    color={Colors[colorScheme ?? "light"].primary}
                    size={20}
                    style={{ marginRight: 10 }}
                  />
                ) : (
                  <FontAwesome5
                    name="circle"
                    color={Colors[colorScheme ?? "light"].text}
                    size={20}
                    style={{ marginRight: 10 }}
                  />
                )}
                {address.title === "Home" ? (
                  <FontAwesome5 name="home" color="#6B7280" size={24} />
                ) : address.title === "Work" ? (
                  <FontAwesome5 name="briefcase" color="#6B7280" size={24} />
                ) : (
                  <FontAwesome5 name="map-marker-alt" color="#6B7280" size={24}/>
                )}
                <View style={styles.addressThemedText}>
                  <ThemedText type="defaultSemiBold">
                    {address.title}
                  </ThemedText>
                  <ThemedText style={styles.text}>{address.address}</ThemedText>
                </View>
                <TouchableOpacity>
                  <MaterialIcons name="edit" color="#6B7280" size={20} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity onPress={()=>router.push(`/addAddress?locationCords=${JSON.stringify(locationCords)}`)} style={styles.addButton}>
            <Ionicons
              name="add"
              color={Colors[colorScheme ?? "light"].primary}
              size={24}
            />
            <ThemedText
              type="defaultSemiBold"
              style={{ color: Colors[colorScheme ?? "light"].primary }}
            >
              Add New Address
            </ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ModalContent>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 200,
    backgroundColor: "#e9e7eb",
    borderRadius: 16,
  },
  content: {
    padding: 16,
    overflow: "hidden",
  },
  currentLocation: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  locationThemedText: {
    marginLeft: 12,
  },
  text: {
    fontSize: 12,
    color: "#6B7280",
  },
  addressList: {
    maxHeight: 200,
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  addressIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
  },
  addressThemedText: {
    flex: 1,
    marginLeft: 12,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    padding: 12,
    backgroundColor: "#e9e7eb",
    borderRadius: 8,
  },
  addButtonThemedText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "500",
    color: "#",
  },
});
