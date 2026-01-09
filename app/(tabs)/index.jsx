import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, View } from 'react-native';
import styles from '../../assets/styles/home.styles';
import Loader from '../../components/Loader';
import { API_URL } from '../../constants/api';
import COLORS from '../../constants/colors';
import { formatPublicDate } from '../../lib/utils';
import { useAuthStore } from '../../source/authStore';
export default function Home() {
  const {token}=useAuthStore();
  const [books,setBooks]=useState([]);
  const [loading,setLoading]=useState(true);
  const [refreshing,setRefreshing]=useState(false);
  const [page,setPage]=useState(1);
  const [hasMore,setHasMore]=useState(true);


  const fetchBooks=async (pageNum=1,refresh=false)=>{
   try {
    if(refresh) setRefreshing(true);
    else if(pageNum===1) setLoading(true);
    const response=await fetch(`${API_URL}/books?page=${pageNum}&limit=5`,{
      headers:{Authorization:`Bearer ${token}`}
    });

    const data=await response.json();
    if(!response.ok) throw new Error(data.message||"Failed to fetch books");
    //setBooks((prevbooks)=>[...prevbooks,...data.books]);

  const uniqueBooks = refresh || pageNum === 1
  ? data.books
  : [...books, ...data.books].reduce((acc, book) => {
      if (!acc.some(b => b._id === book._id)) {
        acc.push(book);
      }
      return acc;
    }, []);

setBooks(uniqueBooks);

    setHasMore(pageNum<data.totalPages)
    setPage(pageNum)
   } catch (error) {
    console.log("Errorfeching books",error);

   }finally{
    if(refresh){
      setRefreshing(false);

    }else{
      setLoading(false);
    }
   }

  };

  const renderItem=({item})=>(
<View style={styles.bookCard}>
<View style={styles.bookHeader}>
  <View style={styles.userInfo}>
    <Image source={{uri:item.user.profileImage}} style={styles.avatar}/>
    <Text style={styles.username}>{item.user.username}</Text>
  </View>
</View>

<View style={styles.bookImageContainer}>
  <Image source={item.image} style={styles.bookImage} contentFit="cover"/>
</View>
<View style={styles.bookDetails}>
  <Text style={styles.bookTitle}>{item.title}</Text>
  <View style={styles.ratingContainer}>{renderRatingPicker(item.rating)}</View>
  <Text style={styles.caption}>{item.caption}</Text>
  <Text style={styles.date}>Shared On: {formatPublicDate(item.createdAt)}</Text>
</View>
    </View>
  );
  const renderRatingPicker = (rating) => {
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
  const handleMore=async ()=>{
if(hasMore && !loading && !refreshing){
  await fetchBooks(page+1);
}

  };
  useEffect(()=>{
  fetchBooks();
  },[]);

  if(loading) return <Loader/>;
  return (
   <View style={styles.container}>
    <FlatList
    data={books}
    renderItem={renderItem}
    keyExtractor={(item)=>item._id}
    contentContainerStyle={styles.listContainer}
    showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl
    refreshing={refreshing}
    onRefresh={()=>fetchBooks(1,true)}
     colors={[COLORS.primary ]}
    tintColor={COLORS.primary}
    />}
    onEndReached={handleMore}
  
     ListHeaderComponent={
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hey BookWorm</Text>
        <Text style={styles.headerSubtitle}>Discover books shared by the community! 🌟</Text>
        
      </View>
    }
    ListEmptyComponent={
      <View style={styles.emptyContainer}>
        <Ionicons name="book-outline" size={60} color={COLORS.textSecondary}/>
        <Text style={styles.emptyText}>No recommadations yet</Text>
        <Text style={styles.emptySubtext}>Be the first to share a book! </Text>
      </View>
    
    }
    ListFooterComponent={
      hasMore && books.length>0?(
        <ActivityIndicator style={styles.footerLoader} color={COLORS.textSecondary}/>
      ):null
    }
    />
   
   </View>
  );
}
