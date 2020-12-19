import React from 'react';
import { GoPlus } from 'react-icons/go';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Checkbox } from '../components/Checkbox';
import { Errors } from '../components/Errors';
import { useResource } from '../hooks/useResource';

const Top: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const taskAccess = useResource('tasks');
  const tasks = taskAccess.index();

  const onToggleCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number | string
  ) => {
    void taskAccess.update(id, { done: e.target.checked });
  };

  const onClickAddButton = () => {
    taskAccess
      .create({ done: false }, (createdTask) =>
        history.replace(
          `${location.pathname}?project_id=${createdTask.project_id}`
        )
      )
      .catch(console.log);
  };

  if (tasks.error?.response) return <Errors error={tasks.error} />;
  if (!tasks.data) return <p>loading...</p>;

  const taskItems = tasks.data.map((task) => (
    <li
      key={task.id}
      data-task-id={task.id}
      className="border-b-2 border-gray-200"
    >
      <Link
        to={{
          pathname: `/tasks/${task.id}`,
          search: location.search,
          state: { fromTop: true },
        }}
        className="linkToDetail flex items-center p-3 transition-all duration-100 hover:bg-blue-100"
      >
        {task.title || <span className="text-gray-500">名称未設定タスク</span>}
        <Checkbox
          checked={task.done}
          onChange={(e) => onToggleCheck(e, task.id)}
        />
      </Link>
    </li>
  ));

  return (
    <div>
      <ul>{taskItems}</ul>
      <div
        onClick={onClickAddButton}
        className="group cursor-pointer inline-flex items-center mt-10 duration-100 text-gray-500 hover:text-blue-500"
      >
        <button
          type="button"
          className="createTask inline-flex w-8 h-8 justify-center mr-2 p-2 rounded-full transition-all duration-500 bg-blue-500 text-white shadow-md focus:outline-none focus:bg-blue-400 focus:shadow-xl group-hover:bg-blue-400 hover:shadow-xl"
        >
          <GoPlus className="self-center text-xl" />
        </button>
        タスクを追加
      </div>
    </div>
  );
};

export default Top;
