import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import TaskDetail from '../pages/TaskDetail';
import Top from '../pages/Top';
import InfoArea from './InfoArea';

const App: React.FC = () => {
  return (
    <Router>
      <InfoArea />
      <div className="container mx-auto p-3 sm:p-5 md:py-10 md:px-0">
        <Switch>
          <Route path="/tasks/:id">
            <TaskDetail />
          </Route>
          <Route path="/">
            <Top />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
