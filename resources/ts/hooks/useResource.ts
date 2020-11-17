import axios from 'axios';
import useSWR, { responseInterface, mutate } from 'swr';

export function useResource<T extends keyof Resources>(
  type: T
): RESTResourceAccess<T> {
  return new RESTResourceAccess(type);
}

type Id = number | string;

type ResourceBase = {
  id: Id;
  created_at: string;
  updated_at: string;
};

type Task = ResourceBase & {
  title: string;
  done: boolean;
};
type Project = ResourceBase & {
  name: string;
};

export type Resources = {
  tasks: Task;
  projects: Project;
};

class RESTResourceAccess<T extends keyof Resources> {
  private uri: string;

  constructor(private type: T) {
    this.uri = `/api/${this.type}`;
  }

  index() {
    const { error, data } = useSWR<Array<Resources[T]>, Error>(this.uri);
    return { error, data };
  }

  get(id: Id) {
    const response = useSWR<Resources[T], Error>(`${this.uri}/${id}`);
    return new RESTResource(this.type, id, response);
  }

  create(data: Partial<Omit<Resources[T], keyof ResourceBase>>) {
    axios
      .post(this.uri, data)
      .then(() => mutate(this.uri))
      .catch((e) => {
        console.log(e);
      });
  }

  update(id: Id, diff: Partial<Omit<Resources[T], keyof ResourceBase>>): void {
    const uri = `${this.uri}/${id}`;
    axios
      .put(uri, diff)
      .then(() => mutate(this.uri))
      .catch((e) => {
        console.log(e);
      });
  }

  delete(id: Id) {
    const uri = `${this.uri}/${id}`;
    return axios
      .delete(uri)
      .then(() => mutate(this.uri))
      .catch((e) => {
        console.log(e);
      });
  }
}

class RESTResource<T extends keyof Resources> {
  private uri: string;
  public readonly error?: Error;
  public readonly data?: Resources[T];

  constructor(
    public readonly type: T,
    public readonly id: Id,
    response: responseInterface<Resources[T], Error>
  ) {
    this.uri = `/api/${type}/${id}`;
    this.error = response.error;
    this.data = response.data;
  }

  update(data: Partial<Resources[T]>): void {
    void mutate(this.uri, { ...this.data, data }, false);
    axios
      .put(this.uri, data)
      .then(() => mutate(this.uri))
      .catch((e) => {
        console.log(e);
      });
  }

  deleteSelf() {
    return axios.delete(this.uri).catch((e) => {
      console.log(e);
    });
  }
}
