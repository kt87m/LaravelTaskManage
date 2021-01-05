import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useResource } from '../hooks/useResource';

import TaskDetail from '../pages/TaskDetail';
import Top from '../pages/Top';
import InfoArea from './InfoArea';

const App: React.FC = () => {
  const location = useLocation();

  const projectParamMatch = /^\/projects\/([^/?]+)/.exec(location.pathname);
  const projectId = projectParamMatch ? projectParamMatch[1] : '';
  const project =
    location.pathname === '/' ? null : useResource('projects').get(projectId);
  const tasks = project?.data?.tasks || [];

  return (
    <>
      <InfoArea project={project} />
      <div className="container mx-auto p-3 sm:p-5 md:py-10 md:px-0">
        <Switch>
          <Route path={`/projects/:projectId/tasks/:id`}>
            <TaskDetail tasks={tasks} />
          </Route>
          <Route path="/">
            <Top tasks={tasks} />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default App;
