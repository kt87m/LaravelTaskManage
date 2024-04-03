import React from 'react';
import { Routes, Route, useLocation, matchPath } from 'react-router-dom';
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
            !!matchPath(`/projects/:projectId/tasks/:id`, location.pathname)
          }
        >
          <Routes>
            <Route path={`/*`} element={null} />
            <Route path={`/projects/:projectId/tasks/:id`} element={<TaskDetail />} />
          </Routes>
        </Modal>
        <Routes>
          <Route path="/*" element={<Top />} />
        </Routes>
      </div>
    </>
  );
};

export default App;
