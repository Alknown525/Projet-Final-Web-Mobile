import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Tabs, Stack, Link, useRouter } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign'
import { StateProvider, StateContext, useStateContext } from '../context/StateContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, TextInput } from 'react-native-web'
import { getUserIdFromToken } from '../utility/utils';
import jwt_decode from 'jwt-decode';

const Layout = () => {
  const [user, setUser] = useState(null);
  const [ident, setIdent] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('username');
      await AsyncStorage.removeItem('userId');
      router.dismissAll()
      router.replace('/Connexion', { reset: true });
    } catch (e) {
      console.error('Error logging out:', e.message);
    }
  };

  useEffect(() => {
    const getUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }

        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          //router.replace('/connexion');
          setIdent(JSON.parse(userId));
        }
      } catch (e) {
        console.error('Error checking authentication:', e.message);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <StateProvider>
     <Stack>
      <Stack.Screen
        name="Connexion"
        options={{
          title: 'Connexion',
          headerTitleStyle: styles.boldTitle,
          tabBarStyle: { display: 'none' },
        }}
      />
      <Stack.Screen
        name="publications"
        options={{
          title: 'Publications',
          headerTitleStyle: styles.boldTitle,
          tabBarStyle: { display: 'none' },
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <Text style={styles.button}>Déconnecter</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      
      <Stack.Screen
        name="CreerPublication"
        options={{
          title: 'Nouvelle Publication',
          headerTitleStyle: styles.boldTitle,
          tabBarStyle: { display: 'none' },
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity onPress={logout} style={styles.logoutButton}>
                <Text style={styles.button}>Déconnecter</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
    </Stack>
  </StateProvider>
  )
}

const styles = StyleSheet.create({
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  headerButton: {
    marginLeft: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FF0000',
    fontWeight: 'bold',
    borderRadius: 8,
    marginLeft: 10,
  },
  linkText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#000000',
  },
  boldTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Layout