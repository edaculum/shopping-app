import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Grid, Card, CardMedia, CardContent, CardActions, Typography, Button } from '@mui/material'; // Gerekli MUI bileşenlerini içe aktarın

const HomePage = ({ addToCart }) => {
  // Ürünleri depolamak için state
  const [products, setProducts] = useState([]);

  // Sayfa yüklendiğinde ürünleri getir
  useEffect(() => {
      // Backend'den ürünleri çek
      const fetchProducts = async () => {
          try {
              const response = await axios.get('/shopping/ürünler/all');
              setProducts(response.data); // Gelen veriyi state'e set et
          } catch (error) {
              console.error('Ürünler yüklenirken hata oluştu:', error);
          }
      };

      fetchProducts();
  }, []); // Boş array ile sadece bir kez çalışır

  return (
      <div>
          <h1>Tüm Ürünler</h1>
          <Grid container spacing={2}>
              {products.length > 0 ? (
                  products.map((product) => (
                      <Grid item xs={12} sm={6} md={4} key={product.id}>
                          <Card className="card">
                              <CardMedia
                                  className="card-media"
                                  component="img"
                                  alt={product.name}
                                  height="250"
                                  image={product.imageurl}
                              />
                              <CardContent className="card-content">
                                  <Typography variant="h5" component="div">
                                      {product.name}
                                  </Typography>

                                  <Typography variant="body2" color="text.secondary">
                                      Stok Durumu: {product.stock}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                      {product.description}
                                  </Typography>
                              </CardContent>
                              <CardActions className="card-actions">
                                  <Typography
                                      variant="body2"
                                      color="text.secondary"
                                      sx={{
                                          fontSize: '1.5rem',
                                          fontWeight: 'bold',
                                          color: '#003366',
                                      }}
                                  >
                                      ${product.price}
                                  </Typography>
                                  <Button 
                                      className="button-primary" 
                                      size="small" 
                                      onClick={() => addToCart(product.id, 1)} // Doğru parametreleri gönderin
                                  >
                                      Sepete Ekle
                                  </Button>
                                  <Button className="button-primary" size="small">Ürün Detay</Button>
                              </CardActions>
                          </Card>
                      </Grid>
                  ))
              ) : (
                  <p>Yükleniyor...</p>
              )}
          </Grid>
      </div>
  );
};

export default HomePage;

