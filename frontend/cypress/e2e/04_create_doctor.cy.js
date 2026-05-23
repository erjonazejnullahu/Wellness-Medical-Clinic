describe('TC-AUTO-07: Admin Creates Doctor Account', () => {

  beforeEach(() => {
    cy.loginAs('admin')
  })

  // TEST 7: Admin fills in form and creates a new doctor
  it('TC-AUTO-07: Admin successfully creates a new doctor account', () => {
    cy.visit('/create-doctor')

    const uniqueEmail = `dr.test_${Date.now()}@klinika.com`

    cy.get('[name="first_name"]').type('Bekim')
    cy.get('[name="last_name"]').type('Berisha')
    cy.get('[name="email"]').type(uniqueEmail)
    cy.get('[name="password"]').type('Doctor@123')
    cy.get('[name="specialization"]').type('Cardiology')
    cy.get('[name="license_number"]').type('LIC-2024-789')
    cy.get('[name="years_of_experience"]').type('10')
    cy.get('button[type="submit"]').click()

    // Success message appears
    cy.get('.bg-green-50.text-green-700')
      .should('be.visible')
      .and('contain', 'Doctor account created successfully')

    // After 1 second redirects to /doctors-dashboard
    cy.url().should('include', '/doctors-dashboard', { timeout: 5000 })
  })

})