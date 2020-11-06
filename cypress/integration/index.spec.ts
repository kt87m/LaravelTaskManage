/// <reference types="cypress" />

context('top page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('list sample task', () => {
    cy.get('li').should(($li) => {
      expect($li).to.have.length(2);
      expect($li).contain('テストタスク');
    });
  });

  it('can transition to task detail', () => {
    cy.get('[data-task-id="1"] .linkToDetail').click();
    cy.url().should('include', '/tasks/1');
  });
});

context('task detail page', () => {
  it('display specified task', () => {
    cy.visit('/tasks/1')
      .get('.taskTitle input')
      .should('has.value', 'テストタスク');
    cy.visit('/tasks/2')
      .get('.taskTitle input')
      .should('has.value', 'テストタスク2');
  });
});

context('update task state globaly', () => {
  it('toggle task execution state', () => {
    cy.visit('/');
    cy.get('[data-task-id="1"] input[type="checkbox"]')
      .as('checkbox')
      .check()
      .should('have.attr', 'checked');

    cy.visit('/tasks/1');
    cy.get('input[type="checkbox"]')
      .as('checkbox_detail')
      .should('have.attr', 'checked');
    cy.get('@checkbox_detail').uncheck();

    cy.visit('/');
    cy.get('@checkbox').should('not.have.attr', 'checked');
  });

  it('change task title', () => {
    cy.visit('/tasks/1');
    cy.get('.taskTitle input')
      .type('タイトル変更')
      .screenshot('task_title_typed');

    cy.visit('/');
    cy.get('[data-task-id="1"]')
      .contains('タイトル変更')
      .screenshot('task_title_changed_in_top_page');
  });
});
