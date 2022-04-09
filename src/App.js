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
import ListBoard from './components/ListBoard';


function App() {

  const { authIsReady, user } = useAuthContext()
  console.log(user)

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
