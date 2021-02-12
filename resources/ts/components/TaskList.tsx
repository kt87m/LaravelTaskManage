import React from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { GoPlus } from 'react-icons/go';
import { FaFlag } from 'react-icons/fa';

import { useResource } from '../hooks/useResource';
import { Checkbox } from './Checkbox';
import { Errors } from './Errors';
import { format } from 'date-fns';
import { CgSandClock } from 'react-icons/cg';

const TaskList: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const taskAccess = useResource('tasks');
  const tasks = taskAccess.index();

  if (tasks.error?.response) return <Errors error={tasks.error} />;
  if (!tasks.data) return <p>loading...</p>;

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

  const onToggleCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number | string
  ) => {
    void taskAccess.update(id, { done: e.target.checked });
  };

  return (
    <>
      <ul>
        {tasks.data.map((task) => (
          <li
            key={task.id}
            data-task-id={task.id}
            className="flex items-start pl-3 border-b-2 border-gray-200 duration-100 hover:bg-blue-100"
          >
            <Checkbox
              checked={task.done}
              onChange={(e) => onToggleCheck(e, task.id)}
              className="checked:bg-blue-500 focus:border-blue-700 focus-checked:bg-blue-700"
              wrapperClassName="mt-4 md:mt-0 md:self-center"
            />
            <Link
              to={{
                pathname: `/projects/${task.project_id}/tasks/${task.id}`,
                search: location.search,
                state: { fromTop: true },
              }}
              className={`linkToDetail overflow-hidden group flex items-center flex-wrap md:flex-no-wrap flex-grow ml-3 p-3 pl-0 outline-none ${
                task.title ? '' : 'text-gray-500'
              } focus:text-blue-500`}
            >
              <div className="overflow-hidden flex items-center">
                {task.priority > 1 && (
                  <FaFlag
                    className={`flex-shrink-0 mr-2 text-${
                      ['blue', 'yellow', 'red'][task.priority - 2]
                    }-500`}
                  />
                )}
                <div className="truncate">
                  {task.title || '名称未設定タスク'}
                </div>
              </div>
              {task.duedate && (
                <div className="w-full md:w-auto ml-auto mt-2 md:mt-0 flex items-center text-xs md:text-sm">
                  <CgSandClock className="-ml-1 mr-1 text-base md:text-xl text-gray-500" />
                  {format(task.duedate, 'yyyy/MM/dd HH:mm')}
                </div>
              )}
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
