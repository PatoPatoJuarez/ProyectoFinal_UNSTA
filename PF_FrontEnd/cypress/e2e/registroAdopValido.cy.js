/// <reference types="cypress" />

describe("Testeo el Registro de la app", () => {
    it("Registro completo valido", () => {
        cy.visit('http://localhost:5173/');
        cy.get('[data-cy="btn-crear"]').click();
        cy.get("[data-cy='cuenta-adoptante']").click();
        
        // Ingresamos al formulario Adoptante:
        cy.get("#nombre") // Nombre
            .type("Alejandro");
        cy.get("#apellido") // Apellido
            .type("Gonzalez Teseyra");
        cy.get("#email") // Email
            .type("emailPrueba@gmail.com");
        cy.get("#telefono") // Telefono
            .type("+543815786038");
        cy.get("#contrasena") // Contraseña
            .type("ale12345");
        cy.get("#confirmacionContrasena") // Contraseña
            .type("ale12345");
        cy.get("#localidad").select("Yerba Buena"); // Localidad Select
        cy.get("#tieneMascotaSi").check(); // Checkbox
        cy.get("#casa").check(); // Checkbox
        cy.get("#siHorarios").check(); // Checkbox
        cy.get("#siMascota").check(); // Checkbox
        cy.get("#motivoAdopcion").type("Texto de prueba..."); // Textarea
        cy.get("#cuidadosVeterinarios").type("Texto de prueba..."); // Textarea
        cy.get("#cuidadoAlternativo").type("Texto de prueba..."); // Textarea

        cy.get("[type='submit']").click(); // Btn Submit
        // cy.on('window:alert', mensaje => { // alert("Registro exitoso");
        //     expect(mensaje).to.equal('Registro exitoso');
        // });

        cy.wait(2000);

        // // En el Login page
        cy.get('[data-cy="boton-volver"]').click();
        cy.get('[data-cy="input-email"]')
            .type("emailPrueba@gmail.com");
            // .type("daniel.sosa@gmail.com");
        cy.get('[data-cy="input-password"]')
            .type("ale12345");
            // .type("sosa12345");
        cy.get('[data-cy="btn-ingresar"]').click();
        // cy.on('window:alert', mensaje => {
        //     expect(mensaje).to.equal('Bienvenido/a, Alejandro');
        // });
        cy.get('header [alt="Logo"]')
            .should("exist");
    });
});