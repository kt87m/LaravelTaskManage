import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const InfoArea: React.FC = () => {
  const location = useLocation();

  let content;
  if (!/project_id=/.test(location.search))
    content = <p className="p-3 pl-0">タスクを追加してプロジェクトを開始</p>;
  else
    content = <>
      <p className="p-3 pl-0">未保存のプロジェクト</p>
      <Link
        to="/"
        className="block ml-auto p-3 text-blue-500 hover:bg-gray-300 transition-all"
      >
        + 新規プロジェクト
      </Link>
    </>;

  return (
    <div className="InfoArea bg-gray-200 h-12">
      <div className="container mx-auto">
        <div className="flex text-gray-600">
          {content}
        </div>
      </div>
    </div>
  );
};

export default InfoArea;
