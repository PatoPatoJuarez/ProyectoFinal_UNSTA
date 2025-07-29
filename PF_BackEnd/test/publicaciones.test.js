const sinon = require('sinon');
const { assert } = require('chai');
const mongoose = require('mongoose');

const ctrl = require('../controllers/publicacionesController');
const Publicacion = require('../models/Publicacion');
const Refugio = require('../models/Refugio');

describe('Pruebas unitarias de publicaciones', () => {

  afterEach(() => sinon.restore());

  it('TC-PUB-01-001 - Crear publicación válida', async () => {
    const refugioId = new mongoose.Types.ObjectId();
    const req = {
      user: { rol: 'refugio', id: refugioId },
      body: { titulo: 'Gatito', descripcion: 'En adopción', especie: 'gato', genero: 'hembra' }
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    sinon.stub(Refugio, 'findById').resolves({ _id: refugioId, nombreCompania: 'Mi Refugio' });
    sinon.stub(Publicacion.prototype, 'save').resolves();

    await ctrl.crearPublicacion(req, res);

    assert.isTrue(res.status.calledWith(201));
    assert.isTrue(res.json.calledOnce);
    assert.isTrue(res.json.calledWithMatch({ message: '✅ Publicación creada con éxito' }));
  });

  it('TC-PUB-01-002 - Crear publicación sin ser refugio', async () => {
    const req = { user: { rol: 'adoptante' }, body: {} };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    await ctrl.crearPublicacion(req, res);

    assert.isTrue(res.status.calledWith(403));
    assert.isTrue(res.json.calledWith({ message: 'Solo los refugios pueden crear publicaciones' }));
  });

  it('TC-PUB-01-003 - Obtener todas las publicaciones', async () => {
    const req = {};
    const res = { json: sinon.stub(), status: sinon.stub().returnsThis() };
    
    const mockPublicaciones = [
      { titulo: 'Gato', especie: 'felino', toObject: () => ({ titulo: 'Gato', especie: 'felino' }) },
      { titulo: 'Perro', especie: 'canino', toObject: () => ({ titulo: 'Perro', especie: 'canino' }) }
    ];

    // --- CAMBIO CLAVE AQUÍ ---
    // Creamos un objeto que se comporta como una promesa y también tiene los métodos de encadenamiento.
    // Cuando el controlador hace 'await' sobre la cadena (después de populate y sort),
    // esta promesa se resolverá con mockPublicaciones.
    const mockQuery = {
      populate: sinon.stub().returnsThis(), // Retorna 'this' para encadenamiento
      sort: sinon.stub().returnsThis(),     // Retorna 'this' para encadenamiento
      // Simulamos el comportamiento de una promesa que se resuelve con el array esperado
      // Esto reemplaza la necesidad de un .exec() explícito que tu controlador no usa
      then: function(resolve, reject) {
        return Promise.resolve(mockPublicaciones).then(resolve, reject);
      }
    };

    sinon.stub(Publicacion, 'find').returns(mockQuery);

    await ctrl.obtenerPublicaciones(req, res);

    assert.isTrue(Publicacion.find.calledOnce, 'Publicacion.find debería haber sido llamado una vez');
    assert.isTrue(mockQuery.populate.calledOnce, '.populate() debería haber sido llamado');
    assert.isTrue(mockQuery.sort.calledOnce, '.sort() debería haber sido llamado');
    
    assert.isTrue(res.status.calledWith(200), 'res.status debería haber sido llamado con 200');
    assert.isTrue(res.json.calledOnce, 'res.json debería haber sido llamado una vez');
    const publicaciones = res.json.firstCall.args[0]; 
    
    assert.isArray(publicaciones, 'La respuesta JSON debería ser un array de publicaciones');
    assert.lengthOf(publicaciones, 2, 'El array de publicaciones debería contener 2 elementos');
  });

  it('TC-PUB-01-004 - Actualizar descripción de publicación', async () => {
    const publicacionId = new mongoose.Types.ObjectId();
    const refugioId = new mongoose.Types.ObjectId();
    const nuevaDescripcion = '¡Gatito adoptado, hogar feliz!';
    const req = {
      params: { id: publicacionId.toString() },
      user: { rol: 'refugio', id: refugioId.toString() },
      body: { descripcion: nuevaDescripcion }
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    const mockPublicacion = { 
      _id: publicacionId, 
      refugio: refugioId, 
      descripcion: 'En adopción',
      save: sinon.stub().resolvesThis(),
      toObject: sinon.stub().returns({ 
          _id: publicacionId.toString(), 
          refugio: refugioId.toString(), 
          descripcion: nuevaDescripcion 
      }) 
    };
    
    sinon.stub(Publicacion, 'findById').withArgs(publicacionId.toString()).resolves(mockPublicacion);

    await ctrl.actualizarPublicacion(req, res);

    assert.isTrue(Publicacion.findById.calledOnceWith(publicacionId.toString()), 'findById debería haber sido llamado con el ID correcto');
    assert.isTrue(mockPublicacion.save.calledOnce, 'El método save debería haber sido llamado en la publicación');
    assert.isTrue(res.status.calledWith(200), 'res.status debería haber sido llamado con 200');
    assert.isTrue(res.json.calledOnce, 'res.json debería haber sido llamado una vez');
    assert.isTrue(res.json.calledWithMatch({ message: '✅ Publicación actualizada', publicacion: { descripcion: nuevaDescripcion } }));
    assert.strictEqual(mockPublicacion.descripcion, nuevaDescripcion, 'La descripción de la publicación mockeada debería haberse actualizado');
  });

  it('TC-PUB-01-005 - Eliminar publicación (sin ser el refugio dueño)', async () => {
    const publicacionId = new mongoose.Types.ObjectId();
    const refugioDueñoId = new mongoose.Types.ObjectId();
    const refugioNoDueñoId = new mongoose.Types.ObjectId();
    const req = { 
      params: { id: publicacionId.toString() },
      user: { rol: 'refugio', id: refugioNoDueñoId.toString() } // Refugio diferente al dueño
    };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };

    const mockPublicacion = { 
        _id: publicacionId, 
        refugio: refugioDueñoId, 
        deleteOne: sinon.stub().resolves({ deletedCount: 1 })
    };
    sinon.stub(Publicacion, 'findById').withArgs(publicacionId.toString()).resolves(mockPublicacion);

    await ctrl.eliminarPublicacion(req, res);

    assert.isTrue(Publicacion.findById.calledOnceWith(publicacionId.toString()), 'findById debería haber sido llamado una vez');
    assert.isFalse(mockPublicacion.deleteOne.called, 'deleteOne NO debería haber sido llamado');
    assert.isTrue(res.status.calledWith(403), 'res.status debería haber sido llamado con 403');
    assert.isTrue(res.json.calledWith({ message: 'No puedes eliminar esta publicación' }), 'res.json debería haber devuelto el mensaje de no autorizado');
  });
});