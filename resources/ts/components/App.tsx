import React from 'react';
import useSWR, { responseInterface } from 'swr';

type Task = {
  id: number;
  title: string;
  done: boolean;
};
type TasksResponse = responseInterface<Task[], Error>;

const App: React.FC = () => {
  const { error, data }: TasksResponse = useSWR('/api/tasks');

  if (error) return <p>{error.message}</p>;
  if (data === undefined) return <p>loading...</p>;

  const tasks = data.map((task) => (
    <li key={task.id}>
      <input type="checkbox" checked={task.done} />
      {task.title}
    </li>
  ));

  return (
    <div>
      <ul>{tasks}</ul>
    </div>
  );
};

export default App;
