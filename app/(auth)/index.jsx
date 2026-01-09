import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import styles from "../../assets/styles/login.styles";
import COLORS from "../../constants/colors";
import { useAuthStore } from "../../source/authStore";

export default function LoginScreen() {
      const handleLogin=async ()=>{
  const result=await login(email,password);
  if(!result.success){
    Alert.alert("Error",result.error);
  }
  };
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [showPassword,setshowPassword]=useState(false);
  const {login,isLoading,isCheckingAuth}=useAuthStore();
  if(isCheckingAuth) return null;

  return (
    <KeyboardAvoidingView
    style={{flex:1}}
    behavior={Platform.OS==="ios"? "padding":"height"}
    >
    <View style={styles.container}>
       <View style={styles.topIllustration}>
        <Image source={require("../../assets/images/l.png")}
        style={styles.illustrationImage}
        resizeMode="contain"
        />
         </View>
        <View style={styles.card}>
            <View style={styles.formContainer}>
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
                        placeholder="Enter your Email "
                        placeholderTextColor={COLORS.placeholderText}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        />
                    </View>
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
                        placeholder="Enter your Password "
                        placeholderTextColor={COLORS.placeholderText}
                        value={password}
                        onChangeText={setPassword}
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
  
                <TouchableOpacity
                style={styles.button}

                onPress={handleLogin}
                disabled={isLoading}
                >{isLoading?(<ActivityIndicator color={COLORS.primary}/>):
                (<Text style={styles.buttonText}>
                    Login
                </Text>)}
                </TouchableOpacity>
                 <View style={styles.footer}>
                    <Text style={styles.footerText}>Don&apos;t have an account?</Text>
                    <Link href="/signup" asChild>
                    <TouchableOpacity>
                        <Text style={styles.link}>Sign Up</Text>
                    </TouchableOpacity>
                    </Link>
                 </View>
            </View>
        </View>
      
    </View>
    </KeyboardAvoidingView>
  )
}