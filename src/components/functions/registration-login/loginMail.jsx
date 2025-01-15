import React, { useState } from 'react'
import '../../styles-of-components/loginCss.css'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase'

export const LoginMail = () => {

  const navigateAfSignin = useNavigate()
  const [msj, setMsj] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const mailRegister = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("User login successfully");
      navigateAfSignin("/");
    } catch (error) {
      if (error.code === 'auth/invalid-credential') {
        setMsj('User or password are incorrect');
      } else if (error.code === 'auth/user-not-found') {
        setMsj('No user found with this email');
      } else if (error.code === 'auth/wrong-password') {
        setMsj('Incorrect password');
      } else {
        setMsj('Something went wrong. Please try again.');
        console.log(name)
      }
    }
}
  return (
    <div className="logIn_input_container">
    <input type="text" name="userName" id="logIn_username" placeholder='Username' onChange={(e)=> setName(e.target.value)}/>
    <input type="text" name="userEmail" id="logIn_username" placeholder='Email' onChange={(e)=> setEmail(e.target.value)}/>
    <input type="text" name="userPassword" id="logIn_username" placeholder='Password' onChange={(e)=> setPassword(e.target.value)}/>
    <button type="submit" className='submitButton' onClick={mailRegister}>Log in</button>
    <p>{msj}</p>
  </div>
  )
}
