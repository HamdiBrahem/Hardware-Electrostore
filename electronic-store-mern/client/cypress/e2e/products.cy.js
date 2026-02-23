/// <reference types="cypress" />

describe('Products Page', () => {
  beforeEach(() => {
    cy.visit('/products');
  });

  it('should display the page header', () => {
    cy.contains('All Products').should('be.visible');
    cy.contains('Browse our full catalog').should('be.visible');
  });

  it('should display product cards', () => {
    cy.get('.product-card', { timeout: 15000 }).should('have.length.at.least', 1);
  });

  it('should display search input', () => {
    cy.get('.toolbar__search-input').should('be.visible');
  });

  it('should filter products by search', () => {
    cy.get('.product-card', { timeout: 15000 }).should('have.length.at.least', 1);
    cy.get('.toolbar__search-input').type('laptop');
    // after typing, only matching items should remain (fixture has one laptop item)
    cy.get('.product-card').should('have.length', 1);
    cy.get('.product-card').first().find('.product-card__name').should('contain.text', 'Laptop');
  });

  it('should filter by category tabs', () => {
    cy.get('.category-tab').should('have.length.at.least', 2);
    cy.get('.category-tab').eq(1).click();
    cy.get('.category-tab--active').should('have.length', 1);
  });

  it('should display sort dropdown', () => {
    cy.get('.toolbar__select').should('be.visible');
    cy.get('.toolbar__select').select('Price: Low to High');
  });

  it('should toggle grid and list view', () => {
    cy.get('.toolbar__view-btn').should('have.length', 2);
    cy.get('.toolbar__view-btn').eq(1).click(); // list view
    cy.get('.products-list').should('exist');
    cy.get('.toolbar__view-btn').eq(0).click(); // grid view
    cy.get('.products-grid').should('exist');
  });

  it('should navigate to product detail when clicking a product', () => {
    cy.get('.product-card', { timeout: 15000 }).first()
      .find('a[aria-label="View product"]')
      .click({ force: true });
    cy.url().should('match', /\/products\/.+/);
  });

  it('should show results count', () => {
    cy.get('.results-count').should('be.visible');
    cy.get('.results-count').should('contain', 'product');
  });
});
