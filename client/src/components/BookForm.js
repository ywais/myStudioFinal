import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

const MyDependentTextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div className='longInput' style={{display: props.displaying ? 'inline-block' : 'none'}}>
      <label className='formLabel' htmlFor={props.id || props.name}>{label}</label>
      <input className='text-input' {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className='error'>{meta.error}</div>
      ) : null}
    </div>
  );
};

const MyTextArea = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <>
      <label className='formLabel' htmlFor={props.id || props.name}>{label}</label>
      <textarea className='text-input' {...field} {...props}></textarea>
      {meta.touched && meta.error ? (
        <div className='error'>{meta.error}</div>
      ) : null}
    </>
  );
};

const MyCheckbox = ({ children, ...props }) => {
  const [field, meta] = useField({ ...props, type: 'checkbox' });
  return (
    <div>
      <label className='formLabel checkbox'>
        <input id='openCheck' type='checkbox' {...field} {...props} />
        {children}
      </label>
      {meta.touched && meta.error ? (
        <div className='error'>{meta.error}</div>
      ) : null}
    </div>
  );
};

const MySelect = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <div>
      <label className='formLabel' htmlFor={props.id || props.name}>{label}</label><br />
      <select {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className='error'>{meta.error}</div>
      ) : null}
    </div>
  );
};

const BookForm = (props) => {
  const [maxDuration, setMaxDuration] = useState(0);

  const getAvailableDuration = async () => {
    const { data } = await axios.post(
      'http://localhost:8080/api/v1/scheduling/append',
      {
        week: new Date(props.week[0][0]) > new Date() ? 'nextWeek' : 'thisWeek',
        day: new Date(props.date).getDay(),
        hour: `${props.hour}:00`,
        userId: props.user ? props.user.id : 1 // TODO: send user and remove default
      }
    )
    .catch(e => console.log(e));
    setMaxDuration(data);
  }

  useEffect(() => {
    if(props.showForm !== 'none'){
      getAvailableDuration();
    }
  }, [props.date, props.hour, props.showForm]);

  const durationOptions = () => {
    const options = [<option key='none' value=''>בחר</option>];
    let durationOption = 0.5;
    for(let i = 0; i < maxDuration; i++) {
      options.push(
        <option key={durationOption} value={i + 1}>
          {
            durationOption < 1 ?
            'חצי שעה' :
            durationOption === 1 ?
            'שעה' :
            `${durationOption} שעות`
          }
        </option>
      );
      durationOption += 0.5;
    }
    return options;
  }

  return (
    <div className='bookFormContainer' style={{ display: props.showForm || 'none' }}>
      <Formik
        initialValues={{
          title: '',
          date: props.date,
          hour: props.hour,
          duration: '',
          isOpen: false,
          openTo: '',
          notes: ''
        }}
        validationSchema={Yup.object({
          title: Yup.string()
            .max(50, 'הכותרת ארוכה מדי')
            .required('יש להזין כותרת'),
          duration: Yup.string()
            .oneOf(
              ['1', '2', '3', '4', '5', '6'],
              'משך החזרה אינו תקין'
            )
            .required('יש לבחור את משך חזרה'),
        })}
        onSubmit={async (values, { setSubmitting }) => {
          await axios.post(
            'http://localhost:8080/api/v1/scheduling/book',
            {
              ...values,
              week: new Date(props.week[0][0]) > new Date() ? 'nextWeek' : 'thisWeek',
              day: new Date(props.date).getDay(),
              hour: `${props.hour}:00`,
              userId: props.user ? props.user.id : 1 // remove default
            }
          )
          .catch(e => console.log(e));
          // await axios.get('http://localhost:8080/api/v1/scheduling/update/thisWeek');
          // props.setWeek(await axios.get('http://localhost:8080/api/v1/scheduling/update/thisWeek'));
          setSubmitting(false);
          props.setShowForm('none');
        }}
      >
        {({ values }) => (
          <Form className='bookForm'>
            <MyTextInput
              className='longInput'
              label='כותרת'
              name='title'
              type='text'
            /><br />
            <MyTextInput
              className='halfInput'
              label='תאריך'
              name='date'
              type='text'
              placeholder={props.date}
              disabled
            /><br />
            <div className='timeInputs longInput'>
              <div className='bookForm halfInput'>
                <MyTextInput
                  className='halfInput'
                  label='שעת התחלה'
                  name='hour'
                  type='text'
                  placeholder={props.hour}
                  disabled
                />
              </div>
              <div className='bookForm halfInput' style={{marginRight: '1em'}}>
                <MySelect label='משך החזרה' name='duration'>
                  {durationOptions()}
                </MySelect><br />
              </div>
            </div>
            <MyCheckbox name='isOpen'>
              הזמנה פתוחה
            </MyCheckbox>
            <MyDependentTextInput
              className='fullInput'
              label='מוזמנים'
              name='openTo'
              type='text'
              displaying={values.isOpen ? 'inline-block' : 'none'}
            /><br />
            <MyTextArea
              className='longInput'
              label='הערות'
              name='notes'
              type='text'
            />
            <br />
            <button type='submit'>שמור</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BookForm;