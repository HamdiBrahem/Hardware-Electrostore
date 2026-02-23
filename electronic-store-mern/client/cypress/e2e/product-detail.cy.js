/// <reference types="cypress" />

describe('Product Detail Page', () => {
  it('should display product details', () => {
    // Navigate from products list to first product detail
    cy.visit('/products');
    cy.get('.product-card', { timeout: 15000 }).first()
      .find('a[aria-label="View product"]')
      .click({ force: true });

    cy.url().should('match', /\/products\/.+/);
    cy.wait('@getProduct');
    cy.get('.product-detail, .product-detail-page', { timeout: 10000 }).should('exist');
  });

  it('should show product name and price', () => {
    cy.visit('/products');
    cy.get('.product-card', { timeout: 15000 }).first()
      .find('a[aria-label="View product"]')
      .click({ force: true });

    cy.wait('@getProduct');
    cy.get('h1, h2').should('have.length.at.least', 1);
    cy.contains('$').should('exist');
  });

  it('should have an Add to Cart button', () => {
    cy.visit('/products');
    cy.get('.product-card', { timeout: 15000 }).first()
      .find('a[aria-label="View product"]')
      .click({ force: true });

    cy.wait('@getProduct');
    cy.contains(/add to cart/i).should('exist');
  });
});
