import React, { useEffect, useState } from 'react'
import ProgramatorArea from '../functions/programator'
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

export const DeveloperServices = () => {
    const navigateLog = useNavigate();
    const [userDetails, setUserDetails] = useState(null);
    const trapUserData = async (user) => {
      if (user) {
        const docRefUser = doc(db, "Users", user.uid);
        const dataUser = await getDoc(docRefUser);
        if (dataUser.exists()) {
          setUserDetails(dataUser.data());
        }
      } else {
        setUserDetails(null);
      }
    };
  
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        trapUserData(user);

      });
      return () => unsubscribe();
    }, []);

  return (
    <>
    {userDetails ? (
        userDetails.isAdmin === 'developer' ? (
            <ProgramatorArea />
        ):(
            navigateLog('/')
        )   
    ):(
        <></>
    )}

    </>

  )
}
