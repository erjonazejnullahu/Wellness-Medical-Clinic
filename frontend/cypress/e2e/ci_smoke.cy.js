describe('CI Smoke Tests', () => {

  it('Home page loads', () => {
    cy.visit('/')
    cy.get('body').should('be.visible')
  })

  it('Login page loads with email and password fields', () => {
    cy.visit('/login')
    cy.get('[name="email"]').should('be.visible')
    cy.get('[name="password"]').should('be.visible')
    cy.get('button[type="submit"]').should('be.visible')
  })

  it('Register page loads with required fields', () => {
    cy.visit('/register')
    cy.get('[name="first_name"]').should('be.visible')
    cy.get('[name="last_name"]').should('be.visible')
    cy.get('[name="email"]').should('be.visible')
    cy.get('[name="password"]').should('be.visible')
  })

  it('Staff page is publicly accessible', () => {
    cy.visit('/staff')
    cy.get('body').should('be.visible')
    cy.url().should('include', '/staff')
  })

  it('About Us page is publicly accessible', () => {
    cy.visit('/aboutus')
    cy.get('body').should('be.visible')
    cy.url().should('include', '/aboutus')
  })

})