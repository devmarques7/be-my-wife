import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography, Box } from '@mui/material';
import { IPresent } from '../../types/presents';
import AppButton from '../AppButton/AppButton';

interface SelectPresentModalProps {
  open: boolean;
  onClose: () => void;
  present: IPresent | null;
  onConfirm: (name: string, email: string) => void;
}

const SelectPresentModal: React.FC<SelectPresentModalProps> = ({
  open,
  onClose,
  present,
  onConfirm
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!present || !name || !email) return;

    setLoading(true);
    try {
      await onConfirm(name, email);
      setName('');
      setEmail('');
    } catch (error) {
      console.error('Error selecting present:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!present) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Selecionar Presente</DialogTitle>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          {present.name}
        </Typography>
        <Typography variant="body1" gutterBottom>
          Preço: € {(present.price / 100).toFixed(2)}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Seu Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            fullWidth
            label="Seu E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <AppButton
          text="Cancelar"
          type="dashed"
          onClick={onClose}
        />
        <AppButton
          text={loading ? "Processando..." : "Confirmar"}
          type="primary"
          onClick={handleSubmit}
        />
      </DialogActions>
    </Dialog>
  );
};

export default SelectPresentModal; 