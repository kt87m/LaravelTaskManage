import React from 'react';
import { Switch, Route, useLocation } from 'react-router-dom';
import { useResource } from '../hooks/useResource';

import TaskDetail from '../pages/TaskDetail';
import Top from '../pages/Top';
import InfoArea from './InfoArea';

const App: React.FC = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const projectParamMatch = /^\/projects\/([^/?]+)/.exec(location.pathname);
  const projectId = projectParamMatch
    ? projectParamMatch[1]
    : searchParams.get('project_id') || '';
  const project = useResource('projects').get(projectId);

  return (
    <>
      <InfoArea project={project} />
      <div className="container mx-auto p-3 sm:p-5 md:py-10 md:px-0">
        <Switch>
          <Route path={`/projects/:projectId/tasks/:id`}>
            <TaskDetail tasks={project.data?.tasks} />
          </Route>
          <Route path="/">
            <Top tasks={project.data?.tasks} />
          </Route>
        </Switch>
      </div>
    </>
  );
};

export default App;
