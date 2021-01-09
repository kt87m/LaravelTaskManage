import React from 'react';
import { Switch, Route } from 'react-router-dom';

import TaskDetail from '../pages/TaskDetail';
import Top from '../pages/Top';
import InfoArea from './InfoArea';

const App: React.FC = () => {
  return (
    <>
      <InfoArea />
      <div className="container mx-auto p-3 sm:p-5 md:py-10 md:px-0">
        <Switch>
          <Route path={`/projects/:projectId/tasks/:id`}>
            <TaskDetail />
          </Route>
          <Route path="/">
            <Top />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default App;
