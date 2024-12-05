import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreerPublicationScreen() {
  const [titre, setTitre] = useState('');
  const [message, setMessage] = useState('');
  const [image, setImage] = useState('');
  const [publication, setPublication] = useState({titre: '', message: ''});

  const handlePost = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Erreur', 'Jeton authentification manquant.');
        console.log('no token', 'no token');
        return;
      }

      const publicationData = {
        titre,
        message,
        image,
      };

      const response = await axios.post(
        'http://127.0.0.1:5000/api/publications', // Correct API endpoint
        publicationData,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include JWT token
            'Content-Type': 'application/json',
          },
        }
      );

      setTitre('');
      setMessage('');
      setImage('');
      Alert.alert('Succès', 'Publication créée avec succès!');
      console.log('Publication response:', response.data);
    }
    catch (error) {
      console.error('Error creating publication:', error);
      if (error.response) {
        Alert.alert('Erreur', error.response.data || 'Une erreur s\'est produite.');
        console.log('Erreur', error.response || 'Une erreur s\'est produite.')
      } else {
        Alert.alert('Erreur', 'Impossible de se connecter au serveur.');
        console.log('Erreur', 'cant connect')

      }
    }
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
        value={message}
        onChangeText={setMessage}
        multiline={true}
        numberOfLines={8}
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
  button: {
    borderRadius: 8,
  },
  text: {
    padding: 5,
  }
})
