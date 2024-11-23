import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, AsyncStorage } from 'react-native';
import axios from 'axios';

export default function ProfilScreen({ navigation }) {
  const [userInfo, setUserInfo] = useState(null);
  //const [publications, setPublications] = useState([]);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await axios.get('http://localhost:3000/api/utilisateur', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserInfo(response.data);

        // const pubsResponse = await axios.get(
        //   `http://localhost:3000/api/utilisateur/${response.data.id}/publications`,
        //   {
        //     headers: { Authorization: `Bearer ${token}` },
        //   }
        // );
        // setPublications(pubsResponse.data);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des données:', error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.navigate('Connexion');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  if (userInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }
  const pubnum = 0;
  return (
    <View style={styles.container}>
      <View style={styles.toolbar}>
        <Button title="Publications" onPress={() => alert('Voir les publications')} />
        <Button
          title="Créer une publication"
          onPress={() => alert('Créer une nouvelle publication')}
        />
        <Button title="Se déconnecter" color="red" onPress={handleLogout} />
      </View>

      <ScrollView style={styles.scrollContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Profil de {"userInfo.username"}</Text>
          <Text style={styles.infoText}>Email: {"userInfo.email"}</Text>
          <Text style={styles.infoText}>Abonnements: {"userInfo.followingCount"}</Text>
          <Text style={styles.infoText}>Abonnés: {"userInfo.followerCount"}</Text>
        </View>

        <View style={styles.publicationsBox}>
          <Text style={styles.publicationsTitle}>Publications</Text>
          {pubnum > 0 ? (
            publications.map((pub, index) => (
              <View key={index} style={styles.publicationItem}>
                <Text style={styles.publicationTitle}>{pub.title}</Text>
                <Text style={styles.publicationContent}>{pub.content}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.noPublicationsText}>
              Aucun contenu publié pour le moment.
            </Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  publicationsBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  publicationsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  publicationItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  publicationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  publicationContent: {
    fontSize: 16,
    color: '#555',
  },
  noPublicationsText: {
    fontSize: 16,
    color: '#999',
  },
});
