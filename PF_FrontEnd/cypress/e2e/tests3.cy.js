describe('Funcionalidad Publicaciones', () => {
  it.skip('TC - HP - 004 - 01 - Ver las publicaciones como refugio', () => {
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
    cy.contains('Mis publicaciones')
    .scrollIntoView()
    .should('be.visible')

    
  });

  it.skip('TC - HP - 004 - 02 - Crear una publicación como refugio', () => {
  cy.visit('https://handsandpaws.vercel.app/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('victoria@gmail.com')
    cy.get('#password').type('123456')
    cy.get('.card > :nth-child(5)').click()
    
    cy.get('.MuiToolbar-root > .MuiButtonBase-root', { timeout: 10000 })
      .should('be.visible')
      .click();
      cy.get('.MuiList-root > :nth-child(2)')
      .should('be.visible')
      .click()
      cy.contains('Mis publicaciones')
  .scrollIntoView()
  .should('be.visible');
  cy.get('.btn-2')
      .should('be.visible')
      .click()
    cy.get(':nth-child(1) > .form-control').type('Lolo')
cy.get(':nth-child(2) > .form-control').type('Es muy amable y cariñoso')
cy.get(':nth-child(3) > .form-select').select('Perro')
cy.get(':nth-child(4) > .form-control').type('7')
cy.get(':nth-child(5) > .form-select').select('si')
cy.get(':nth-child(6) > .form-select').select('macho')
cy.get(':nth-child(7) > .form-select').select('pequeño')
cy.get(':nth-child(8) > .form-control').type('https://thumbs.dreamstime.com/z/perrito-lindo-40133793.jpg')

    
   cy.get('.modal-footer > .btn-primary')
      .should('be.visible')
      .click()
cy.wait(10000)
    cy.contains('lolo')
    .should('be.visible')
    
  });


it.skip('TC - HP - 004 - 03 - Eliminar una publicacion como refugio', () => {
    cy.visit('https://handsandpaws.vercel.app/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('victoria@gmail.com')
    cy.get('#password').type('123456')
    cy.get('.card > :nth-child(5)').click()
    
    cy.get('.MuiToolbar-root > .MuiButtonBase-root', { timeout: 10000 })
      .should('be.visible')
      .click();
      cy.get('.MuiList-root > :nth-child(2)')
      .should('be.visible')
      .click()
      cy.contains('Mis publicaciones')
  .scrollIntoView()
  .should('be.visible');
  cy.get(':nth-child(1) > .card > .card-body > .d-flex > .btn-danger')
      .should('be.visible')
     .click()
    
    cy.contains('lolo').should('not.exist')

  });
  

  });
