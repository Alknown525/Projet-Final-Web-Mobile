import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { StyleSheet, Text, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { StateProvider } from '../context/StateContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) {
          router.replace('/connexion');
        }
        else {
          router.replace('/publications');
        }
      } catch (e) {
        console.error('Error checking authentication:', e.message);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <StateProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Bienvenue à l'App Microblog</Text>
        <View style={styles.linksContainer}>
          <Link href="/publications" style={styles.link}>
            Voir les publications
          </Link>
          <Link href="/connexion" style={styles.link}>
            Se connecter
          </Link>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </StateProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  linksContainer: {
    alignItems: 'center',
  },
  link: {
    fontSize: 18,
    marginBottom: 10,
    color: '#007BFF',
  },
});
