import React, {useState, useEffect} from "react";
// import { Routes, Route } from "react-router-dom";
// import Home from "./demo/routes/Home";
import Navbar from "./demo/components/Navbar";
import VendorLandingPage from "./demo/components/VendorHome/VendorLandingPage";
import { getToken, getUserType, getVendorId, vendorLogout } from './demo/utils';
import * as constants from './demo/contants';
import "./global.css";

function App() {
  const [vendorId, setVendorId] = useState(null);
  const [isVendorLogin, setIsVendorLogin] = useState(false);

  useEffect(()=>{
   validateLogin();
  },[])

  const validateLogin = () => {
    const token = getToken();
    const userType = getUserType();
    if(token && userType){
      if(userType === constants.userTypes.vendor){
        const vendorId = getVendorId();
        if(vendorId){
          setVendorId(vendorId);
          setIsVendorLogin(true);
        }
      }
    }
  }

  const logoutVendor = () => {
    vendorLogout();
    setVendorId(null);
    setIsVendorLogin(false);
  }

  return (
    <>
      <Navbar validateLogin={validateLogin} isVendorLogin={isVendorLogin} logoutVendor={logoutVendor}/>
      { (isVendorLogin && vendorId) && <VendorLandingPage />}
    </>
  );
}

export default App;
