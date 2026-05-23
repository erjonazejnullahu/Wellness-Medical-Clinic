describe('TC-AUTO-08: Patient Books Appointment', () => {

  beforeEach(() => {
    cy.loginAs('patient')
  })

  it('TC-AUTO-08a: Patient fills form, selects doctor and books appointment', () => {

    cy.intercept('GET', '**/api/doctors/availability*').as('getDoctors')

    cy.visit('/book-appointment')

    // Dynamic future date
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 7)

    const formattedDate = futureDate.toISOString().split('T')[0]

    cy.get('input[type="date"]').type(formattedDate)

    cy.get('input[type="time"]').type('10:00')

    // Wait for API
    cy.wait('@getDoctors')

    // Select real available doctor
    cy.get('select option', { timeout: 10000 })
      .should('exist')
      .then(($options) => {

        const options = [...$options]

        const validDoctors = options.filter(option =>
          option.value !== '' &&
          !option.disabled &&
          !option.text.includes('Choose a doctor') &&
          !option.text.includes('No doctors available') &&
          !option.text.includes('Loading')
        )

        expect(validDoctors.length).to.be.greaterThan(0)

        cy.get('select').select(validDoctors[0].value)
      })

    // Fill form
    cy.get('input[placeholder*="General checkup"]')
      .type('General checkup visit')

    cy.get('textarea')
      .type('No additional notes.')

    // Submit
    cy.contains('button', 'Request Appointment')
      .click()

    // Verify success
    cy.contains('successfully', { timeout: 10000 })
      .should('be.visible')
  })

})