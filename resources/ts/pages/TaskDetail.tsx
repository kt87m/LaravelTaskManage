import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Checkbox } from '../components/Checkbox';
import useCallbackBuffer from '../hooks/useCallbackBuffer';
import { AiTwotoneDelete } from 'react-icons/ai';
import { FaRegFlag, FaFlag } from 'react-icons/fa';
import { CgNotes, CgSandClock } from 'react-icons/cg';
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
      else history.replace(
        `${location.pathname.replace(/\/tasks\/.+$/, '')}${location.search}`
      );
    });
  };

  return (
    <div className="mt-4 sm:mt-0">
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

      <div className="md:flex">
        <dl className="flex flex-col flex-grow mt-8">
          <dt className="mb-1 text-sm">
            <label htmlFor="description" className="flex items-center">
              <CgNotes className="mr-2 text-lg text-gray-500" />
              説明
            </label>
          </dt>
          <dd className="flex flex-grow">
            <textarea
              id="description"
              defaultValue={task.data.description || ''}
              onChange={onDescriptionChange}
              className="h-full w-full p-1 border-gray-400 border-solid border rounded-sm"
            />
          </dd>
        </dl>
        <div className="md:ml-5">
          <dl className="mt-8">
            <dt className="mb-1 text-sm">
              <label id="priority-label" className="flex items-center">
                <FaRegFlag className="mr-2 text-base text-gray-500" />
                優先度
              </label>
            </dt>
            <dd>
              <Select
                labelId="priority-label"
                id="priority"
                value={task.data.priority}
                onChange={(e) =>
                  void task.update({
                    priority: e.target.value as 1 | 2 | 3 | 4,
                  })
                }
              >
                <MenuItem value={1}>
                  <span className="flex items-center">
                    <FaFlag className="mx-2 text-white" />低
                  </span>
                </MenuItem>
                <MenuItem value={2}>
                  <span className="flex items-center">
                    <FaFlag className="mx-2 text-blue-500" />中
                  </span>
                </MenuItem>
                <MenuItem value={3}>
                  <span className="flex items-center">
                    <FaFlag className="mx-2 text-yellow-500" />高
                  </span>
                </MenuItem>
                <MenuItem value={4}>
                  <span className="flex items-center">
                    <FaFlag className="mx-2 text-red-500" />
                    最高
                  </span>
                </MenuItem>
              </Select>
            </dd>
          </dl>
          <dl className="mt-8">
            <dt className="mb-1 text-sm">
              <label htmlFor="duedate" className="flex items-center">
                <CgSandClock className="-ml-1 mr-2 text-xl text-gray-500" />
                締め切り
              </label>
            </dt>
            <dd>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                  id="duedate"
                  value={task.data.duedate}
                  onChange={onDueDateChange}
                  format="yyyy/MM/dd HH:mm"
                  clearable
                  ampm={false}
                  margin="none"
                  inputProps={{
                    style: {
                      color:
                        task.data.duedate && task.data.duedate <= new Date()
                          ? '#f56565'
                          : '',
                    },
                  }}
                />
              </MuiPickersUtilsProvider>
            </dd>
          </dl>
        </div>
      </div>
      <button
        type="button"
        onClick={onClickDeleteTask}
        className="deleteTask flex items-center mt-16 ml-auto py-1 px-2 rounded-sm text-sm sm:text-base bg-red-500 text-white focus:bg-red-700"
      >
        <AiTwotoneDelete className="mr-1 text-base sm:text-xl" />
        削除
      </button>
    </div>
  );
};

export default TaskDetail;
