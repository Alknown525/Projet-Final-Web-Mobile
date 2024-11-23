import React from 'react';
import { Stack } from 'expo-router'
import { createStackNavigator } from '@react-navigation/stack';
import ConnexionScreen from './Connexion';
import PublicationScreen from './Publication';
import CreerPublicationScreen from './CreerPublication';
import ProfilScreen from './Profil';

const Layout = () => {
  return (
    <Stack>
        <Stack.Screen 
          name="Connexion" 
          options={{ headerShown: true }} 
        />
        <Stack.Screen 
          name="Profil" 
          options={{ headerShown: true }}
        />
      </Stack>
  )
}

export default Layout