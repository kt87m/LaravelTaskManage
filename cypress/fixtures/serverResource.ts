import { Project, Task } from '../../resources/ts/types/api';

export let project: Project;
export let task1: Task;
export let task2: Task;
export let queryString: string;

export function setupDb(): Cypress.Chainable<Project> {
  return cy
    .refreshDatabase()
    .seed('TaskSeeder')
    .php<Project>(`App\\Models\\Project::with('tasks')->first();`)
    .then((prj) => {
      [task1, task2] = prj.tasks;
      queryString = `?project_id=${prj.id}`;
      project = prj;
      return prj;
    });
}
