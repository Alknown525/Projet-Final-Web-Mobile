import { Link, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native'
import { useStateValue, StateProvider } from '../context/StateContext'
import AsyncStorage from '@react-native-async-storage/async-storage';


const PublicationsScreen = () => {
  const router = useRouter()
  const { state, dispatch } = useStateValue()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (!userToken) {
          router.replace('/connexion');
        }
      } catch (e) {
        console.error('Error checking authentication:', e.message);
      }
    };

    checkAuth();
  }, []);

  if (state.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des publications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList style={styles.flatList}
        data={state.publications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.titre}>{item.titre}</Text>

            <Text style={styles.text}>{item.message}</Text>
            <Text style={styles.text}>{`Date: ${item.date}`}</Text>
            <Text style={styles.text}>{`Auteur ID: ${item.auteur_id}`}</Text>

            <Link href={`/profil/${item.auteur_id}`} style={styles.button}>
              <Text style={styles.linkText}>Profile de l'auteur</Text>
            </Link>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>
            Aucun article n'a été trouvé.
          </Text>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  flatList: {
    width: '50%',
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    borderRadius: 8,
  },
  item: {
    flexDirection: 'column',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    marginLeft: 0,
    width: 150,
  },
  linkText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
  titre: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  text: {
    padding: 5,
  }
})

export default PublicationsScreen
