import {BrowserRouter, Switch, Route} from 'react-router-dom';
import Scheduler from './Scheduler';

function PrivateRouter(props) {

  return (
    <BrowserRouter>
        <Switch>
          {/* <Route exact path='/home' component={Home} />
          <Route exact path='/about' component={About} />
          <Route exact path='/gallery' component={Gallery} />
          <Route exact path='/contact' component={Contact} /> */}
          <Route exact path='/scheduler'
            render={({match, location, history}) => (
              <Scheduler /*user={props.user}*/ match={match} location={location} history={history} />
            )}
          />
          <Route>
            <div>
              ERROR 404, PAGE NOT FOUND!
            </div>
          </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default PrivateRouter;
