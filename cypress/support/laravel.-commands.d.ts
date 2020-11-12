/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    refreshDatabase(options?: { [p: string]: string | number | boolean }): this;

    create(model: string, times = null, attributes = {}): this;
    create(model: string, times: number): this;
    create(
      model: string,
      attributes: { [p: string]: string | number | boolean }
    ): this;
    create(
      model: string,
      times: number,
      attributes: { [p: string]: string | number | boolean }
    ): this;
  }
}
