describe('TC-AUTO-10: Logout Functionality', () => {

  it('TC-AUTO-10a: User logs out successfully', () => {

    cy.loginAs('patient')

    cy.visit('/')

    cy.contains('Logout').click()

    // Verify token removed
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null
    })

    // Verify user sees login option again
    cy.contains(/login|sign in/i)
      .should('be.visible')
  })

  it('TC-AUTO-10b: Logged out user cannot access protected route', () => {

    cy.loginAs('patient')

    cy.contains('Logout').click()

    cy.visit('/book-appointment')

    // User should be redirected to login
    cy.url()
      .should('include', '/login')

    cy.contains(/login/i)
      .should('be.visible')
  })

})