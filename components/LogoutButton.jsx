import { Ionicons } from '@expo/vector-icons';
import { Alert, Text, TouchableOpacity } from 'react-native';
import styles from '../assets/styles/profile.styles';
import COLORS from '../constants/colors';
import { useAuthStore } from '../source/authStore';
export default function LogoutButton() {
  const {logout}=useAuthStore();
  const confirmLogout=()=>{
  Alert.alert("LogOut","Are you sure you want to logout?",[
    {text:"Cancel",style:"cancel"},
    {text:"Logout",onPress:()=>logout(), style:"destructive"}
  ]);

  };
  return (
    <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
      <Ionicons name="log-out" size={25} color={COLORS.white}/>
     <Text style={styles.logoutText}>Logout</Text>
    </TouchableOpacity>
  )
}