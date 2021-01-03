import firebase from 'firebase';
import { useState } from 'react';

function SignIn(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = () => {
    firebase.auth().signInWithEmailAndPassword(email, password)
    .catch((error) => {
    let errorMessage = error.message;
    alert(errorMessage);
    });
  }

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  const sendResetEmail = () => {
    if(email !== "") {
      firebase.auth().sendPasswordResetEmail(email)
      .catch((error) => {
        let errorMessage = error.message;
        alert(errorMessage);
      });
      alert("Email sent to " + email);
    } else {
      alert("Fill in your email");
    }
  }

  return (
    <div className="signsContainer">
      <h1>Sign In</h1>
      <button onClick={signInWithGoogle}>Sign In with Google</button><br />
      <label htmlFor="siEmail">Email: </label>
      <input id="siEmail" name="email" onChange={(event) => setEmail(event.target.value)}/><br />
      <label htmlFor="siPassword">Password: </label>
      <input type="password" id="siPassword" name="password" onChange={(event) => setPassword(event.target.value)}/><br />
      <button onClick={signIn}>Sign In</button>
      <button onClick={sendResetEmail}>Forgot password?</button>
    </div>
  );
}

export default SignIn;
