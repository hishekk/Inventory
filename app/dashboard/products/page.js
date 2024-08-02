'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Table, TableBody, TableCell, TableHead, TableRow, Paper, Typography, Box, IconButton } from '@mui/material';
import AddProductDialog from '@/app/components/products/AddProductDialog';
import EditProductDialog from '@/app/components/products/EditProductDialog';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get('http://localhost:9000/products', {
      headers: { 'Token': `${token}` }
    });
    setProducts(response.data.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:9000/products/${id}`, {
      headers: { 'Token': `${token}` }
    });
    fetchProducts();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
        Products
      </Typography>
      <Button variant="contained" color="primary" sx={{ mb: 3 }} onClick={() => setAddDialogOpen(true)}>
        Add Product
      </Button>
      <Paper sx={{ p: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  <IconButton color="primary" aria-label="edit product" onClick={() => handleEdit(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="secondary" aria-label="delete product" onClick={() => handleDelete(product.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <AddProductDialog open={addDialogOpen} handleClose={() => setAddDialogOpen(false)} fetchProducts={fetchProducts} />
      {selectedProduct && (
        <EditProductDialog open={editDialogOpen} handleClose={() => setEditDialogOpen(false)} fetchProducts={fetchProducts} product={selectedProduct} />
      )}
    </Box>
  );
};

export default ProductList;
