import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Homepage from './components/Homepage/Homepage';
import { Provider } from 'react-redux';
import store from './redux/Store';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import CountryDetails from './components/CountryDetails/CountryDetails';
import ComparePage from './components/ComparePage/ComparePage';
import GA from './utils/GoogleAnalytics'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        { GA.init() && <GA.RouteTracker /> }
        <Switch>
          <>
        <Link to={'/'} className="header-link">
          <h4 className="c--website-name">Covid stat</h4>
        </Link>
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
        </>
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
