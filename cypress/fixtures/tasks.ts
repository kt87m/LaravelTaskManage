import { Resources } from '../../resources/ts/hooks/useResource';

export let task1: Resources['tasks'];
export let task2: Resources['tasks'];
export let queryString: string;
export function setupDb(): Cypress.Chainable<Resources['tasks'][]> {
  cy.refreshDatabase().seed('TaskSeeder');

  return cy.php<typeof task1[]>(`App\\Models\\Task::all();`).then((ts) => {
    [task1, task2] = ts;
    queryString = `?project_id=${task1.project_id}`;
    return ts;
  });
}
