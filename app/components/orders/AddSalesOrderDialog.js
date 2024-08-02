import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const AddSalesOrderDialog = ({ open, handleClose, fetchSalesOrders }) => {
  const [code, setCode] = useState('');
  const [date, setDate] = useState('');
  const [customerID, setCustomerID] = useState('');
  const [salesmanID, setSalesmanID] = useState('');
  const [additionalDisc, setAdditionalDisc] = useState('');
  const [salesOrderDetails, setSalesOrderDetails] = useState([]); 
  const [error, setError] = useState('');

  const handleAddSalesOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:9000/sales_orders', {
        code,
        date,
        customer_id: customerID,
        salesman_id: salesmanID,
        additional_disc: parseFloat(additionalDisc),
        sales_order_details: salesOrderDetails
      }, {
        headers: { 'Token': `${token}` }
      });
      fetchSalesOrders();
      handleClose();
    } catch (error) {
      console.error('Error adding sales order:', error.response ? error.response.data : error.message);
      setError('Error adding sales order: ' + (error.response?.data?.status_message || error.message));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Sales Order</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Code"
          type="text"
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Date"
          type="date"
          fullWidth
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Customer ID"
          type="text"
          fullWidth
          value={customerID}
          onChange={(e) => setCustomerID(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Salesman ID"
          type="text"
          fullWidth
          value={salesmanID}
          onChange={(e) => setSalesmanID(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Additional Discount"
          type="number"
          fullWidth
          value={additionalDisc}
          onChange={(e) => setAdditionalDisc(e.target.value)}
        />
        {error && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleAddSalesOrder} color="primary">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSalesOrderDialog;
