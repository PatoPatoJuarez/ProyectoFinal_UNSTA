describe('Funcionalidad Solicitudes', () => {
  it.skip('TC - HP - 003 - 01 - Crear solicitud como adoptante', () => {
    cy.visit('https://handsandpaws.vercel.app/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('v@gmail.com')
    cy.get('#password').type('123456')
    cy.get('.card > :nth-child(5)').click()

    cy.get(':nth-child(1) > .card > .card-body > .btn')
      .scrollIntoView()
      .should('be.visible')
      .click();
       cy.get('.btn-primary')
  .scrollIntoView()
  .should('be.visible')
  .click();
  cy.contains('Solicitud enviada', { timeout: 10000 })
  .should('be.visible');

    
  });

  it.skip('TC - HP - 003 - 02 - Ver mis solicitudes como adoptante', () => {
    cy.visit('https://handsandpaws.vercel.app/');
    
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('v@gmail.com')
    cy.get('#password').type('123456')
    cy.get('.card > :nth-child(5)').click()
    
    
    cy.get('.MuiToolbar-root > .MuiButtonBase-root', { timeout: 10000 })
      .should('be.visible')
      .click();
      cy.get('.MuiList-root > :nth-child(2)')
      .should('be.visible')
      .click()

      cy.contains('Mis solicitudes')
    .scrollIntoView()
    .should('be.visible')


  });

  it.skip('TC - HP - 003 - 03 - Ver las solicitudes como refugio', () => {
    cy.visit('https://handsandpaws.vercel.app/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('vic1@gmail.com')
    cy.get('#password').type('123456')
    cy.get('.card > :nth-child(5)').click()
    
    cy.get('.MuiToolbar-root > .MuiButtonBase-root', { timeout: 10000 })
      .should('be.visible')
      .click();
      cy.get('.MuiList-root > :nth-child(2)')
      .should('be.visible')
      .click()
    cy.contains('Solicitudes de Adopción')
    .scrollIntoView()
    .should('be.visible')


  });


  it.skip('TC - HP - 003 - 04 - Aceptar una solicitud como refugio', () => {
    cy.visit('https://handsandpaws.vercel.app/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('vic1@gmail.com')
    cy.get('#password').type('123456')
    cy.get('.card > :nth-child(5)').click()
    
    cy.get('.MuiToolbar-root > .MuiButtonBase-root', { timeout: 10000 })
      .should('be.visible')
      .click();
      cy.get('.MuiList-root > :nth-child(2)')
      .should('be.visible')
      .click()
    cy.get('.btn.btn-success.btn-sm.me-2', { timeout: 10000 }).first()
  .scrollIntoView()
  .should('be.visible');

  
  cy.get('.btn.btn-success.btn-sm.me-2').first().click()
  
  cy.get('.badge.bg-success').contains('aprobada').should('be.visible');
  

  });

  it('TC - HP - 003 - 05 - Rechazar una solicitud como refugio', () => {
    cy.visit('https://handsandpaws.vercel.app/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('vic1@gmail.com')
    cy.get('#password').type('123456')
    cy.get('.card > :nth-child(5)').click()
    
    cy.get('.MuiToolbar-root > .MuiButtonBase-root', { timeout: 10000 })
      .should('be.visible')
      .click();
      cy.get('.MuiList-root > :nth-child(2)')
      .should('be.visible')
      .click()

    cy.get('.btn.btn-warning.btn-sm.me-2', { timeout: 10000 }).first()
  .scrollIntoView()
  .should('be.visible');

  cy.get('.btn.btn-warning.btn-sm.me-2').first().click()
  cy.get('.badge.bg-danger').contains('rechazada').should('be.visible');
  });


  });
