import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

axios.defaults.baseURL='http://localhost:5000';
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId="553023378005-iftd5gvs1bvt113go821cm5q89lsgv2r.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
