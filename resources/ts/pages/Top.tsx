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

  const searchParams = new URLSearchParams(location.search);
  const filter = (/done=[^&]+/.exec(location.search) ?? [''])[0];

  const onToggleCheck = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number | string
  ) => {
    void taskAccess.update(id, { done: e.target.checked });
  };

  const onClickAddButton = () => {
    taskAccess
      .create({ done: false }, (createdTask) => {
        searchParams.set('project_id', createdTask.project_id);

        history.replace({
          search: searchParams.toString(),
        });
      })
      .catch(console.log);
  };

  const onChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      const [key, value] = e.target.value.split('=');
      searchParams.set(key, value);
    } else searchParams.delete('done');

    history.replace({
      search: searchParams.toString(),
    });
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
      <h2 className="text-2xl mb-3 text-gray-500">タスク一覧</h2>

      <label>
        フィルター
        <select
          data-testid="filter"
          value={filter}
          onChange={onChangeFilter}
          className="ml-3 mb-3 border-b-2 border-gray-300"
        >
          <option value="">全て</option>
          <option value="done=true">完了済み</option>
          <option value="done=false">未完了</option>
        </select>
      </label>

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
