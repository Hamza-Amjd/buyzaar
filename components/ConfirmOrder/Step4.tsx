import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { ThemedText } from '../ThemedText'
import { Colors } from '@/constants/Colors'
import { MaterialIcons } from '@expo/vector-icons'
import SearchTile from '../SearchTile'
import { numberWithCommas } from '@/utils/healper'

type step4props ={
  styles: any,
  selectedAddress: any,
  totalPrice: any,
  cart: any,
  handleSubmit: any
}

const Step4:React.FC<step4props> = ({styles,selectedAddress,totalPrice,cart,handleSubmit}) => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.detailsContainer}>
          <View>
          <ThemedText type="heading">Order Now</ThemedText>

            <View
              style={[
                styles.itemContainer,
                { backgroundColor:Colors[colorScheme??'light'].background2, justifyContent: "space-between" },
              ]}
            >
              <View>
                <ThemedText style={{ fontSize: 17, fontWeight: "bold" }}>
                  Save 5% and never run out
                </ThemedText>
                <ThemedText style={{ fontSize: 15, color: "gray", marginTop: 5 }}>
                  Turn on auto deliveries
                </ThemedText>
              </View>

              <MaterialIcons
                name="keyboard-arrow-right"
                size={24}
                color={Colors[colorScheme??'light'].text}
              />
            </View>

            <View
              style={[styles.itemListContainer,{backgroundColor:Colors[colorScheme??'light'].background2}]}
            >
              <ThemedText type="subtitle">Shipping to {selectedAddress.name}</ThemedText>

              <View style={styles.subItemContainer}>
                <ThemedText type="default"
                  style={{ color: "gray" }}
                >
                  Items
                </ThemedText>
                
                <ThemedText type="default" style={{ color: "gray", fontSize: 16 }}>
                  $ {numberWithCommas(totalPrice)}
                </ThemedText>
              </View>
              <View >
                  {cart.map((item:any)=>{
                      return<SearchTile key={item._id} item={item}/>
                  })}
                </View>
                
              <View style={styles.subItemContainer}>
                <Text
                  style={{ fontSize: 16, fontWeight:'bold', color: "gray" }}
                >
                  Delivery
                </Text>

                <Text style={{ color: "gray", fontSize: 16 }}>$ 0</Text>
              </View>

              <View style={styles.subItemContainer}>
                <ThemedText style={{ fontSize: 20, fontWeight: "bold",lineHeight:20 }}>
                  Order Total
                </ThemedText>

                <Text
                  style={{ color: "#C60C30", fontSize: 17, fontWeight: "bold" }}
                >
                  $ {numberWithCommas(totalPrice)}
                </Text>
              </View>
            </View>

            <View style={[styles.itemListContainer,{backgroundColor:Colors[colorScheme??'light'].background2,gap:2}]}
            >
              <ThemedText type="subtitle">Pay With</ThemedText>

              <ThemedText type="default">
                Pay on delivery (Cash)
              </ThemedText>
            </View>
          </View> 
          
          <TouchableOpacity
            onPress={handleSubmit}
            style={styles.button}
          >
            <Text style={styles.btnTxt}>Place your order</Text>
          </TouchableOpacity>
        </View>
  )
}

export default Step4

const styles = StyleSheet.create({})