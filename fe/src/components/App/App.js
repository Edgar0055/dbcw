import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  // useHistory,
  // useParams,
} from 'react-router-dom';
// import Auth from '../Auth';
import Home from '../Home';
import Menu from '../Menu';
import Sensor from '../Sensor';
import Sensors from '../Sensors';
import Statistic from '../Statistic';
import Unknown from '../Unknown';

const App = () => {
  return (
    <div className="app">
      <Router>
        <Switch>
          {/* <Route exact path="/auth/" strict>
            <Auth />
          </Route> */}
          <Route exact path="/sensors/">
            <Menu />
            <Sensors />
          </Route>
          <Route exact path="/sensor/:sensorId/" strict>
            <Menu />
            <Sensor />
          </Route>
          <Route exact path="/statistic/">
            <Menu />
            <Statistic />
          </Route>
          <Route exact path="/statistic/:sensorId/" >
            <Menu />
            <Statistic />
          </Route>
          <Route exact strict path="/" >
            <Menu />
            <Home />
          </Route>
          <Route strict path="/" >
            <Menu />
            <Unknown />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
