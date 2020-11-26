import axios, { AxiosError, AxiosResponse } from 'axios';
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
  project_id: string;
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
    const { error, data } = useSWR<Array<Resources[T]>, Error>(
      this.uri,
      (uri) => {
        return axios
          .get<Resources[T][], AxiosResponse<Resources[T][]>>(
            `${uri as string}${location.search}`
          )
          .then((res) => res.data);
      }
    );
    return { error, data };
  }

  get(id: Id) {
    const response = useSWR<Resources[T], AxiosError<Error>>(
      `${this.uri}/${id}${location.search}`,
      (uri) => {
        return axios
          .get<Resources[T], AxiosResponse<Resources[T]>>(uri as string)
          .then((res) => res.data);
      }
    );
    return new RESTResource(this.type, id, response);
  }

  create(
    data: Partial<Omit<Resources[T], keyof ResourceBase>>,
    onSuccess?: (res: Resources[T]) => void
  ) {
    return axios
      .post<Resources[T], AxiosResponse<Resources[T]>>(
        this.uri + location.search,
        data
      )
      .then((res) => {
        if (onSuccess) onSuccess(res.data);
        void mutate(this.uri);
        return res;
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
  public readonly error?: AxiosError<Error>;
  public readonly data?: Resources[T];

  constructor(
    public readonly type: T,
    public readonly id: Id,
    response: responseInterface<Resources[T], AxiosError<Error>>
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
