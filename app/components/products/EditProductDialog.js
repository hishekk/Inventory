import { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography } from '@mui/material';
import axios from 'axios';

const EditProductDialog = ({ open, handleClose, fetchProducts, product }) => {
  const [name, setName] = useState(product.name);
  const [code, setCode] = useState(product.code);
  const [price, setPrice] = useState(product.price);
  const [minimumStock, setMinimumStock] = useState(product.minimum_stock);
  const [brand, setBrand] = useState(product.brand);
  const [productCategory, setProductCategory] = useState(product.product_category);
  const [error, setError] = useState('');

  useEffect(() => {
    setName(product.name);
    setCode(product.code);
    setPrice(product.price);
    setMinimumStock(product.minimum_stock);
    setBrand(product.brand);
    setProductCategory(product.product_category);
  }, [product]);

  const handleEditProduct = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:9000/products/${product.id}`, {
        id: product.id,  
        name,
        price: parseFloat(price),
        minimum_stock: minimumStock.toString(), 
        brand,
        product_category: productCategory
      }, {
        headers: { 'Token': `${token}` }
      });
      fetchProducts();
      handleClose();
    } catch (error) {
      console.error('Error editing product:', error.response ? error.response.data : error.message);
      setError('Error editing product: ' + (error.response?.data?.status_message || error.message));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Edit Product</DialogTitle>
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
        <Button onClick={handleEditProduct} color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
