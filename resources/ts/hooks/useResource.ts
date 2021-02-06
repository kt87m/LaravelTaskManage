import axios, { AxiosError, AxiosResponse } from 'axios';
import useSWR, { responseInterface, mutate } from 'swr';
import { format } from 'date-fns';

import { ApiError, Id, ResourceBase, Resources } from '../types/api';

const resourceApi = axios.create();
resourceApi.interceptors.request.use((config) => {
  if (!config.data) return config;
  const data = config.data as { duedate?: Date | null | string };
  if (data.duedate instanceof Date) {
    data.duedate = format(data.duedate, 'yyyy-MM-dd HH:mm:ss');
  }
  return config;
});
resourceApi.interceptors.response.use(
  (
    res: AxiosResponse<{
      duedate?: string | null | Date;
    }>
  ) => {
    if (typeof res.data.duedate == 'string') {
      res.data.duedate = new Date(res.data.duedate.replace(' ', 'T'));
    }
    return res;
  }
);

export function useResource<T extends keyof Resources>(
  type: T
): RESTResourceAccess<T> {
  return new RESTResourceAccess(type);
}

class RESTResourceAccess<T extends keyof Resources> {
  public readonly uri: string;

  constructor(private type: T) {
    this.uri = `/api/${this.type}`;
  }

  index() {
    const key = this.getKeyFromPath();
    const { error, data } = useSWR<Array<Resources[T]>, AxiosError<ApiError>>(
      key,
      () => {
        return resourceApi
          .get<Resources[T][], AxiosResponse<Resources[T][]>>(
            `/api${key}${location.search}`
          )
          .then(({ data }) => data);
      }
    );

    const prevSearch = search;
    search = location.search;
    if (search !== prevSearch) void mutate(key);

    return { error, data };
  }

  get(id: Id): RESTResource<T> {
    const key = this.getKeyFromPath(id);
    const response = useSWR<Resources[T], AxiosError<ApiError>>(key, () => {
      return resourceApi
        .get<Resources[T], AxiosResponse<Resources[T]>>(
          `/api${key}${location.search}`
        )
        .then((res) => res.data);
    });
    return new RESTResource(this, id, response);
  }

  create(
    data: Partial<Omit<Resources[T], keyof ResourceBase>>,
    onSuccess?: (res: Resources[T]) => void
  ) {
    const key = this.getKeyFromPath();
    return resourceApi
      .post<Resources[T], AxiosResponse<Resources[T]>>(
        `/api${key}${location.search}`,
        data
      )
      .then((res) => {
        if (onSuccess) onSuccess(res.data);
        void mutate(key);
        return res;
      });
  }

  update(id: Id, diff: Partial<Omit<Resources[T], keyof ResourceBase>>) {
    // 集合キャッシュ
    const collectionKey = this.getKeyFromPath();
    void mutate(
      collectionKey,
      (data?: Resources[T][]) => {
        if (!data) return;
        return data.map((item) =>
          item.id == id ? { ...item, ...diff } : item
        );
      },
      false
    );

    // 個別キャッシュ
    const key = `${collectionKey}/${id}`;
    void mutate(key, (data: Resources[T]) => ({ ...data, ...diff }), false);

    return resourceApi
      .put<Resources[T]>(`/api${key}${location.search}`, diff)
      .catch((e) => {
        console.log(e);
        void mutate(collectionKey);
        void mutate(key);
      });
  }

  delete(id: Id) {
    const collectionKey = this.getKeyFromPath();
    void mutate(
      collectionKey,
      (data?: Resources[T][]) => {
        if (!data) return;
        return data.filter((item) => item.id != id);
      },
      false
    );

    const key = `${collectionKey}/${id}`;
    void mutate(key, undefined, false);

    return resourceApi.delete(`/api${key}${location.search}`).catch((e) => {
      console.log(e);
      void mutate(collectionKey);
    });
  }

  private getKeyFromPath(id?: Id) {
    const path = location.pathname == '/' ? '' : location.pathname;
    if (!id) {
      const match = new RegExp(`^.*/${this.type}`).exec(path);
      return match ? match[0] : `${path}/${this.type}`;
    }
    const match = new RegExp(`^.*/${this.type}/${id}`).exec(path);
    return match ? match[0] : `/${this.type}/${id}`;
  }
}

export class RESTResource<T extends keyof Resources> {
  public readonly error?: AxiosError<ApiError>;
  public readonly data?: Resources[T];

  constructor(
    public readonly parent: RESTResourceAccess<T>,
    public readonly id: Id,
    response: responseInterface<Resources[T], AxiosError<ApiError>>
  ) {
    this.error = response.error;
    this.data = response.data;
  }

  update(diff: Partial<Omit<Resources[T], keyof ResourceBase>>) {
    return this.parent.update(this.id, diff);
  }

  deleteSelf() {
    return this.parent.delete(this.id);
  }
}

let search = location.search;
