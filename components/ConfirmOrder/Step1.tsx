import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { ThemedText } from '../ThemedText'
import { Colors } from '@/constants/Colors'
import { Entypo,FontAwesome5 } from '@expo/vector-icons'
import { router } from 'expo-router'

type step1props={
    addresses: any[],
    selectedAddress: any,
    setSelectedAdress: (address: any) => void,
    styles: any,
    handleNext: () => void,
  
}

const Step1:React.FC<step1props> = ({addresses,selectedAddress,setSelectedAdress,styles,handleNext}) => {
    const colorScheme = useColorScheme();
  return (
    
    <View style={styles.detailsContainer}>
    <View>
      <ThemedText type="heading">
        Select Delivery Address
      </ThemedText>

        {addresses.map((item:any) => (
          <TouchableOpacity key={item._id} style={[styles.itemContainer,{backgroundColor:Colors[colorScheme??'light'].background2}]} onPress={() => setSelectedAdress(item)}>
            {selectedAddress && selectedAddress._id == item._id ? (
              <FontAwesome5
                name="dot-circle"
                size={20}
                color={Colors[colorScheme??'light'].primary}
              />
            ) : (
              <Entypo
                name="circle"
                size={20}
                color="gray"
              />
            )}

            <View style={{ marginLeft: 6 }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 3,
                }}
              >
                <ThemedText type="defaultSemiBold">
                  {item.name}
                </ThemedText>
                <Entypo name="location-pin" size={24} color="red" />
              </View>

              <ThemedText  type='default'>
                {item.streetAddress +
                  ", " +
                  item.city +
                  ", " +
                  item.country}
              </ThemedText>

              <ThemedText  type='default'>
                Contact : {item.mobileNo}
              </ThemedText>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 10,
                  marginTop: 7,
                }}
              >
                <TouchableOpacity style={styles.subButton}>
                  <Text>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.subButton}>
                  <Text>Remove</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.subButton}>
                  <Text>Set as Default</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[styles.itemContainer,{backgroundColor:Colors[colorScheme??'light'].background2,justifyContent:'center'}]} onPress={()=>router.push('/address')}>
            <Entypo name="location-pin" size={25} color={"red"}/>
            <ThemedText type='defaultSemiBold' >Press to add a new Address </ThemedText>

        </TouchableOpacity>
    </View>
    <TouchableOpacity
      onPress={handleNext}
      style={[
        styles.button,
        !selectedAddress && {backgroundColor:Colors[colorScheme??'light'].gray}]}
      disabled={!selectedAddress}
    >
      <Text style={styles.btnTxt}>
        Deliver to this Address
      </Text>
    </TouchableOpacity>
  </View>
  )
}

export default Step1
