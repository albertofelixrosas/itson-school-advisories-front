import { Container, Typography, Box } from '@mui/material';
import './App.css';

function App() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom color="primary">
          School Advisories System
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
          Sistema de Gestión de Asesorías Académicas
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Material-UI configurado correctamente ✓
        </Typography>
      </Box>
    </Container>
  );
}

export default App;
