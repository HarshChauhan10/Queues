import React from 'react'
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import "@fortawesome/fontawesome-free/css/all.min.css";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login></Login>}></Route>
      </Routes>
    </div>
  )
}

export default App