import React from 'react';
import { Link } from 'react-router-dom';

import { Task } from '../types/api';
import { Checkbox } from './Checkbox';

type Props = {
  tasks?: Task[];
  onToggleCheck(
    e: React.ChangeEvent<HTMLInputElement>,
    id: number | string
  ): void;
};

const TaskList: React.FC<Props> = ({ tasks, onToggleCheck }) => {
  if (!tasks) return null;

  return (
    <ul>
      {tasks.map((task) => (
        <li
          key={task.id}
          data-task-id={task.id}
          className="flex pl-3 border-b-2 border-gray-200 duration-100 hover:bg-blue-100"
        >
          <Checkbox
            checked={task.done}
            onChange={(e) => onToggleCheck(e, task.id)}
          />
          <Link
            to={{
              pathname: `/projects/${task.project_id}/tasks/${task.id}`,
              state: { fromTop: true },
            }}
            className={`linkToDetail group flex items-center flex-grow p-3 pl-0 outline-none ${
              task.title ? '' : 'text-gray-500'
            } focus:text-blue-500`}
          >
            {task.title || '名称未設定タスク'}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
