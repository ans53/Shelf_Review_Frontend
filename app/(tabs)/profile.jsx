import { Ionicons } from '@expo/vector-icons';
import { Image } from "expo-image";
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, RefreshControl, Text, TouchableOpacity, View } from 'react-native';
import styles from '../../assets/styles/profile.styles';
import Loader from '../../components/Loader';
import LogoutButton from '../../components/LogoutButton';
import ProfileHeader from '../../components/ProfileHeader';
import { API_URL } from '../../constants/api';
import COLORS from '../../constants/colors';
import { useAuthStore } from '../../source/authStore';
export default function Profile() {
const [books,setbooks]=useState([]);
const [isLoading,setIsLoading]=useState(true);
const [refreshing,setRefreshing]=useState(false);
const [deleteBook,setDeleteBook]=useState(null);
const {token}=useAuthStore();
  const router=useRouter();
  useEffect(()=>{
    fetchData();
  },[]);
  const handleDeleteBook=async (bookId)=>{
    try {
      setDeleteBook(bookId)
      const response= await fetch(`${API_URL}/books/${bookId}`,{
        method:"DELETE",
        headers:{Authorization:`Bearer ${token}`},
      });
      const data=await response.json();
      if(!response.ok) throw new Error(data.message || "Failed to delete books");
      setbooks(books.filter((book)=>book._id!==bookId));
      Alert.alert("Success","Recommedation deleted Successfully!");
    } catch (error) {
      Alert.alert("Error",error.message ||"Failed to delete Recommedation.")
    }finally{
      setDeleteBook(null)
    }
  }
  const confirmDelete=(bookId)=>{
    Alert.alert("Delete Recommedation","Are you sure you want to delete this Recommedation?",[
      {text:"Cancel",style:"cancel"},
      {text:"Delete",style:"destructive",onPress:()=>handleDeleteBook(bookId)}

    ])
  }
   const renderRatingStars = (rating) => {
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
    
        <Ionicons
        key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={15}
          color={starColor}
          style={{marginRight:2}}
        />
    );
  }
  return stars;
};
const fetchData=async()=>{
  try {
    setIsLoading(true);
    const response=await fetch(`${API_URL}/books/user`,{
      headers:{
        Authorization:`Bearer ${token}`,
      }
    });
    const data=await response.json();
    if(!response.ok)throw new Error(data.message||"Failed to fetch user books");
    setbooks(data);
  } catch (error) {
    console.error("Error fetching data ",error);
    Alert.alert("Error","Failed to load Profile data.Please Refresh")
  }finally{
    setIsLoading(false);
  }
};
const handleRefresh=async()=>{
setRefreshing(true);
await fetchData();
setRefreshing(false)
};

const renderbookItem=({item})=>{
return <View style={styles.bookItem}>
  <Image source={item.image} style={styles.bookImage}/>
  <View style={styles.bookInfo}>
    <Text style={styles.bookTitle}>{item.title}</Text>
   <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
   <Text style={styles.bookCaption} numberOfLines={2}>
  {item.caption}
</Text>
<Text style={styles.bookDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
  </View>

<TouchableOpacity style={styles.deleteButton} onPress={()=>confirmDelete(item._id)}>
  {deleteBook===item._id?(
  <ActivityIndicator size="small" color={COLORS.primary}/>)
  :
  (<Ionicons name="trash" size={20} color={COLORS.primary}/>)
  }

</TouchableOpacity>
</View>


};
if (isLoading && !refreshing) return <Loader/>
  return (
    <View style={styles.container}>
      <ProfileHeader/>
      <LogoutButton/>
      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your Recommedations</Text>
        <Text style={styles.booksCount}>{books.length}</Text>
      </View>
      <FlatList
      data={books}
      renderItem={renderbookItem}
      keyExtractor={(item)=>item._id}
      showsVerticalScrollIndicator={false}
       refreshControl={<RefreshControl
    refreshing={refreshing}
    onRefresh={handleRefresh}
     colors={[COLORS.primary ]}
    tintColor={COLORS.primary}
    />}
      contentContainerStyle={styles.booksList}
      ListEmptyComponent={
        <View style={styles.emptyContainer}>
        <Ionicons name="book-outline" size={50} color={COLORS.textSecondary}/>
        <Text style={styles.emptyText}>No Recommedations Yet</Text>
        <TouchableOpacity style={styles.addButton} onPress={()=>router.push("/create")}>
          <Text style={styles.addButtonText}>Add Your First Book</Text>
        </TouchableOpacity>
        </View>
      }
      />
    </View>
  )
}