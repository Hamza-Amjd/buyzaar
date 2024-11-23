import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
// import { BottomModal, ModalContent } from "react-native-modals";
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
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetView,
  useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

type addressModalProps = {
  setAddress: (address: any) => void;
  bottomSheetModalRef:any;
};

export default function AddressBottomModal({
  setAddress,
  bottomSheetModalRef
}: addressModalProps) {
  const { user } = useUser();
  const colorScheme = useColorScheme();
  const mapRef = useRef<MapView | null>(null);
  const { location, locationCords } = useLocation();
  const [addresses, setAddresses] = useState<any[]>();
  const [selectedAddress, setSelectedAddress] = useState<any>();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {dismiss}= useBottomSheetModal();
  
  const fetchaddresses = async () => {
    setIsLoading(true);
    await axios
      .post(`https://buyzaar.vercel.app/api/users`, {
        userId: user?.id,
      })
      .catch((err) => console.log(err));
    await axios
      .get(`https://buyzaar.vercel.app/api/users/address/${user?.id}`)
      .then((response) => setAddresses(response.data.addresses))
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };
  useFocusEffect(
    useCallback(() => {
      fetchaddresses();
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
    dismiss();
  };

  const handleDelete = async () => {
    setIsLoading(true);
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
        setIsLoading(false);
        setShowInfoModal(false);
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
        <BottomSheetModal
          ref={bottomSheetModalRef} 
          containerStyle={{backgroundColor: "rgba(0,0,0,0.6)",}}
          backgroundStyle={{backgroundColor: Colors[colorScheme ?? "light"].background}}
          handleIndicatorStyle={{backgroundColor: Colors[colorScheme ?? "light"].text}}  
        >
          <BottomSheetView
            style={{
              backgroundColor: Colors[colorScheme ?? "light"].background,
            }}
          >
            <ThemedView style={styles.content}>
              <View>
                <TouchableOpacity
                  onPress={() => {
                    setSelectedAddress(null);
                    setAddress(location);
                    dismiss();
                  }}
                  style={styles.addressItem}
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
                  <View style={{ marginLeft: 12 }}>
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
                        dismiss();
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
                      <View style={styles.addressText}>
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
                          dismiss();
                        }}
                      >
                        <MaterialIcons name="edit" color="#6B7280" size={23} />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  ))
                )}
              </View>
              <CustomButton
                title="Add New Address"
                onPress={handleAddAddress}
                icon={"add"}
              />
            </ThemedView>
          </BottomSheetView>
        </BottomSheetModal>
      <ThemedView style={{flex:1,position:'absolute'}}>
      <CenterModal
        isVisible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        width={"90%"}
      >
        {selectedAddress?.title && (
          <>
            <MapView
              style={styles.map}
              ref={mapRef}
              initialCamera={{
                center: selectedAddress.coordinates,
                altitude: 1000,
                heading: 0,
                pitch: 0,
                zoom: 16,
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
        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity
            onPress={() => {
              router.push(
                `/addAddress?address=${JSON.stringify(
                  selectedAddress
                )}&edit=true`
              );
              setShowInfoModal(false), dismiss();
            }}
            style={[
              styles.actionButton,
              { borderWidth: 1, borderColor: "#6B7280" },
            ]}
          >
            <ThemedText>Edit</ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDelete}
            style={[styles.actionButton, { backgroundColor: "#ff0055" }]}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <ThemedText style={{ color: "#fff" }}>Delete</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </CenterModal></ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  map: {
    height: 200,
    backgroundColor: "#e9e7eb",
    borderRadius: 16,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
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
  addressText: {
    marginLeft: 12,
    width: "72%",
  },
  text: {
    fontSize: 12,
    color: "#6B7280",
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  actionButton: {
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: "center",
  },
});
