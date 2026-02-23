// ***********************************************************
// Global support file — loaded before every spec.
// ***********************************************************

// Take a screenshot only when a test fails to avoid timeouts and large artifacts
afterEach(function () {
  if (this.currentTest.state === 'failed') {
    const testTitle = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_');
    const specName = Cypress.spec.name.replace('.cy.js', '');
    cy.screenshot(`${specName}/${testTitle}`, { capture: 'fullPage' });
  }
});

// stub common API endpoints so specs can run without a live backend
beforeEach(() => {
  // product list used on home and cart pages; wrap fixture in envelope
  cy.fixture('products.json').then((prods) => {
    cy.intercept('GET', '/api/products', {
      statusCode: 200,
      body: { success: true, data: prods },
    }).as('getProducts');

    // stub single product request by returning first item
    cy.intercept('GET', '/api/products/*', {
      statusCode: 200,
      body: { success: true, data: prods[0] },
    }).as('getProduct');
  });
  // contact submission
  cy.intercept('POST', '/api/contact', {
    statusCode: 200,
    body: { message: 'Message Sent!' },
  }).as('postContact');

  // auth endpoints just return a fake token and echo the submitted data
  cy.intercept('POST', '/api/auth/register', (req) => {
    req.reply({
      statusCode: 200,
      body: {
        data: {
          token: 'fake-jwt-token',
          user: { ...req.body },
        },
      },
    });
  }).as('registerApi');
  cy.intercept('POST', '/api/auth/login', (req) => {
    req.reply({
      statusCode: 200,
      body: {
        data: {
          token: 'fake-jwt-token',
          user: { email: req.body.email },
        },
      },
    });
  }).as('loginApi');
});

// Custom command: login via API (fast, no UI)
Cypress.Commands.add('loginViaApi', (email, password) => {
  cy.request('POST', '/api/auth/login', { email, password }).then((resp) => {
    window.localStorage.setItem('token', resp.body.data.token);
  });
});

// Custom command: register + login via API
Cypress.Commands.add('registerViaApi', (userData) => {
  cy.request('POST', '/api/auth/register', userData).then((resp) => {
    window.localStorage.setItem('token', resp.body.data.token);
  });
});
