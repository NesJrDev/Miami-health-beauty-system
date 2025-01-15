import { useState } from "react";
import { Header } from "../../../components/app/Header";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";


export const UxAdmin = () => {
    const navigateLog = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
  
    const getAllData = async () => {
      const querySnapshot = await getDocs(collection(db, "Users"));
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setAllUsers(users);
    };
  
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
  
    const logOutF = async () => {
      try {
        await auth.signOut();
        setUserDetails(null);  // Limpia los datos del usuario
        setTimeout(() => {
          navigateLog("/logIn");  // Navega después de un pequeño delay
        }, 100);  // 100ms de retraso
      } catch (e) {
        console.log(e);
      }
    };
    const findEditApptakenOrNext = async (appoID) => {
      try {
        // Itera por todos los usuarios
        const querySnapshot = await getDocs(collection(db, "Users"));
        for (const userDoc of querySnapshot.docs) {
          const userData = userDoc.data();
    
          // Verifica si tiene citas (userAppointments)
          if (userData.userAppointments) {
            const appointmentIndex = userData.userAppointments.findIndex(
              (appointment) => appointment.appoID === appoID
            );
    
            // Si encuentra la cita, actualiza el campo takenOrNext
            if (appointmentIndex !== -1) {
              const updatedAppointments = [...userData.userAppointments];
              updatedAppointments[appointmentIndex].takenOrNext = "taken";
    
              // Actualiza la base de datos con las nuevas citas
              await updateDoc(doc(db, "Users", userDoc.id), {
                userAppointments: updatedAppointments,
              });
    
              console.log(`Cita con ID ${appoID} actualizada exitosamente`);
              return;
            }
          }
        }
    
        console.log(`No se encontró ninguna cita con ID ${appoID}`);
      } catch (error) {
        console.error("Error al actualizar la cita:", error);
      }
    };
    
    
    
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        trapUserData(user);
      });
  
      // Cleanup function
      return () => unsubscribe();
    }, []);
  
    useEffect(() => {
      getAllData()
    },[])
  
    return (
      <>
        <Header />
        <div className="containerAdminInfo">
          <div className="containerInfoAdmin">
            {userDetails ? (
              <>
                <img src={userDetails.userPhoto} alt="User" />
                <h2>{userDetails.userName}</h2>
                <p>{userDetails.userEmail}</p>
                <div 
                style={{ width: "150px", height: "50px", background: "red" }}
                onClick={logOutF}>Sign Out</div>
              </>
            ) : (
              <>
                <p>Wanna log in / Sign up?</p>
                <div
                  style={{ width: "150px", height: "50px", background: "red" }}
                  onClick={() => navigateLog("/login")}
                >
                  Log in / Sign Up
                </div>
              </>
            )}
          </div>
            <div className="allUserAppoiments">
              {userDetails && allUsers ? (<>
                {allUsers.filter((el) => el.userAppointments).map((ex)=> {
                  return (
                    <div className="usersId" key={ex.userID}>
                      <h3>{ex.userName}</h3>
                      <p>{ex.userEmail}</p> 
                      <p>{ex.userNumber}</p>
                      {ex.userAppointments.map((el) => (
                        <div className="userAppoInfo"  key={el.appoID}>
                          <img src={el.userImage} alt="User" />
                          <p>{el.userNameAppo}</p>
                          <p>{el.userEmailAppo}</p>
                          <p>{el.userNumberAppo}</p>
                          <p>{el.dataForAppo}</p>
                          <p>{el.timeForAppo}</p>
                          <div className="buttonOfCancellAppo" onClick={() => findEditApptakenOrNext(el.appoID)}>Complete Appo</div>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </>
              ):(
              <p>Loading...</p>
              )}
            </div>
        </div>
      </>
    );
}
