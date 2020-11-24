/// <reference types="cypress" />

import { Resources } from '../../resources/ts/hooks/useResource';

context('project', () => {
  beforeEach(() => {
    cy.refreshDatabase();
  });

  it('append project_id as search param when add task without "project_id" param', () => {
    cy.visit('/');
    cy.location('search').should('equal', '');
    cy.get('.createTask').click();
    cy.wait(1000)
      .php<Resources['tasks']>(`App\\Models\\Task::first();`)
      .then((task) => {
        cy.location('search').should('contains', task.project_id);
      });
  });

  it('display tasks of the project which specified by "project_id" params', () => {
    const taskData = { title: 'テストタスク1', done: true };
    cy.create('App\\Models\\Task', 1, taskData);

    cy.php<Resources['tasks']>(`App\\Models\\Task::first();`).then((task) => {
      cy.visit(`/?project_id=${task.project_id}`);
      cy.get('li[data-task-id]').should(($li) => {
        expect($li).to.have.length(1);
        expect($li).contain(taskData.title);
      });

      cy.visit('/');
      cy.wait(1000).get('li[data-task-id]').should('not.exist');
    });
  });
});
