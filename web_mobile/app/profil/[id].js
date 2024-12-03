import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profil = () => {
  const [user, setUser] = useState('');
  const [loading, setLoading] = useState('');
  const [error, setError] = useState(null);
  const router = useRouter();
  
  const { id } = useLocalSearchParams()

  useEffect(() => {
    if (!id) return;

    const fetchUserProfile = async () => {
      console.log('Fetching user profile for id:', id);

      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        router.replace('/connexion'); 
      }

      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/utilisateur/${id}`);

        console.log('User data fetched:', response.data);

        setUser(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user data:', err);
        console.log(user)
        setError('Unable to fetch user data');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id, router]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement du profil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Profil de {user.nom}</Text>
      <Text style={styles.text}>Nom: {user.nom}</Text>
      <Text style={styles.text}>Email: {user.courriel}</Text>
      <Text style={styles.text}>Followers: {user.followers}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Profil;
