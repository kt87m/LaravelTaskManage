import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Checkbox } from '../components/Checkbox';
import useCallbackBuffer from '../hooks/useCallbackBuffer';
import { AiTwotoneDelete } from 'react-icons/ai';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker } from '@material-ui/pickers';

import { useResource } from '../hooks/useResource';
import { Errors } from '../components/Errors';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory<{ fromTop?: boolean } | undefined>();

  const task = useResource('tasks').get(id);
  const titleChangeBuffer = useCallbackBuffer();
  const descriptionChangeBuffer = useCallbackBuffer();

  if (task.error?.response) return <Errors error={task.error} />;
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

  const onDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    descriptionChangeBuffer(() => {
      void task.update({ description });
    });
  };

  const onDueDateChange = (date: Date | null) => {
    if (!date) return task.update({ duedate: null });
    void task.update({
      duedate: date,
    });
  };

  const onClickDeleteTask = () => {
    void task.deleteSelf().then(() => {
      if (history.location.state?.fromTop) history.goBack();
      else task.data && history.replace(`/projects/${task.data.project_id}`);
    });
  };

  return (
    <div>
      <div className="flex items-center">
        <Checkbox
          checked={task.data.done}
          onChange={onToggleCheck}
          className="checked:bg-blue-500 focus:border-blue-700 focus-checked:bg-blue-700"
        />
        <h1 className="taskTitle flex-grow ml-3">
          <input
            defaultValue={task.data.title}
            onChange={onTitleChange}
            className="w-full p-1 border-gray-400 border-solid border rounded-sm"
          />
        </h1>
      </div>
      <dl className="flex-grow mt-6">
        <dt>説明</dt>
        <dd className="h-full">
          <textarea
            defaultValue={task.data.description || ''}
            onChange={onDescriptionChange}
            className="h-full w-full p-1 border-gray-400 border-solid border rounded-sm"
          />
        </dd>
      </dl>
      <dl className="mt-6">
        <dt>優先度</dt>
        <dd>
          <Select
            value={task.data.priority}
            onChange={(e) =>
              void task.update({
                priority: e.target.value as 1 | 2 | 3 | 4,
              })
            }
          >
            <MenuItem value={1}>低</MenuItem>
            <MenuItem value={2}>中</MenuItem>
            <MenuItem value={3}>高</MenuItem>
            <MenuItem value={4}>最高</MenuItem>
          </Select>
        </dd>
      </dl>
      <dl className="mt-6">
        <dt>締め切り</dt>
        <dd>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DateTimePicker
              value={task.data.duedate}
              onChange={onDueDateChange}
              format="yyyy/MM/dd HH:mm"
              clearable
              ampm={false}
              margin="none"
            />
          </MuiPickersUtilsProvider>
        </dd>
      </dl>

      {/* <div className="flex">
        <div className="ml-5">
        </div>
      </div> */}
      <button
        type="button"
        onClick={onClickDeleteTask}
        className="deleteTask flex items-center mt-12 ml-auto py-1 px-2 rounded-sm text-xs sm:text-base bg-red-500 text-white focus:bg-red-700"
      >
        <AiTwotoneDelete className="mr-1 sm:text-xl" />
        削除
      </button>
    </div>
  );
};

export default TaskDetail;
