import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useResource } from '../hooks/useResource';

const InfoArea: React.FC = () => {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('project_id') || '';
  const project = useResource('projects').get(projectId);

  const onClickPreserveProject = () => {
    project.update({ preserved: true }).catch(console.log);
  };

  let content;
  if (!projectId)
    content = <p className="self-center">タスクを追加してプロジェクトを開始</p>;
  else if (!project.error && project.data) {
    if (project.data.preserved)
      content = (
        <p className="self-center" contentEditable>
          {project.data.name}
        </p>
      );
    else
      content = (
        <>
          <p className="self-center">未保存のプロジェクト</p>
          <button
            className="preserveProject self-center ml-3 py-1 px-2 text-xs rounded-sm bg-white shadow-sm"
            onClick={onClickPreserveProject}
          >
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
              className="block ml-auto p-3 text-blue-500 hover:bg-gray-300 transition-all"
            >
              + 新規プロジェクト
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default InfoArea;
