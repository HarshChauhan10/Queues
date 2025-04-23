import React from 'react';
import { Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';
import Sidebar from './components/Sidebar';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer } from "react-toastify";
import Queue from './pages/Queue';

const App = () => {
  return (
    <div className='bg-gray-100'>
      <ToastContainer />

      {/* Sidebar and Main Content Layout */}
      <div className="flex">
        {/* Sidebar Component */}
        {/* <Sidebar /> */}

        {/* Main Content Area */}
        <div className="flex-1 p-10">
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/complete-profile' element={<CompleteProfile />} />
            <Route path='/queue' element={<Queue />} />
            {/* Add additional routes here as needed */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
