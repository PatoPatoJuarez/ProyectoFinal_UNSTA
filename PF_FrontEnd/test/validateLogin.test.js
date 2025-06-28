// validateLogin.test.js
import { expect } from 'chai';
import { validateLogin } from '../src/utils/validateLogin.js';

describe('Pruebas Unitarias => Validamos el Login', () => {
  it('Login correcto', () => {
    const input = { user: 'admin', password: '123456' };
    expect(validateLogin(input)).to.equal(true);
  });

  it('Usuario no registrado (sólo valida campos, no autenticación real)', () => {
    const input = { user: 'noexiste', password: '123456' };
    expect(validateLogin(input)).to.equal(true); // Solo valido presencia de datos
  });

  it('Campos vacíos', () => {
    const input = { user: '', password: '' };
    expect(validateLogin(input)).to.equal(false);
  });
});
