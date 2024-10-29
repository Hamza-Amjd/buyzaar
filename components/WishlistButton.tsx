import { StyleSheet, Text, TouchableOpacity, useColorScheme, View } from 'react-native'
import React from 'react'
import { AntDesign, FontAwesome } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import useCart from '@/hooks/useCart';

const WishlistButton = ({product}:{product:any}) => {
  const cart =useCart();
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity onPress={() => {
              cart.toggleWishlist(product);
            }}>
          <FontAwesome
            
            name={
              cart.wishlist.some((value: any) => value._id == product._id)
                ? "bookmark"
                : "bookmark-o"
            }
            size={27}
            color={
              cart.wishlist.some((value: any) => value._id == product._id)
                ? "orange"
                : "grey"
            }
          />
        </TouchableOpacity>
  )
}

export default WishlistButton

const styles = StyleSheet.create({})