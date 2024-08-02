import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const AddCustomerDialog = ({ open, handleClose, fetchCustomers }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [hp, setHp] = useState('');
  const [error, setError] = useState('');

  const handleAddCustomer = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:9000/customers', {
        name,
        email,
        address,
        hp
      }, {
        headers: { 'Token': `${token}` }
      });
      fetchCustomers();
      handleClose();
    } catch (error) {
      console.error('Error adding customer:', error.response ? error.response.data : error.message);
      setError('Error adding customer: ' + (error.response?.data?.status_message || error.message));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Customer</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Address"
          type="text"
          fullWidth
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Phone"
          type="text"
          fullWidth
          value={hp}
          onChange={(e) => setHp(e.target.value)}
        />
        {error && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleAddCustomer} color="primary">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCustomerDialog;
