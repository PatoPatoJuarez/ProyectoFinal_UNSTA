/// <reference types="cypress" />

describe("Testeamos el Login, llenando con campos vacios", () => {
    it('Login vacío', () => {
        cy.visit('http://localhost:5173');
        cy.get('[data-cy="btn-ingresar"]').click();
        cy.contains('Por favor, completá todos los campos.');
    });
});