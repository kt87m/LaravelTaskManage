import React from 'react';
import { Link } from 'react-router-dom';
import { useResource } from '../hooks/useResource';

const Top: React.FC = () => {
  const taskAccess = useResource('tasks');
  const tasks = taskAccess.index();

  const onToggleCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number | string
  ) => {
    taskAccess.update(id, { done: e.target.checked });
  };

  const onClickAddButton = () => {
    taskAccess.create({
      done: false,
    });
  };

  if (tasks.error) return <p>{tasks.error.message}</p>;
  if (!tasks.data) return <p>loading...</p>;

  const taskItems = tasks.data.map((task) => (
    <li key={task.id} data-task-id={task.id} className="flex items-center">
      <Link to={`/tasks/${task.id}`} className="linkToDetail order-1">
        {task.title || <span className="text-gray-500">名称未設定タスク</span>}
      </Link>
      <input
        type="checkbox"
        checked={task.done}
        onChange={(e) => onToggleCheck(e, task.id)}
        className="mr-2"
      />
    </li>
  ));

  return (
    <div>
      <ul>{taskItems}</ul>
      <button
        type="button"
        onClick={onClickAddButton}
        className="createTask mt-2 p-2 corner-round-5 bg-blue-500 text-white"
      >
        + 新規追加
      </button>
    </div>
  );
};

export default Top;
