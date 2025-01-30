import React from 'react'
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer, toast } from "react-toastify";
import CompleteProfile from './pages/CompleteProfile';


const App = () => {
  return (
    <div>
      <ToastContainer></ToastContainer>
      <Routes>
        <Route path='/' element={<Login></Login>}></Route>
        <Route path='/complete-profile' element={<CompleteProfile></CompleteProfile>}></Route>
      </Routes>
    </div>
  )
}

export default App