import { useEffect, useState } from 'react';
import {BrowserRouter, Switch, Route, Redirect} from 'react-router-dom';
import firebase from 'firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Navbar from './components/Navbar';
import SignIn from './components/SignIn';
import About from './components/About';
import PrivateRouter from './components/PrivateRouter';
import './App.css';
  firebase.initializeApp({
    apiKey: 'AIzaSyCT2X4ak356lSMmFG93z6IdF_HfTPiMq5s',
    authDomain: 'derech-haketzev.firebaseapp.com',
    projectId: 'derech-haketzev',
    storageBucket: 'derech-haketzev.appspot.com',
    messagingSenderId: '793610760529',
    appId: '1:793610760529:web:ab1e88f4fb1bac9e616370',
    measurementId: 'G-V4ZBT294V6'
  });
const auth = firebase.auth();

function App() {
  const [user] = useAuthState(auth);
  const [authorize, setAuthorize] = useState('');
  
  const checkUser = async () => {
    setTimeout(() => {
      setAuthorize(user ? 'authorized' : 'unauthorized');
    }, 500);
  }
  
  useEffect(() => {
    checkUser();
  }, [user])

  return (
    <div className='app'>
      <Navbar user={user}/>
      <div className='pageContainer'>
        <div className='page'>
          {(user || authorize === 'authorized') && (
            <PrivateRouter user={user} firebase={firebase}/>
          )}
          {authorize === 'unauthorized' && (
            <BrowserRouter>
              <Switch>
                <Route exact path="/login">
                  <SignIn user={user} />
                </Route>
                <Route exact path="/about">
                  <About user={user} />
                </Route>
                <Route path="/*">
                  <Redirect
                    to={{
                      pathname: "/login",
                    }}
                  />
                </Route>
              </Switch>
            </BrowserRouter>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
