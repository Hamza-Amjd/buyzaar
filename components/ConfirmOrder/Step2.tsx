import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { ThemedText } from '../ThemedText'
import { Entypo, FontAwesome5 } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
type step2props={
  styles: any,
  setDeliveryOption: any,
  deliveryOption: boolean,
  handleNext: any
}
const Step2:React.FC<step2props> = ({styles,setDeliveryOption,deliveryOption,handleNext}) => {
  const colorScheme = useColorScheme();
  return (
    <View style={styles.detailsContainer}>
          <View>
          <ThemedText type="heading">
              Choose your delivery options
            </ThemedText>

            <TouchableOpacity onPress={() => setDeliveryOption(!deliveryOption)} style={styles.itemContainer}>
              {deliveryOption ? 
                <FontAwesome5
                  name="dot-circle"
                  size={20}
                  color={Colors[colorScheme??'light'].primary}
                />:
                <Entypo
                  name="circle"
                  size={20}
                  color="gray"
                />
              }

              <ThemedText style={{ flex: 1 }}>
                <Text style={{ color: "green", fontWeight: "500" }}>
                  Promtional Offer
                </Text>{" "}
                - FREE DELIVERY
              </ThemedText>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleNext}
            style={[
              styles.button,
              !deliveryOption && {backgroundColor:Colors[colorScheme??'light'].gray}
            ]}
            disabled={!deliveryOption}
          >
            <Text style={styles.btnTxt}>Continue</Text>
          </TouchableOpacity>
        </View>
  )
}

export default Step2

const styles = StyleSheet.create({})