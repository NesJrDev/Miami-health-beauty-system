import React from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Home } from './components/app/Home'
import { Register } from './components/app/Register'
import { Appointments } from './components/app/Appointments'
import Login from './components/app/Login'
import { RegLoginAdmin } from './components/app/regLoginAdmin'
import  { DeveloperServices }  from './components/app/developerServices.jsx'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/appointments' element={<Appointments />}/>
        <Route path='/adminPanel' element={<RegLoginAdmin />}/>
        <Route path='/programator-area' element={<DeveloperServices />}/>
      </Routes>
    </Router>
  )
}

export default App
