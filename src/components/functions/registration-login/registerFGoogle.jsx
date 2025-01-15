import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import React, { useState } from 'react'
import { auth, db } from '../../../firebase'
import { collection, query, where, getDocs, setDoc, doc } from 'firebase/firestore'
import googleLogo from '../../styles-of-components/vecteezy_google-logo-on-transparent-white-background_13948549.jpg'
import { useNavigate } from 'react-router-dom'
import '../../styles-of-components/registration.css'

const RegisterFGoogle = () => {

  const [error, setError] = useState('')

  const navigateAfSignin = useNavigate()

  // Check if the email is already sign in
  const checkIfMailExist = async (emailUser) => {
    const usersRef = collection(db, "Users")
    const q = query(usersRef, where("userEmail", "==", emailUser))
    const querySnapshot = await getDocs(q)

    // If querySnapshot is empty return that the func dosnt found a user with that email
    return !querySnapshot.empty
  }

  const registerWithGoogle = () => {
    const providerUserGoogle = new GoogleAuthProvider()
    signInWithPopup(auth, providerUserGoogle).then(async (result) => {
      if (result.user) {
        const emailExists = await checkIfMailExist(result.user.email)

        if (!emailExists) {
          // If the email dosnt exist, create the account
          await setDoc(doc(db, "Users", result.user.uid), {
            userName: result.user.displayName,
            userEmail: result.user.email,
            userPhoto: result.user.photoURL,
            isAdmin: false,
          })
          console.log("User registered successfully!")
          navigateAfSignin('/')
        } else {
          setError("A user with this email already exists.")
        }
      }
    }).catch((error) => {
      console.error("Error during Google sign-in: ", error)
    })
  }

  return (
    <>
      <div className="buttonGoogleRegister" onClick={registerWithGoogle}>
        <img src={googleLogo} alt="google_logo" />
        <p>Sign up with Google</p>
      </div>
      <p>{error}</p>
    </>
  )
}

export default RegisterFGoogle
