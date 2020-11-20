import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import TaskDetail from '../pages/TaskDetail';
import Top from '../pages/Top';

const App: React.FC = () => {
  return (
    <Router>
      <div className="container mx-auto p-10">
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
