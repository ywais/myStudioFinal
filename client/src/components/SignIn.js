import firebase from 'firebase';
import { Formik, Form, useField } from 'formik';
import { useState } from 'react';
import * as Yup from 'yup';

const MyTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label className='formLabel' htmlFor={props.id || props.name}>{label}</label>
      <input className='text-input' {...field} {...props} />
      {meta.touched && meta.error ?
        <div className='error'>{meta.error}</div> : 
        <br />
      }
    </>
  );
};

function SignIn(props) {
  const [errorMessage, setErrorMessage] = useState('');
  const [alertMessage, setAlertMessage] = useState('');

  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    .catch((error) => {
      const errorCode = error.code;
      switch (errorCode) {
        case 'auth/popup-closed-by-user':
          setErrorMessage('החלון נסגר לפני החיבור למערכת');
          break;
        default:
          setErrorMessage('ארעה תקלה, אנא נסה שנית מאוחר יותר');
          console.log(errorCode);
          break;
      }
      setTimeout(() => {
        return setErrorMessage('');
      }, 4000);
    });
  }

  const sendResetEmail = (email) => {
    if(email !== '') {
      firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        setAlertMessage('הנחיות איפוס סיסמה נשלחו ל-' + email);
        setTimeout(() => {
          return setAlertMessage('');
        }, 4000);
      })
      .catch((error) => {
        const errorCode = error.code;
        switch (errorCode) {
          case 'auth/invalid-email':
            setErrorMessage('כתובת המייל שהוזנה אינה תקינה');
            break;
          case 'auth/user-not-found':
            setErrorMessage('כתובת המייל שהוזנה אינה רשומה במערכת');
            break;
          default:
            setErrorMessage('ארעה תקלה, אנא נסה שנית מאוחר יותר');
            console.log(errorCode);
            break;
        }
        setTimeout(() => {
          return setErrorMessage('');
        }, 4000);
      });
    } else {
      setAlertMessage('יש להזין כתובת מייל תקינה');
      setTimeout(() => {
        return setAlertMessage('');
      }, 4000);
    }
  }

  return (
    <div className='signIn'>
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
            const errorCode = error.code;
            switch (errorCode) {
              case 'auth/invalid-email':
                setErrorMessage('כתובת המייל שהוזנה אינה תקינה');
                break;
              case 'auth/user-disabled':
                setErrorMessage('המשתמש נחסם. אנא צור קשר עם צוות המערכת לעזרה');
                break;
              case 'auth/user-not-found':
                setErrorMessage('כתובת המייל או הסיסמה אינם נכונים');
                break;
              case 'auth/wrong-password':
                setErrorMessage('כתובת המייל או הסיסמה אינם נכונים');
                break;
              default:
                setErrorMessage('ארעה תקלה, אנא נסה שנית מאוחר יותר');
                console.log(errorCode);
                break;
            }
            setTimeout(() => {
              return setErrorMessage('');
            }, 4000);
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
            />
            <MyTextInput
              className='longInput'
              id='password'
              label='סיסמה'
              name='password'
              type='password'
            />
            <div className='signInMessages'>
              {errorMessage ?
                <span className='signInError'>{errorMessage}</span> :
                alertMessage ? 
                  <span className='signInAlert'>{alertMessage}</span> :
                  <br />
              }
            </div>
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
