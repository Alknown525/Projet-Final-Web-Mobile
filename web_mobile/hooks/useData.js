import React, { useEffect, useState, useReducer } from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import dataReducer, { CHARGER_PUBLICATIONS, initialState } from '../reducers/dataReducer'

const useData = () => {
  const [userToken, setUserToken] = useState(null);
  const [state, dispatch] = useReducer(dataReducer, initialState)

  const chargerListePublications = async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken === null) {
        console.log('No token found');
      }

      const resultat = await axios.get('http://localhost:5000/api/publications', {
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
      });
      dispatch({
        type: CHARGER_PUBLICATIONS,
        payload: resultat.data,
      })
    } catch (e) {
      console.log(e.message)
    }
  }

  useEffect(() => {
    chargerListePublications()
  }, [])

  return [state, dispatch]
}

export default useData
