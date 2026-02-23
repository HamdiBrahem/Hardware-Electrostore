/// <reference types="cypress" />

describe('Contact Page', () => {
  beforeEach(() => {
    cy.visit('/contact');
  });

  it('should display page header', () => {
    cy.contains('Get in Touch').should('be.visible');
    cy.get('.page-hero__label').should('contain', 'Reach Out');
  });

  it('should display contact info cards', () => {
    cy.get('.contact-info-card').should('have.length', 4);
    cy.contains('Address').should('exist');
    cy.contains('Phone').should('exist');
    cy.contains('Email').should('exist');
    cy.contains('Hours').should('exist');
  });

  it('should display contact form', () => {
    cy.contains('Send Us a Message').should('be.visible');
    cy.get('#name').should('be.visible');
    cy.get('#email').should('be.visible');
    cy.get('input[name="subject"], #subject').should('exist');
    cy.get('textarea[name="message"], #message').should('exist');
  });

  it('should show validation errors for empty form', () => {
    cy.get('.contact-form').find('button[type="submit"]').click();
    cy.get('.form-error').should('have.length.at.least', 1);
  });

  it('should submit contact form successfully', () => {
    cy.get('#name').type('Cypress Test User');
    cy.get('#email').type('cypress@test.com');
    cy.get('input[name="subject"], #subject').first().type('Test Subject from Cypress');
    cy.get('textarea[name="message"], #message').first().type('This is an automated test message from Cypress E2E testing.');

    cy.get('.contact-form').find('button[type="submit"]').click();

    cy.wait('@postContact');
    cy.contains('Message Sent!', { timeout: 10000 }).should('be.visible');
  });
});
