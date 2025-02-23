import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Animated, StyleSheet, TextInputProps, useColorScheme, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from '@/constants/Colors';
import { useFocusEffect } from 'expo-router';

interface CustomInputProps extends TextInputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    validationFunction?: any;
    validationMessage?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({
    label,
    value,
    onChangeText,
    onBlur,
    validationFunction = null,
    validationMessage = false,
    placeholder,
    secureTextEntry = false,
    ...rest
}) => {
    const colorScheme = useColorScheme();
    const [isFocused, setIsFocused] = useState(false);
    const [isValid, setIsValid] = useState<boolean | null>(true);
    const labelAnim = useRef(new Animated.Value(0)).current;

    const checkValidation = async () => {
        if (validationFunction ) {
            setIsValid(validationFunction(value));
        }
    }

    useEffect(() => {
        checkValidation()
    }, [value, validationFunction]);

    useFocusEffect(() => {
        if(value){
            Animated.timing(labelAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    });
    const handleFocus = () => {
        setIsFocused(true);
        Animated.timing(labelAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (!value) {
            Animated.timing(labelAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    };

    const labelStyle = {
        top: labelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [RFValue(12), RFValue(-7)],
        }),
        fontSize: labelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [RFValue(12), RFValue(10)],
        }),
    };

    return (
        <View style={styles.container}>
            <Animated.Text
                style={[
                    styles.label,
                    labelStyle,
                    {
                        color: isFocused ?!isValid?"red": Colors[colorScheme??'light'].primary : '#666',
                        fontWeight: isFocused ? '700' : '500',
                        backgroundColor: Colors[colorScheme??'light'].background
                    },
                ]}
            >
                {label}
            </Animated.Text>
            <View style={styles.inputWrapper}>
                <TextInput
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={isFocused ? '' : placeholder}
                    secureTextEntry={secureTextEntry}
                    style={[
                        styles.input,
                        {
                            color:Colors[colorScheme??'light'].text,
                            borderColor: isFocused ? !isValid?"red": Colors[colorScheme??'light'].primary : '#666',
                            borderWidth: isFocused ? 2 : 1,
                        },
                    ]}
                    {...rest}
                />
            </View>
            {isFocused && validationMessage && isValid === false && <Text style={{ color:'red', fontSize: RFValue(9),padding:3 }}>
                 {validationMessage}
            </Text>
            }
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
    },
    label: {
        position: 'absolute',
        left: 10,
        pointerEvents: 'none',
        color: '#666',
        zIndex: 11,
    },
    inputWrapper: {
        flexDirection:'row',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: Colors.light.primary,
        borderRadius: 10,
        paddingVertical: RFValue(10),
        paddingHorizontal: RFValue(10),
        height: 50,
        fontSize: RFValue(14),
        color: '#fff',
    },
    icon: {
        marginLeft: 10,
    },
});

export default CustomInput;
