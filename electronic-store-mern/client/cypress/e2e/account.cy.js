/// <reference types="cypress" />

describe('Account Page — Login & Register', () => {
  beforeEach(() => {
    cy.visit('/account');
  });

  it('should display Sign In tab by default', () => {
    cy.get('.auth-tab--active').should('contain', 'Sign In');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });

  it('should NOT show email field in login mode', () => {
    cy.get('input[name="email"]').should('not.exist');
  });

  it('should switch to Register tab', () => {
    cy.contains('.auth-tab', 'Register').click();
    cy.get('.auth-tab--active').should('contain', 'Register');
    cy.get('input[name="username"]').should('be.visible');
    cy.get('input[name="email"]').should('be.visible');
    cy.get('input[name="password"]').should('be.visible');
  });

  it('should toggle password visibility', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    cy.get('.auth-form__toggle-pw').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
  });

  it('should show error for invalid login', () => {
    // override stub to return an authentication error
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: { message: 'Invalid credentials' },
    }).as('badLogin');

    cy.get('input[name="username"]').type('nonexistentuser@test.com');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('.auth-form__submit').click();

    cy.wait('@badLogin');
    cy.get('.form-error', { timeout: 10000 }).should('be.visible');
  });

  it('should register a new user and redirect to profile', () => {
    const uniqueUser = `cypresstest_${Date.now()}`;

    // stubbed network ensures registration always succeeds
    cy.contains('.auth-tab', 'Register').click();
    cy.get('input[name="username"]').type(uniqueUser);
    cy.get('input[name="email"]').type(`${uniqueUser}@test.com`);
    cy.get('input[name="password"]').type('cypress123');
    cy.get('.auth-form__submit').click();

    // wait for stubbed API call to complete before asserting redirect
    cy.wait('@registerApi');
    cy.url({ timeout: 15000 }).should('include', '/profile');
  });

  it('should login with valid credentials', () => {
    // the username field is treated as email by the API, stubbed response
    cy.get('input[name="username"]').type('testuser@test.com');
    cy.get('input[name="password"]').type('password123');
    cy.get('.auth-form__submit').click();

    cy.wait('@loginApi');
    cy.url({ timeout: 15000 }).should('include', '/profile');
  });
});
