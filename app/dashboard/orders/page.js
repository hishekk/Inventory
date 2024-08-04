'use client';
import { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableHead, TableRow, Typography, Paper, Box } from '@mui/material';
import axios from 'axios';

const SalesOrderPage = () => {
  const [salesOrders, setSalesOrders] = useState([]);

  useEffect(() => {
    fetchSalesOrders();
  }, []);

  const fetchSalesOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:9000/sales-orders', {
        headers: { 'Token': `${token}` }
      });
      setSalesOrders(response.data.data || []);
    } catch (error) {
      console.error('Error fetching sales orders:', error);
      setSalesOrders([]);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Sales Orders
      </Typography>
      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Code</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Customer</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Salesman</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {salesOrders.map((salesOrder) => (
              <TableRow key={salesOrder.id}>
                <TableCell>{salesOrder.code}</TableCell>
                <TableCell>{new Date(salesOrder.date).toLocaleDateString()}</TableCell>
                <TableCell>{salesOrder.customer.name}</TableCell>
                <TableCell>{salesOrder.salesman.name}</TableCell>
                <TableCell>{salesOrder.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
};

export default SalesOrderPage;
