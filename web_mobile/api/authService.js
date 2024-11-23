import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

const URL_API = `http://localhost:5000/api`

export const ouvrirSession = async (courriel, motPasse) => {
  try {
    const reponse = await axios({
      method: 'POST',
      url: `${URL_API}/session`,
      data: { courriel, mot_passe: motPasse },
    })
    const { jeton } = reponse.data

    if (jeton) {
      await AsyncStorage.setItem('jeton', jeton)
    }
    return jeton
  } catch (e) {
    console.log(`Erreur: ${e.message}`)
    throw new Error(e.message)
  }
}

export const requeteAuth = async (methode, route, payload = null) => {
  const token = await AsyncStorage.getItem('jeton')
  try {
    if (!token) {
      throw new Error(`Jeton non dispible`)
    }
    const reponse = await axios({
      method: methode,
      url: `${URL_API}${route}`,
      data: payload,
      headers: {
        Authorization: `Bearer ${jeton}`,
        'Content-Type': 'application/json',
      },
    })
    return reponse.data
  } catch (err) {
    throw new Error(`Erreur: requete ${methode} a ${route}`)
  }
}