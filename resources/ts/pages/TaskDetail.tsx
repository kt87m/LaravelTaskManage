import React from 'react';
import { useParams } from 'react-router-dom';
import useSWR, { responseInterface } from 'swr';

type Task = {
  id: number;
  title: string;
  done: boolean;
};
type TasksResponse = responseInterface<Task[], Error>;

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { error, data }: TasksResponse = useSWR(`/api/tasks/${id}`);

  if (error) return <p>{error.message}</p>;
  if (data === undefined) return <p>loading...</p>;

  return (
    <div>
      <h1 className="taskTitle">{data.title}</h1>
    </div>
  );
};

export default TaskDetail;
