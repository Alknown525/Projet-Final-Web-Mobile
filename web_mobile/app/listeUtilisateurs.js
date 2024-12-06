import { Link, useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, ScrollView, Alert  } from 'react-native'
import { useStateValue, StateProvider } from '../context/StateContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';


const PublicationsScreen = () => {
  const router = useRouter()
  const [userId, setUserId] = useState(null);
  const {state, dispatch } = useStateValue()
  const [filter, setFilter] = useState('tout')
  const [listeUtilisateurs, setListeUtilisateurs] = useState([]);
  const [listeSuivis, setListeSuivis] = useState([]);
  const [liste123, setListe123] = useState([]);
  const [loading, setLoading] = useState(false);

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
    getUtilisateurs();
  }, []);

  const getUtilisateurs = async () => {
    setLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.get('http://localhost:5000/api/utilisateur', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setListeUtilisateurs(response.data);
    
    const response2 = await axios.get(`http://localhost:5000/api/utilisateur/following`, {
        headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', 
        },
    });
    setListeSuivis(response2.data);
    
    setLoading(false);
  }

  const handleFollowUnfollow = (userId, isFollowing) => {
    if (isFollowing) {
      // Unfollow user
      //setFollowingIds((prev) => prev.filter((id) => id !== userId));
      plusSuivreUtilisateur(userId);
    } else {
      // Follow user
      //setFollowingIds((prev) => [...prev, userId]);
      suivreUtilisateur(userId);
    }
  };

  const suivreUtilisateur = async (userId) => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Erreur', 'Jeton authentification manquant.');
          console.log('no token', 'no token');
          return;
        }

        const response = await axios.get(
        `http://127.0.0.1:5000/api/utilisateur/suivre/${userId}`,
        {
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            }
        });
        alert('Vous suivez maintenant cet utilisateur');
        getUtilisateurs();
        console.log('Publication response:', response.data);
        
      }
      catch (error) {
        //console.error('Erreur:', error);
        if (error.response) {
          alert(error.response.data.message || 'Une erreur s\'est produite.');
          console.log('Erreur', error.response.data || 'Une erreur s\'est produite.')
        } else {
          alert('Erreur de connexion');
          console.log('Erreur', error.message)
        }
      }
  }

  const plusSuivreUtilisateur = async (userId) => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          Alert.alert('Erreur', 'Jeton authentification manquant.');
          console.log('no token', 'no token');
          return;
        }

        const response = await axios.get(
        `http://127.0.0.1:5000/api/utilisateur/ne_plus_suivre/${userId}`,
        {
            headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            }
        });
        alert('Vous ne suivez plus cet utilisateur');
        getUtilisateurs();
        console.log('Publication response:', response.data);
        
      }
      catch (error) {
        //console.error('Error creating publication:', error);
        if (error.response) {
          alert(error.response.data.message || 'Une erreur s\'est produite.');
          console.log('Erreur', error.response.data || 'Une erreur s\'est produite.')
        } else {
          alert('Erreur de connexion');
          console.log('Erreur', error.message)
        }
      }
  }

  if (state.loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Chargement des utilisateurs...</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => {
    const isFollowing = listeSuivis.includes(item.id); // Check if user is followed
    
    return (
        <View style={styles.item}>
        <View style={styles.authorContainer}>
          <Image
            source={{ uri: item.image_profil }}
            style={styles.profileImage}
          />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{item.nom}</Text>
          </View>
          <View 
              style={styles.filterContainer}
          >
              <TouchableOpacity
                  style={isFollowing ? styles.buttonPlusSuivre : styles.buttonSuivre}
                  onPress={() => handleFollowUnfollow(item.id, isFollowing)}
              >
                  <Text style={styles.createButtonText}>{isFollowing ? 'Unfollow' : 'Follow'}</Text>
              </TouchableOpacity>
          </View>
        </View>
        
      </View>
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        
        <FlatList
          style={styles.flatList}
          data={listeUtilisateurs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              Aucun article n'a été trouvé.
            </Text>
          )}
        />
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
  buttonSuivre: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    marginLeft: 0,
    width: 150,
  },
  buttonPlusSuivre: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FF0000',
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
