import { createContext, useContext } from 'react'
import useData from '../hooks/useData'

const StateContext = createContext(null)

export const StateProvider = ({ children }) => {
  const [state, dispatch] = useData()

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  )
}

export const useStateValue = () => {
  const context = useContext(StateContext)
  if (context === null) {
    throw new Error("useStateValue doit etre utilise a l'interieur de StateProvider")
  }
  return context
}
