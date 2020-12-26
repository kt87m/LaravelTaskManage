import { AxiosError } from 'axios';
import React from 'react';
import { Link } from 'react-router-dom';

import { ApiError, Task } from '../types/api';
import { Checkbox } from './Checkbox';
import { Errors } from './Errors';

type Props = {
  tasks: {
    error: AxiosError<ApiError> | undefined;
    data: Task[] | undefined;
  };
  onToggleCheck(
    e: React.ChangeEvent<HTMLInputElement>,
    id: number | string
  ): void;
};

const TaskList: React.FC<Props> = ({ tasks, onToggleCheck }) => {
  if (tasks.error?.response) return <Errors error={tasks.error} />;
  if (!tasks.data) return <p>loading...</p>;

  return (
    <ul>
      {tasks.data.map((task) => (
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
              pathname: `/tasks/${task.id}`,
              search: location.search,
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
