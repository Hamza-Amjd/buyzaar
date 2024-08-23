import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import useCart from '@/hooks/useCart';

const WishlistButton = ({product}:{product:any}) => {
  const cart =useCart();
  
  return (
    <TouchableOpacity onPress={() => {
              cart.toggleWishlist(product);
            }}>
          <AntDesign
            
            name={
              cart.wishlist.some((value: any) => value._id == product._id)
                ? "heart"
                : "hearto"
            }
            size={30}
            color={
              cart.wishlist.some((value: any) => value._id == product._id)
                ? "red"
                : Colors.light.primary
            }
          />
        </TouchableOpacity>
  )
}

export default WishlistButton

const styles = StyleSheet.create({})