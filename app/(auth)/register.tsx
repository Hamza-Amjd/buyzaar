import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons, MaterialCommunityIcons,Feather, FontAwesome } from "@expo/vector-icons";
import {Colors} from "@/constants/Colors";
import { Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import * as Yup from "yup";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const validationSchema = Yup.object().shape({
  name:Yup.string().required("Please enter your name"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Password must be atleast 8 characters")
    .required("Required"),
    confirmPassword: Yup.string().when('password', (password, field) =>
    password ? field.required("Required").oneOf([Yup.ref('password')]) : field
  )
});

export default function RegisterationScreen() {
    const router =useRouter();
    const navigation = useNavigation();
    const [loader, setLoader] = useState(false);
    const [responseData, setResponseData] = useState(null);
    const [obsecurePass, setobsecurePass] = useState(true);
    const [obsecureCpass, setobsecureCpass] = useState(true);
    const handleRegister=async(values:any)=>{
      axios.post(`https://buyzaar-backend.vercel.app/api/auth/register`, values).then((response:any) => {
        setLoader(false);
        console.log(response.data)
        if (response.success == true) {
          Alert.alert("Registration successful","Please check your email for verification", [{text:'ok',onPress:()=>router.back()}]
        );
        }
        //@ts-ignore
      })
      .catch((error) => {
        Alert.alert(
          "Registration Error",
          `${error}`
        );
        console.log("registration failed", error);
      });
  }
       
  
  return (
    <ThemedView style={{flex:1,paddingLeft:20,paddingTop:40}}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <ThemedText type="title"><Ionicons name="arrow-back" size={30} /></ThemedText>
        </TouchableOpacity>
      <View style={{alignItems:"center",justifyContent:"center",marginBottom:50,marginTop:70}}>
      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",marginBottom:15 }}>
          <Image source={require('@/assets/images/logo.png')} style={{width:50,height:50,borderRadius:100}}/>
          <ThemedText type="title">  Buyzaar</ThemedText>
        </View>
        <ThemedText type="subtitle">Create a new account</ThemedText>
      </View>
      <Formik
        initialValues={{name:'', email: "", password: "" ,confirmPassword:""}}
        validationSchema={validationSchema}
        onSubmit={(values) => handleRegister(values)}
        style={{alignItems:"center",justifyContent:"center"}}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          touched,
          setFieldTouched,
          errors,
          isValid
        }) => (
          <View>
            <View style={[styles.label,
                  touched.name && {borderColor:Colors["light"].primary } 
                ]}>
            {!touched.name &&<FontAwesome name="user" size={15} color={Colors['light'].primary} />}
            <TextInput
              style={{flex:1}}
              placeholder=" Enter name"
              onChangeText={handleChange("name")}
              value={values.name}
              // @ts-ignore
              onBlur={() => setFieldTouched("name", "")}
              onFocus={() => setFieldTouched("name")}
            />
            </View>
            <View style={styles.errorContainer}>
                {touched.name && errors.name && <Text style={styles.errorMessage}>{errors.name}</Text>}
            </View>


            <View style={[styles.label,
                  touched.email && {borderColor:Colors["light"].primary } 
                ]}>
            {!touched.email &&<MaterialCommunityIcons name="email" size={15} color={Colors['light'].primary} />}
            <TextInput
              style={{flex:1}}
              placeholder=" Email"
              onChangeText={handleChange("email")}
              value={values.email}
              // @ts-ignore
              onBlur={() => setFieldTouched("email", "")}
              onFocus={() => setFieldTouched("email")}
              autoCapitalize="none"
            />
            </View>
            <View style={styles.errorContainer}>
                {touched.email && errors.email && <Text style={styles.errorMessage}>{errors.email}</Text>}
            </View>
            <View style={[styles.label,
                  touched.password && {borderColor:Colors["light"].primary } 
                ]}>
            {!touched.password &&<MaterialCommunityIcons name="form-textbox-password" size={15} color={Colors['light'].primary} />}
            <TextInput
              style={{flex:1}}
              placeholder=" Password"
              onChangeText={handleChange("password")}
              value={values.password}
              // @ts-ignore
              onBlur={() => setFieldTouched("password", "")}
              onFocus={() => setFieldTouched("password")}
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={obsecurePass}
            />
            <TouchableOpacity onPress={()=>{setobsecurePass(!obsecurePass)}}>
                <MaterialCommunityIcons name={obsecurePass?'eye-outline':'eye-off-outline'} size={20} color={Colors['light'].gray}/>
            </TouchableOpacity>
            </View>
            <View style={styles.errorContainer}>
            {touched.password && errors.password && <Text style={styles.errorMessage}>{errors.password}</Text>}
            </View>

            
            <View style={[styles.label,
                  touched.confirmPassword && {borderColor:Colors["light"].primary } 
                ]}>
            {!touched.confirmPassword && <MaterialCommunityIcons name="form-textbox-password" size={15} color={Colors['light'].primary} />}
            <TextInput
              style={{flex:1}}
              placeholder=" Confirm Password"
              onChangeText={handleChange("confirmPassword")}
              value={values.confirmPassword}
              // @ts-ignore
              onBlur={() => setFieldTouched("confirmPassword", "")}
              onFocus={() => setFieldTouched("confirmPassword")}
              autoCapitalize='none'
              autoCorrect={false}
              secureTextEntry={obsecureCpass}
            />
            <TouchableOpacity onPress={()=>{setobsecureCpass(!obsecureCpass)}}>
                <MaterialCommunityIcons name={obsecureCpass?'eye-outline':'eye-off-outline'} size={20} color={Colors['light'].gray}/>
            </TouchableOpacity>
            </View>
            <View style={styles.errorContainer}>
            {touched.confirmPassword && errors.confirmPassword && <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>}
            </View>

                {/* @ts-ignore */}
            <TouchableOpacity disabled={!isValid} onPress={handleSubmit} style={[styles.registerBtn,isValid && {backgroundColor: Colors["light"].primary}]}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "white",
                }}
              >
                {loader?<ActivityIndicator/>:'S I G N   U P'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.back()}
              >
                <ThemedText type="defaultSemiBold" style={{textAlign:'center',marginTop:15}}>Already have an account?</ThemedText>
              </TouchableOpacity>
              
          </View>
        )}
      </Formik>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingLeft:20
  },
  bar: {
    margin: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  }, 
  form:{
    top:150
  },
  errorContainer: {
    height:15,
    margin:7
  },
  errorMessage: {
    fontSize: 12,
    color:'red',
    alignItems: "flex-start",
    fontWeight: "bold",
  },
  label:{
    alignItems:'center',
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
  registerBtn:  {
    width: "95%",
    height: 50,
    borderRadius: 20,
    backgroundColor: Colors["light"].gray,
    justifyContent: "center",
    alignItems: "center",
  },
});