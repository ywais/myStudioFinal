import firebase from "firebase";
import { useState } from "react";

function SignUp(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [title, setTitle] = useState("");

  const firestore = props.firebase.firestore();
  const usersRef = firestore.collection("users");
  usersRef.get();
  
  const signUp = () => {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((user) => {
      usersRef.add({
        uid: user.user.uid,
        email: user.user.email,
        fullName: fullName,
        imgUrl: imgUrl,
        title: title
      });
      firebase.auth().currentUser.updateProfile({
        displayName: fullName.split(" ")[0]
      });
    })
    .catch((error) => {
    let errorMessage = error.message;
    alert(errorMessage);
    });
    }

  return (
    <div>
      <h1>or... Sign Up</h1>
      <label htmlFor="suEmail">Email: </label>
      <input id="suEmail" name="email" onChange={(event) => setEmail(event.target.value)}/><br />
      <label htmlFor="suPassword">Password: </label>
      <input type="password" id="suPassword" name="password" onChange={(event) => setPassword(event.target.value)}/><br />
      <label htmlFor="suFullName">Full Name: </label>
      <input type="fullName" id="suFullName" name="fullName" onChange={(event) => setFullName(event.target.value)}/><br />
      <label htmlFor="suImgUrl">Profile Image: </label>
      <input type="imgUrl" id="suImgUrl" name="imgUrl" onChange={(event) => setImgUrl(event.target.value)}/><br />
      <label htmlFor="suTitle">Title: </label>
      <input type="title" id="suTitle" name="title" onChange={(event) => setTitle(event.target.value)}/><br />
      <button onClick={signUp}>Sign Up</button>
    </div>
  );
}

export default SignUp;
