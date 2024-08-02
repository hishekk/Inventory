import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';

const DeleteCustomerDialog = ({ open, handleClose, fetchCustomers, customer }) => {
  const [error, setError] = useState('');

  const handleDeleteCustomer = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:9000/customers/${customer.id}`, {
        headers: { 'Token': `${token}` }
      });
      fetchCustomers();
      handleClose();
    } catch (error) {
      console.error('Error deleting customer:', error.response ? error.response.data : error.message);
      setError('Error deleting customer: ' + (error.response?.data?.status_message || error.message));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Customer</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this customer?</Typography>
        {error && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleDeleteCustomer} color="primary">Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCustomerDialog;
