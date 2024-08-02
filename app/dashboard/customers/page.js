'use client';
import { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Button, Typography, Paper, Box, IconButton } from '@mui/material';
import axios from 'axios';
import AddCustomerDialog from '@/app/components/customers/AddCustomerDialog';
import EditCustomerDialog from '@/app/components/customers/EditCustomerDialog';
import DeleteCustomerDialog from '@/app/components/customers/DeleteCustomerDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:9000/customers', {
        headers: { 'Token': `${token}` }
      });
      setCustomers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleAddCustomer = () => {
    setOpenAddDialog(true);
  };

  const handleEditCustomer = (customer) => {
    setSelectedCustomer(customer);
    setOpenEditDialog(true);
  };

  const handleDeleteCustomer = (customer) => {
    setSelectedCustomer(customer);
    setOpenDeleteDialog(true);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Customers
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 3 }} onClick={handleAddCustomer}>
        Add Customer
      </Button>
      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.address}</TableCell>
                <TableCell>{customer.hp}</TableCell>
                <TableCell>
                  <IconButton color="primary" aria-label="edit customer" onClick={() => handleEditCustomer(customer)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" aria-label="delete customer" onClick={() => handleDeleteCustomer(customer)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <AddCustomerDialog
        open={openAddDialog}
        handleClose={() => setOpenAddDialog(false)}
        fetchCustomers={fetchCustomers}
      />
      {selectedCustomer && (
        <EditCustomerDialog
          open={openEditDialog}
          handleClose={() => setOpenEditDialog(false)}
          fetchCustomers={fetchCustomers}
          customer={selectedCustomer}
        />
      )}
      {selectedCustomer && (
        <DeleteCustomerDialog
          open={openDeleteDialog}
          handleClose={() => setOpenDeleteDialog(false)}
          fetchCustomers={fetchCustomers}
          customer={selectedCustomer}
        />
      )}
    </Box>
  );
};

export default CustomerPage;
