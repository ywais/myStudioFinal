import firebase from "firebase";

function Profile(props) {
      
  return (
    <div className='userPage'>
      <h1>
        הי {props.user && (props.user.displayName || props.user.email)}!
      </h1>
      <button onClick={() => firebase.auth().signOut()}>Sign Out</button>
    </div>
  );
}

export default Profile;
