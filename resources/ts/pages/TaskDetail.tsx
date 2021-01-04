import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Checkbox } from '../components/Checkbox';
import useCallbackBuffer from '../hooks/useCallbackBuffer';
import { AiTwotoneDelete } from 'react-icons/ai';

import { useResource } from '../hooks/useResource';
import { Task } from '../types/api';

type Props = {
  tasks?: Task[];
};

const TaskDetail: React.FC<Props> = ({ tasks }) => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory<{ fromTop?: boolean } | undefined>();

  const task = tasks?.find((task) => task.id == id);

  const taskResource = useResource('tasks').get(id);
  const titleChangeBuffer = useCallbackBuffer();

  if (!task) return null;

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    titleChangeBuffer(() => {
      void taskResource.update({ title });
    });
  };

  const onToggleCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    void taskResource.update({ done: e.target.checked });
  };

  const onClickDeleteTask = () => {
    void taskResource.deleteSelf().then(() => {
      if (history.location.state?.fromTop) history.goBack();
      else history.replace(`/${location.search}`);
    });
  };

  return (
    <div>
      <div className="flex items-center">
        <Checkbox checked={task.done} onChange={onToggleCheck} />
        <h1 className="taskTitle flex-grow">
          <input
            defaultValue={task.title}
            onChange={onTitleChange}
            className="w-full p-1 border-gray-400 border-solid border rounded-sm"
          />
        </h1>
        <button
          type="button"
          onClick={onClickDeleteTask}
          className="deleteTask flex items-center ml-3 sm:ml-8 py-1 px-2 rounded-sm text-xs sm:text-base bg-red-500 text-white"
        >
          <AiTwotoneDelete className="mr-1 sm:text-xl" />
          削除
        </button>
      </div>
    </div>
  );
};

export default TaskDetail;
