import { expect } from 'chai';
import { validationResult } from 'express-validator';
import adoptanteValidation from '../validations/adoptanteValidation.js';
import refugioValidation from '../validations/refugioValidation.js';

function runValidations(reqBody, validationRules) {
  const req = { body: reqBody };
  const res = {};
  const next = () => {};
  return Promise.all(validationRules.map(rule => rule.run(req, res, next)))
    .then(() => validationResult(req));
}

// ✅ Variables válidas para reutilizar
const validData = {
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@mail.com',
  telefono: '+543811234567',
  contrasena: '123456',
  tieneMascota: true
};

const validRefugio = {
  nombre: 'Refugio Patitas',
  apellido: 'Solidarias',
  email: 'refugio@mail.com',
  telefono: '+543811234567',
  contrasena: '123456',
  localidad: 'San Miguel de Tucumán',
  direccion: 'Calle Falsa 123',
  tipoMascota: ['perro'],
  tarifaAdopcion: '5000',
  seguimientoAdopcion: 'Sí',
  necesidadesRefugio: 'Comida y vacunas'
};

describe('Validaciones de Adoptante', () => {
  it('TC-MP-01-001 - Registro adoptante válido', async () => {
    const result = await runValidations(validData, adoptanteValidation);
    expect(result.isEmpty()).to.be.true;
  });

  it('TC-MP-01-002 - Email inválido adoptante', async () => {
    const data = { ...validData, email: 'correoIncorrecto' };
    const result = await runValidations(data, adoptanteValidation);
    expect(result.isEmpty()).to.be.false;
    expect(result.array()[0].msg).to.include('Email no válido');
  });

  it('TC-MP-01-003 - Campos vacíos adoptante', async () => {
    const result = await runValidations({}, adoptanteValidation);
    expect(result.isEmpty()).to.be.false;
    expect(result.array().length).to.be.greaterThan(0);
  });
});

describe('Validaciones de Refugio', () => {
  it('TC-MP-01-004 - Registro refugio válido', async () => {
    const result = await runValidations(validRefugio, refugioValidation);
    expect(result.isEmpty()).to.be.true;
  });

  it('TC-MP-01-005 - Email inválido refugio', async () => {
    const data = { ...validRefugio, email: 'correoIncorrecto' };
    const result = await runValidations(data, refugioValidation);
    expect(result.isEmpty()).to.be.false;
    expect(result.array()[0].msg).to.include('correo electrónico no es válido');
  });

  it('TC-MP-01-006 - Campos vacíos refugio', async () => {
    const result = await runValidations({}, refugioValidation);
    expect(result.isEmpty()).to.be.false;
    expect(result.array().length).to.be.greaterThan(0);
  });
});
