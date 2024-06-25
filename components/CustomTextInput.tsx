import { StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

type customTextInputProps={
    title:string,
    touched:any,
    handleChange:any,
    value:string,
    setFieldTouched:any,
}
const CustomTextInput:React.FC<customTextInputProps> = ({title,touched,handleChange,value,setFieldTouched}) => {
  return (
    <View style={[styles.label,
        touched && {borderColor:Colors["light"].primary } 
      ]}>
  <TextInput
    style={{flex:1}}
    placeholder={`Enter ${title}`}
    onChangeText={handleChange(title)}
    value={value}
    onBlur={() => setFieldTouched(title, "")}
    onFocus={() => setFieldTouched(title)}
  />
  </View>

  )
}

const styles = StyleSheet.create({
    label:{
        alignItems: "center",
        padding: 10,
        marginBottom:20,
        borderColor: Colors["light"].white,
        borderRadius: 10,
        backgroundColor: Colors["light"].gray2,
        borderWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
    },
})

export default CustomTextInput