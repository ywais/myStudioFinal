import { useRef } from "react";

function Home(props) {
  const homeStripRef = useRef({current: {scrollTop: 0}});

  homeStripRef.current.scrollTop = 150;

  return (
    <div className='homePage'>
      <div className='homeStrip' ref={homeStripRef}>
        <img className='homeImage' src='https://instagram.fhfa1-1.fna.fbcdn.net/v/t51.2885-15/e35/19424892_1833204223664103_111733909212889088_n.jpg?_nc_ht=instagram.fhfa1-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=UY066i6TVBkAX_qgiuP&tp=1&oh=254a3b60870859a063cf665c6767b703&oe=601E6B3A' alt='kintos drummimng' />
        <img className='homeImage homeTorn' id='homeTornFirst' src='torn_bottom.png' alt='torn bottom' />
        <div className='homeStripTextContainer'>
          <h2 className='homeStripText'>תיפוף גוף, תיפוף על פחים,</h2>
          <h2 className='homeStripText'>מקלות, כלי הקשה מגוונים</h2>
          <h2 className='homeStripText'>ובקיצור, על הכל ומהכל !!</h2>
          <h1 className='homeStripText'>אך הכי חשוב ביחד !!!</h1>
        </div>
        <img className='homeImage homeTorn' id='homeTornSecond' src='torn_top.png' alt='torn top' />
        <img className='homeImage' src='https://instagram.fhfa1-1.fna.fbcdn.net/v/t51.2885-15/e35/37576552_1122354481237959_2675074449933336576_n.jpg?_nc_ht=instagram.fhfa1-1.fna.fbcdn.net&_nc_cat=103&_nc_ohc=6zHtv3V5UVkAX8A2Rfy&tp=1&oh=18e2a65c6bd7d200ac817be2e6114cb2&oe=601D60E3' alt='baruch' />
        <img className='homeImage homeTorn' id='homeTornThird' src='torn_bottom.png' alt='torn bottom' />
        <div className='homeStripTextContainer'>
          <h2 className='homeStripText'>להקות "דרך הקצב"</h2>
          <h2 className='homeStripText'>פועלות ברחבי הארץ ובחו"ל מעל עשור</h2>
          <h2 className='homeStripText'>ומונות כ-350 מתופפים בגילאי 6 ומעלה</h2>
          <h3 className='homeStripText'>הלהקות מופיעות בהפקות מרכזיות בארץ ובחו"ל</h3>
        </div>
        <img className='homeImage homeTorn' id='homeTornFourth' src='torn_top.png' alt='torn top' />
        <img className='homeImage' src='https://instagram.fhfa1-1.fna.fbcdn.net/v/t51.2885-15/e35/36963204_215272745993956_51307559058931712_n.jpg?_nc_ht=instagram.fhfa1-1.fna.fbcdn.net&_nc_cat=104&_nc_ohc=gOwsadnp4WAAX9CHeYP&tp=1&oh=9762705a8fdee86555b608f2b6942573&oe=601C10B3' alt='emet' />
      </div>
    </div>
  );
}

export default Home;
