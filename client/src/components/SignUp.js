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

function SignUp(props) {
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <div className='signUp'>
      <h1>משתמש חדש?</h1>
      <h2>הרשם למערכת</h2>
      <Formik
        initialValues={{
          fullName: '',
          email: '',
          password: ''
        }}
        validationSchema={Yup.object({
          fullName: Yup.string()
            .matches('\\S{2,} .{2,}', 'יש להזין שם מלא')
            .required('יש להזין שם מלא'),
          email: Yup.string()
            .email('יש להזין כתובת מייל תקינה')
            .required('יש להזין כתובת מייל תקינה'),
          password: Yup.string()
            .min(6, 'יש להזין סיסמה מעל 6 תווים')
            .required('יש להזין סיסמה מעל 6 תווים')
        })}
        onSubmit={(values, { setSubmitting }) => {
          firebase.auth().createUserWithEmailAndPassword(values.email, values.password)
          .then(() => {
            firebase.auth().currentUser.updateProfile({
              displayName: values.fullName
            });
          })
          .catch((error) => {
            const errorCode = error.code;
            switch (errorCode) {
              case 'auth/email-already-in-use':
                setErrorMessage('כתובת המייל שהוזנה רשומה במערכת');
                break;
              case 'auth/invalid-email':
                setErrorMessage('כתובת המייל שהוזנה אינה תקינה');
                break;
              case 'auth/weak-password':
                setErrorMessage('הסיסמה שהוזנה חלשה מדי');
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
          <Form className='signUpForm'>
            <MyTextInput
              className='longInput'
              id='fullName'
              label='שם מלא'
              name='fullName'
              type='text'
            />
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
            <div className='signUpMessages'>
              {errorMessage ?
                <span className='signUpError'>{errorMessage}</span> :
                <br />
              }
            </div>
            <div className='signUpFormButtons'>
              <button type='submit'>הרשם</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default SignUp;
