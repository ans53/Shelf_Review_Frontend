import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from "react-native";
import styles from "../../assets/styles/signup.styles";
import COLORS from "../../constants/colors";
import { useAuthStore } from "../../source/authStore";
export default function SignUpScreen() {
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

   const handleSignup=async()=>{


    if (!isValidEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }


   const result=await register(username,email,password)
   if(!result.success) {
    Alert.alert("Error",result.error)
  }else {
    Alert.alert("Success", "Account created successfully!");
    // Optionally navigate or clear inputs
  }}
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [showPassword,setshowPassword]=useState(false)
  const [password,setPassword]=useState("");

  const {register,isLoading}=useAuthStore();

  

  return (
    
    <KeyboardAvoidingView
     style={{flex:1}}
      behavior={Platform.OS==="ios"? "padding":"height"}
      >
        <View style={styles.container}>
        <View style={styles.card}>
    <View style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={styles.title}>Hey! BookWorm</Text> 
      <Ionicons
      size={20}
      name="book-outline"
      color={COLORS.primary}
      /></View>
      <Text style={styles.subtitle}>Share your favourite reads</Text>
      </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputContainer}>
              <Ionicons
              name="person"
              size={20}
              color={COLORS.primary}
              style={styles.inputIcon}
              />
              <TextInput
              style={styles.input}
              placeholder="Name"
              placeholderTextColor={COLORS.placeholderText}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Ionicons
              name="mail"
              size={20}
              color={COLORS.primary}
              style={styles.inputIcon}
              />
              <TextInput
              style={styles.input}
              placeholder="example@mail.com"
              placeholderTextColor={COLORS.placeholderText}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Ionicons
              name="lock-closed"
              size={20}
              color={COLORS.primary}
              style={styles.inputIcon}
              />
              <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.placeholderText}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry={!showPassword}
              />
              <TouchableOpacity
                        onPress={()=>setshowPassword(!showPassword) }
                        style={styles.eyeIcon}
                        >
                            <Ionicons name={showPassword?"eye-sharp": "eye-off-sharp"}
                            size={20}
                            color={COLORS.primary}/>
                        </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity
                style={styles.button}

                onPress={handleSignup}
                disabled={isLoading}
                >{isLoading?(<ActivityIndicator color={COLORS.primary}/>):
                (<Text style={styles.buttonText}>
                    Sign Up
                </Text>)}
                </TouchableOpacity>

                  <View style={styles.footer}>
                    <Text style={styles.footerText}>Already have an account? </Text>
                    <TouchableOpacity onPress={()=>router.back()}>
                        <Text style={styles.link}>Login</Text>
                    </TouchableOpacity>
                 </View>
        </View>
      </View>
    </View>
    </KeyboardAvoidingView>
  )
}