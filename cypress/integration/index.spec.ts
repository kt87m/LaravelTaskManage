/// <reference types="cypress" />

it('response 200', () => {
  cy.visit('/');
  cy.get('li').should(($li) => {
    expect($li).to.have.length(2);
    expect($li).contain('テストタスク');
  });
});
