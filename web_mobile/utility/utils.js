import jwt_decode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getUserIdFromToken = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      const decoded = jwt_decode(token);
      return decoded.identity;
    }
  } catch (error) {
    console.error('Error decoding token:', error);
  }
  return null;
};