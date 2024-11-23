import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import FormSession from '../fonctionalites/session/composants/Form.session.composant'

//import VuePublication from './fonctionalites/publication/vues/Vue.Publication'
import axios from 'axios'
import VueSession from '../fonctionalites/session/vues/Vue.session'

const Stack = createNativeStackNavigator()

export default function App() {
  const chargerListFilms = async () => {
    // Requete a http://localhost:5000/api/films pour la liste de films

    try {
      const resultat = await axios({
        method: 'GET',
        url: `http://localhost:5000/api/publications`,
      })

      setFilms(resultat.data)
    } catch (e) {
      console.log(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    chargerListFilms()
  }, [])

  const [films, setFilms] = useState([])
  const [loading, setLoading] = useState(true)
  
  return (
    //<NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator initialRouteName="Session">
          <Stack.Screen name="Session" component={VueSession} />
          <Stack.Screen
            name="Films"
            children={() => <VueFilm films={films} loading={loading} />}
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </SafeAreaView>
    //</NavigationContainer>
  )
  
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    fontSize: 24,
  },
})