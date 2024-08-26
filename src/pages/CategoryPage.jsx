// CategoryPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, CardMedia, CardActions, Button } from '@mui/material'; // CardActions ve Button içe aktarıldı
import '../css/CategoryPage.css'; // Eğer CategoryPage.jsx src/pages/ dizinindeyse

function CategoryPage({ categories }) {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams(); // Kategori ID'sini alır

    // Kategori adı ayarlama
    const categoryName = categories.find(category => category.id === parseInt(id))?.name || 'Kategori Adı Bulunamadı';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoading(true);
                // URL'yi backend endpoint'iniz ile uyumlu hale getirin
                const response = await axios.get(`/shopping/ürünler/kategori/${id}`);
                setProducts(response.data);
            } catch (error) {
                setError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

       return (
        <div>
            <h1>{categoryName} </h1>
            <Grid container spacing={2}>
                {products.length > 0 ? (
                    products.map((product) => (
                        <Grid item xs={12} sm={6} md={4} key={product.id}>
                            <Card className="card">
                                {/* Resim URL'sini ekleyin */}
                                <CardMedia
                                    className="card-media" // Stil sınıfını ekleyin
                                    component="img"
                                    alt={product.name}
                                    height="250"
                                    image={product.imageurl} // Ürünün resim URL'si
                                />
                                <CardContent className='card-content'>
                                    <Typography variant="h5" component="div">
                                        {product.name}
                                    </Typography>
                                    
                                    <Typography variant="body2" color="text.secondary">
                                        Stok Durumu: {product.stock} {/* Stok bilgisi */}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.description}
                                    </Typography>
                                </CardContent>
                                <CardActions className='card-actions'>
                                <Typography
                                   variant="body2"
                                   color="text.secondary"
                                   sx={{
                                   fontSize: '1.5rem', // Fiyat büyüklüğü
                                   fontWeight: 'bold', // Kalın yazı
                                   color: '#003366', // Lacivert renk kodu
                                   }}
> 
                                  ${product.price}
                                  </Typography>
                                    <Button  className="button-primary" size="small" >Sepete Ekle</Button>
                                    <Button  className="button-primary" size="small" >Ürün Detay</Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="h6">Bu kategori için ürün bulunamadı.</Typography>
                )}
            </Grid>
        </div>
    );
}

export default CategoryPage;
