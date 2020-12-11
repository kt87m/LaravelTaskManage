import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import useCallbackBuffer from '../hooks/useCallbackBuffer';

import { useResource } from '../hooks/useResource';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory<{ fromTop?: boolean } | undefined>();

  const task = useResource('tasks').get(id);
  const titleChangeBuffer = useCallbackBuffer();

  if (task.error?.response)
    return (
      <>
        {Object.values(task.error.response.data.errors).map((errors) =>
          errors.map((message) => (
            <p key={message} className="text-red-600">
              {message}
            </p>
          ))
        )}
      </>
    );
  if (!task.data) return <p>loading...</p>;

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    titleChangeBuffer(() => {
      void task.update({ title });
    });
  };

  const onToggleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    void task.update({ done: e.target.checked });
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
