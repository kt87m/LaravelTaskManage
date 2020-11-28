import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const InfoArea: React.FC = () => {
  const location = useLocation();
  let content;
  if (!/project_id=/.test(location.search))
    content = 'タスクを追加してプロジェクトを開始';
  return (
    <div className="InfoArea  p-3 bg-gray-200 h-12">
      <div className="container mx-auto">
        <p className="text-gray-600">{content}</p>
      </div>
    </div>
  );
};

export default InfoArea;
