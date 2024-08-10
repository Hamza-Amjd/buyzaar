import { Alert, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { ThemedText } from '../ThemedText'
import { Entypo, FontAwesome5 } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
type step3props={
  styles: any,
  setSelectedPaymentOption: any,
  selectedPaymentOption: any,
  handleNext: any
}
const Step3:React.FC<step3props> = ({styles,setSelectedPaymentOption,selectedPaymentOption,handleNext}) => {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.detailsContainer}>
    <View>
    <ThemedText type="heading">
        Select your payment Method
      </ThemedText>

      <TouchableOpacity onPress={() => setSelectedPaymentOption("cash on delivery")} style={styles.itemContainer}>
        {selectedPaymentOption === "cash on delivery" ? (
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

        <ThemedText type="default">Cash on Delivery</ThemedText>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => {
              setSelectedPaymentOption("card payment");
              Alert.alert("Credit/Debit card", "Pay Online", [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel is pressed"),
                },
                {
                  text: "OK",
                },
              ]);
            }} style={styles.itemContainer}>
        {selectedPaymentOption === "card payment" ? (
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

        <ThemedText type="default">Credit or debit card</ThemedText>
      </TouchableOpacity>
    </View>
    <TouchableOpacity
      onPress={handleNext}
      style={[
        styles.button,
        !selectedPaymentOption && {backgroundColor:Colors[colorScheme??'light'].gray}
      ]}
      disabled={!selectedPaymentOption}
    >
      <Text style={styles.btnTxt}>Continue</Text>
    </TouchableOpacity>
  </View>
  )
}

export default Step3

const styles = StyleSheet.create({})