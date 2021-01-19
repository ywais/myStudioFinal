import firebase from 'firebase';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label className='formLabel' htmlFor={props.id || props.name}>{label}</label>
      <input className='text-input' {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className='error'>{meta.error}</div>
      ) : null}
    </>
  );
};

function SignIn(props) {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider);
  }

  const sendResetEmail = (email) => {
    if(email !== "") {
      firebase.auth().sendPasswordResetEmail(email)
      .then((user) => {
        alert("Email sent to " + email);
      })
      .catch((error) => {
        let errorMessage = error.message;
        alert(errorMessage);
      });
    } else {
      alert("Fill in your email");
    }
  }

  return (
    <div className="signIn">
      <h1>משתמש קיים?</h1>
      <h2>התחבר למערכת</h2>
      <button id='signInWithGoogle' onClick={signInWithGoogle}>
        <img id='googleGLogo' src='https://madeby.google.com/static/images/google_g_logo.svg' alt='Google G Logo'/>
        התחבר דרך חשבון גוגל
      </button><br />
      <Formik
        initialValues={{
          email: '',
          password: ''
        }}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('יש להזין כתובת מייל תקינה')
            .required('יש להזין כתובת מייל תקינה'),
          password: Yup.string()
            .min(6, 'יש להזין סיסמה מעל 6 תווים')
            .required('יש להזין סיסמה מעל 6 תווים')
        })}
        onSubmit={(values, { setSubmitting }) => {
          firebase.auth().signInWithEmailAndPassword(values.email, values.password)
          .catch((error) => {
            let errorMessage = error.message;
            alert(errorMessage);
          });
          setSubmitting(false);
        }}
      >
        {({ values }) => (
          <Form className='signInForm'>
            <MyTextInput
              className='longInput'
              id='email'
              label='כתובת מייל'
              name='email'
              type='text'
            /><br />
            <MyTextInput
              className='longInput'
              id='password'
              label='סיסמה'
              name='password'
              type='password'
            /><br />
            <div className='signInFormButtons'>
              <button type='submit'>התחבר</button>
              <button type='button' onClick={() => sendResetEmail(values.email)}>שכחת סיסמה?</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignIn;
