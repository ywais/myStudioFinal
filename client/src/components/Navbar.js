function Navbar(props) {

  return (
    <div className='bar navbar'>
      <img id='navbarLogo' src='logo.jpg' alt='logo'/>
      <a className='navbarLink' href='/'>דף הבית</a>
      <a className='navbarLink' href='about'>אודות</a>
      <a className='navbarLink' href='gallery'>גלריה</a>
      <a className='navbarLink' href='contact'>צור קשר</a>
      <a className='navbarLink' href='user'>{props.user ? `שלום, ${props.user.displayName}` : 'התחבר למערכת'}</a>
      {/* <img id='navbarLogo' src='user.profile' alt='userProfile'/> */}
    </div>
  );
}

export default Navbar;
