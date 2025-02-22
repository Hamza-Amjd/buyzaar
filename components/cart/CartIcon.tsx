import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import useCartStore from '@/services/cartStore'
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../ui/ThemedText';
import { Colors } from '@/constants/Colors';

const CartIcon = ({icon,size}:any) => {
    const {cartItems}= useCartStore();
    const colorScheme= useColorScheme();
  return (
    <TouchableOpacity onPress={()=>router.push('/(screens)/cart')}>
        {icon?icon:<Ionicons name="cart" size={size??30} color={Colors[colorScheme??"light"].text}/>}
      {cartItems.length>0 && <View style={styles.countContainer}>
        <ThemedText style={styles.countText}>{cartItems.length}</ThemedText>
      </View>}
      </TouchableOpacity>
  )
}

export default CartIcon

const styles = StyleSheet.create({
    countContainer:{
        width:20,height:20,
        borderRadius:20,
        backgroundColor: Colors["light"].tabIconSelected,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: -7,
        right: -7,
    
      },
      countText: {
        color:"#fff"
      }
})