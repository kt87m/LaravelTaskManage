/// <reference types="cypress" />

import { task1, task2, queryString, setupDb } from '../fixtures/serverResource';

context('top page', () => {
  beforeEach(() => {
    setupDb();
  });

  it('list sample task', () => {
    cy.visit(`/${queryString}`);
    cy.get('li').should(($li) => {
      expect($li).to.have.length(2);
      expect($li).contain(task1.title);
    });
  });

  it('can transition to task detail', () => {
    cy.visit(`/${queryString}`);
    cy.get(`[data-task-id="${task1.id}"] .linkToDetail`).click();
    cy.url().should('include', `/tasks/${task1.id}`);
  });
});

context('task detail page', () => {
  beforeEach(() => {
    setupDb();
  });

  it('require "project_id" param', () => {
    cy.visit(`/tasks/${task1.id}`)
      .wait(1000)
      .contains('URLにプロジェクトIDが含まれていません');
    cy.visit(`/tasks/${task1.id}${queryString}`)
      .get('.taskTitle input')
      .should('has.value', task1.title);
  });

  it('display specified task', () => {
    cy.visit(`/tasks/${task1.id}${queryString}`)
      .get('.taskTitle input')
      .should('has.value', task1.title);
    cy.visit(`/tasks/${task2.id}${queryString}`)
      .get('.taskTitle input')
      .should('has.value', task2.title);
  });
});

context('update task state globaly', () => {
  beforeEach(() => {
    setupDb();
  });

  it('toggle task execution state', () => {
    cy.visit(`/${queryString}`);
    cy.get(`[data-task-id="${task1.id}"] input[type="checkbox"]`)
      .as('checkbox')
      .check()
      .should('be.checked');

    cy.visit(`/tasks/${task1.id}${queryString}`);
    cy.wait(500) // wait task loading
      .get('input[type="checkbox"]')
      .as('checkbox_detail')
      .should('be.checked');
    cy.get('@checkbox_detail').uncheck().should('not.be.checked');

    cy.visit(`/${queryString}`);
    cy.get('@checkbox').should('not.be.checked');
  });

  it('change task title', () => {
    cy.visit(`/tasks/${task1.id}${queryString}`);
    cy.get('.taskTitle input').clear().type('タイトル変更').wait(1000); // wait task updating

    cy.visit(`/${queryString}`);
    cy.get(`[data-task-id="${task1.id}"]`).contains('タイトル変更');
  });
});

context('create new task', () => {
  beforeEach(() => {
    setupDb();
  });

  it('create new task with title placeholder "名称未設定タスク"', () => {
    cy.visit(`/${queryString}`);
    cy.get('.createTask').click();
    cy.wait(1000) // wait task creating
      .get('li')
      .should(($li) => {
        expect($li).to.have.length(3);
        expect($li).contain('名称未設定タスク');
      });
  });
});

context('delete task', () => {
  beforeEach(() => {
    setupDb();
  });

  it('delete specified task', () => {
    cy.visit(`/tasks/${task1.id}${queryString}`);
    cy.get('.deleteTask').click();
    cy.wait(1000) // wait task deleting
      .location('pathname')
      .should('eq', `/`);
    cy.location('search').should('eq', `${queryString}`);
    cy.get('li').should(($li) => {
      expect($li).to.have.length(1);
      expect($li).contain(task2.title);
    });
  });
});
