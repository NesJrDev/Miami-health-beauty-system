import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebase'
import noProfileImg from '../../images/profile/blank-profile-picture-973460_640.png'
import appUser from '../../images/profile/app_user.png'
import '../styles-of-components/profileIcon.css'
import { LogOutF } from './registration-login/LogOutF'
import { useNavigate } from 'react-router-dom'
import adminPhoto from '../../images/profile/admin-icon.svg'
import devPhoto from '../../images/profile/developer_6478099.png'

export const IconProfile = () => {
  
    const navigateF = useNavigate()
    const [userDetails, setUserDetails] = useState(null)
    const [valueButton, setValueButton] = useState("Log in?")
    const [isVisible, setIsVisible] = useState(false)

    const trapUserData = async (user) => {
        if(user) {
            const docRefUser = doc(db, "Users", user.uid);
            const dataUser = await getDoc(docRefUser)
            if(dataUser.exists()) {
                setUserDetails(dataUser.data())
                setValueButton("Log out")
            }
        }else {
          setUserDetails(null) 
        }
      }
      const displayArea = () => {
        setIsVisible(!isVisible)
      }
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
      trapUserData(user);
      });
      
      return () => unsubscribe();
    }, []);
    return (
        <div>
          <div className="iconProfile">
            {/* Picture profile */}
            <div className="iconUser">
              <img
                className="userProfile"
                src={userDetails && userDetails.userPhoto ? userDetails.userPhoto : noProfileImg}
                alt="profile"
                onClick={displayArea}
              />
            </div>
            {/* End picture profile / user info */}
      
            <div className={`userInfo ${isVisible ? 'visible_flex' : ''}`}>
            
              {userDetails !== null ? (
                <>
                <div className='userprofile_data'>
                <img
                className="userProfile2"
                src={userDetails && userDetails.userPhoto ? userDetails.userPhoto : noProfileImg}
                alt="profile"
              />
                <div className="userDetails">
                  <strong><p>{userDetails.userName}</p></strong>
                  <p>{userDetails.userEmail}</p>
                </div>
                </div>
                <div className="appointmentsUser" onClick={()=> navigateF("/appointments")}>
                    <img src={appUser} alt="appointments" />
                    <p>Appointments</p>
                </div>
                {userDetails.isAdmin && (
                  <>
                  <div className="appointmentsUser" onClick={()=> navigateF("/adminPanel")}>
                   <img src={adminPhoto} alt="appointments" />
                   <p>Admin</p>
                </div>
                  </>
                )}
                {userDetails.isAdmin == "developer" ? (
                <>
                  <div className="appointmentsUser" onClick={()=> navigateF("/programator-area")}>
                    <img src={devPhoto} alt="Developer-area" />
                    <p style={{color: 'red'}}>Developer</p>
                  </div>
                </>  
                ) : (
                  <>
                  </>
                )}
                <LogOutF />
                </>
              ) : (
                <p>Loading... {valueButton}?</p>
              )}
            </div>
          </div>
        </div>
      );
      
}
