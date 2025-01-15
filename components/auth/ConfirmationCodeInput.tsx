import { StyleSheet, Text, useColorScheme } from 'react-native'
import React from 'react'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field'
import { Colors } from '@/constants/Colors';

const ConfirmationCodeInput = ({code,setCode}:{code:any,setCode:any}) => {
    const colorScheme = useColorScheme()
    const ref =useBlurOnFulfill({value: code,cellCount:6});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value:code,
    setValue:setCode,
  });
  return (
    <CodeField
        ref={ref}
        {...props}
        value={code}
        onChangeText={setCode}
        cellCount={6}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        cursorColor={Colors[colorScheme??'light'].text}
        autoFocus
        renderCell={({index, symbol, isFocused}) => (
          <Text
            key={index}
            style={[styles.cell,{color:Colors[colorScheme??'light'].text}, isFocused && {borderColor: Colors[colorScheme??'light'].primary}]}
            onLayout={getCellOnLayoutHandler(index)}>
            {symbol || (isFocused ? <Cursor/> : null)}
          </Text>
        )}
      />
  )
}

const styles = StyleSheet.create({
    
  codeFieldRoot:{
    marginTop: 20,
    width: 260,
    marginLeft:"auto",
    marginRight:"auto",
    gap: 4
  },
  cell: {
    width: 40,
    height: 40,
    lineHeight: 38,
    fontSize: 24,
    borderBottomWidth: 2,
    borderColor: '#fff',
    textAlign: 'center',
  },
  focusCell: {
    borderColor: '#000',
  },
})

export default ConfirmationCodeInput