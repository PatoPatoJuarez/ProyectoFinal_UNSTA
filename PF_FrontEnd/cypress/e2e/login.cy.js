/// <reference types="cypress" />

describe('Pruebas E2E - Login Valido', () => {
    
    it('Login adoptante (válido)', () => {
        cy.visit('http://localhost:5173/');
        cy.get('[data-cy="input-email"]').type('daniel.sosa@gmail.com');
        cy.get('[data-cy="input-password"').type('sosa12345');
        cy.get('[data-cy="btn-ingresar"]').click();
        cy.on('window:alert', mensaje => {
            expect(mensaje).to.equal('Bienvenido/a, Daniel');
        });
    });
});