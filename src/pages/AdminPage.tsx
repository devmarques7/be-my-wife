import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Button, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StyledAdmin } from '../components/Admin/styleAdmin';
import { API_CONFIG } from '../config/api.config';

interface Statistics {
  total: number;
  selected: number;
  available: number;
}

const AdminPage: React.FC = () => {
  const theme = useTheme();
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    selected: 0,
    available: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchStatistics = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}${API_CONFIG.endpoints.statistics}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setStatistics(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, [navigate]);

  const chartData = [
    { name: 'Total', value: statistics.total },
    { name: 'Selecionados', value: statistics.selected },
    { name: 'Disponíveis', value: statistics.available },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <StyledAdmin theme={theme}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Painel Administrativo
        </Typography>
        <Button variant="outlined" color="error" onClick={handleLogout}>
          Sair
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card className="statistics-card">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Presentes
              </Typography>
              <Typography variant="h4">
                {statistics.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="statistics-card">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Presentes Selecionados
              </Typography>
              <Typography variant="h4">
                {statistics.selected}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card className="statistics-card">
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Presentes Disponíveis
              </Typography>
              <Typography variant="h4">
                {statistics.available}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box className="chart-container" sx={{ mt: 4, height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={theme.palette.primary.main} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </StyledAdmin>
  );
};

export default AdminPage; 