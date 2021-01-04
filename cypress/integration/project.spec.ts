/// <reference types="cypress" />

import { Resources } from '../../resources/ts/types/api';
import { project, setupDb } from '../fixtures/serverResource';

context('project', () => {
  beforeEach(() => {
    cy.refreshDatabase();
  });

  it('show message to start project when access without project id', () => {
    cy.visit('/').contains('タスクを追加してプロジェクトを開始');
  });

  it('append project id as path when add task without project id in path', () => {
    cy.visit('/');
    cy.get('.createTask').click();
    cy.wait(1000)
      .php<Resources['tasks']>(`App\\Models\\Task::first();`)
      .then((task) => {
        cy.location('pathname').should(
          'contains',
          `/projects/${task.project_id}`
        );
      });
  });

  it('display tasks of the project which specified by path', () => {
    const taskData = { title: 'テストタスク1', done: true };
    cy.create('App\\Models\\Task', 1, taskData);

    cy.php<Resources['tasks']>(`App\\Models\\Task::first();`).then((task) => {
      cy.visit(`/projects/${task.project_id}`);
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

  it('show message that project is unpreserved and button to preserve when access with project id', () => {
    cy.visit(`/projects/${project.id}`).contains('未保存のプロジェクト');
    cy.get('button.preserveProject');
  });

  it('show initial project name when project is preserved', () => {
    cy.visit(`/projects/${project.id}`);
    cy.get('button.preserveProject').click();
    cy.wait(1000);
    cy.get('button.preserveProject').should('not.exist');
    cy.get('.projectName').should('has.value', '新しいプロジェクト');
  });
});
