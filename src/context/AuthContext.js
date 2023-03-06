import React, { useReducer, createContext, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../config/firebase'

export const AuthContext = createContext()

const initialState = { isAuthenticated: false }

const reducer = ((state, { type, payload }) => {
  switch (type) {
    case "LOGIN":
      return { isAuthenticated: true, user: payload.user }
    case "LOGOUT":
      return { isAuthenticated: false }
    default:
      return state
  }
})

export default function AuthContextPovider(props) {

  const [state, dispatch] = useReducer(reducer, initialState)
  const [users, setUsers] = useState({})

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsers(user)
        dispatch({ type: "LOGIN", payload: { user } })
        // ...
      } else {
        // ... 
      }
    });
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, dispatch, users }}>
      {props.children}
    </AuthContext.Provider>
  )
}
