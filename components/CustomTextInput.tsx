import { KeyboardType, StyleSheet, TextInput, useColorScheme, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'

import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

type CustomTextInputProps = {
    title?: string,
    handleChange?: (text: string) => void,
    value: string,
    placeholder?: string,
    keyboardType?: KeyboardType,
    autoComplete?: TextInput['props']['autoComplete'],
    editable?: boolean,
    numberOfLines?: number
    error?: boolean,
    errorText?: string,
}

const CustomTextInput: React.FC<CustomTextInputProps> = ({
  title,
  handleChange,
  placeholder,
  value,
  keyboardType = 'default',
  autoComplete = 'off',
  editable=true,
  numberOfLines=1,
  error,
  errorText
}) => {
  const colorScheme = useColorScheme();
  const inputHeight = Math.max(50, numberOfLines * 30);

  return (
    <ThemedView style={[
      styles.inputContainer,
      !title && {height: inputHeight + 10},
      numberOfLines > 1 && {height: inputHeight + 20}
    ]}>
      <ThemedText type='defaultSemiBold' style={{marginLeft:7}}>{title}</ThemedText>
      <View style={[
        styles.input,
        {backgroundColor: Colors[colorScheme ?? 'light'].gray2},
        {height: inputHeight},
        error && styles.inputError,
        !editable && styles.inputDisabled
      ]}>
        <TextInput
          style={[
            styles.textInput,
            numberOfLines > 1 && { textAlignVertical: 'top' }
          ]}
          multiline={numberOfLines > 1}
          onChangeText={handleChange}
          value={value}
          placeholder={placeholder ?? title}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          editable={editable}
          numberOfLines={numberOfLines}
          accessibilityLabel={title}
          accessibilityHint={placeholder}
          accessibilityState={{
            disabled: !editable,
          }}
        />
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
    inputContainer: {
      position: 'relative',
      height: 70,
      justifyContent: 'flex-end',
    },
    input: {
        alignItems: "center",
        paddingHorizontal: 10,
        borderColor: Colors["light"].white,
        borderRadius: 10,
        borderWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        height: 50,
    },
    inputError: {
        borderColor: "red",
        borderWidth: 1,
    },
    inputDisabled: {
        opacity: 0.7,
    },
    textInput: {
        flex: 1,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 10,
    }
})

export default CustomTextInput