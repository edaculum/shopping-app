import React from 'react';
import { Modal, Box, Typography, CardMedia, Button } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: '8px',
};

const ProductModal = ({ open, handleClose, product }) => {
  if (!product) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            borderRadius: '8px',
            mb: 2,
          }}
        >
          <CardMedia
            component="img"
            sx={{
              maxHeight: '300px',
              maxWidth: '100%',
              objectFit: 'contain', // Görüntüyü kutuya sığdırır
            }}
            image={product.imageurl}
            alt={product.name}
          />
        </Box>
        <Typography variant="h6" component="h2" mt={2}>
          {product.name}
        </Typography>
        <Typography variant="body1" color="text.secondary" mt={1}>
          Stok Durumu: {product.stock}
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          {product.description}
        </Typography>
        <Button
          onClick={handleClose}
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
        >
          Kapat
        </Button>
      </Box>
    </Modal>
  );
};

export default ProductModal;
