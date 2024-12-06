import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Button, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router'
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStateValue, StateProvider } from '../context/StateContext'


export default function CreerPublicationScreen() {
  const router = useRouter()
  const [titre, setTitre] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [userId, setUserId] = useState('');
  const [publication, setPublication] = useState({titre: '', message: ''});
  const {state, dispatch } = useStateValue()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          setUserId(JSON.parse(userId));
        }
        if (!userToken) {
          router.replace('/Connexion');
        }
      } catch (e) {
        console.error('Error checking authentication:', e.message);
      }
    };

    checkAuth();
  }, []);

  const handlePost = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erreur', 'Jeton authentification manquant.');
        console.log('no token', 'no token');
        return;
      }
      if (titre === "") {
        alert("Titre vide, veuillez mettre un titre");
        return;
      }
      else if (description === "") {
        alert("Message vide, veuillez mettre un message");
        return;
      }
      
      else {
        const dataPublication = {
          titre,
          description,
          image,
        };

        const response = await axios.post(
          'http://127.0.0.1:5000/api/publications',
          dataPublication,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          }
        );
        alert('Publication créée avec succès!');
        router.replace('/publications');
        console.log('Publication response:', response.data);
      }
    }
    catch (error) {
      console.error('Error creating publication:', error);
      if (error.reponse) {
        Alert.alert('Erreur', error.reponse.data || 'Une erreur s\'est produite.');
        console.log('Erreur', error.reponse || 'Une erreur s\'est produite.')
      } else {
        Alert.alert('Erreur', 'Impossible de se connecter au serveur.');
        console.log('Erreur', 'cant connect')

      }
    }
  };

  const retour = async () => {
    router.replace('/publications');
  };

  // le code original...
  /*
  const handlePost = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.post(
      'http://127.0.0.1:5000/api/publications',
      //{ content: message },
      dataPubTemp,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitre('');
    setMessage('');
    alert('Message publié!');
  };
  */

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Créer une nouvelle publication</Text>
      <TextInput
        style={styles.input}
        placeholder="Titre..."
        value={titre}
        onChangeText={setTitre}
      />
      <TextInput
        style={styles.inputDescription}
        placeholder="Écrivez votre message..."
        value={description}
        onChangeText={setDescription}
        multiline={true}
        numberOfLines={5}
      />
      <TextInput
        style={styles.input}
        placeholder="URL de l'image (optionnel)"
        value={image}
        onChangeText={setImage}
      />
      <View style={styles.buttonContainer}>
        <Button 
          style={styles.button}
          title="Publier" 
          onPress={handlePost} 
        />
      </View>
      <View style={styles.buttonContainer2}>
        <Button 
            style={styles.button}
            title="Retour en arrière" 
            onPress={retour} 
            color="#C0C0C0"
          />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  titre: {
    textAlign: 'center',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: 400,
    maxWidth: '90%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  inputDescription: {
    width: 400,
    maxWidth: '90%',
    height: 200,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    width: 400,
    maxWidth: '90%',
    borderRadius: 8,
  },
  buttonContainer2: {
    width: 400,
    maxWidth: '90%',
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: '#808080',
  },
  button: {
    borderRadius: 8,
  },
  text: {
    padding: 5,
  }
})
