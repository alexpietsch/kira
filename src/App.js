import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React from "react"

// styles
import './App.css';

// pages
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import NewBoard from './pages/NewBoard/NewBoard';
import UserProfile from './pages/userProfile/UserProfile';

// components
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// hooks
import { useAuthContext } from "./hooks/useAuthContext"
import ListBoard from './components/ListBoard';
import { Button } from '@mui/material';


function App() {

  const { authIsReady, user } = useAuthContext()
  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
        <Navbar />
        {user && !user.emailVerified && (
            <div>
              <h1>Please verify your email.</h1>
              <h2>If you can't find the email, also check you spam folder or</h2>
              <Button>Resend Email</Button>
            </div>
          )}
        <Routes>
          {user && user.emailVerified && (
            <>
              <Route path="/" element={
                user ? <Home /> : <Navigate to="/login" />
              } />

              <Route path="/login" element={
                user ? <Navigate to="/" /> : <Login />
              } />

              <Route path="/signup" element={
                user ? <Navigate to="/" /> : <Signup />
              } />

              <Route path="/board/:id" element={
                user ? <ListBoard /> : <Navigate to="/login" />
              } />

              <Route path="/new" element={
                user ? <NewBoard /> : <Navigate to="/login" />
              } />

              <Route path="/profile" element={
              user ? <UserProfile /> : <Navigate to="/login" />
              } />
            </>
          )}

          {!user && (
              <>
                <Route path="/login" element={
                  <Login />
                } />

                <Route path="/signup" element={
                  <Signup />
                } />

                <Route path="*" element={
                  <Navigate to="/login" />
                } />
              </>
          )}
        </Routes>
        <Footer />
      </BrowserRouter>
      )}
    </div>
  );
}

export default App;
