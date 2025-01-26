import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import App from './App.jsx'
import InstituteContextProvider from './context/IsntituteContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <InstituteContextProvider>
      <App />
    </InstituteContextProvider>
  </BrowserRouter>,
)
