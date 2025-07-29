describe('Test e2e Hands and Paws', () => {
  
  describe('Funcionalidad Crear Cuenta', () => {
  it.only('TC - HP - 001 - 01 - Crear cuenta como adoptante', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.card > :nth-child(5)', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get('.btn-adoptante', { timeout: 10000 })
      .should('be.visible')
      .click();
  
    cy.get('#nombre').type('Victoria')
    cy.get('#apellido').type('Lizarraga')
    cy.get('#email').type('v@gmail.com')
    cy.get('#telefono').type('+543815600128')
    cy.get('#contrasena').type('123456')
    cy.get('#confirmacionContrasena').type('123456')
    cy.get('#localidad').select('Yerba Buena')

    cy.get('#tieneMascotaSi').click()
    cy.get('#casa').click()
    cy.get('#siHorarios').click()
    cy.get('#siMascota').click()
    cy.get('#motivoAdopcion').type('Me siento sola a veces')
    cy.get('#cuidadosVeterinarios').type('Los necesarios')
    cy.get('#cuidadoAlternativo').type('La dejaría en una guardería')
   
    cy.get('form > .btn', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.window().then((win) => {
    cy.stub(win, 'alert').as('alerta') })
       cy.get('@alerta').should('have.been.calledWith', 'Registro exitoso')
    
  });

  it('TC - HP - 001 - 02 - Crear cuenta como refugio', () => {
    cy.visit('http://localhost:5173/');
     cy.get('.card > :nth-child(5)', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get('.btn-refugio', { timeout: 10000 })
      .should('be.visible')
      .click();
    cy.get('#nombre').type('Victoria')
    cy.get('#apellido').type('Lizarraga')
    cy.get('#email').type('vic@gmail.com')
    cy.get('#telefono').type('+543815600128')
    cy.get('#contrasena').type('123456')
    cy.get('#confirmacionContrasena').type('123456')
   cy.get('#localidad').select('Yerba Buena')
    cy.get('#direccion').type('Country la Cañada')
cy.get('#tipoMascotaPerro').click()
cy.get('#tipoMascotaGato').click()
cy.get('#procesoAdopcion').type('Al recibir las solicitudes me contacto con el adoptante y coordinamos para ver como se lleva con la mascota y vemos si es apto para adoptarla')
cy.get('#tarifaAdopcion').type('Gratis')


   cy.get('#seguimientoAdopcion').select('Sí')
   cy.get('#necesidadesRefugio').type('Actualmente necesitamos alimento y abrigo')

    cy.get('form > .btn').click()
    cy.window().then((win) => {
    cy.stub(win, 'alert').as('alerta')
  })
       cy.get('@alerta').should('have.been.calledWith', 'Registro exitoso') 
  });
  });


  describe('Funcionalidad Ingresar', () => {
  it('TC - HP - 002 - 01 - Ingresar como adoptante', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('vickilizarraga2210@gmail.com')
    cy.get('#password').type('123456')
    cy.get('.card > :nth-child(5)').click()
    
    cy.window().then((win) => {
    cy.stub(win, 'alert').as('alerta')
  })
       cy.get('@alerta').should('have.been.calledWith', 'Bienvenido/a, Victoria') 

    
  });

  it('TC - HP - 002 - 02 - Ingresar como refugio', () => {
    cy.visit('http://localhost:5173/');
    cy.get('.card > :nth-child(4)', { timeout: 10000 })
      .should('be.visible')
      .click();

    cy.get('#email').type('vic@gmail.com')
    cy.get('#password').type('123456')
    cy.get('.card > :nth-child(5)').click()
    
    cy.window().then((win) => {
    cy.stub(win, 'alert').as('alerta')
  })
       cy.get('@alerta').should('have.been.calledWith', 'Bienvenido/a, Victoria') 

  });
  });



});





