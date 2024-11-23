import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { Button, TextInput } from 'react-native-web'
import { ouvrirSession } from '../../../api/authService'

const FormSession = ({ navigation }) => {
  const [courriel, setCourriel] = useState('')
  const [motPasse, setMotPasse] = useState('')
  const [erreur, setErreur] = useState('')

  const gererSession = async () => {
    try {
      console.log('Ouvrir session')
      const jeton = await ouvrirSession(courriel, motPasse)
      console.log(jeton)
      navigation.navigate('Films')
    } catch (e) {
      setErreur("Donnes d'authentification invalides")
    }
  }

  return (
    <>
      {erreur && <Text>{erreur}</Text>}
      <View>
        <TextInput
          placeholder="Courriel"
          value={courriel}
          onChangeText={setCourriel}
        />
        <TextInput
          placeholder="Mot de passe"
          value={motPasse}
          onChangeText={setMotPasse}
        />
        <Button title="Ouvrir session" onPress={gererSession} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({})

export default FormSession