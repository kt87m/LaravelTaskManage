import React from 'react';
import { Link } from 'react-router-dom';
import useSWR, { responseInterface } from 'swr';

type Task = {
  id: number;
  title: string;
  done: boolean;
};
type TasksResponse = responseInterface<Task[], Error>;

const Top: React.FC = () => {
  const { error, data }: TasksResponse = useSWR('/api/tasks');

  if (error) return <p>{error.message}</p>;
  if (data === undefined) return <p>loading...</p>;

  const tasks = data.map((task) => (
    <li key={task.id}>
      <input type="checkbox" checked={task.done} />
      <Link
        to={`/tasks/${task.id}`}
        className="linkToDetail"
        data-task-id={task.id}
      >
        {task.title}
      </Link>
    </li>
  ));

  return (
    <div>
      <ul>{tasks}</ul>
    </div>
  );
};

export default Top;
