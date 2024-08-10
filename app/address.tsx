import React, {  useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  useColorScheme,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors} from "@/constants/Colors";
import { Formik } from "formik";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CustomTextInput from "@/components/CustomTextInput";


export default function address() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);


    const handleAddress=async(values:any)=>{
        const userId=await AsyncStorage.getItem('userId')
        const address=values
      axios.post(`https://buyzaar-backend.vercel.app/api/shop/addresses`, {userId,address}).then((response) => {
        // @ts-ignore
        Alert.alert("Address Added","",[{text:'ok',onPress:router.back()}]);
      })
      .catch((error) => {
        console.log("Unable to add Address", error);
      });
  }
    
       const colorScheme = useColorScheme()
  
  return (
    <ThemedView style={styles.container}>
      <View style={styles.bar}>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={30} color={Colors[colorScheme?? 'light'].text} />
        </TouchableOpacity>
      </View>
      <View style={{}}>
      <KeyboardAvoidingView >
      <ThemedText type="title" style={{textAlign:'center',paddingVertical:40,paddingBottom:70}}>Add a new address</ThemedText>
      <Formik
        initialValues={{name:'', mobileNo: "", streetAddress: "", city:"", country:"", postalCode:''}}
        onSubmit={(values:any) => handleAddress(values)}
      >
        {({
          handleChange,
          handleSubmit,
          values,
          touched,
          setFieldTouched,
          isValid
        }) => (
          <View>
            <CustomTextInput  title={"name"} value={values.name} touched={touched.name}  handleChange={handleChange} setFieldTouched={setFieldTouched} autoComplete={'name'}/>
            <CustomTextInput title={"mobileNo"} value={values.mobileNo} touched={touched.mobileNo}  handleChange={handleChange} setFieldTouched={setFieldTouched} keyboardType={'number-pad'} autoComplete={''}/>
            <CustomTextInput title={"streetAddress"} value={values.streetAddress} touched={touched.streetAddress}  handleChange={handleChange} setFieldTouched={setFieldTouched} autoComplete={'street-address'}/>
            <CustomTextInput  title={"city"} value={values.city} touched={touched.city}  handleChange={handleChange} setFieldTouched={setFieldTouched} />
            <CustomTextInput  title={"country"} value={values.country} touched={touched.country}  handleChange={handleChange} setFieldTouched={setFieldTouched} autoComplete={'country'}/>
            <CustomTextInput  title={"postalCode"} value={values.postalCode} touched={touched.postalCode}  handleChange={handleChange} setFieldTouched={setFieldTouched} keyboardType={'number-pad'}/>
            
            {/* @ts-ignore */}
            <TouchableOpacity disabled={!isValid} onPress={handleSubmit} style={[styles.loginbtn,isValid && {backgroundColor: Colors["light"].primary}]}>
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "white",
                }}
              >
                {loading?<ActivityIndicator/>:'Add Address'}
              </Text>
            </TouchableOpacity>
            
          </View>
        )}
      </Formik>
      </KeyboardAvoidingView>
      </View>
    </ThemedView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop:40,
    flex: 1,
    padding:15
  },
  bar: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center"
  }, 
  loginbtn:  {
    width: "100%",
    height: 50,
    borderRadius: 20,
    backgroundColor: Colors["light"].gray,
    justifyContent: "center",
    alignItems: "center",
  },
});