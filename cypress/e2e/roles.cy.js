describe('Roles', () => {
  it('login and create a Role', () => {
    cy.visit('http://localhost:8080/#/login')

    cy.contains('Login here.').click()

    cy.contains('LOGIN WITH KEY').click()

    cy.get('input[aria-label="Account"]').type('johnnyhypha1')

    cy.get('input[aria-label="Private key"]').type('5HwnoWBuuRmNdcqwBzd1LABFRKnTk2RY2kUMYKkZfF8tKodubtK')

    cy.contains('Login').click()

    // Should be on the Dashboard
    cy.url().should('include', '/dashboard')

    // Create Role

    cy.get('i[class*="fa-plus"]').first().click()

    cy.get('input[aria-label="Title"]').type('Test Role')

    cy.get('[contenteditable]').type('{selectall}Role text')

    cy.get('input[aria-label="URL Link"]').type('https://www.google.com/')

    cy.get('input[aria-label="Min. hypha"]').type('20')

    cy.get('i[class*="fa-caret-down"]').first().click()

    cy.contains('B1').click()

    cy.get('input[aria-label="ROLE CAP"]').type('1')

    cy.contains('Save draft').click()

    cy.contains('Propose').click()

    cy.contains('Yes').click()

    cy.contains('Transaction processing, please refresh screen.').should('be.visible')
  })

  it('login and approve a Role', () => {
    cy.visit('http://localhost:8080/#/login')

    cy.contains('Login here.').click()

    cy.contains('LOGIN WITH KEY').click()

    cy.get('input[aria-label="Account"]').type('johnnyhypha1')

    cy.get('input[aria-label="Private key"]').type('5HwnoWBuuRmNdcqwBzd1LABFRKnTk2RY2kUMYKkZfF8tKodubtK')

    cy.contains('Login').click()

    // Should be on the Dashboard
    cy.url().should('include', '/dashboard')

    // Approve

    cy.get('i[class*="fa-bars"]').click()

    cy.contains('Endorse Role').click()

    cy.contains('Yes').last().click()

    cy.contains('Transaction processing, please refresh screen.').should('be.visible')
  })
})
