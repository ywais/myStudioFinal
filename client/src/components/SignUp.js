import firebase from "firebase";
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

function SignUp(props) {
  return (
    <div className="signUp">
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
          .then((user) => {
            firebase.auth().currentUser.updateProfile({
              displayName: values.fullName
            });
          })
          .catch((error) => {
            let errorMessage = error.message;
            alert(errorMessage);
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
            /><br />
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
