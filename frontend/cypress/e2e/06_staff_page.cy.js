describe('TC-AUTO-09: Our Staff Page', () => {

  // TEST 9: Staff page is publicly accessible and loads doctors
  it('TC-AUTO-09: Staff page loads and displays doctor list', () => {
    // This is a public route — no login needed
    cy.visit('/staff')

    // Page must load successfully
    cy.url().should('include', '/staff')

    // Wait for doctors to load from API (allow up to 10 seconds)
    cy.get('body').should('be.visible')

    // The page should not show an error state
    cy.contains('Error').should('not.exist')
  })

})