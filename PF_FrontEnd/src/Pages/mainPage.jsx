import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
  Box
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import logo from "../assets/logoMYP.png";
import "../styles/Main.css";
import "../assets/js/color-modes.js";
import FormularioPublicacion from '../components/FormularioPublicacion';
import Header from '../components/Componentes Pag. Principal/Header.jsx';
import Footer from '../components/Componentes Pag. Principal/Footer.jsx';

const MainPage = ({ token, rol }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ species: '', gender: '' });
  const [allPets, setAllPets] = useState([]);
  const [filteredPets, setFilteredPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [refreshList, setRefreshList] = useState(false);
  const [openConfigModal, setOpenConfigModal] = useState(false);
  const [userConfig, setUserConfig] = useState({nombre: '', email: '', password: ''});

  useEffect(() => {
    axios.get('http://localhost:3000/api/publicaciones', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        setAllPets(res.data);
        setFilteredPets(res.data);
      })
      .catch(err => {
        console.error('Error al cargar publicaciones:', err);
        setAllPets([]);
        setFilteredPets([]);
      });
  }, [token, refreshList]);

  useEffect(() => {
    const filtered = allPets.filter(pet =>
      (searchTerm === '' || pet.titulo.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.species === '' || pet.tipoMascota === filters.species)
    );
    setFilteredPets(filtered);
  }, [searchTerm, filters, allPets]);

  const handleSaveConfig = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.put('http://localhost:3000/api/usuarios/configuracion', userConfig, {
      headers: { Authorization: `Bearer ${token}` }
    });

    alert('Configuración actualizada');
    setOpenConfigModal(false);
    } catch (error) {
    console.error('Error al guardar configuración:', error);
    alert('Hubo un problema al guardar los datos.');
    }
  };

  const handleSearchChange = (event) => setSearchTerm(event.target.value);
  const handleFilterChange = (event) => setFilters({ ...filters, [event.target.name]: event.target.value });
  const handlePetClick = (pet) => setSelectedPet(pet);
  const clearSelectedPet = () => setSelectedPet(null);
  const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: 24,
  minWidth: 300
  };

  return (
    <>
      {/* SVG Symbols para íconos de tema */}
      <svg xmlns="http://www.w3.org/2000/svg" className="d-none">
        {/* Asegurate de copiar los <symbol> de tu HTML completo aquí */}
        {/* ... */}
      </svg>

      {/* Botón flotante para cambiar el tema */}
      {/*<div className="dropdown position-fixed bottom-0 end-0 mb-3 me-3 bd-mode-toggle">
        <button
          className="btn btn-bd-primary py-2 dropdown-toggle d-flex align-items-center"
          id="bd-theme"
          type="button"
          aria-expanded="false"
          data-bs-toggle="dropdown"
          aria-label="Toggle theme (auto)"
        >
          <svg className="bi my-1 theme-icon-active" aria-hidden="true">
            <use href="#circle-half" />
          </svg>
          <span className="visually-hidden" id="bd-theme-text">Toggle theme</span>
        </button>
        <ul className="dropdown-menu dropdown-menu-end shadow" aria-labelledby="bd-theme-text">
          {["light", "dark", "auto"].map((theme) => (
            <li key={theme}>
              <button
                type="button"
                className={`dropdown-item d-flex align-items-center ${theme === "auto" ? "active" : ""}`}
                data-bs-theme-value={theme}
                aria-pressed={theme === "auto" ? "true" : "false"}
              >
                <svg className="bi me-2 opacity-50" aria-hidden="true">
                  <use href={`#${theme === "light" ? "sun-fill" : theme === "dark" ? "moon-stars-fill" : "circle-half"}`} />
                </svg>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
                <svg className="bi ms-auto d-none" aria-hidden="true">
                  <use href="#check2" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>*/}

    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <Header onConfigClick={() => setOpenConfigModal(true)} />

      {/* Main content con filtros y cards */}

      <main>
        {/*<section className="py-2 text-center bg-warning">
          <div className="py-lg-5">
            <img src={logo} alt="Logo MYP" width="300" height="300" />
          </div>
        </section>*/}

        <div className="album py-5">
          <Container>
            <Typography variant="h3" align="center" gutterBottom>
              ¡Busca tu compañia perfecta!
            </Typography>

            <Grid sx={{ mt: 4 }} container spacing={2} alignItems="center" className="search-filter">
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Buscar por nombre"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{ startAdornment: <SearchIcon />,
                  }}
                  sx={{
                  backgroundColor: 'transparent',
                  '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white',
                  },
                  '&:hover fieldset': {
                    borderColor: 'white',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white',
                  },
                  color: 'white',
                  },
                  '& input': {
                    color: 'white',
                  },
                  borderRadius: 1
                  }}
                />
              </Grid>
              <Grid item xs={6} sm={3}>
                <FormControl
                  variant="outlined"
                  sx={{
                    backgroundColor: 'transparent',
                    minWidth: 110,         
                  }}
                >
                  <InputLabel
                    sx={{
                      color: 'gray',
                      '&.Mui-focused': {
                        color: 'gray',
                      },
                    }}
                  >
                    Especies
                  </InputLabel>
                  <Select
                    name="species"
                    value={filters.species}
                    onChange={handleFilterChange}
                    label="Especies"
                    sx={{
                      color: 'white',
                      backgroundColor: 'transparent',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                    }}
                  >
                    <MenuItem value="">Todos</MenuItem>
                    <MenuItem value="perro">Perro</MenuItem>
                    <MenuItem value="gato">Gato</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {selectedPet ? (
              <Grid container justifyContent="center">
                <Grid item xs={12} md={8}>
                  <Card sx={{ backgroundColor: '#ec7741'}}>
                    <CardMedia
                      component="img"
                      height="300"
                      image={selectedPet.fotos?.[0] || ''}
                      alt={selectedPet.titulo}
                    />
                    <CardContent>
                      <Typography variant="h5">{selectedPet.titulo}</Typography>
                      <Typography variant="subtitle1">{selectedPet.tipoMascota}, {selectedPet.edad}</Typography>
                      <Typography variant="body2" paragraph>{selectedPet.descripcion}</Typography>
                      <Button variant="contained" color="primary" onClick={clearSelectedPet}>
                        Volver al listado
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Grid sx={{ mt: 4 }} container spacing={3}>
                {filteredPets.map(pet => (
                  <Grid item key={pet._id} xs={12} sm={6} md={4}>
                    <Card onClick={() => handlePetClick(pet)} sx={{ backgroundColor: '#ec7741' }}>
                      <CardMedia component="img" height="200" image={pet.fotos?.[0] || ''} alt={pet.titulo} />
                      <CardContent>
                        <Typography variant="h5">{pet.titulo}</Typography>
                        <Typography variant="body2">{pet.tipoMascota}, {pet.edad}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {rol === 'refugio' && (
              <div style={{ marginTop: '2rem', backgroundColor: '#f5f5f5', padding: '1rem' }}>
                <Typography variant="h5" gutterBottom>
                  Crear nueva publicación (Solo para refugios)
                </Typography>
                <FormularioPublicacion
                  token={token}
                  onPublicacionCreada={() => setRefreshList(prev => !prev)}
                />
              </div>
            )}
            <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
              <div class="col">
                <div class="card shadow-sm">
                  <CardMedia
                  component="img"
                  height="225"
                  image="https://cdn.pixabay.com/photo/2023/11/02/16/49/cat-8361048_1280.jpg"
                  alt="Foto de gato"
                  />
                  <div class="card-body">
                    <CardContent>
                    <Typography variant="body2" gutterBottom><strong>Sexo:</strong> Macho</Typography>
                    <Typography variant="body2" gutterBottom><strong>Edad:</strong> 2 años</Typography>
                    <Typography variant="body2"><strong>Raza:</strong> No tiene</Typography>
                    </CardContent>
                    <div class="d-flex justify-content-between align-items-center">
                      <a href="#" class="btn btn-primary">Más informacion...</a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card shadow-sm">
                  <CardMedia
                  component="img"
                  height="225"
                  image="https://cdn.pixabay.com/photo/2023/11/02/16/49/cat-8361048_1280.jpg"
                  alt="Foto de gato"
                  />
                  <div class="card-body">
                    <CardContent>
                    <Typography variant="body2" gutterBottom><strong>Sexo:</strong> Macho</Typography>
                    <Typography variant="body2" gutterBottom><strong>Edad:</strong> 2 años</Typography>
                    <Typography variant="body2"><strong>Raza:</strong> No tiene</Typography>
                    </CardContent>
                    <div class="d-flex justify-content-between align-items-center">
                      <a href="#" class="btn btn-primary">Más informacion...</a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card shadow-sm">
                  <CardMedia
                  component="img"
                  height="225"
                  image="https://cdn.pixabay.com/photo/2023/11/02/16/49/cat-8361048_1280.jpg"
                  alt="Foto de gato"
                  />
                  <div class="card-body">
                    <CardContent>
                    <Typography variant="body2" gutterBottom><strong>Sexo:</strong> Macho</Typography>
                    <Typography variant="body2" gutterBottom><strong>Edad:</strong> 2 años</Typography>
                    <Typography variant="body2"><strong>Raza:</strong> No tiene</Typography>
                    </CardContent>
                    <div class="d-flex justify-content-between align-items-center">
                      <a href="#" class="btn btn-primary">Más informacion</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </main>

      <Modal open={openConfigModal} onClose={() => setOpenConfigModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Configuración del usuario</Typography>
          
          <TextField
            fullWidth
            label="Nombre"
            margin="normal"
            value={userConfig.nombre}
            onChange={(e) => setUserConfig({ ...userConfig, nombre: e.target.value })}
          />

          <TextField
            fullWidth
            label="Correo electrónico"
            margin="normal"
            value={userConfig.email}
            onChange={(e) => setUserConfig({ ...userConfig, email: e.target.value })}
          />

          <TextField
            fullWidth
            label="Nueva contraseña"
            type="password"
            margin="normal"
            value={userConfig.password}
            onChange={(e) => setUserConfig({ ...userConfig, password: e.target.value })}
          />

          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="outlined" onClick={() => setOpenConfigModal(false)}>Cancelar</Button>
            <Button variant="contained" onClick={handleSaveConfig}>Guardar</Button>
          </Box>
        </Box>
      </Modal>


      {/* Footer */}
      <Footer />
    </div>
    </>
  );
};

export default MainPage;