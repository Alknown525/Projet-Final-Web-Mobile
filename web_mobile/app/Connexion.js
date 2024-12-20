import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-web'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStateValue, StateProvider } from '../context/StateContext'

export default function ConnexionScreen({ navigation }) {
  const {state, dispatch } = useStateValue()
  const [courriel, setCourriel] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/jeton', { courriel, password });
      await AsyncStorage.setItem('userToken', response.data.jeton);
      await AsyncStorage.setItem('username', JSON.stringify(response.data.username));
      await AsyncStorage.setItem('userId', response.data.userId);
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;
  
        const response = await axios.get('http://127.0.0.1:5000/api/publications', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.data.status === 'OK') {
          dispatch({
            type: 'CHARGER_PUBLICATIONS',
            payload: response.data.publications,
          });
          
          setPosts(response.data.publications);
          setNewPostAvailable(false); 
          router.replace('/publications');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des publications :', error.message);
      };
      router.replace('/publications');
    } catch (e) {
      alert('Courriel ou mot de passe invalide');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titre}>Bienvenue</Text>
      <Text style={styles.soustitre}>Web Mobile: Projet Final{"\n"}par Alexandru B. et Éliott M.</Text>
      <TextInput
        style={styles.input}
        placeholder="Courriel"
        onChangeText={setCourriel}
        value={courriel}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <View style={styles.buttonContainer}>
        <Button title="Se connecter" onPress={handleLogin} />
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
    backgroundColor: '#f5f5f5',
  },
  titre: {
    textAlign: 'center',
    fontSize: 60,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#333',
  },
  soustitre: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '',
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
    marginTop: 10,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    width: 400,
    maxWidth: '90%',
    marginTop: 10,
    borderRadius: 8,
  },
});
