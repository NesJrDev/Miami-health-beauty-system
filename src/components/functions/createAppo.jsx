import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useEffect, useState } from 'react';

const CreateAppo = ({showContainer}) => {

  const [userDetails, setUserDetails] = useState(null)
  const [getDataAppo, setDataAppo] = useState({
    appoID: Date.now(),
    userNameAppo: "",
    userEmailAppo: "",
    dataForAppo: "",
    timeForAppo: "",
    takenOrNext: 'next',
    userImage: '',
  });

  const trapUserData = async (user) => {
    if (user) {
      const docRefUser = doc(db, "Users", user.uid);
      const dataUser = await getDoc(docRefUser);
      if (dataUser.exists()) {
        const userData = dataUser.data();
        setUserDetails(userData);
        setDataAppo((prevData) => ({
          ...prevData,
          userImage: userData.userPhoto, // Assuming userPhoto is the field name for the user's image
        }));
        console.log(userDetails);
      }
    } else {
      setUserDetails(null);
    }
  };

  const setDataInArr = (e) => {
    setDataAppo({...getDataAppo, [e.target.name]: e.target.value });
    console.log(getDataAppo);
  };
  
  const createAppointment = () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userDocRef = doc(db, "Users", user.uid);
        
        // Aquí defines los detalles de la nueva cita
        
        try {
          // Utilizamos arrayUnion para agregar al array sin sobrescribir los valores existentes
          await updateDoc(userDocRef, {
            userAppointments: arrayUnion(getDataAppo)
          });
          setDataAppo({...getDataAppo, userImage: userDetails.userImage});
          console.log("Appointment added successfully!");
          showContainer()
        } catch (error) {
          console.error("Error adding appointment: ", error);
        }
      }
    });
  }
  
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        trapUserData(user);
      });
    }, []);
    return (
        <>

          {userDetails !== null ? ( 
          <>
          <h1>Create Appointment Lol</h1>
            <input type="text" name="userNameAppo" placeholder='Name' onChange={setDataInArr}/>
            <input type="text" name='userEmailAppo' placeholder='Email' onChange={setDataInArr}/>
            <input type="number" name="userNumberAppo" id="user_number" placeholder='Number' onChange={setDataInArr}/>
            <input type="date" name="dataForAppo" id="user_date_appo" onChange={setDataInArr} />
            <input type="time" name="timeForAppo" id="user_date_time" onChange={setDataInArr} />
            <button className="Appointment_create" onClick={createAppointment}>Create Appointment</button>
          </>
          ) : (
            <p>Loading...</p>
          )}


        </>
    );
};
export default CreateAppo