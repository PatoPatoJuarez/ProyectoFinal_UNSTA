/// <reference types="cypress" />

describe('Probamos el Login', () => {
    it('Login inválido (contraseña incorrecta)', () => {
        cy.visit('http://localhost:5173');
        cy.get('[data-cy="input-email"').type('daniel.sosa@gmail.com');
        cy.get('[data-cy="input-password"').type('123456');
        cy.get('[data-cy="btn-ingresar"]').click();
        cy.contains('Contraseña incorrecta');
    });
});