describe('Funcionalidad Solicitudes', () => {
  it('TC - HP - 003 - 01 - Crear solicitud como adoptante', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('vickilizarraga2210@gmail.com')
    cy.get('#password').type('123456')
    cy.get('.card > :nth-child(5)').click()

    cy.get(':nth-child(1) > .card > .card-body > .btn')
      .scrollIntoView()
      .should('be.visible')
      .click();
       cy.get('.btn-primary')
      .should('be.visible')
      .click();
    cy.get('.btn-secondary')
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.scrollTo('top')
    cy.contains('Solicitud enviada con éxito. ¡Gracias!').should('be.visible')

    cy.get(':nth-child(1) > .card > .card-body > .btn')
      .scrollIntoView()
      .should('be.visible')
      .click();
       cy.get('.btn-primary')
      .should('be.visible')
      .click();
    cy.get('.btn-secondary')
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.scrollTo('top')
    cy.contains('Solicitud enviada con éxito. ¡Gracias!').should('be.visible')

    
  });

  it('TC - HP - 003 - 02 - Ver mis solicitudes como adoptante', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('vickilizarraga2210@gmail.com')
    cy.get('#password').type('123456')
    cy.get('.card > :nth-child(5)').click()
    
    cy.get('.MuiToolbar-root > .MuiButtonBase-root', { timeout: 10000 })
      .should('be.visible')
      .click();
      cy.get('.MuiList-root > :nth-child(2)')
      .should('be.visible')
      .click()
    cy.contains('Chimuelo').should('be.visible')


  });

  it('TC - HP - 003 - 03 - Ver las solicitudes como refugio', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('patorjuarezstordeur@gmail.com')
    cy.get('#password').type('pato123')
    cy.get('.card > :nth-child(5)').click()
    
    cy.get('.MuiToolbar-root > .MuiButtonBase-root', { timeout: 10000 })
      .should('be.visible')
      .click();
      cy.get('.MuiList-root > :nth-child(2)')
      .should('be.visible')
      .click()
    cy.contains('Solicitudes recibidas')
    .scrollIntoView()
    .should('be.visible')


  });


  it('TC - HP - 003 - 04 - Aceptar una solicitud como refugio', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('patorjuarezstordeur@gmail.com')
    cy.get('#password').type('pato123')
    cy.get('.card > :nth-child(5)').click()
    
    cy.get('.MuiToolbar-root > .MuiButtonBase-root', { timeout: 10000 })
      .should('be.visible')
      .click();
      cy.get('.MuiList-root > :nth-child(2)')
      .should('be.visible')
      .click()
    cy.get('.mt-2 > .btn-success', { timeout: 10000 }).first()
  .scrollIntoView()
  .should('be.visible')
  cy.get('.mt-2 > .btn-success').first().click()
  
  cy.get('.ms-2').contains('aprobada').should('be.visible');

  });

  it('TC - HP - 003 - 05 - Rechazar una solicitud como refugio', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('patorjuarezstordeur@gmail.com')
    cy.get('#password').type('pato123')
    cy.get('.card > :nth-child(5)').click()
    
    cy.get('.MuiToolbar-root > .MuiButtonBase-root', { timeout: 10000 })
      .should('be.visible')
      .click();
      cy.get('.MuiList-root > :nth-child(2)')
      .should('be.visible')
      .click()
    cy.get('.btn-danger').first().scrollIntoView()
  .should('be.visible')
  cy.get('.btn-danger').first().click()
  cy.get('.ms-2').contains('rechazada').should('be.visible');
  });


  });
