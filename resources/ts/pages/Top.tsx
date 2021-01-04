import React from 'react';
import { GoPlus } from 'react-icons/go';
import { FaFilter } from 'react-icons/fa';
import { useHistory, useLocation } from 'react-router-dom';
import TaskList from '../components/TaskList';
import { useResource } from '../hooks/useResource';
import { Task } from '../types/api';

type Props = {
  tasks?: Task[];
};

const Top: React.FC<Props> = ({ tasks }) => {
  const history = useHistory();
  const location = useLocation();

  const taskAccess = useResource('tasks');

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
        history.replace({
          pathname: `/projects/${createdTask.project_id}`,
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

  return (
    <div className="relative">
      <h2 className="text-xl md:text-2xl mb-3 text-gray-500">タスク一覧</h2>

      <div className="absolute top-0 right-0">
        <label>
          <FaFilter
            title="フィルター"
            className="inline align-middle text-lg sm:text-xl text-gray-500"
          />
          <select
            data-testid="filter"
            value={filter}
            onChange={onChangeFilter}
            className="appearance-none ml-1 p-1 text-base outline-none border-b-2 border-gray-500 focus:border-0 focus:border-blue-300 rounded-none"
          >
            <option value="">全て</option>
            <option value="done=true">完了済み</option>
            <option value="done=false">未完了</option>
          </select>
        </label>
      </div>

      <TaskList tasks={tasks} onToggleCheck={onToggleCheck} />

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
    </div>
  );
};

export default Top;
