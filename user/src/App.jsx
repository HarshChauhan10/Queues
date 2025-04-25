import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CompleteProfile from './pages/CompleteProfile';
import Find from './pages/Find';
// import Sidebar from './components/Sidebar'; // Uncomment if you have a sidebar

const App = () => {
  return (
    <div className='bg-gray-100'>
      <ToastContainer />

      <div className="flex">
        {/* Sidebar Component - Uncomment when ready */}
        {/* <Sidebar /> */}

        {/* Main Content Area */}
        <div className="flex-1 p-10">
          <Routes>
            <Route path='/' element={<Login />} />
            <Route path='/complete-profile' element={<CompleteProfile />} />
            <Route path='/find' element={<Find />} />
            {/* Add additional routes here */}
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
