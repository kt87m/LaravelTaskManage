import axios, { AxiosError, AxiosResponse } from 'axios';
import useSWR, { responseInterface, mutate } from 'swr';
import { ApiError, Id, ResourceBase, Resources } from '../types/api';

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
    const { error, data } = useSWR<Array<Resources[T]>, AxiosError<ApiError>>(
      this.uri + location.search,
      (uri) => {
        return axios
          .get<Resources[T][], AxiosResponse<Resources[T][]>>(uri)
          .then((res) => res.data);
      }
    );
    return { error, data };
  }

  get(id: Id): RESTResource<T> {
    const response = useSWR<Resources[T], AxiosError<ApiError>>(
      `${this.uri}/${id}${location.search}`,
      (uri) => {
        return axios
          .get<Resources[T], AxiosResponse<Resources[T]>>(uri)
          .then((res) => res.data);
      }
    );
    return new RESTResource(this, id, response);
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
        void mutate(this.uri + location.search);
        return res;
      });
  }

  update(id: Id, diff: Partial<Omit<Resources[T], keyof ResourceBase>>) {
    // 集合キャッシュ
    void mutate(
      this.uri + location.search,
      (data?: Resources[T][]) => {
        if (!data) return;
        return data.map((item) =>
          item.id == id ? { ...item, ...diff } : item
        );
      },
      false
    );

    // 個別キャッシュ
    const uri = `${this.uri}/${id}${location.search}`;
    void mutate(uri, (data: Resources[T]) => ({ ...data, ...diff }), false);

    return axios
      .put<Resources[T]>(uri, diff)
      .then((res) => mutate(uri, res.data, false))
      .catch((e) => {
        console.log(e);
        void mutate(this.uri + location.search);
        void mutate(uri);
      });
  }

  delete(id: Id) {
    void mutate(
      this.uri + location.search,
      (data?: Resources[T][]) => {
        if (!data) return;
        return data.filter((item) => item.id != id);
      },
      false
    );

    const uri = `${this.uri}/${id}${location.search}`;
    return axios.delete(uri).catch((e) => {
      console.log(e);
      void mutate(this.uri + location.search);
    });
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
