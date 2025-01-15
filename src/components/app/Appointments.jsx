import { useEffect, useState } from 'react'
import { Header } from './Header'
import '../styles-of-components/appointmentsUser.css'
import { auth, db } from '../../firebase'
import CreateAppo from '../functions/createAppo'
import { doc, getDoc } from 'firebase/firestore'

export const Appointments = () => {
    const [userDetails, setUserDetails] = useState(null);
    const [appoCon, setAppoCon] = useState(false)
    const [valueOfAppo, setValueOfAppo] = useState("next")
    const [appOrlist, setAppOrlist] = useState(true)
    const trapUserData = async (user) => {
        if(user) {
            const docRefUser = doc(db, "Users", user.uid);
            const dataUser = await getDoc(docRefUser)
            if(dataUser.exists()) {
                setUserDetails(dataUser.data())
                await console.log()
            }
        }else {
          setUserDetails(null) 
        }
      }

    
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        trapUserData(user);
      });

      // Cleanup function
      return () => unsubscribe();
    }, []);


return (
  <div className="container_appo">
    <Header />
    <div className="containerAllInfo">
      <div className="Appointments_container">
        <div className="appointmentsContainer">
          {appOrlist ? (
            <>
              <div className="dates_appo">
                <div
                  className="appo_already_taken"
                  onClick={() => setValueOfAppo("taken")}
                >
                  Taken
                </div>
                <div className="appo_next" onClick={() => setValueOfAppo("next")}>
                  Next
                </div>
              </div>

              {userDetails ? (
                <>
                  {userDetails.userAppointments &&
                  userDetails.userAppointments.length > 0 ? (
                    userDetails.userAppointments
                      .filter((el) => el.takenOrNext === valueOfAppo)
                      .map((el) => (
                        <div className="app_numb_1" key={el.appoID}>
                          <img
                            src={el.userImage}
                            alt={`${el.userNameAppo}'s profile`}
                          />
                          <p>{el.userNameAppo}</p>
                          <p>{el.userEmailAppo}</p>
                          <p>{el.userNumberAppo}</p>
                          <p>{el.dataForAppo}</p>
                          <p>{el.timeForAppo}</p>
                        </div>
                      ))
                  ) : (
                    <p>No appointments available.</p>
                  )}
                </>
              ) : (
                <p>Loading...</p>
              )}
            </>
          ) : (
            <p>No appointments list available.</p>
          )}
        </div>
      </div>

      <div className="userInfoAppo">
        {userDetails ? (
          <div className="infoContainer">
            <img src={userDetails.userPhoto} alt="picProfileUser" />
            <strong>
              <p>Username: {userDetails.userName}</p>
            </strong>
            <strong>
              <p>Email: {userDetails.userEmail}</p>
            </strong>
          </div>
        ) : (
          <div className="loadingUser">Loading...</div>
        )}

        <button onClick={() => setAppOrlist(!appOrlist)}>+ New Appointment</button>
        <button onClick={() => console.log(appOrlist)}>+ New E-Mail</button>
        <button>Contact us</button>
      </div>
    </div>

    {appoCon && (
      <div className="containerSendDataOfAppointment">
        <div className="containerAlert">
          <div onClick={() => setAppoCon(false)}>X</div>
          <CreateAppo showContainer={() => setAppoCon(false)} />
        </div>
      </div>
    )}
  </div>
);
};