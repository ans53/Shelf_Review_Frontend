import { Ionicons } from '@expo/vector-icons';

import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from 'react';
import { ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from "../../assets/styles/create.styles";
import { API_URL } from "../../constants/api";
import COLORS from '../../constants/colors';
import { useAuthStore } from "../../source/authStore";

export default function Create() {
  const [title,setTitle]=useState("");
  const [caption,setCaption]=useState("");
  const [rating,setRating]=useState();
  const [image,setImage]=useState("");
  const [imageBase64,setImageBase64]=useState("");
  const [loading,setLoading]=useState(false);
  const router=useRouter();
  const {token}=useAuthStore();

const renderRatingPicker = () => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let starColor;

    if (i <= rating) {
      if (rating <= 2) {
        starColor = "#ff4d4d"; 
      } else if (rating===3 ||rating=== 4) {
        starColor = "#ffb300"; 
      } else {
        starColor = "#4CAF50"; 
      }
    } else {
      starColor = COLORS.textSecondary; 
    }

    stars.push(
      <TouchableOpacity
        key={i}
        onPress={() => setRating(i)}
        style={styles.starButton}
      >
        <Ionicons
          name={i <= rating ? "star" : "star-outline"}
          size={32}
          color={starColor}
        />
      </TouchableOpacity>
    );
  }
  return <View style={styles.ratingContainer}>{stars}</View>;
};

// PICK IMAGE
const pickImage = async () => {
    try {
      // request permission if needed
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
          Alert.alert("Permission Denied", "We need camera roll permissions to upload an image");
          return;
        }
      }

      // launch image library
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.2, // lower quality for smaller base64
        base64: true,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
        const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);

      if (fileInfo.size > 2 * 1024 * 1024) { // 2 MB limit
        Alert.alert("Image too large", "Please choose an image smaller than 2 MB");
        return;
      }
        // if base64 is provided, use it

        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64);
        } else {
          // otherwise, convert to base64
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          setImageBase64(base64);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "There was a problem selecting your image");
    }
  };

  const handleSubmit = async () => {
    if (!title || !caption || !imageBase64 || !rating) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setLoading(true);

      // get file extension from URI or default to jpeg
      const uriParts = image.split(".");
      const fileType = uriParts[uriParts.length - 1];
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image/jpeg";

      const imageDataUrl = `data:${imageType};base64,${imageBase64}`;
      
   console.log(JSON.stringify({
  title,
  caption,
  rating: rating.toString(),
  image: imageDataUrl,
}));

      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          caption,
          rating: rating.toString(),
          image: imageDataUrl,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Something went wrong");

      Alert.alert("Success", "Your book recommendation has been posted!");
      setTitle("");
      setCaption("");
      setRating(0);
      setImage(null);
      setImageBase64(null);
      router.push("/");
    } catch (error) {
      console.error("Error creating post:", error);
      Alert.alert("Error", error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <KeyboardAvoidingView
    style={{flex:1}}
    behavior={Platform.OS==="ios"?"padding":"height"}
    >
    <ScrollView contentContainerStyle={styles.container} style={styles.scrollViewStyle}>
      <View style={styles.card}>
      {/* HEADER*/ }
      <View style={styles.header}>
       <Text style={styles.title}>What Did You Think?</Text>
        <Text style={styles.subtitle}>The good, the bad, and everything in between</Text>
      </View>
</View>
       {/* BOOK TITLR*/ }
      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Book Title</Text>
          <View style={styles.inputContainer}>
            <Ionicons
            name="book-outline"
            size={20}
            color={COLORS.textSecondary}
            style={styles.inputIcon}
            />
            <TextInput
            style={styles.input}
            placeholder='Enter book title'
            placeholderTextColor={COLORS.placeholderText}
            value={title}
            onChangeText={setTitle}
            />
          </View>
        </View>

      {/*RATING*/ }
      <View style={styles.formGroup}>
        <Text style={styles.label}>Your Rating</Text>
        {renderRatingPicker()}
      </View>

      {/*Image */}

      <View style={styles.formGroup}>
       <Text style={styles.label}>Book Image</Text>
       <TouchableOpacity style={styles.imagePicker}
       onPress={pickImage}
       >
        {image ? (
          <Image source={{uri:image}} 
          style={styles.previewImage}/>
        ):(
          <View style={styles.placeholderContainer}>
          <Ionicons name="image-outline" size={40} color={COLORS.textSecondary}/>
          <Text style={styles.placeholderText}>Tap to select image</Text>
          </View>
        )}
       </TouchableOpacity>
      </View >

      <View style={styles.formGroup}>
        <Text style={styles.label}>Caption</Text>
         <TextInput
         style={styles.textArea}
         placeholder='Write your review or thoughts about this book...'
         placeholderTextColor={COLORS.placeholderText}
         value={caption}
         onChangeText={setCaption}
         multiline
         />
      </View>

      <TouchableOpacity 
      style={styles.button}
      onPress={handleSubmit}
      disabled={loading}
      >

        {loading?( <ActivityIndicator color={COLORS.white}/>):(
          <>
          <Ionicons
          name="cloud-upload-outline"
          size={20}
          color={COLORS.white}
          style={styles.buttonText}
          />
          <Text style={styles.buttonText}>Share</Text>
          </>
        )}
      </TouchableOpacity>
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  )
}