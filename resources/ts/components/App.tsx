import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Top from '../pages/Top';

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Top />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
