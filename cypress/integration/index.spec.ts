/// <reference types="cypress" />

function setupDb() {
  cy.refreshDatabase()
    .create('App\\Models\\Task', 1, { title: 'テストタスク', done: true })
    .create('App\\Models\\Task', 1, { title: 'テストタスク2', done: false });
}

context('top page', () => {
  beforeEach(() => {
    setupDb();
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
  beforeEach(() => {
    setupDb();
  });

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
  beforeEach(() => {
    setupDb();
  });

  it('toggle task execution state', () => {
    cy.visit('/');
    cy.get('[data-task-id="1"] input[type="checkbox"]')
      .as('checkbox')
      .check()
      .should('be.checked');

    cy.visit('/tasks/1');
    cy.wait(500) // wait task loading
      .get('input[type="checkbox"]')
      .as('checkbox_detail')
      .should('be.checked');
    cy.get('@checkbox_detail').uncheck();

    cy.visit('/');
    cy.get('@checkbox').should('not.be.checked');
  });

  it('change task title', () => {
    cy.visit('/tasks/1');
    cy.get('.taskTitle input')
      .clear()
      .type('タイトル変更')
      .screenshot('task_title_typed')
      .wait(500); // wait task updating

    cy.visit('/');
    cy.get('[data-task-id="1"]')
      .contains('タイトル変更')
      .screenshot('task_title_changed_in_top_page');
  });
});

context('create new task', () => {
  beforeEach(() => {
    setupDb();
    cy.visit('/');
  });

  it('create new task with title placeholder "名称未設定タスク"', () => {
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
    cy.visit('/tasks/1');
  });

  it('delete specified task', () => {
    cy.get('.deleteTask').click();
    cy.wait(1000) // wait task deleting
      .location('pathname')
      .should('eq', '/');
    cy.get('li').should(($li) => {
      expect($li).to.have.length(1);
      expect($li).contain('テストタスク2');
    });
  });
});
