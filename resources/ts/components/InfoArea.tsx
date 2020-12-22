import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useCallbackBuffer from '../hooks/useCallbackBuffer';
import { useResource } from '../hooks/useResource';
import { GoPlus } from 'react-icons/go';
import { GoCloudUpload } from 'react-icons/go';

const InfoArea: React.FC = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('project_id') || '';
  const project = useResource('projects').get(projectId, projectId);

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

  let content;
  if (!projectId)
    content = <p className="self-center">タスクを追加してプロジェクトを開始</p>;
  else if (!project.error && project.data) {
    if (project.data.preserved)
      content = (
        <input
          key={projectId}
          placeholder="プロジェクト名を入力"
          defaultValue={project.data.name}
          onChange={onChangeProjectName}
          className="projectName self-center bg-transparent border-b-2 border-transparent focus:outline-none focus:border-blue-300"
        />
      );
    else
      content = (
        <>
          <p className="self-center">未保存のプロジェクト</p>
          <button
            onClick={onClickPreserveProject}
            className="preserveProject flex items-center self-center ml-8 py-1 px-3 text-xs rounded-full duration-200 bg-teal-600  hover:bg-teal-500 text-white shadow"
          >
            <GoCloudUpload className="text-lg mr-1" />
            プロジェクトを保存する
          </button>
        </>
      );
  }

  return (
    <div className="InfoArea bg-gray-200">
      <div className="container mx-auto">
        <div className="flex h-12 text-gray-600">
          {content}
          {projectId && (
            <Link
              to="/"
              className="flex ml-auto p-3 text-blue-500 focus:outline-none focus:bg-gray-300 hover:bg-gray-300 transition-all"
            >
              <GoPlus className="mr-1 self-center text-xl" />
              新規プロジェクト
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoArea;
