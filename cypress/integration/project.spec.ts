/// <reference types="cypress" />

import { Resources } from '../../resources/ts/hooks/useResource';
import { /* task1, task2, */ queryString, setupDb } from '../fixtures/tasks';

context('project', () => {
  beforeEach(() => {
    cy.refreshDatabase();
  });

  it('show message to start project when access without "project_id" param', () => {
    cy.visit('/').contains('タスクを追加してプロジェクトを開始');
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

context('Preserve project', () => {
  beforeEach(() => {
    setupDb();
  });

  it('show message that project is unpreserved and button to preserve when access with `project_id` param', () => {
    cy.visit(`/${queryString}`).contains('未保存のプロジェクト');
    cy.get('button.preserveProject');
  });

  it('show initial project name when project is preserved', () => {
    cy.visit(`/${queryString}`);
    cy.get('button.preserveProject').click();
    cy.wait(1000);
    cy.get('button.preserveProject').should('not.exist');
    cy.contains('新しいプロジェクト');
  });
});
