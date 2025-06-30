import React from 'react';
import { Box, Typography, Link, IconButton } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
return (
        <Box
        component="footer"
        sx={{
            backgroundColor: ' rgba(60, 46, 40, 0.88)',
            padding: '1rem',
            mt: 'auto',
            textAlign: 'center',
            }}
        >
            <Box>
            <IconButton
            sx={{ color: 'white' }}
            component="a"
            href="https://facebook.com"
            target="_blank"
            rel="noopener"
            >
                <FacebookIcon />
            </IconButton>
            <IconButton
            sx={{ color: 'white' }}
            component="a"
            href="https://instagram.com"
            target="_blank"
            rel="noopener"
            >
                <InstagramIcon />
            </IconButton>
            <IconButton
            sx={{ color: 'white' }}
            component="a"
            href="mailto:soporte@tupagina.com"
            >
                <EmailIcon />
            </IconButton>
            </Box>
            <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
                <Link href="/soporte" underline="hover" sx={{ color: 'white', cursor: 'pointer' }}>Soporte</Link> | <Link href="/contacto" underline="hover" sx={{ color: 'white', cursor: 'pointer' }}>Contacto</Link>
            </Typography>
            <Typography variant="caption" display="block" sx={{ marginTop: '0.5rem', color: 'white' }}>
                &copy; {new Date().getFullYear()} Hands & Paws. Todos los derechos reservados.
            </Typography>
        </Box>
    );
};

export default Footer;
