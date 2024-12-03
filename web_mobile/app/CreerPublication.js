import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Button } from 'react-native';
import { StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CreerPublicationScreen() {
  const [titre, setTitre] = useState('');
  const [message, setMessage] = useState('');
  const [publication, setPublication] = useState({titre: '', message: ''});

  const handlePost = async () => {
    const token = await AsyncStorage.getItem('token');
    await axios.post(
      'http://127.0.0.1:5000/api/publications',
      //{ content: message },
      { titre, message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitre('');
    setMessage('');
    alert('Message publié!');
  };

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
        placeholder="Message..."
        value={message}
        onChangeText={setMessage}
        multiline={true}
        numberOfLines={8}
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
    width: '25%',
    minWidth: 400,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  inputDescription: {
    width: '25%',
    minWidth: 400,
    height: 200,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    width: '25%',
    minWidth: 400,
  },
  button: {
    borderRadius: 8,
  },
  text: {
    padding: 5,
  }
})
