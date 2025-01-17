import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ThemedView } from './ThemedView'

const CustomSafeAreaView = ({children,style}:{children:React.ReactNode,style?:any}) => {
  return (
    <SafeAreaView style={[styles.container,style]}>
        <ThemedView style={{flex:1}}>

      {children}

        </ThemedView>
    </SafeAreaView>
  )
}

export default CustomSafeAreaView

const styles = StyleSheet.create({
    container:{
        flex:1,
        paddingTop:Platform.OS=="android"?StatusBar.currentHeight:0,
    }
})