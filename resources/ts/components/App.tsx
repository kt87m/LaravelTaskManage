import React from 'react';
import { Route, useLocation, matchPath } from 'react-router-dom';
import { Modal } from './Modal';

import TaskDetail from '../pages/TaskDetail';
import Top from '../pages/Top';
import InfoArea from './InfoArea';

const App: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <InfoArea />
      <div className="container mx-auto p-3 sm:p-5 md:py-10 md:px-0">
        <Modal
          open={
            !!matchPath(location.pathname, `/projects/:projectId/tasks/:id`)
          }
        >
          <Route path={`/projects/:projectId/tasks/:id`}>
            <TaskDetail />
          </Route>
        </Modal>
        <Route path="/">
          <Top />
        </Route>
      </div>
    </>
  );
};

export default App;
