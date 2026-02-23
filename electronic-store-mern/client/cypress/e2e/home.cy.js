/// <reference types="cypress" />

describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display the hero section with heading', () => {
    cy.get('.hero__title').should('be.visible');
    cy.contains('Next-Gen').should('exist');
    cy.contains('Shop Now').should('be.visible');
  });

  it('should display the navigation bar with logo', () => {
    cy.get('.navbar__logo-text').should('contain', 'ElectroStore');
    cy.get('.navbar__link').should('have.length.at.least', 4);
  });

  it('should display perks section', () => {
    cy.get('.perk').should('have.length', 4);
    cy.contains('Free Shipping').should('be.visible');
    cy.contains('2 Year Warranty').should('be.visible');
  });

  it('should display categories section', () => {
    // scroll so animated headers become visible
    cy.contains('Shop by Category').scrollIntoView().should('be.visible');
    cy.get('.category-card').should('have.length', 3).each(($el) => cy.wrap($el).scrollIntoView());
  });

  it('should display featured products', () => {
    cy.contains('Top Picks for You').scrollIntoView().should('be.visible');
    cy.get('.product-card').should('have.length.at.least', 1).each(($el) => cy.wrap($el).scrollIntoView());
  });

  it('should display footer', () => {
    cy.get('footer').should('be.visible');
  });

  it('should navigate to Products page from Shop Now button', () => {
    cy.contains('Shop Now').click();
    // wait for products API stub to finish before asserting
    cy.wait('@getProducts');
    cy.url().should('include', '/products');
    cy.contains('All Products').should('be.visible');
  });

  it('should navigate to About page from Learn More button', () => {
    cy.contains('Learn More').click();
    cy.url().should('include', '/about');
  });
});
