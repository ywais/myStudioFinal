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
    <div style={{display: props.displaying, marginTop: '1em'}}>
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
        <span className="checkmark"></span>
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


// TODO: reset button doesn't remove appends. won't read props?
// TODO: validate date & hour. use setFieldValue?
// TODO: edit tooltip text


function BookForm(props) {
  const [maxDuration, setMaxDuration] = useState(0);

  const getAvailableDuration = async () => {
    const { data } = await axios.post('/api/v1/scheduling/append',
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

  const handleResetForm = () => {
    console.log({week: props.week, date: props.date, hour: props.hour, userId: 1});
    props.setShowForm('none');
    console.log(
      {
        week: new Date(props.week[0][0]) > new Date() ? 'nextWeek' : 'thisWeek',
        day: new Date(props.date).getDay(),
        hour: `${props.hour}:00`,
        userId: props.user ? props.user.id : 1 // remove default
      }
    );
    axios.post('/api/v1/scheduling/unappend',
      {
        week: new Date(props.week[0][0]) > new Date() ? 'nextWeek' : 'thisWeek',
        day: new Date(props.date).getDay(),
        hour: `${props.hour}:00`,
        userId: props.user ? props.user.id : 1 // remove default
      }
    )
    .catch(e => console.log(e));
  }

  return (
    <div className='bookFormContainer' /*style={{ display: props.showForm || 'none' }}*/>
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
          // date: Yup.string()
          //   .required('יש לבחור יום'),
          // hour: Yup.string()
          //   .required('יש לבחור שעה'),
          duration: Yup.string()
            .oneOf(
              ['1', '2', '3', '4', '5', '6'],
              'משך החזרה אינו תקין'
            )
            .required('יש לבחור את משך חזרה'),
        })}
        onSubmit={async (values, { setSubmitting, resetForm }) => {
          console.log(
            {
              week: new Date(props.week[0][0]) > new Date() ? 'nextWeek' : 'thisWeek',
              day: new Date(props.date).getDay(),
              hour: `${props.hour}:00`,
              userId: props.user ? props.user.id : 1 // remove default
            }
          );
          await axios.post('/api/v1/scheduling/book',
            {
              ...values,
              week: new Date(props.week[0][0]) > new Date() ? 'nextWeek' : 'thisWeek',
              day: new Date(props.date).getDay(),
              hour: `${props.hour}:00`,
              userId: props.user ? props.user.id : 1 // remove default
            }
          )
          .catch(e => console.log(e));
          // await axios.get('/api/v1/scheduling/update/thisWeek');
          // props.setWeek(await axios.get('/api/v1/scheduling/update/thisWeek'));
          setSubmitting(false);
          resetForm();
          props.setShowForm('none');
        }}
        onReset={(values) => {
          // handleResetForm();
          console.log(
            {
              week: new Date(props.week[0][0]) > new Date() ? 'nextWeek' : 'thisWeek',
              day: new Date(props.date).getDay(),
              hour: `${props.hour}:00`,
              userId: props.user ? props.user.id : 1 // remove default
            }
          );
          console.log(values);
          // axios.post('/api/v1/scheduling/unappend',
          //   {
          //     week: new Date(props.week[0][0]) > new Date() ? 'nextWeek' : 'thisWeek',
          //     day: new Date(props.date).getDay(),
          //     hour: `${props.hour}:00`,
          //     userId: props.user ? props.user.id : 1 // remove default
          //   }
          // )
          // .catch(e => console.log(e))
          props.setShowForm('none');
          props.setDate('')
          props.setHour('')
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className='bookForm'>
            <MyTextInput
              className='longInput'
              id='title'
              label='כותרת'
              name='title'
              type='text'
            /><br />
            <MyTextInput
              className='halfInput'
              id='date'
              label='תאריך'
              name='date'
              // value={props.date}
              // setFieldValue(...)
              type='text'
              placeholder={props.date}
              disabled
              /><br />
            <div className='timeInputs'>
              <div>
                <MyTextInput
                  className='halfInput'
                  id='hour'
                  label='שעת התחלה'
                  name='hour'
                  // value={props.hour}
                  // setFieldValue(...)
                  type='text'
                  placeholder={props.hour}
                  disabled
                />
              </div>
              <div>
                <MySelect
                  className='halfInput'
                  id='duration'
                  label='משך החזרה'
                  name='duration'
                  disabled={!(props.date && props.hour)}
                >
                  {durationOptions()}
                </MySelect><br />
              </div>
            </div>
            <MyCheckbox id='isOpen' name='isOpen'>
              הזמנה פתוחה
              <span className='tooltip'>?
                <span className='tooltiptext'>האם אמרו לך פעם?</span>
              </span>
            </MyCheckbox>
            <MyDependentTextInput
              className='longInput'
              id='openTo'
              label='מוזמנים'
              name='openTo'
              type='text'
              displaying={values.isOpen ? 'inline-block' : 'none'}
            /><br />
            <MyTextArea
              className='longInput'
              id='notes'
              label='הערות'
              name='notes'
              type='text'
            />
            <br />
            <div className='bookFormButtons'>
              <button type='submit' disabled={!(props.date && props.hour)}>שמור</button>
              <button type='reset'>ביטול</button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default BookForm;
