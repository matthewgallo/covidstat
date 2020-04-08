import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Homepage from './components/Homepage/Homepage';
import store from './store/index';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { StoreContext } from 'storeon/react';
import CountryDetails from './components/CountryDetails/CountryDetails';
import ComparePage from './components/ComparePage/ComparePage';
import FourOhFour from './components/FourOhFour/FourOhFour.js';
import GA from './utils/GoogleAnalytics'

ReactDOM.render(
  <React.StrictMode>
    <StoreContext.Provider value={store}>
      <Router>
        { GA.init() && <GA.RouteTracker /> }
        <Link to={'/'} className="header-link">
          <h4 className="c--website-name">Covid stat</h4>
        </Link>
        <Switch>
        <Route exact
            path="/"
            component={Homepage}
        />
        <Route exact
            path="/country/:countryFriendlyName"
            component={CountryDetails}
        />
        <Route exact
            path="/compare/:countriesToCompare"
            component={ComparePage}
        />
        <Route path="*" component={FourOhFour}/>
        </Switch>
      </Router>
    </StoreContext.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
