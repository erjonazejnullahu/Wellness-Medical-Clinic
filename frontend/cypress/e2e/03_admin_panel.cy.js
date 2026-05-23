describe('TC-AUTO-05: Admin Panel Access Control', () => {

  // TEST 5: Admin can access the admin panel
  it('TC-AUTO-05a: Admin user can access /adminpanel', () => {
    cy.loginAs('admin')
    cy.visit('/adminpanel')

    // Admin Panel heading must be visible
    cy.contains('h1', 'Admin Panel').should('be.visible')

    // The three management cards must be present
    cy.contains('Doctor Management').should('be.visible')
    cy.contains('Patient Management').should('be.visible')
    cy.contains('Pharmacy / Inventory').should('be.visible')
  })

  // TEST 6: Non-admin (patient) is redirected away from admin panel
  it('TC-AUTO-05b: Patient role cannot access /adminpanel and gets redirected', () => {
    cy.loginAs('patient')
    cy.visit('/adminpanel')

    // AdminPanel.js redirects non-admins to '/'
    cy.url().should('eq', Cypress.config().baseUrl + '/')

    // Admin Panel heading must NOT be on screen
    cy.contains('h1', 'Admin Panel').should('not.exist')
  })

})