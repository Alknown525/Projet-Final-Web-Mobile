import { Link, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, ScrollView } from 'react-native'
import { useStateValue, StateProvider } from '../context/StateContext'
import AsyncStorage from '@react-native-async-storage/async-storage';


const PublicationsScreen = () => {
  const router = useRouter()
  const [userId, setUserId] = useState(null);
  const {state, dispatch } = useStateValue()
  const [filter, setFilter] = useState('tout')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          setUserId(JSON.parse(userId));
        }
        if (!userToken) {
          router.replace('/connexion');
        }
      } catch (e) {
        console.error('Error checking authentication:', e.message);
      }
    };

    checkAuth();
  }, []);

  const filteredPublications = state.publications.filter((item) => {
    if (filter === 'moi') {
      return item.utilisateur.id === userId;
    }
    if (filter === 'suivies') {
      return item.utilisateur.followers.some((follower) => follower.id === userId)
    }
    return true;
  });

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
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <ScrollView horizontal style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'tout' && styles.selectedFilter]}
            onPress={() => setFilter('tout')}>
            <Text style={styles.filterText}>Toutes les publications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'moi' && styles.selectedFilter]}
            onPress={() => setFilter('moi')}>
            <Text style={styles.filterText}>Mes publications</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'suivies' && styles.selectedFilter]}
            onPress={() => setFilter('suivies')}>
            <Text style={styles.filterText}>Publications suivies</Text>
          </TouchableOpacity>
        </ScrollView>

        <FlatList
          style={styles.flatList}
          data={filteredPublications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={styles.authorContainer}>
                <Image
                  source={{ uri: item.utilisateur.image_profil }}
                  style={styles.profileImage}
                />
                <View style={styles.authorInfo}>
                  <Text style={styles.authorName}>{item.utilisateur.nom}</Text>
                  <Text style={styles.titre}>{item.titre}</Text>
                </View>
              </View>
              <Text style={styles.text}>{item.message}</Text>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.postImage}
                />
              )}
            </View>
          )}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Aucun article n'a été trouvé.
            </Text>
          )}
        />
        <View horizontal style={styles.filterContainer}>
          <TouchableOpacity
            style={styles.filterButton}
            //onPress={() => router.push('/CreerPublication')}
          >
            <Text style={styles.createButtonText}>Precedent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            //onPress={() => router.push('/CreerPublication')}
          >
            <Text style={styles.createButtonText}>Suivant</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/CreerPublication')}
      >
        <Text style={styles.createButtonText}>Publier</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
  },
  contentContainer: {
    alignItems: 'center',
  },
  flatList: {
    width: 500,
    maxWidth: '90%',
    minWidth: 300,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
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
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
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
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    maxWidth: '90%',
    alignContent: 'center',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#ddd',
    borderRadius: 8,
    marginRight: 10,
  },
  selectedFilter: {
    backgroundColor: '#007BFF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },

  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
})

export default PublicationsScreen
