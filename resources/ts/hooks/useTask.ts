import useSWR, { responseInterface } from 'swr';

type Task = {
  id: number;
  title: string;
  done: boolean;
};

type Response<T> = responseInterface<T, Error>;

type FetchSingleOrCollection<T> = {
  (): Response<T[]>;
  (id: number | string): Response<T>;
};

const useTask = ((id?: number | string) => {
  if (id === undefined) return useSWR<Task[], Error>(`/api/tasks`);
  else return useSWR<Task, Error>(`/api/tasks/${id}`);
}) as FetchSingleOrCollection<Task>;

export default useTask;
