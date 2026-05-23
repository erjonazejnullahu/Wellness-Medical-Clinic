// Custom command: logs in as any role and sets localStorage
// Usage: cy.loginAs('admin') or cy.loginAs('patient') or cy.loginAs('doctor')
Cypress.Commands.add('loginAs', (role) => {
  cy.fixture('users').then((users) => {
    const user = users[role]
    cy.visit('/login')
    cy.get('[name="email"]').type(user.email)
    cy.get('[name="password"]').type(user.password)
    cy.get('button[type="submit"]').click()
    // Wait for redirect away from login page
    cy.url().should('not.include', '/login')
  })
})