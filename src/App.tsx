/**
 * Main App Component
 * School Advisories System
 * 
 * Root component with all providers and routing
 */

import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Container, Typography, Box } from '@mui/material';
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryProvider } from '@/contexts/QueryContext';
import './App.css';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <BrowserRouter>
          <Container maxWidth="lg">
            <Box sx={{ my: 4, textAlign: 'center' }}>
              <Typography variant="h2" component="h1" gutterBottom color="primary">
                School Advisories System
              </Typography>
              <Typography variant="h5" component="h2" gutterBottom color="text.secondary">
                Sistema de Gestión de Asesorías Académicas
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                ✅ Material-UI configurado correctamente
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                ✅ Sistema de autenticación configurado
              </Typography>
              <Typography variant="body1" sx={{ mt: 1 }}>
                ✅ React Query configurado
              </Typography>
            </Box>
          </Container>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4caf50',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#f44336',
                  secondary: '#fff',
                },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
