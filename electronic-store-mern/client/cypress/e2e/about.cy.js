/// <reference types="cypress" />

describe('About Page', () => {
  beforeEach(() => {
    cy.visit('/about');
  });

  it('should display the page hero', () => {
    cy.contains('About ElectroStore').should('be.visible');
    cy.get('.page-hero__label').should('contain', 'Our Story');
  });

  it('should display the company story section', () => {
    cy.contains('Who We Are').should('be.visible');
    cy.get('.about-story__image img').should('be.visible');
  });

  it('should display stats section', () => {
    // scroll to force animations to trigger
    cy.get('.stat-card').should('have.length', 4).each(($el) => {
      cy.wrap($el).scrollIntoView().should('be.visible');
    });
    cy.contains('15+').scrollIntoView().should('be.visible');
    cy.contains('Happy Customers').scrollIntoView().should('be.visible');
  });

  it('should display values section', () => {
    cy.get('.about-values').should('exist');
  });

  it('should display team members', () => {
    cy.get('.team-card, .about-team').should('exist');
  });
});
