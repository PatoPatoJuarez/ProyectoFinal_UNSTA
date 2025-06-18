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
            backgroundColor: '#E54A00',
            padding: '1rem',
            mt: 'auto',
            textAlign: 'center',
            }}
        >
            <Box>
            <IconButton
            component="a"
            href="https://facebook.com"
            target="_blank"
            rel="noopener"
            >
                <FacebookIcon />
            </IconButton>
            <IconButton
            component="a"
            href="https://instagram.com"
            target="_blank"
            rel="noopener"
            >
                <InstagramIcon />
            </IconButton>
            <IconButton
            component="a"
            href="mailto:soporte@tupagina.com"
            >
                <EmailIcon />
            </IconButton>
            </Box>
            <Typography variant="body2" sx={{ marginTop: '0.5rem' }}>
                <Link href="/soporte" underline="hover">Soporte</Link> | <Link href="/contacto" underline="hover">Contacto</Link>
            </Typography>
            <Typography variant="caption" display="block" sx={{ marginTop: '0.5rem' }}>
                &copy; {new Date().getFullYear()} Hands & Paws. Todos los derechos reservados.
            </Typography>
        </Box>
    );
};

export default Footer;
