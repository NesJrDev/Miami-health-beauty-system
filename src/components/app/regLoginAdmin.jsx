import { useState } from "react";
import { Header } from "./Header";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import '../styles-of-components/reglogincss.css'
import { UxAdmin } from "../functions/registration-login-admin/ux-admin";
import NoProfilePicture from "../../images/profile/blank-profile-picture-973460_640.png";

export const RegLoginAdmin = () => {
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

    // Cleanup function
    return () => unsubscribe();
  }, []);


  return (
    <>
      {userDetails && (userDetails.isAdmin === true || userDetails.isAdmin === 'developer') ? (
        <UxAdmin />
      ) : userDetails ? (
        <div className="containerNoAdmin">
          <div className="containerOfNoAdmin">
            <img className="pictureProfile" src={userDetails.userPhoto ? userDetails.userPhoto : NoProfilePicture} alt="User" />
            <h1 className="titleNoAdmin">I'm sorry {userDetails.userName ? userDetails.userName : ''}, but you are not an admin</h1>
            <button className="buttonomepage" onClick={() => navigateLog('/')}>Go to Homepage</button>
          </div>
        </div>
      ) : (
        <div>Loading...</div> 
      )}
    </>
  );  
};