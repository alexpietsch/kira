import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

// styles
import './App.css';

// pages
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';

// components
import Navbar from './components/Navbar';

// hooks
import { useAuthContext } from "./hooks/useAuthContext"


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
          <Route path="/login">
            {user && <Redirect to="/" />}
            {!user && <Login />}
          </Route>
          <Route path="/signup">
            {user && <Redirect to="/" />}
            {!user && <Signup />}
          </Route>
        </Switch>
      </BrowserRouter>
      )}
    </div>
  );
}

export default App;
