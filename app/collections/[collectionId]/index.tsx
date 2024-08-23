import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ThemedText } from '@/components/ThemedText'
import { getCollectionDetails } from '@/utils/actions'
import { useLocalSearchParams } from 'expo-router'
import { ScrollView } from 'react-native-gesture-handler'
import ProductCard from '@/components/ProductCard'

const page = () => {
    const { collectionId } = useLocalSearchParams<{collectionId:string}>();
    const [collectionDetails, setCollectionDetails] = useState<any>({})
    useEffect(() => {
      getCollectionDetails(collectionId).then((res)=>setCollectionDetails(res));
    }, [])
  return (
    <ScrollView>
        <Image source={{uri:collectionDetails.image}} style={styles.image}/>
      <ThemedText  style={styles.description}>{collectionDetails.description}</ThemedText>
      <FlatList
        data={collectionDetails.products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
            <ProductCard item={item}/>
        )}
        numColumns={2}
        contentContainerStyle={{padding:10}}
        scrollEnabled={false}
      />
    </ScrollView>
  )
}

export default page

const styles = StyleSheet.create({
    image:{
        width:'100%',
        height:300,
        resizeMode:'cover'
    },
    description:{
        textAlign:'center',
        fontSize:18,
        color:'grey',
        paddingHorizontal:20,
        paddingTop:20
        
    }
})