import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

type customTextInputProps={
    title:string,
    touched:any,
    handleChange:any,
    value:string,
    setFieldTouched:any,
    keyboardType?: any,
    autoComplete?: any,
}
const CustomTextInput:React.FC<customTextInputProps> = ({title,touched,handleChange,value,setFieldTouched,keyboardType='default',autoComplete='off'}) => {
  return (
    <View style={[styles.input,
        touched && {borderColor:Colors["light"].primary } 
      ]}>
  <TextInput
    style={{flex:1}}
    placeholder={`Enter ${title}`}
    onChangeText={handleChange(title)}
    value={value}
    onBlur={() => setFieldTouched(title, "")}
    onFocus={() => setFieldTouched(title)}
    keyboardType={keyboardType}
    autoComplete={autoComplete}
  />
  </View>

  )
}

const styles = StyleSheet.create({
    input:{
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