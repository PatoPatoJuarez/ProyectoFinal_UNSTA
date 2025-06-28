/// <reference types="cypress" />

describe("Testeo el Registro de la app", () => {
    it("Registro completo valido", () => {
        cy.visit('http://localhost:5173/');
        cy.get('[data-cy="btn-crear"]').click();
        cy.get("[data-cy='cuenta-refugio']").click();
        
        // Ingresamos al formulario Refugio:
        cy.get("#nombre") // Nombre
            .type("Alejandro");
        cy.get("#apellido") // Apellido
            .type("Gonzalez Teseyra");
        cy.get("#email") // Email
            .type("correoPrueba@yahoo.com");
        cy.get("#telefono") // Telefono
            .type("+543815786038");
        cy.get("#contrasena") // Contraseña
            .type("12345ale");
        cy.get("#confirmacionContrasena") // Contraseña
            .type("12345ale");
        cy.get("#localidad").select("Yerba Buena"); // Localidad Select
        cy.get("#direccion") // Direccion
            .type("Av Aconquija 1000");
        cy.get("#tipoMascotaGato").check(); // Checkbox
        cy.get("#procesoAdopcion") // Proceso adopcion
            .type("Texto de prueba...");
        cy.get("#tarifaAdopcion") // Tarifa
            .type("0");
        cy.get("#seguimientoAdopcion").select("No"); // Select
        cy.get("#necesidadesRefugio") // Necesidades
            .type("Texto de prueba...");

        cy.get("[type='submit']").click(); // Btn Submit
        // cy.on('window:alert', mensaje => { // alert("Registro exitoso");
        //     expect(mensaje).to.equal('Registro exitoso');
        // });

        cy.wait(2000);

        // En el Login page
        cy.get('[data-cy="boton-volver"]').click();
        cy.get('[data-cy="input-email"]')
            .type("correoPrueba@yahoo.com");
        cy.get('[data-cy="input-password"]')
            .type("12345ale");
        cy.get('[data-cy="btn-ingresar"]').click();

        // Verifacion que el usuario si esta en el MainPage
        cy.get('header [alt="Logo"]')
            .should("exist");
    });
});