/// <reference types="cypress" />

import { Resources } from '../../resources/ts/hooks/useResource';

context('top page', () => {
  beforeEach(() => {
    cy.refreshDatabase();
    cy.visit('/');
  });

  it('append project_id as search param when add task without "project_id" param', () => {
    cy.location('search').should('equal', '');
    cy.get('.createTask').click();
    cy.wait(1000)
      .php<Resources['tasks']>(`App\\Models\\Task::first();`)
      .then((task) => {
        cy.location('search').should('contains', task.project_id);
      });
  });
});
