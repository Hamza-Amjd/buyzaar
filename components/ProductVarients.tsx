import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
type productVarientsProps={
    selected:string,
    setSelected:any,
}
const ProductVarients:React.FC<productVarientsProps> = ({selected,setSelected}) => {
  const colorScheme=useColorScheme();
    const varients=['S','M','L','XL']
  return (
    <View style={{flexDirection:'row',padding:10,alignItems:'center',justifyContent:'space-evenly'}}>
      {varients.map((item,index)=>{
        return(
            <TouchableOpacity onPress={()=>{setSelected(item)}} key={`${item}${index}`} style={[{width:50,height:50,alignItems:'center',justifyContent:"center",backgroundColor:Colors[colorScheme??'light'].tertiary,borderColor:Colors.dark.tertiary,borderRadius:100},selected===item && {backgroundColor:Colors[colorScheme??'light'].background2,borderWidth:5}]}>
                <Text style={[{fontSize:20,fontWeight:'bold',color:'white'},selected===item && {color:Colors.light.tertiary } ]}>{item}</Text>
            </TouchableOpacity>
        )
      })}
    </View>
  )
}

export default ProductVarients

const styles = StyleSheet.create({})