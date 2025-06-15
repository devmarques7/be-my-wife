import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Typography, Container, useTheme } from '@mui/material';
import AppButton from '../components/AppButton/AppButton';
import { StyledLogin } from '../components/Login/styleLogin';

const LoginPage: React.FC = () => {
  const theme = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        navigate('/admin');
      } else {
        setError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor');
    }
  };

  return (
    <Container>
      <StyledLogin theme={theme}>
        <Box component="form" onSubmit={handleSubmit} className="login-form">
          <Typography variant="h4" component="h1" gutterBottom>
            Login Administrativo
          </Typography>
          
          <TextField
            fullWidth
            label="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          
          <Box sx={{ mt: 3 }}>
            <AppButton
              text="Entrar"
              type="primary"
              onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
            />
          </Box>
        </Box>
      </StyledLogin>
    </Container>
  );
};

export default LoginPage; 