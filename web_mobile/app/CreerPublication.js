import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import axios from 'axios';

export default function CreerPublicationScreen() {
  const [message, setMessage] = useState('');

  const handlePost = async () => {
    const token = await AsyncStorage.getItem('token');
    await axios.post(
      'http://localhost:3000/api/publications',
      { content: message },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMessage('');
    alert('Message publié!');
  };

  return (
    <View>
      <TextInput
        placeholder="Écrivez votre message..."
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Publier" onPress={handlePost} />
    </View>
  );
}
