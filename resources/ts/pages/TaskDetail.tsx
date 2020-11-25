import React from 'react';
import { useHistory, useParams } from 'react-router-dom';

import { useResource } from '../hooks/useResource';

let inputTimer: number | undefined;

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory<{ fromTop?: boolean } | undefined>();

  const task = useResource('tasks').get(id);

  if (task.error) return <p>{task.error.message}</p>;
  if (!task.data) return <p>loading...</p>;

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    if (inputTimer) clearTimeout(inputTimer);
    inputTimer = window.setTimeout(() => {
      inputTimer = undefined;
      task.update({ title });
    }, 1000);
  };

  const onToggleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    task.update({ done: e.target.checked });
  };

  const onClickDeleteTask = () => {
    void task.deleteSelf().then(() => {
      if (history.location.state?.fromTop) history.goBack();
      else history.replace(`/${location.search}`);
    });
  };

  return (
    <div>
      <div className="flex items-center">
        <h1 className="taskTitle">
          <input
            defaultValue={task.data.title}
            onChange={onTitleChange}
            className="p-1 border-gray-400 border-solid border"
          />
        </h1>
        <input
          type="checkbox"
          checked={task.data.done}
          onChange={onToggleCheck}
          className="mr-2 order-first"
        />
        <button
          type="button"
          onClick={onClickDeleteTask}
          className="deleteTask ml-5 p-1 corner-round-5 bg-red-500 text-white"
        >
          削除
        </button>
      </div>
    </div>
  );
};

export default TaskDetail;
