function Sidebar() {

  return (
    <div className='bar sidebar'>
      <a className='sidebarLink' href='scheduler'>שריון זמן סטודיו</a>
      <a className='sidebarLink' href='songs'>שירים</a>
      <a className='sidebarLink' href='equipment'>מחסן ציוד</a>
      <a className='sidebarLink' href='costumes'>מחסן תלבושות</a>
      <a className='sidebarLink' href='transfers'>העברת ציוד</a>
      <a className='sidebarLink' href='report'>דיווח שימוש</a>
      <a className='sidebarLink' href='analytics'>סטטיסטיקות</a>
    </div>
  );
}

export default Sidebar;
