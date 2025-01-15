import { useState } from "react";
import { Header } from "../app/Header";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import  RegisterMail  from './registration-login/registerMail'
import noProfile from '../../images/profile/blank-profile-picture-973460_640.png'

const ProgramatorArea = () => {
    const navigateLog = useNavigate();
    const [allUsers, setAllUsers] = useState([]);
    const [userDetails, setUserDetails] = useState(null);
    const [newUdrt, setNewUdrt] = useState(false);
    const [filterUser, setFilterUser] = useState(['userName', '']);
    const AllUsersFunction = async () => {
        try {
          const querySnapshot = await getDocs(collection(db, "Users"));
          // Mapea los documentos para obtener el id y los datos del usuario
          const usersArray = querySnapshot.docs.map(doc => ({
            id: doc.id,  // Aquí obtienes el ID del documento
            ...doc.data()  // Desestructuras los datos del usuario
          }));
          setAllUsers(usersArray);
          console.log(usersArray);  // Imprime el array de usuarios con el id incluido
        } catch (e) {
          console.log(e);
        }
      };
      

      const changeStatusUser = async (IDuserStatus) => {
        try {
          // Obtén la referencia del documento específico del usuario
          const docRef = doc(db, "Users", IDuserStatus);
          const userData = await getDoc(docRef);  // Obtén el documento del usuario
          
          if (userData.exists()) {
            console.log(userData.data());  // Imprime los datos del usuario
            
            // Verifica si el usuario es Admin y cambia su estado
            if (userData.data().isAdmin) {
              await updateDoc(docRef, { isAdmin: false });
              console.log("El estado del usuario ha sido cambiado a no Admin");
            } else {
              await updateDoc(docRef, { isAdmin: true });
              console.log("El estado del usuario ha sido cambiado a Admin");
            }
            
          } else {
            console.log("No existe un usuario con ese ID");
          }
        } catch (error) {
          console.error("Error al actualizar el estado del usuario:", error);
        }
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
  

    
    
    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        trapUserData(user);

      });
      AllUsersFunction();
      return () => unsubscribe();
    }, []);
  
  
    return (
      <>
        <Header />
        <div className="containerProgrammerInfo">
          <div className="containerInfoProgrammer">
            {userDetails ? (
              <>
                <img src={userDetails.userPhoto} alt="programmer" />
                <h2>{userDetails.userName}</h2>
                <p>{userDetails.userEmail}</p>
                <div 
                style={{ width: "150px", height: "50px", background: "red" }}
                onClick={()=> setNewUdrt(true)}>Create a new account</div>
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
        </div>
        <div className="allUsers">  
    <div className="userFilterInfo">
        <div className="setByName" style={{background: filterUser[0] === 'userName' ? 'blue' : 'red'}} onClick={() => setFilterUser([ 'userName', filterUser[1] ])}> Filter by name</div>
        <div className="setByEmail" style={{background: filterUser[0] === 'userEmail' ? 'blue' : 'red'}} onClick={() => setFilterUser([ 'userEmail', filterUser[1] ])}> Filter by email</div>
        <div className="setByName" style={{background: filterUser[0] === 'isAdmin' ? 'blue' : 'red'}} onClick={() => setFilterUser([ 'isAdmin', filterUser[1] ])}> Filter by status</div>
        <div className="setByName" onClick={() => setFilterUser([ 'isAdmin', 'true' ])} style={{background: filterUser[0] === 'isAdmin' && filterUser[1] === 'true' ? 'blue' : 'red'}}> Show only Admins </div>
        <div className="setByName" onClick={() => setFilterUser([ 'isAdmin', 'false' ])} style={{background: filterUser[0] === 'isAdmin' && filterUser[1] === 'false' ? 'blue' : 'red'}}> Show only Users </div>
        <div className="setByName" onClick={() => setFilterUser([ 'userName', '' ])} style={{background: filterUser[0] === 'userName' && filterUser[1] === '' ? 'blue' : 'red'}}> Show All Users </div>
        
        <input type="text" onChange={(e) => setFilterUser([ filterUser[0], e.target.value ])}/>
    </div>
    
    <div className="usersInfo">
        {allUsers.filter((elF) => {
            if (filterUser[0] === 'isAdmin') {
                return filterUser[1] === 'true' ? elF.isAdmin : !elF.isAdmin;
            }
            return elF[filterUser[0]].toLowerCase().includes(filterUser[1].toLowerCase());
        }).map((el) => (
            <div className="userInfoAdmin" key={el.id} style={{ backgroundColor: el.isAdmin ? '#fff0' : '#EDF4C2' }}>
                <img src={el.userPhoto ? el.userPhoto : noProfile} alt="User" />
                <h3>{el.userName}</h3>
                <p>{el.userEmail}</p>
                <p>{el.userNumber ? el.userNumber : 'There is nothing'}</p>
                <p>{el.isAdmin ? 'Admin' : 'User'}</p>
                <button onClick={() => changeStatusUser(el.id)}>Change status</button>
            </div>
        ))}
    </div>
</div>

{newUdrt && (
    <div className="containerForCreateAccount">
        <div className="closeContainerForCreateAccount" onClick={() => setNewUdrt(false)}>Close</div>
        <RegisterMail />
    </div>
)}


      </>
    );
};

export default ProgramatorArea;