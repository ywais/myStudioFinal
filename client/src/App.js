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
  return (
    <div className='app'>
      <Navbar user={user}/>
      <div className='pageContainer'>
        <div className='page'>
        </div>
      </div>
    </div>
  );
}

export default App;
