import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router'; 

const DisconnectScreen = () => {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.removeItem('username');
        await AsyncStorage.removeItem('userId');
        //router.dismissAll()
        //router.replace('/connexion');
      } catch (e) {
        console.error('Error logging out:', e.message);
      }
    };

    logout();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Vous êtes déconnecté</Text>
      <Button title="Retour à la connexion" onPress={() => {
        router.dismissAll()
        router.replace('/connexion')}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 18,
    marginBottom: 20,
  },
});

export default DisconnectScreen;