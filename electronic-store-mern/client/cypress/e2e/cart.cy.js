/// <reference types="cypress" />

describe('Cart Functionality', () => {
  beforeEach(() => {
    // visit products page and wait for global stubbed response
    cy.visit('/products');
    cy.wait('@getProducts');
    // Wait for product cards rendered from stubbed data
    cy.get('.product-card', { timeout: 15000 }).should('have.length.at.least', 1);
  });

  it('should add product to cart via Add to Cart button', () => {
    cy.get('.product-card__add-btn').first().click();
    cy.get('.navbar__cart-badge').should('contain', '1');
  });

  it('should open cart drawer', () => {
    cy.get('.product-card__add-btn').first().click();
    cy.get('.navbar__cart-btn').click();
    cy.get('.cart-drawer').should('be.visible');
  });

  it('should show added product in cart drawer', () => {
    cy.get('.product-card').first().find('.product-card__name').invoke('text').then((productName) => {
      cy.get('.product-card__add-btn').first().click();
      cy.get('.navbar__cart-btn').click();
      cy.get('.cart-drawer').should('contain', productName);
    });
  });

  it('should increment quantity for same product', () => {
    cy.get('.product-card__add-btn').first().click();
    cy.get('.product-card__add-btn').first().click();
    cy.get('.navbar__cart-badge').should('contain', '2');
  });

  it('should close cart drawer', () => {
    cy.get('.product-card__add-btn').first().click();
    cy.get('.navbar__cart-btn').click();
    cy.get('.cart-drawer').should('be.visible');
    cy.get('.cart-drawer__close, .cart-drawer__overlay').first().click({ force: true });
    cy.get('.cart-drawer').should('not.be.visible');
  });
});
