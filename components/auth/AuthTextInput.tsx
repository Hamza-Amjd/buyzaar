import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

type customTextInputProps = {
  title: string;
  touched: any;
  handleChange: any;
  value: string;
  setFieldTouched: any;
  keyboardType?: any;
  autoComplete?: any;
  obsecurePass?: boolean;
  setobsecurePass?: any;
  error: any;
  iconName?: any;
  isPassword: boolean;
  autoCapitalize?: any;
  style?: any;
  placeholder?: string;
};

const AuthTextInput = ({
  title,
  touched,
  handleChange,
  value,
  setFieldTouched,
  obsecurePass,
  setobsecurePass,
  error,
  keyboardType = "default",
  autoComplete = "off",
  autoCapitalize = "none",
  iconName,
  isPassword,
  style,
  placeholder,
}: customTextInputProps) => {
  return (
    <View style={style}>
      <View
        style={[
          styles.input,
          touched && { borderColor: Colors["light"].primary },
          !touched&&value.length>0&&error&& { borderColor:"red"}
        ]}
      >
        <MaterialCommunityIcons
          name={iconName}
          size={20}
          color={Colors["light"].primary}
        />
        <TextInput
          style={{ flex: 1 }}
          placeholder={placeholder?placeholder:`Enter ${title}`}
          onChangeText={handleChange(title)}
          value={value}
          onBlur={() => setFieldTouched(title, "")}
          onFocus={() => setFieldTouched(title)}
          keyboardType={keyboardType}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          secureTextEntry={obsecurePass}
        />
        {isPassword && (
          <TouchableOpacity
            onPress={() => {
              setobsecurePass(!obsecurePass);
            }}
          >
            <MaterialCommunityIcons
              name={obsecurePass ? "eye-outline" : "eye-off-outline"}
              size={20}
              color={Colors["light"].gray}
            />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.errorContainer}>
        {touched && error && <Text style={styles.errorMessage}>{error}</Text>}
      </View>
    </View>
  );
};

export default AuthTextInput;

const styles = StyleSheet.create({
  errorContainer: {
    height: 15,
    margin: 7,
  },
  errorMessage: {
    fontSize: 12,
    color: "red",
    alignItems: "flex-start",
    fontWeight: "bold",
  },
  input: {
    height: 50,
    paddingHorizontal: 15,
    borderColor: Colors["light"].white,
    borderRadius: 10,
    backgroundColor: Colors["light"].gray2,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
