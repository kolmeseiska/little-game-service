import React from 'react'
import {
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  onIdTokenChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  UserCredential
} from 'firebase/auth'

const provider = new GoogleAuthProvider()

const auth = getAuth()
auth.languageCode = 'fi'

export const useAuth = () => {
  const [user, setUser] = React.useState<UserCredential['user'] | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  const handleUser = (user: UserCredential['user'] | null) => {
    setUser(user || null)
    setIsLoading(false)
  }

  const logIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => handleUser(result.user))
      .catch((error) => console.log(error))
  }

  const logOut = () => {
    signOut(auth)
      .then(() => handleUser(null))
  }

  React.useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, handleUser)
    return () => unsubscribe()
  }, [])
  return { user, isLoading, logIn, logOut }
}

export const requestLogin = () => signInWithRedirect(auth, provider)

export const getLoginInformation = () =>
  getRedirectResult(auth, provider)
    .then((result) => {
      if (result == null) {
        console.error('No result')
        alert('Login failed')
        return
      }
      const credential = GoogleAuthProvider.credentialFromResult(result)
      if (credential == null) {
        console.error('Invalid credentials')
        alert('Login failed')
        return
      }
      const token = credential.accessToken

      // The signed-in user info.
      const user = result.user
      alert(JSON.stringify(result))
      // The signed-in user info.
      // const user = result.user
      return {
        token,
        user
      }

    }).catch((error) => {
      const errorCode = error.code
      const errorMessage = error.message
      const email = error.customData.email
      const credential = GoogleAuthProvider.credentialFromError(error)
      console.error({
        errorCode,
        errorMessage,
        email,
        credential
      })
      throw error
    })
