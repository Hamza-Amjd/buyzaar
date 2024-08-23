import { ScrollView, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React, { useState } from 'react'
import { BottomModal, ModalContent, SlideAnimation } from 'react-native-modals';
import { Colors } from '@/constants/Colors';
import { ThemedText } from './ThemedText';
import { Entypo } from '@expo/vector-icons';
import { router } from 'expo-router';

type addressBottomModalProps = {
    addresses: any[],
    isVisible: boolean,
    handleClose: () => void,
    handleAddAddress: () => void,
    selectedAddress: any,
    setSelectedAdress: (address: any) => void,
}

const AddressBottomModal = ({isVisible,handleClose,addresses,handleAddAddress,selectedAddress,setSelectedAdress}:addressBottomModalProps) => {
    const colorScheme = useColorScheme();
  return (
    <BottomModal
        //@ts-ignore
        onHardwareBackPress={handleClose}
        visible={isVisible}
        modalAnimation={new SlideAnimation({ slideFrom: "bottom" })}
        onTouchOutside={handleClose}
        swipeDirection={["up", "down"]}
        swipeThreshold={200}
        onSwipeOut={handleClose}
      >
        <ModalContent
          style={{
            width: "100%",
            height: 300,
            backgroundColor: Colors[colorScheme ?? "light"].background,
          }}
        >
          <View style={{ marginBottom: 8 }}>
            <ThemedText style={{ fontSize: 16, fontWeight: "500" }}>
              Choose your Location
            </ThemedText>

            <Text style={{ marginTop: 5, fontSize: 16, color: "gray" }}>
              Select a delivery location to see product availabilty and delivery
              options
            </Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {/* @ts-ignore */}
            {addresses.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedAdress(item)}
                style={[
                  styles.addressContainer,
                  {
                    backgroundColor:
                      selectedAddress === item ? "#FBCEB1" : "white",
                  },
                ]}
              >
                <View style={styles.row}>
                  <Text style={{ fontSize: 13, fontWeight: "bold" }}>
                    {item.name}
                  </Text>
                  <Entypo name="location-pin" size={24} color="red" />
                </View>

                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item.streetAddress}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ width: 130, fontSize: 13, textAlign: "center" }}
                >
                  {item.city}, {item.country}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              onPress={handleAddAddress}
              style={styles.addAddressContainer}
            >
              <Text style={styles.addAddressTxt}>
                Add an Address or pick-up point
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </ModalContent>
      </BottomModal>
  )
}

export default AddressBottomModal

const styles = StyleSheet.create({
    addressContainer: {
        width: 140,
        height: 140,
        borderColor: "#D0D0D0",
        borderWidth: 1,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        gap: 3,
        marginRight: 15,
        marginTop: 10,
        borderRadius: 10,
      },
      row: { flexDirection: "row", alignItems: "center", gap: 3 },
      addAddressContainer: {
        width: 140,
        height: 140,
        borderColor: "#D0D0D0",
        marginTop: 10,
        borderWidth: 1,
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
      },
      addAddressTxt: {
        textAlign: "center",
        color: "#0066b2",
        fontWeight: "500",
      },
})