import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { GoPlus } from 'react-icons/go';

import { useResource } from '../hooks/useResource';
import { Checkbox } from './Checkbox';
import { Errors } from './Errors';

const TaskList: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const onClickAddButton = () => {
    taskAccess
      .create({ done: false }, (createdTask) => {
        history.replace({
          pathname: `/projects/${createdTask.project_id}`,
          search: searchParams.toString(),
        });
      })
      .catch(console.log);
  };
  const taskAccess = useResource('tasks');
  const tasks = taskAccess.index();

  const onToggleCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number | string
  ) => {
    void taskAccess.update(id, { done: e.target.checked });
  };

  if (tasks.error?.response) return <Errors error={tasks.error} />;
  if (!tasks.data) return <p>loading...</p>;

  return (
    <>
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
              className="checked:bg-blue-500 focus:border-blue-700 focus-checked:bg-blue-700"
            />
            <Link
              to={{
                pathname: `/projects/${task.project_id}/tasks/${task.id}`,
                search: location.search,
                state: { fromTop: true },
              }}
              className={`linkToDetail group flex items-center flex-grow ml-3 p-3 pl-0 outline-none ${
                task.title ? '' : 'text-gray-500'
              } focus:text-blue-500`}
            >
              {task.title || '名称未設定タスク'}
            </Link>
          </li>
        ))}
      </ul>

      <div
        onClick={onClickAddButton}
        className="group cursor-pointer inline-flex items-center mt-10 duration-100 text-gray-500 hover:text-blue-500 focus-within:text-blue-500"
      >
        <button
          type="button"
          className="createTask inline-flex w-8 h-8 justify-center mr-2 p-2 rounded-full transition-all duration-500 bg-blue-500 text-white shadow-md focus:outline-none focus:bg-blue-400 focus:shadow-xl group-hover:bg-blue-400 hover:shadow-xl group-hover:shadow-xl"
        >
          <GoPlus className="self-center text-xl" />
        </button>
        タスクを追加
      </div>
    </>
  );
};

export default TaskList;
