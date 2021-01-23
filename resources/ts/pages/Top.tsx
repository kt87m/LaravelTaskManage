import React from 'react';
import TaskList from '../components/TaskList';
import TaskListTools from '../components/TaskListTools';

const Top: React.FC = () => {
  return (
    <div className="relative">
      <h2 className="text-xl md:text-2xl mb-3 text-gray-500">タスク一覧</h2>
      <TaskListTools />
      <TaskList />
    </div>
  );
};

export default Top;
