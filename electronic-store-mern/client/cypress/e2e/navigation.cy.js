/// <reference types="cypress" />

describe('Navigation & Routing', () => {
  it('should load home page at /', () => {
    cy.visit('/');
    cy.get('.hero').should('be.visible');
  });

  it('should navigate to Products', () => {
    cy.visit('/');
    cy.contains('.navbar__link', 'Products').click();
    cy.wait('@getProducts');
    cy.url().should('include', '/products');
    cy.contains('All Products').should('be.visible');
  });

  it('should navigate to About', () => {
    cy.visit('/');
    cy.contains('.navbar__link', 'About').click();
    cy.url().should('include', '/about');
    cy.contains('About ElectroStore').should('be.visible');
  });

  it('should navigate to Contact', () => {
    cy.visit('/');
    cy.contains('.navbar__link', 'Contact').click();
    cy.url().should('include', '/contact');
    cy.contains('Get in Touch').should('be.visible');
  });

  it('should navigate to Account', () => {
    cy.visit('/');
    cy.contains('.navbar__link', 'Account').click();
    cy.url().should('include', '/account');
    cy.contains('Your Account').should('be.visible');
  });

  it('should navigate home via logo click', () => {
    cy.visit('/about');
    cy.get('.navbar__logo').click();
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
  });
});
