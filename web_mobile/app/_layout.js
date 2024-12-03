import React, { useContext, useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Tabs, Stack, Link, useRouter } from 'expo-router'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign'
import { StateProvider, StateContext, useStateContext } from '../context/StateContext'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserIdFromToken } from '../utility/utils';
import jwt_decode from 'jwt-decode';

const Layout = () => {
  const [user, setUser] = useState(null);
  const [ident, setIdent] = useState(null);
  const [loading, setLoading] = useState(true);

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
      {/*
      <Stack.Screen
        name="connexion"
        options={{
          title: 'Connexion',
          headerTitleStyle: styles.boldTitle,
          tabBarStyle: { display: 'none' },
        }}
      />
      */}
      <Stack.Screen
        name="publications"
        options={{
          title: 'Publications',
          headerTitleStyle: styles.boldTitle,
          tabBarStyle: { display: 'none' },
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Link href={`/profil/${ident}`} style={styles.button}>
                <Text style={styles.linkText}>Mon profil</Text>
              </Link>
              <Link href="/deconnexion" style={styles.button2}>
                <Text style={styles.linkText}>Déconnexion</Text>
              </Link>
            </View>
          ),
        }}
      />
      <Stack.Screen
        name="profil/[id]"
        options={{
          title: 'Profile',
          headerTitleStyle: styles.boldTitle,
          tabBarStyle: { display: 'none' },
          headerRight: () => (
            <View style={styles.headerButtons}>
              <Link href="/publications" style={styles.button}>
                <Text style={styles.linkText}>Publications</Text>
              </Link>
              <Link href="/deconnexion" style={styles.button2}>
                <Text style={styles.linkText}>Déconnexion</Text>
              </Link>
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
    backgroundColor: '#007BFF',
    borderRadius: 8,
    marginLeft: 10,
  },
  button2: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#C60000',
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