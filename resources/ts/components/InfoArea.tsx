import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useCallbackBuffer from '../hooks/useCallbackBuffer';
import { useResource } from '../hooks/useResource';
import { GoPlus, GoCloudUpload } from 'react-icons/go';
import { BsQuestion } from 'react-icons/bs';
import { ClickAwayListener, Tooltip } from '@material-ui/core';

const PreserveProjectButton: React.FC<{
  onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  className?: string;
}> = ({ onClick, className }) => (
  <button
    onClick={onClick}
    className={`preserveProject items-center self-center py-1 px-3 text-xs rounded-full duration-200 bg-teal-600  hover:bg-teal-500 text-white shadow ${
      className ?? ''
    }`}
  >
    <GoCloudUpload className="text-lg mr-1" />
    プロジェクトを保存する
  </button>
);

const InfoArea: React.FC = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('project_id') || '';
  const project = useResource('projects').get(projectId);

  const onClickPreserveProject = () => {
    project.update({ preserved: true }).catch(console.log);
  };

  const changeProjectNameBuffer = useCallbackBuffer();
  const onChangeProjectName = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    changeProjectNameBuffer(() => {
      project.update({ name }).catch(console.log);
    });
  };

  const [tooltipOpen, setTooltipOpen] = useState(false);

  let content;
  if (!projectId)
    content = <p className="self-center">タスクを追加してプロジェクトを開始</p>;
  else if (project.error?.response) {
    const errors = project.error.response.data.errors;
    content = (
      <p className="self-center text-red-600">
        {Object.values(errors).join(', ')}
      </p>
    );
  } else if (project.data) {
    if (project.data.preserved)
      content = (
        <input
          key={projectId}
          placeholder="プロジェクト名を入力"
          autoFocus
          defaultValue={project.data.name}
          onChange={onChangeProjectName}
          className="projectName self-center bg-transparent border-b-2 border-transparent focus:outline-none focus:border-blue-300 text-base rounded-none"
        />
      );
    else
      content = (
        <>
          <p className="self-center text-sm sm:text-base">
            未保存のプロジェクト
          </p>

          <ClickAwayListener onClickAway={() => setTooltipOpen(false)}>
            <Tooltip
              interactive
              arrow
              open={tooltipOpen}
              title={
                <div className="text-center text-xs p-1">
                  <p>
                    未保存のプロジェクトは
                    <br />
                    最終アクセスから1時間後に削除されます
                  </p>
                  <PreserveProjectButton
                    onClick={onClickPreserveProject}
                    className="flex sm:hidden mt-1 mx-auto"
                  />
                </div>
              }
            >
              <span
                onClick={() => setTooltipOpen(true)}
                onMouseEnter={() => setTooltipOpen(true)}
                onMouseLeave={() => setTooltipOpen(false)}
              >
                <BsQuestion className="mx-1 align-middle rounded-full text-base sm:text-lg text-white bg-gray-600" />
              </span>
            </Tooltip>
          </ClickAwayListener>

          <PreserveProjectButton
            onClick={onClickPreserveProject}
            className="hidden sm:flex ml-6"
          />
        </>
      );
  }

  return (
    <div className="InfoArea pl-3 sm:pl-5 md:pl-0 bg-gray-200 text-xs md:text-base">
      <div className="container mx-auto">
        <div className="flex items-center h-12 text-gray-600">
          {content}
          {projectId && (
            <Link
              to="/"
              className="flex items-center ml-auto p-3 text-blue-500 focus:outline-none focus:bg-gray-300 hover:bg-gray-300 transition-all"
            >
              <GoPlus className="mr-1 text-base sm:text-xl" />
              新規プロジェクト
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoArea;
