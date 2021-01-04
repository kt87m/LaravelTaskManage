export type Id = number | string;

export type ResourceBase = {
  id: Id;
  created_at: string;
  updated_at: string;
};

export type Task = ResourceBase & {
  project_id: string;
  title: string;
  done: boolean;
};
export type Project = ResourceBase & {
  name: string;
  expiration: string;
  preserved: boolean;
  tasks: Task[];
};

export type Resources = {
  tasks: Task;
  projects: Project;
};

export type ApiError = {
  data: any;
  status: string;
  summary: string;
  errors: {
    [k: string]: string[];
  };
};
