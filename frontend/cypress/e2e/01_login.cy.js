describe('TC-AUTO-01: Login Functionality', () => {

  beforeEach(() => {
    cy.visit('/login')
  })

  // TEST 1: Successful login redirects to home
  it('TC-AUTO-01a: Valid credentials log in the user and redirect to home', () => {
    cy.fixture('users').then((users) => {
      cy.get('[name="email"]').type(users.patient.email)
      cy.get('[name="password"]').type(users.patient.password)
      cy.get('button[type="submit"]').click()

      // After login, app navigates to '/' (Home)
      cy.url().should('eq', Cypress.config().baseUrl + '/')

      // Token must be stored in localStorage
      cy.window().then((win) => {
        expect(win.localStorage.getItem('token')).to.not.be.null
        expect(win.localStorage.getItem('role')).to.eq('PATIENT')
      })
    })
  })

  // TEST 2: Wrong password shows error message
  it('TC-AUTO-01b: Wrong password shows error message and stays on login', () => {
    cy.fixture('users').then((users) => {
      cy.get('[name="email"]').type(users.patient.email)
      cy.get('[name="password"]').type('WrongPassword999')
      cy.get('button[type="submit"]').click()

      // Error message appears — it has bg-red-50 text-red-700 class
      cy.get('.bg-red-50.text-red-700').should('be.visible')

      // Must stay on login page
      cy.url().should('include', '/login')
    })
  })

})