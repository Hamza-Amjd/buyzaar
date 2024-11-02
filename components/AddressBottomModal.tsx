import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Modal,
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
import { router, useFocusEffect } from "expo-router";
import axios from "axios";
import { useAuth } from "@clerk/clerk-expo";
import CenterModal from "./CenterModal";
import CustomTextInput from "./CustomTextInput";

type addressModalProps = {
  isVisible: boolean;
  handleClose: () => void;
};

export default function AddressBottomModal({
  isVisible,
  handleClose,
}: addressModalProps) {
  const user=useAuth()
  const colorScheme = useColorScheme();
  const { location, locationCords } = useLocation();
  const [addresses, setAddresses] = useState<any[]>();
  const [selectedAddress, setSelectedAddress] = useState<any>();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const fetchaddresses =async()=>{
    await axios.post(`https://buyzaar.vercel.app/api/users`,{userId:user.userId})
   await axios.get(`https://buyzaar.vercel.app/api/users/address/${user.userId}`).then((response)=>{setAddresses(response.data.addresses);}).catch((error)=>console.log(error));
  } 
  useFocusEffect(useCallback(()=>{
    fetchaddresses();
  },[]))

  const handleAddAddress = ()=>{
    router.push(`/addAddress?address=${JSON.stringify({title:null,address:null,coordinates:locationCords})}`);
    handleClose();
  }

  const handleDelete = async()=>{
    await fetch(`https://buyzaar.vercel.app/api/users/address`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.userId,
        addressId: selectedAddress._id
      })
    }).then(() => {
      fetchaddresses();
      setShowInfoModal(false);
    }).catch(error => console.log(error));
  }

  return (
    <>
    <BottomModal
      visible={isVisible}
      onTouchOutside={handleClose}
      onSwipeOut={handleClose}
      style={{borderRadius: 100}}
    >
      <ModalContent
        style={{ backgroundColor: Colors[colorScheme ?? "light"].background }}
      >
        <View style={styles.bar}/>
        {/* {locationCords ? (
          <MapView
            style={styles.map}
            initialRegion={selectedAddress?{...selectedAddress.coordinates,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005}:locationCords}
            scrollEnabled={false}
            userInterfaceStyle={colorScheme === 'dark' ? 'dark' : 'light'}
          >
            <Marker coordinate={locationCords} />
          </MapView>
        ) : (
          <View style={styles.map} />
        )} */}
        <ThemedView style={styles.content}>
          
          <View style={styles.addressList}>
            <TouchableOpacity onPress={()=>setSelectedAddress(null)} style={styles.currentLocation}>
            {!selectedAddress?<MaterialIcons
              name="my-location"
              color={Colors[colorScheme ?? "light"].primary}
              size={24}
            />:<MaterialIcons
            name="location-searching"
            color={Colors[colorScheme ?? "light"].primary}
            size={24}
          />}
            <View style={styles.locationThemedText}>
              <ThemedText type="defaultSemiBold">Current Location</ThemedText>
              <ThemedText style={styles.text}>
                {location?.formattedAddress}
              </ThemedText>
            </View>
          </TouchableOpacity>
          {addresses?.map((address) => (
              <TouchableOpacity key={address._id} onPress={()=>setSelectedAddress(address)} onLongPress={()=>{setSelectedAddress(address);setShowInfoModal(true)}} style={styles.addressItem}>
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
                
                <TouchableOpacity onPress={()=>{router.push(`/addAddress?address=${JSON.stringify(address)}&edit=true`);handleClose()}}>
                  <MaterialIcons name="edit" color="#6B7280" size={23} />
                </TouchableOpacity>
                {showInfoModal==address._id && 
                <TouchableOpacity style={{marginLeft:10}} onPress={handleDelete}>
                <MaterialIcons name="delete" color="#ff0055" size={23}/>
              </TouchableOpacity>}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity onPress={handleAddAddress} style={styles.addButton}>
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
    <CenterModal
      isVisible={showInfoModal}
      onClose={() => setShowInfoModal(false)}
      width={"95%"}
    >
      {selectedAddress?.title&&<>
        <MapView
            style={styles.map}
            initialRegion={{...selectedAddress.coordinates,
              latitudeDelta: 0.005,
              longitudeDelta: 0.005}}
            scrollEnabled={false}
          >
            <Marker coordinate={selectedAddress.coordinates} />
          </MapView>
      <CustomTextInput value={selectedAddress.title} />
      <CustomTextInput value={selectedAddress.address} /></>}
        <ThemedView style={{alignItems: 'center', padding: 20,paddingBottom:0}}>
          <View style={{flexDirection: 'row', gap: 10}}>
            <TouchableOpacity 
              onPress={() => {router.push(`/addAddress?address=${JSON.stringify(selectedAddress)}&edit=true`);setShowInfoModal(false),handleClose()}}
              style={{
                padding: 12,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#6B7280',
                flex: 1,
                alignItems: 'center'
              }}
            >
              <ThemedText>Edit</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={handleDelete}
              style={{
                padding: 12,
                borderRadius: 8,
                backgroundColor: '#ff0055',
                flex: 1,
                alignItems: 'center'
              }}
            >
              <ThemedText style={{color: '#fff'}}>Delete</ThemedText>
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
  bar:{
    backgroundColor: "#e9e7eb",
    height: 5,
    width: 50,
    marginBottom:10,
    borderRadius: 15,
    top:-10,
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
  addressList: {
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
