import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { View, Text, StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-web'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConnexionScreen({ navigation }) {
  const [courriel, setCourriel] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState({username: '', userId: ''})
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:5000/api/jeton', { courriel, password });
      await AsyncStorage.setItem('userToken', response.data.token);
      await AsyncStorage.setItem('username',JSON.stringify(response.data.username));
      await AsyncStorage.setItem('userId',JSON.stringify(response.data.userId));
      //alert(response.data.userId);
      router.replace('/publications');
      //setUser({ username: 'Bob', userId: '1' });
    } catch (e) {
      //alert('Erreur de connexion');
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
