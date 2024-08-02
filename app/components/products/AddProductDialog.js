import { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const AddProductDialog = ({ open, handleClose, fetchProducts }) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [price, setPrice] = useState('');
  const [minimumStock, setMinimumStock] = useState('');
  const [brand, setBrand] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [error, setError] = useState('');

  const handleAddProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:9000/products', {
        code,
        name,
        price: parseFloat(price),
        minimum_stock: minimumStock, 
        brand: brand, 
        product_category: productCategory 
      }, {
        headers: { 'Token': `${token}` }
      });
      fetchProducts();
      handleClose();
    } catch (error) {
      console.error('Error adding product:', error.response ? error.response.data : error.message);
      setError('Error adding product: ' + (error.response?.data?.status_message || error.message));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Add Product</DialogTitle>
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
          label="Code"
          type="text"
          fullWidth
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Price"
          type="number"
          fullWidth
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Minimum Stock"
          type="number"
          fullWidth
          value={minimumStock}
          onChange={(e) => setMinimumStock(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Brand ID"
          type="text"
          fullWidth
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Product Category ID"
          type="text"
          fullWidth
          value={productCategory}
          onChange={(e) => setProductCategory(e.target.value)}
        />
        {error && <Typography variant="body2" color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">Cancel</Button>
        <Button onClick={handleAddProduct} color="primary">Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
