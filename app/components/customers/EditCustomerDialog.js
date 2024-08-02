import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const EditCustomerDialog = ({ open, handleClose, fetchCustomers, customer }) => {
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const [address, setAddress] = useState(customer.address);
  const [hp, setHp] = useState(customer.hp);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(customer.name);
    setEmail(customer.email);
    setAddress(customer.address);
    setHp(customer.hp);
  }, [customer]);

  const handleEditCustomer = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:9000/customers/${customer.id}`, {
        id: customer.id,
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
      console.error('Error editing customer:', error.response ? error.response.data : error.message);
      setError('Error editing customer: ' + (error.response?.data?.status_message || error.message));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Customer</DialogTitle>
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
        <Button onClick={handleEditCustomer} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditCustomerDialog;
