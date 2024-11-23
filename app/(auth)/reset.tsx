import { View, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { router, Stack } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";
import CustomButton from "@/components/CustomButton";
import Header from "@/components/Header";
import { Colors } from "@/constants/Colors";
import { ThemedText } from "@/components/ThemedText";
import ConfirmationCodeInput from "@/components/ConfirmationCodeInput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedView } from "@/components/ThemedView";

const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const [obsecurePass, setobsecurePass] = useState(true);
  
  const {isLoaded, signIn, setActive } = useSignIn();  

  // Request a passowrd reset code by email
  const onRequestReset = async () => {
    if (!isLoaded) {
        return;
      }
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };

  // Reset the password with the code and the new password
  const onReset = async () => {
    if (!isLoaded) {
        return;
      }
    try {
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      console.log(result);
      alert("Password reset successfully");

      // Set the user session active, which will log in the user automatically
      await setActive({ session: result.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };
  const onBackPress = () => {
    if (successfulCreation) {
      setSuccessfulCreation(false);
    } else {
      router.back();
    }
  };
  return (
    <ThemedView style={{ flex: 1 }}>
      <Header onBackPress={onBackPress} />

      <View style={styles.container}>
        <ThemedText
          type="heading"
          style={{ textAlign: "center", paddingBottom: 30 }}
        >
          {successfulCreation ? "Set new password" : "Enter your e-mail"}
        </ThemedText>
        {successfulCreation ? (
          <>
            <View style={{ paddingBottom: 10, gap: 20 }}>
              <ConfirmationCodeInput code={code} setCode={setCode} />
              <View style={styles.inputField}>
                <TextInput
                  placeholder="New password"
                  value={password}
                  onChangeText={setPassword}
                  autoCapitalize="none"
                  autoComplete="new-password"
                  secureTextEntry={obsecurePass}
                  style={{ flex: 1 }}
                />
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
              </View>
            </View>
            <CustomButton onPress={onReset} title="Set new Password" />
          </>
        ) : (
          <>
            <TextInput
              autoCapitalize="none"
              placeholder="your-email@email.com"
              value={emailAddress}
              onChangeText={setEmailAddress}
              style={styles.inputField}
            />

            <CustomButton onPress={onRequestReset} title="Send Reset Email" />
          </>
        )}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  inputField: {
    height: 50,
    paddingHorizontal: 10,
    borderColor: Colors["light"].white,
    borderRadius: 10,
    backgroundColor: Colors["light"].gray2,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
});

export default PwReset;
