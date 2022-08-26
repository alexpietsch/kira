import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';
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

// hooks
import { useAuthContext } from "./hooks/useAuthContext"
import ListBoard from './components/ListBoard';


function App() {

  const { authIsReady, user } = useAuthContext()

  return (
    <div className="App">
      {authIsReady && (
        <BrowserRouter>
        <Navbar />
        <Switch>
          <Route exact path="/">
            {!user && <Redirect to="/login" />}
            {user && <Home />}
          </Route>
          <Route path="/board/:id">
            {!user && <Redirect to="/login" />}
            {user && <ListBoard />}
          </Route>
          <Route path="/login">
            {!user && <Login />}
            {user && <Redirect to="/" />}
          </Route>
          <Route path="/signup">
            {!user && <Signup />}
            {user && <Redirect to="/" />}
          </Route>
          <Route path="/new">
            {!user && <Redirect to="/login" />}
            {user && <NewBoard />}
          </Route>
          <Route path="/profile">
            {!user && <Redirect to="/login" />}
            {user && <UserProfile />}
          </Route>
        </Switch>
      </BrowserRouter>
      )}
    </div>
  );
}

export default App;
