import { useEffect, useReducer } from 'react'
import axios from 'axios'
import dataReducer, { CHARGER_PUBLICATIONS } from '../reducers/dataReducer'

const useData = () => {
  const [state, dispatch] = useReducer(dataReducer, {
    publications: [],
    loading: true,
  })

  const chargerListePublications = async () => {
    try {
      const resultat = await axios.get('http://127.0.0.1:5000/api/publications');
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
