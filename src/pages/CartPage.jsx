// src/pages/CartPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, List, ListItem, ListItemText } from '@mui/material';
import { toast } from 'react-toastify'; // Import toast

const CartPage = ({ customerId, addOrder }) => {
    const [basket, setBasket] = useState(null); // Başlangıçta null olarak ayarladık
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!customerId) return;

        const loadBasket = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/shopping/sepet/${customerId}`);
                console.log('Sepet yanıtı:', response.data);
                setBasket(response.data);
            } catch (error) {
                console.error('Sepet yüklenirken bir hata oluştu:', error);
                setError('Sepet yüklenirken bir hata oluştu.');
            } finally {
                setIsLoading(false);
            }

        };

        loadBasket();
    }, [customerId]);

    const handleRemoveProduct = async (itemId) => {
        try {
            const response = await axios.delete(`/shopping/sepet/ürünüSil/${itemId}`);
            setBasket(response.data);
            toast.success('Ürün sepetten kaldırıldı.');
        } catch (error) {
            console.error('Ürün silinirken bir hata oluştu:', error);
            toast.error('Ürün silinirken bir hata oluştu.');
        }
    };

    const handleIncreaseQuantity = async (itemId, productId) => {
        try {
            const response = await axios.post(`/shopping/sepet/sepeteEkle`, null, {
                params: {
                    customerId: customerId,
                    productId: productId,
                    count: 1
                }
            });
            setBasket(response.data);
            toast.success('Ürün miktarı artırıldı.');
        } catch (error) {
            console.error('Ürün miktarı artırılırken hata oluştu:', error);
            toast.error('Ürün miktarı artırılırken hata oluştu.');
        }
    };

    const handleDecreaseQuantity = async (itemId, productId, currentCount) => {
    if (currentCount === 1) {
        // Eğer miktar 1 ise, ürünü tamamen kaldır
        handleRemoveProduct(itemId);
        return;
    }

    try {
        const response = await axios.post(`/shopping/sepet/sepeteEkle`, null, {
            params: {
                customerId: customerId,
                productId: productId,
                count: -1
            }
        });
        setBasket(response.data);
        toast.success('Ürün miktarı azaltıldı.');
    } catch (error) {
        console.error('Ürün miktarı azaltılırken hata oluştu:', error);
        toast.error('Ürün miktarı azaltılırken hata oluştu.');
    }
};

    const handleClearBasket = async () => {
        try {
            await axios.delete(`/shopping/sepet/sepetiTemizle/${customerId}`);
            setBasket({ basketItems: [] }); // Sepeti temizledikten sonra boş bir sepet ayarla
            toast.success('Sepet temizlendi.');
        } catch (error) {
            console.error('Sepet temizlenirken bir hata oluştu:', error);
            toast.error('Sepet temizlenirken bir hata oluştu.');
        }
    };

    const handleCreateOrder = async () => {
        if (!basket || !basket.basketItems || basket.basketItems.length === 0) {
            alert('Sepetiniz boş. Sipariş veremezsiniz.');
            return;
        }

        try {
            await addOrder();
            toast.success('Siparişiniz başarıyla oluşturuldu.');
            setBasket({ basketItems: [] }); // Siparişi verdikten sonra sepeti temizle
        } catch (error) {
            console.error('Sipariş oluşturulurken bir hata oluştu:', error);
            toast.error('Sipariş oluşturulurken bir hata oluştu.');
        }
    };

    return (
        <div>
            <Typography variant="h4" gutterBottom>
                Sepetim
            </Typography>
            {isLoading ? (
                <Typography>Yükleniyor...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : !basket || !basket.basketItems || basket.basketItems.length === 0 ? (
                <Typography>Sepetiniz boş.</Typography>
            ) : (
                <>
                    <List>
                        {basket.basketItems.map((item) => (
                            <ListItem key={item.id}>
                                <ListItemText
                                    primary={item.product.name}
                                    secondary={`Fiyat: ${item.price} TL - Miktar: ${item.count}`}
                                />
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleIncreaseQuantity(item.id, item.product.id)}
                                >
                                    +
                                </Button>
                                <Typography variant="body1" style={{ margin: '0 10px' }}>
                                    {item.count}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleDecreaseQuantity(item.id, item.product.id, item.count)}
                                    disabled={item.count <= 1}
                                >
                                    -
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleRemoveProduct(item.id)}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Kaldır
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                    <div style={{ marginTop: '20px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleClearBasket}
                        >
                            Sepeti Temizle
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleCreateOrder}
                            style={{ marginLeft: '10px' }}
                        >
                            Siparişi Ver
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartPage;


