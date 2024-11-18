import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { Formik } from "formik";
import * as Yup from "yup";
import { router } from "expo-router";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import Header from "@/components/Header";
import AuthTextInput from "@/components/AuthTextInput";
import CustomButton from "@/components/CustomButton";
import { useSignUp } from "@clerk/clerk-expo";
import ConfirmationCodeInput from "@/components/ConfirmationCodeInput";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("Please enter your firstname"),
  lastName: Yup.string().required("Please enter your lastname"),
  username: Yup.string().required("Please enter a unique username"),
  email: Yup.string().email("Invalid email address").required("Required"),
  password: Yup.string()
    .min(8, "Password must be atleast 8 characters")
    .required("Required"),
  confirmPassword: Yup.string().when("password", (password, field) =>
    password ? field.required("Required").oneOf([Yup.ref("password")],"Password did'nt match") : field
  ),
});

export default function RegisterationScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [loading, setLoading] = useState(false);
  const [obsecurePass, setobsecurePass] = useState(true);
  const [obsecureCpass, setobsecureCpass] = useState(true);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState('');
  const handleRegister = async (values: any) => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      // Create the user on Clerk
      await signUp.create({
        username:values.username,
        firstName: values.firstName,
        lastName: values.lastName,
        emailAddress:values.email,
        password:values.password,
      });

      // Send verification Email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });

      // change the UI to verify the email address
      setPendingVerification(true);
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      await setActive({ session: completeSignUp.createdSessionId }).catch((err)=>alert(err));
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const onBackPress=()=>{
    if(pendingVerification){
      setPendingVerification(false);
    }else{
      router.back();
    }
  };
  return (
    <ThemedView style={{ flex: 1 }}>
      <Header onBackPress={onBackPress}/>
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
       
      <View style={styles.info}>
        <View style={styles.logoRow}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={styles.logo}
          />
          <ThemedText type="title"> Buyzaar</ThemedText>
        </View>
        <ThemedText type="subtitle">{pendingVerification?"Verification code sent to your email":"Create a new account"}</ThemedText>
      </View>
      
      {pendingVerification ? (
        <View style={{ paddingHorizontal: 20 ,gap:40}}>
          <ConfirmationCodeInput code={code} setCode={setCode}/>
          <CustomButton onPress={onPressVerify} title="Verify Email"/>
        </View>
      ):<Formik
        initialValues={{
          firstName: "",
          lastName: "",
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => handleRegister(values)}
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
            <View style={{flexDirection:"row",width:'100%',gap:5}}>
              <AuthTextInput handleChange={handleChange} iconName={'account'} setFieldTouched={setFieldTouched} title="firstName" touched={touched.firstName} value={values.firstName} isPassword={false}  error={errors.firstName} autoCapitalize={"words"} placeholder="Enter firstname" style={{flex:1}}/>
              <AuthTextInput handleChange={handleChange} setFieldTouched={setFieldTouched} title="lastName" touched={touched.lastName} value={values.lastName} isPassword={false}  error={errors.lastName} autoCapitalize={"words"} placeholder="Enter lastname" style={{flex:1}}/>
            </View>
            <AuthTextInput handleChange={handleChange} iconName={'account'} setFieldTouched={setFieldTouched} title="username" touched={touched.username} value={values.username} isPassword={false}  error={errors.username} autoCapitalize={"words"} placeholder="Enter unique username"/>
            <AuthTextInput handleChange={handleChange} iconName={'email'} setFieldTouched={setFieldTouched} title="email" touched={touched.email} value={values.email} isPassword={false} error={errors.email}/>
            <AuthTextInput handleChange={handleChange} iconName={'form-textbox-password'} setFieldTouched={setFieldTouched} title="password" touched={touched.password} value={values.password} isPassword={true} obsecurePass={obsecurePass} setobsecurePass={setobsecurePass} error={errors.password}/>
            <AuthTextInput handleChange={handleChange} iconName={'form-textbox-password'} setFieldTouched={setFieldTouched} title="confirmPassword" touched={touched.confirmPassword} value={values.confirmPassword} isPassword={true} obsecurePass={obsecureCpass} setobsecurePass={setobsecureCpass} error={errors.confirmPassword} placeholder="Confirm password"/>
            <CustomButton isValid={isValid} isLoading={loading} onPress={handleSubmit} title={"S I G N   U P"} />
            <TouchableOpacity onPress={() => router.back()}>
              <ThemedText
                type="defaultSemiBold"
                style={{ textAlign: "center", marginTop: 15 }}
              >
                Already have an account?
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </Formik>} 
      </View>
    </ThemedView>
  );
}
const styles = StyleSheet.create({

  info: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
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
  input: {
    height: 50,
    padding: 10,
    borderColor: Colors["light"].white,
    borderRadius: 10,
    backgroundColor: Colors["light"].gray2,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    bottom:10
  },
});
