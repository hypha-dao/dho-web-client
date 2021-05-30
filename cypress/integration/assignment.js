describe('Assignments', () => {
  it('login and assign to a Role', () => {
    cy.visit('http://localhost:8080/#/login')

    cy.contains('Login here.').click();

    cy.contains('LOGIN WITH KEY').click();

    cy.get('input[aria-label="Account"]').type("johnnyhypha1");

    cy.get('input[aria-label="Private key"]').type("5HwnoWBuuRmNdcqwBzd1LABFRKnTk2RY2kUMYKkZfF8tKodubtK");

    cy.contains('Login').click();

    // Should be on the Dashboard
    cy.url().should('include', '/dashboard')

    // Submit assignment

    cy.get('i[class*="fa-bars"]').click();

    cy.get('a[href="#/documents/role"]').click();

    //cy.wait(3000)

    cy.get('div[class*="q-card__actions"]').contains('Apply').click();

    cy.get('[contenteditable]').type("{selectall}Assignment text");

    cy.get('input[aria-label="URL Link"]').type("https://www.google.com/");

    cy.get('input[aria-label="Committed"]').type("10");

    cy.get('input[aria-label="Deferred"]').type("100");

    cy.get('input[aria-label="Number of periods"]').type("1");

    let now = new Date();
    let year = now.getFullYear();
    let month = now.getMonth()+1;
    let day = now.getDate();

    cy.get('input[aria-label="Start phase"]').type(`${year}/${month}/${day}`);

    cy.contains('Save draft').click();  

    cy.contains('Propose').click();

    cy.contains('Yes').click();

    cy.contains('Transaction processing, please refresh screen.').should('be.visible');

    // Get an input, type into it and verify that the value has been updated
    // cy.get('.action-email')
    //   .type('fake@email.com')
    //   .should('have.value', 'fake@email.com')
  })
})