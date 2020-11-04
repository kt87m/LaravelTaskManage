import React from 'react';
import { useParams } from 'react-router-dom';
import useTask from '../hooks/useTask';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { error, data } = useTask(id);

  if (error) return <p>{error.message}</p>;
  if (data === undefined) return <p>loading...</p>;

  return (
    <div>
      <h1 className="taskTitle">{data.title}</h1>
    </div>
  );
};

export default TaskDetail;
