import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors} from "@/constants/Colors";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";



const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Password must be atleast 8 characters")
    .required("Required"),
});

export default function Login() {
  const router =useRouter();
  const [loader, setLoader] = useState(false);
  const [userData, setUserData] = useState(null);
  const [obsecureText, setobsecureText] = useState(true);

  
  const handleLogin = (values:any) => {
    setLoader(true);
    axios
      .post("https://shopro-backend.vercel.app/api/auth/login", values)
      .then((response:any) => {
        setLoader(false);
        if ((response.success = true)) {
          AsyncStorage.setItem("token", response.data.authtoken);

          const decodedtoken:any = jwtDecode(response.data.authtoken);
          const userId:any = decodedtoken.user.id;
          AsyncStorage.setItem("userId", userId);
          router.replace("(tabs)");
        }
      })
      .catch((error) => {
        setLoader(false);
        console.log(error);
        //@ts-ignore
        Alert.alert("Invalid Credentials", "Please enter correct credentials", [{ text: "ok", onPress: setLoader(false) },]);
      })
  };
  return (
    <ThemedView style={{flex:1,paddingTop:40,paddingLeft:20}}>
        <TouchableOpacity
          onPress={() => {
            router.replace('(tabs)');
          }}
        >
          <ThemedText type="title"><Ionicons name="arrow-back" size={30} /></ThemedText>
        </TouchableOpacity>
      <View style={{alignItems:"center",justifyContent:"center",marginBottom:90,marginTop:80}}>
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginBottom:15 }}>
          <Image source={require('@/assets/images/logo.png')} style={{width:50,height:50,borderRadius:100}}/>
          <ThemedText type="title">  Buyzaar</ThemedText>
        </View>
        <ThemedText type="subtitle">Log in to your account</ThemedText>
      </View>
        <Formik
          initialValues={{ email: "", password: "" }} 
          validationSchema={validationSchema}
          onSubmit={(values) => handleLogin(values)}
          style={{alignItems:'center',justifyContent:"center"}}
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
            <View>
              <View
                style={[styles.label,
                  touched.email && {borderColor:Colors["light"].primary } 
                ]}
              >
                {!touched.email && (
                  <MaterialCommunityIcons
                    name="email"
                    size={15}
                    color={Colors["light"].primary}
                  />
                )}
                <TextInput
                  style={{ flex: 1 }}
                  placeholder=" Enter email"
                  onChangeText={handleChange("email")}
                  value={values.email}
                  //@ts-ignore
                  onBlur={() => setFieldTouched("email", "")}
                  onFocus={() => setFieldTouched("email")}
                  autoCapitalize="none"
                />
              </View>
              <View style={styles.errorContainer}>
                {touched.email && errors.email && (
                  <Text style={styles.errorMessage}>{errors.email}</Text>
                )}
              </View>
              <View
                style={[styles.label,
                  touched.password && {borderColor:Colors["light"].primary } 
                ]}
              >
                {!touched.password && (
                  <MaterialCommunityIcons
                    name="form-textbox-password"
                    size={15}
                    color={Colors["light"].primary}
                  />
                )}
                <TextInput
                  style={{ flex: 1 }}
                  placeholder=" Password"
                  onChangeText={handleChange("password")}
                  value={values.password}
                  //@ts-ignore
                  onBlur={() => setFieldTouched("password", "")}
                  onFocus={() => setFieldTouched("password")}
                  autoCapitalize="none"
                  autoCorrect={false}
                  secureTextEntry={obsecureText}
                />
                <TouchableOpacity
                  onPress={() => {
                    setobsecureText(!obsecureText);
                  }}
                >
                  <MaterialCommunityIcons
                    name={obsecureText ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color={Colors["light"].gray}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.errorContainer}>
                {touched.password && errors.password && (
                  <Text style={styles.errorMessage}>{errors.password}</Text>
                )}
              </View>
              {/* @ts-ignore */}
              <TouchableOpacity disabled={!isValid} onPress={handleSubmit} style={[styles.loginbtn,isValid && {backgroundColor: Colors["light"].primary}]}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    fontSize: 15,
                    color: "white",
                  }}
                >
                  {loader ? <ActivityIndicator /> : "S I G N  I N"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={()=>{}}
                style={styles.googleBtn}
              >
                <Image source={require('@/assets/images/google-icon.png')} style={{height:30,width:30}}/>
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
              <TouchableOpacity
                onPress={() => router.push("register")}
              >
                <ThemedText type="defaultSemiBold" style={{textAlign:'center',marginTop:15}}>Don't have an account?  Sign up</ThemedText>
              </TouchableOpacity>
              
            </View>
          )}
        </Formik>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
 
  bar: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  errorContainer: {
    height: 15,
    margin: 7,
  },
  errorMessage: {
    fontSize: 12,
    color: "red",
    alignItems: "flex-start",
    fontWeight: "700",
  },
  label:{
    alignItems: "center",
    width: "95%",
    height: 50,
    padding: 10,
    borderColor: Colors["light"].white,
    borderRadius: 10,
    backgroundColor: Colors["light"].gray2,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  loginbtn:  {
    width: "95%",
    height: 50,
    borderRadius: 20,
    backgroundColor: Colors["light"].gray,
    justifyContent: "center",
    alignItems: "center",
  },
  googleBtn: {
    width: "95%",
    height: 50,
    borderRadius: 20,
    backgroundColor: "white",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
});
