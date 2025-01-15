import React, { useState } from 'react'
import googleLogo from '../../styles-of-components/vecteezy_google-logo-on-transparent-white-background_13948549.jpg'
import { GoogleAuthProvider } from 'firebase/auth'
import { signInWithPopup } from 'firebase/auth'
import { auth, db } from '../../../firebase'
import { doc, getDoc } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import '../../styles-of-components/loginCss.css'
import { LoginMail } from './loginMail'

export const LoginF = () => {
  
  const [msj, setMsj] = useState('')
  const navigateAfSignin = useNavigate()

  const loginWithGoogle = async (e) => {
    try {
      const providerUserGoogle = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, providerUserGoogle);
  
      if (result.user) {
        const docRefUser = doc(db, "Users", result.user.uid);
        const dataUser = await getDoc(docRefUser);
  
        if (dataUser.exists()) {
          setMsj("Log in successfully");
          setTimeout(() => {
            navigateAfSignin('/')
          }, 500);
        } else {
          setMsj("We did not find any user");
        }
      }
    } catch (error) {
      console.error("Error during Google sign-in: ", error);
    }
  };
  
  
  return (
    <div className='container_logIn'>
        <h1>Log in</h1>
        <LoginMail />
        <br />
          <p>-- Or use --</p>
        <br />
              <div className="buttonGoogleRegister" onClick={loginWithGoogle}>
                <img src={googleLogo} alt="google_logo" />
                <p>Sign up with Google</p>
              </div>
          <p>{msj}</p>
    </div>
  )
}
