import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

const REDIRECT_SECONDS = 7;

const SuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);

  useEffect(() => {
    if (seconds === 0) {
      navigate('/');
      return;
    }
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, navigate]);

  const handleGoHome = () => navigate('/');

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="80vh">
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
        <Typography variant="h4" color="success.main" gutterBottom>
          Presente recebido com sucesso!
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Muito obrigado pelo carinho!<br />
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          Você será redirecionado para a página inicial em <b>{seconds}</b> segundo{seconds !== 1 ? 's' : ''}.
        </Typography>
        <Button variant="contained" color="primary" sx={{ mt: 3 }} onClick={handleGoHome}>
          Ir para a página inicial agora
        </Button>
      </Paper>
    </Box>
  );
};

export default SuccessPage;
