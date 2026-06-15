import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Splash from "./pages/Splash";
import Login from "./pages/Login";
import { Navigate }
from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import SelectCrop from "./pages/SelectCrop";
import UploadImage from "./pages/UploadImage";
import PhotoReview from "./pages/PhotoReview";
import DiagnosisResult from "./pages/DiagnosisResult";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";

import ProtectedRoute from "./components/ProtectedRoute";
import Weather from "./pages/Weather";
import EmergencyHelp from "./pages/EmergencyHelp";
import Admin from "./pages/Admin";

export default function App() {


  return (
    <div
      style={{
        maxWidth: "430px",
        margin: "0 auto",
        minHeight: "100vh",
        backgroundColor: "#f9fafb",
        boxShadow: "0 0 0 1px #e5e7eb",
        position: "relative"
      }}
    >
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
         
      <Route
  path="/admin"
  element={
    <ProtectedRoute
      roleRequired="admin"
    >
      <Admin />
    </ProtectedRoute>
  }
/>


<Route
  path="/dashboard"
  element={
    <ProtectedRoute
      roleRequired="farmer"
    >
      <Dashboard />
    </ProtectedRoute>
  }
/>


<Route
  path="/emergency"
  element={
    <ProtectedRoute roleRequired="farmer">
      <EmergencyHelp />
    </ProtectedRoute>
  }
/>


<Route
  path="/weather"
  element={
    <ProtectedRoute roleRequired="farmer">
      <Weather />
    </ProtectedRoute>
  }
/>
 

          

         <Route
  path="/select-crop"
  element={
    <ProtectedRoute roleRequired="farmer">
      <SelectCrop />
    </ProtectedRoute>
  }
/>

<Route
  path="/upload"
  element={
    <ProtectedRoute roleRequired="farmer">
      <UploadImage />
    </ProtectedRoute>
  }
/>
          <Route
  path="/photo-review"
  element={
    <ProtectedRoute roleRequired="farmer">
      <PhotoReview />
    </ProtectedRoute>
  }
/>

         <Route
  path="/result"
  element={
    <ProtectedRoute roleRequired="farmer">
      <DiagnosisResult />
    </ProtectedRoute>
  }
/>


        <Route
  path="/history"
  element={
    <ProtectedRoute roleRequired="farmer">
      <History />
    </ProtectedRoute>
  }
/>



         <Route
  path="/settings"
  element={
    <ProtectedRoute roleRequired="farmer">
      <Settings />
    </ProtectedRoute>
  }
/>


        <Route
  path="/chat"
  element={
    <ProtectedRoute roleRequired="farmer">
      <Chat />
    </ProtectedRoute>
  }
/>

        </Routes>
      </BrowserRouter>
    </div>

    
  );


}
