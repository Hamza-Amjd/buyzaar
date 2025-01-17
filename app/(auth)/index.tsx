import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { Colors } from "@/constants/Colors";
import { Formik } from "formik";
import * as Yup from "yup";
import { router, useRouter } from "expo-router";
import { ThemedView } from "@/components/ui/ThemedView";
import { ThemedText } from "@/components/ui/ThemedText";
import Header from "@/components/ui/Header";
import AuthTextInput from "@/components/auth/AuthTextInput";
import CustomButton from "@/components/ui/CustomButton";
import { useOAuth, useSignIn } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";

WebBrowser.maybeCompleteAuthSession();

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Password must be atleast 8 characters")
    .required("Required"),
});

export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [obsecurePass, setobsecurePass] = useState(true);

  const { signIn, setActive, isLoaded } = useSignIn();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  useWarmUpBrowser();

  const handleLogin = async (values: any) => {
    if (!isLoaded) {
      return;
    }
    setIsLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = React.useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)', { scheme: "buyzaar" }),
      })

      if (createdSessionId) {
        setActive!({ session: createdSessionId })
      } else {
        
      }
    } catch (err) {
      console.error('OAuth error', err)
    }
  }, [])

  return (
    <ThemedView style={styles.container}>
      <Header onBackPress={() => router.replace("/(tabs)")} />
      <View style={styles.info}>
        <View style={styles.logoRow}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
          <ThemedText type="title"> Buyzaar</ThemedText>
        </View>
        <ThemedText type="subtitle">Log in to your account</ThemedText>
      </View>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleLogin(values)}
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          touched,
          setFieldTouched,
          errors,
          isValid,
        }) => (
          <View style={{ paddingHorizontal: 20 }}>
            <AuthTextInput
              handleChange={handleChange}
              iconName={"email"}
              setFieldTouched={setFieldTouched}
              title="email"
              touched={touched.email}
              autoComplete={"email"}
              value={values.email}
              isPassword={false}
              error={errors.email}
            />
            <AuthTextInput
              handleChange={handleChange}
              iconName={"form-textbox-password"}
              setFieldTouched={setFieldTouched}
              title="password"
              touched={touched.password}
              autoComplete={"password"}
              value={values.password}
              isPassword={true}
              obsecurePass={obsecurePass}
              setobsecurePass={setobsecurePass}
              error={errors.password}
            />
            <TouchableOpacity onPress={() => router.push("/(auth)/reset")}>
              <ThemedText style={styles.link}>Forget Password?</ThemedText>
            </TouchableOpacity>
            <CustomButton
              isLoading={isLoading}
              isValid={isValid}
              onPress={() => handleSubmit}
              title="S I G N   I N"
              height={50}
            />
            <TouchableOpacity
              onPress={handleGoogleSignIn}
              style={styles.googleBtn}
            >
              <Image
                source={require("@/assets/images/google-icon.png")}
                style={{ height: 25, width: 25 }}
              />
              <Text
                style={{
                  fontWeight: "700",
                  fontSize: 16,
                  color: Colors["light"].primary,
                }}
              >
                Sign In with Google
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/register")}>
              <ThemedText
                type="defaultSemiBold"
                style={{ textAlign: "center", marginTop: 15 }}
              >
                Don't have an account? Sign up
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </Formik>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  info: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
    marginTop: 70,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
  googleBtn: {
    height: 50,
    borderRadius: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
    gap: 5,
  },
  link: {
    marginBottom: 10,
    color: "cyan",
    fontWeight: "500",
    textDecorationLine: "underline",
    textAlign: "right",
    paddingRight: 5,
  },
});
