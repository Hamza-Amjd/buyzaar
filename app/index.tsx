import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Colors } from '@/constants/Colors';

const Main = () => {
    useEffect(() => {
        (async () => {
          const userID = await AsyncStorage.getItem("userId");
          const secondOpen = await AsyncStorage.getItem("@secondopen");
          if(!secondOpen) {
            router.replace('/onboarding')
          }
          else if (!userID) {
            router.replace('/(auth)');;
          } else{
            router.replace('/(tabs)')
          }
        })();
      }, []);
    
  return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
        <ActivityIndicator size={'large'} color={Colors.light.primary}/>
    </View>
  )
}

export default Main

const styles = StyleSheet.create({})