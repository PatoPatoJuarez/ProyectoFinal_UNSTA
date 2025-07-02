describe('Funcionalidad Publicaciones', () => {
  it('TC - HP - 004 - 01 - Ver las publicaciones como refugio', () => {
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
    cy.contains('Mis publicaciones')
    .scrollIntoView()
    .should('be.visible')

    
  });

  it('TC - HP - 004 - 02 - Crear una publicacion como refugio', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('vic@gmail.com')
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
  cy.get('.d-flex.mb-3 > .btn')
      .should('be.visible')
      .click()
    cy.get(':nth-child(1) > .form-control').type('Bruno')
cy.get(':nth-child(2) > .form-control').type('Es muy amable y cariñoso')
cy.get('.form-select').select('Perro')
cy.get(':nth-child(4) > .form-control').type(7)
cy.get(':nth-child(5) > .form-control').type('Mediano')
cy.get(':nth-child(6) > .form-control').type('https://thumbs.dreamstime.com/z/perrito-lindo-40133793.jpg')
    
    cy.get('.btn-primary')
      .should('be.visible')
      .click()
cy.wait(1000)
    cy.contains('Bruno')
    .should('be.visible')
  });


it('TC - HP - 004 - 03 - Eliminar una publicacion como refugio', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('vic@gmail.com')
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
  cy.get('.card-body > .btn')
      .should('be.visible')
     .click()
    
    cy.contains('Bruno').should('not.exist')

  });

  });
