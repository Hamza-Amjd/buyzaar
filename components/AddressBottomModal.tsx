import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  BackHandler
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import {
  FontAwesome5,
  Ionicons,
  MaterialIcons,
} from "@expo/vector-icons";
import { BottomModal, ModalContent } from "react-native-modals";
import { ThemedView } from "./ThemedView";
import { ThemedText } from "./ThemedText";
import { Colors } from "@/constants/Colors";
import useLocation from "@/hooks/useLocation";
import { router, useFocusEffect } from "expo-router";
import axios from "axios";
import { useUser } from "@clerk/clerk-expo";
import CenterModal from "./CenterModal";
import * as Haptics from "expo-haptics";
import CustomButton from "./CustomButton";

type addressModalProps = {
  isVisible: boolean;
  setAddress: (address: any) => void;
  handleClose: () => void;
};

export default function AddressBottomModal({
  isVisible,
  handleClose,
  setAddress,
}: addressModalProps) {
  const {user} = useUser();
  const colorScheme = useColorScheme();
  const { location, locationCords } = useLocation();
  const [addresses, setAddresses] = useState<any[]>();
  const [selectedAddress, setSelectedAddress] = useState<any>();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const backAction = () => {
      if (isVisible) {
        handleClose();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, [isVisible, handleClose]);
  const fetchaddresses = async () => {
    setIsLoading(true);
    await axios.post(`https://buyzaar.vercel.app/api/users`, {
      userId: user?.id,
    }).catch((err)=>console.log(err));
    await axios
      .get(`https://buyzaar.vercel.app/api/users/address/${user?.id}`)
      .then((response) => setAddresses(response.data.addresses))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };
  useFocusEffect(
    useCallback(() => {
      if (user?.id) fetchaddresses();
    }, [])
  );

  const handleAddAddress = () => {
    if (!user?.id) {
      router.replace("/(auth)");
      return;
    }
    router.push(
      `/addAddress?address=${JSON.stringify({
        title: null,
        address: null,
        coordinates: locationCords,
      })}`
    );
    handleClose();
  };

  const handleDelete = async () => {
    await fetch(`https://buyzaar.vercel.app/api/users/address`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user?.id,
        addressId: selectedAddress._id,
      }),
    })
      .then(() => {
        fetchaddresses();
        setShowInfoModal(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <BottomModal
        visible={isVisible}
        onTouchOutside={handleClose}
        onSwipeOut={handleClose}
        style={{ borderRadius: 100 }}
      >
        <ModalContent
          style={{ backgroundColor: Colors[colorScheme ?? "light"].background }}
        >
          <View style={styles.bar} />
          <ThemedView style={styles.content}>
            <View style={styles.addressList}>
              <TouchableOpacity
                onPress={() => {
                  setSelectedAddress(null);
                  setAddress(location);
                }}
                style={styles.currentLocation}
              >
                {!selectedAddress ? (
                  <MaterialIcons
                    name="my-location"
                    color={Colors[colorScheme ?? "light"].primary}
                    size={24}
                  />
                ) : (
                  <MaterialIcons
                    name="location-searching"
                    color={
                      selectedAddress
                        ? Colors[colorScheme ?? "light"].text
                        : Colors[colorScheme ?? "light"].primary
                    }
                    size={24}
                  />
                )}
                <View style={styles.locationThemedText}>
                  <ThemedText type="defaultSemiBold">
                    Current Location
                  </ThemedText>
                  <ThemedText style={styles.text}>
                    {location?.formattedAddress}
                  </ThemedText>
                </View>
              </TouchableOpacity>
              {isLoading ? (
                <ActivityIndicator
                  size="large"
                  color={Colors[colorScheme ?? "light"].primary}
                  style={{ marginVertical: 20 }}
                />
              ) : (
                addresses?.map((address) => (
                  <TouchableOpacity
                    key={address._id}
                    onPress={() => {
                      setSelectedAddress(address);
                      setAddress(address);
                    }}
                    onLongPress={() => {
                      setSelectedAddress(address);
                      setShowInfoModal(true);
                      setAddress(address);
                      Haptics.impactAsync();
                    }}
                    style={styles.addressItem}
                  >
                    {selectedAddress?._id === address._id ? (
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
                      <FontAwesome5
                        name="briefcase"
                        color="#6B7280"
                        size={24}
                      />
                    ) : (
                      <FontAwesome5
                        name="map-marker-alt"
                        color="#6B7280"
                        size={24}
                      />
                    )}
                    <View style={styles.addressThemedText}>
                      <ThemedText type="defaultSemiBold">
                        {address.title}
                      </ThemedText>
                      <ThemedText style={styles.text}>
                        {address.address}
                      </ThemedText>
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        router.push(
                          `/addAddress?address=${JSON.stringify(
                            address
                          )}&edit=true`
                        );
                        handleClose();
                      }}
                    >
                      <MaterialIcons name="edit" color="#6B7280" size={23} />
                    </TouchableOpacity>
                    {showInfoModal == address._id && (
                      <TouchableOpacity
                        style={{ marginLeft: 10 }}
                        onPress={handleDelete}
                      >
                        <MaterialIcons
                          name="delete"
                          color="#ff0055"
                          size={23}
                        />
                      </TouchableOpacity>
                    )}
                  </TouchableOpacity>
                ))
              )}
            </View>
            <CustomButton title="Add New Address" onPress={handleAddAddress} icon={'plus'}/>
          </ThemedView>
        </ModalContent>
      </BottomModal>
      <CenterModal
        isVisible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        width={"95%"}
      >
        {selectedAddress?.title && (
          <>
            <MapView
              style={styles.map}
              initialRegion={{
                ...selectedAddress.coordinates,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
            >
              <Marker coordinate={selectedAddress.coordinates} />
            </MapView>
            <View style={{ marginVertical: 10 }}>
              <ThemedText type="subtitle">{selectedAddress.title}</ThemedText>
              <ThemedText type="default">{selectedAddress.address}</ThemedText>
            </View>
          </>
        )}
        <ThemedView
          style={{ alignItems: "center", padding: 20, paddingBottom: 0 }}
        >
          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={() => {
                router.push(
                  `/addAddress?address=${JSON.stringify(
                    selectedAddress
                  )}&edit=true`
                );
                setShowInfoModal(false), handleClose();
              }}
              style={[styles.actionButton, { borderColor: "#6B7280" }]}
            >
              <ThemedText>Edit</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              style={[styles.actionButton, { backgroundColor: "#ff0055" }]}
            >
              <ThemedText style={{ color: "#fff" }}>Delete</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </CenterModal>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 200,
    backgroundColor: "#e9e7eb",
    borderRadius: 16,
  },
  bar: {
    backgroundColor: "#e9e7eb",
    height: 5,
    width: 50,
    marginBottom: 10,
    borderRadius: 15,
    top: -10,
    alignSelf: "center",
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
  addressList: {},
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
  actionButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    alignItems: "center",
  },
});
