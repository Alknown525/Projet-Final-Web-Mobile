import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button } from 'react-native';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

export default function PublicationScreen() {
  const [posts, setPosts] = useState([]);
  const [newPostAvailable, setNewPostAvailable] = useState(false);

  useEffect(() => {
    fetchPosts();

    socket.on('new_post', () => {
      setNewPostAvailable(true);
    });

    return () => {
      socket.off('new_post');
    };
  }, []);

  const fetchPosts = async () => {
    const token = await AsyncStorage.getItem('token');
    const response = await axios.get('http://localhost:3000/api/publications', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setPosts(response.data);
  };

  return (
    <View>
      {newPostAvailable && (
        <Button title="Nouveaux messages disponibles. Actualiser" onPress={fetchPosts} />
      )}
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.content}</Text>}
      />
    </View>
  );
}
