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
    cy.get('.linkToDetail[data-task-id="1"]').click();
    cy.url().should('include', '/tasks/1');
  });
});

context('task detail page', () => {
  it('display specified task', () => {
    cy.visit('/tasks/1').contains('.taskTitle', 'テストタスク');
    cy.visit('/tasks/2').contains('.taskTitle', 'テストタスク2');
  });
});
