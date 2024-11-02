import { KeyboardType, StyleSheet, TextInput, useColorScheme, View } from 'react-native'
import React from 'react'
import { Colors } from '@/constants/Colors'
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue 
} from 'react-native-reanimated';
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';
import { number } from 'yup';

type customTextInputProps = {
    title?: string,
    handleChange?: (text: string) => void,
    value: string,
    keyboardType?: KeyboardType,
    autoComplete?: any,
    editable?:boolean,
    numberOfLines?:number
}

const CustomTextInput: React.FC<customTextInputProps> = ({
  title,
  handleChange,
  value,
  keyboardType = 'default',
  autoComplete = 'off',
  editable=true,
  numberOfLines=1
}) => {
  const colorSchome= useColorScheme();
  const labelPosition = useSharedValue(value ? -25 : 0);
  const labelScale = useSharedValue(value ? 0.8 : 1);

  const labelStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: labelPosition.value },
      { scale: labelScale.value }
    ],
    position: 'absolute',
    left: 10,
    top: 25,
    zIndex: 1,
    paddingHorizontal: 5,
    color: value?Colors[colorSchome??'light'].text:"grey",
  }));

  const handleFocus = () => {
    labelPosition.value = withTiming(-25);
    labelScale.value = withTiming(0.8);
  };

  const handleBlur = () => {
    if (!value) {
      labelPosition.value = withTiming(0);
      labelScale.value = withTiming(1);
    }
  };

  return (
    <ThemedView style={[styles.inputContainer,!title && {height:60}]}>
      {/* {title && <Animated.Text style={labelStyle}>{title}</Animated.Text>} */}
      {value&&<ThemedText type='defaultSemiBold' style={{marginLeft:10}}>{title}</ThemedText>}
      <View style={[
        styles.input
      ]}>
        <TextInput
          style={{ flex: 1, color: Colors["light"].text }}
          onChangeText={handleChange}
          value={value}
          placeholder={title}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={editable}
          numberOfLines={numberOfLines}
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
        padding: 10,
        borderColor: Colors["light"].white,
        borderRadius: 10,
        backgroundColor: Colors["dark"].gray2,
        borderWidth: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        height: 50,
    },
})

export default CustomTextInput