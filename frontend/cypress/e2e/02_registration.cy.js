describe('TC-AUTO-02: Patient Registration', () => {

  beforeEach(() => {
    cy.visit('/register')
  })

  // TEST 3: Successful registration with all valid fields
  it('TC-AUTO-03: Valid registration data creates account and redirects to login', () => {
    const uniqueEmail = `patient_${Date.now()}@test.com`

    cy.get('[name="first_name"]').type('Ana')
    cy.get('[name="last_name"]').type('Krasniqi')
    cy.get('[name="email"]').type(uniqueEmail)
    cy.get('[name="password"]').type('Test@1234')
    cy.get('[name="date_of_birth"]').type('1995-05-15')
    cy.get('[name="gender"]').type('Female')        // ← FIXED: type() not select()
    cy.get('[name="phone"]').type('044123456')
    cy.get('[name="insurance_info"]').type('INS-2024-001')
    cy.get('button[type="submit"]').click()

    // Success message appears
    cy.get('.bg-green-50.text-green-700')
      .should('be.visible')
      .and('contain', 'Registration successful')

    // After 2 seconds the app redirects to /login
    cy.url().should('include', '/login', { timeout: 5000 })
  })

  // TEST 4: Submitting empty form shows validation errors
  it('TC-AUTO-04: Empty form submission shows required field errors', () => {
    cy.get('button[type="submit"]').click()

    cy.get('.bg-red-50.text-red-700')
      .should('be.visible')
      .and('contain', 'Please correct the highlighted fields')

    cy.contains('First Name is required.').should('be.visible')
    cy.contains('Last Name is required.').should('be.visible')
    cy.contains('Email Address is required.').should('be.visible')
    cy.contains('Password is required.').should('be.visible')

    cy.url().should('include', '/register')
  })

})