// src/pages/CartPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, List, ListItem, ListItemText, Modal, TextField, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { toast } from 'react-toastify'; // Import toast

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const CartPage = ({ customerId, basket, setBasket, addOrder }) => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [orderAddress, setOrderAddress] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');

    useEffect(() => {
        if (!customerId) return;
    
        const loadBasket = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`/shopping/sepet/${customerId}`);
                console.log('Sepet yanıtı:', response.data); // Debug log
    
                // Sepet öğelerini kontrol edin
                response.data.basketItems.forEach(item => {
                    console.log(`Basket Item ID: ${item.id}`);
                });
    
                setBasket(response.data);
            } catch (error) {
                console.error('Sepet yüklenirken bir hata oluştu:', error);
                setError('Sepet yüklenirken bir hata oluştu.');
                setBasket({ basketItems: [] }); // Hata durumunda sepeti temizle
            } finally {
                setIsLoading(false);
            }
        };
    
        loadBasket();
    }, [customerId, setBasket]);
    
    const handleRemoveProduct = async (basketItemId) => {
        if (!basketItemId) {
            toast.error('Ürün ID bulunamadı.');
            return;
        }
    
        try {
            const response = await axios.delete(`/shopping/sepet/urunuSil/${basketItemId}`);
            console.log('Ürün silme yanıtı:', response.data);
            if (response.data && Array.isArray(response.data.basketItems)) {
                setBasket(response.data);
            } else {
                setBasket({ basketItems: [] });
            }
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
            console.log('Ürün arttırma yanıtı:', response.data);
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
            await handleRemoveProduct(itemId);
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
            console.log('Ürün azaltma yanıtı:', response.data);
            setBasket(response.data);
            toast.success('Ürün miktarı azaltıldı.');
        } catch (error) {
            console.error('Ürün miktarı azaltılırken hata oluştu:', error);
            toast.error('Ürün miktarı azaltılırken hata oluştu.');
        }
    };

    const handleClearBasket = async () => {
        try {
            const response = await axios.delete(`/shopping/sepet/sepetiTemizle/${customerId}`);
            console.log('Sepet temizleme yanıtı:', response.data);
            setBasket(response.data);
            toast.success('Sepet temizlendi.');
        } catch (error) {
            console.error('Sepet temizlenirken bir hata oluştu:', error);
            toast.error('Sepet temizlenirken bir hata oluştu.');
        }
    };

    const handleCreateOrder = () => {
        // Sepet boş olsa da buton görünmeli
        setIsOrderModalOpen(true);
    };

    const handleOrderSubmit = async (e) => {
        e.preventDefault();
        // Sipariş detayları oluştur
        const orderDetails = {
            address: orderAddress,
            paymentMethod: paymentMethod
            // Diğer detaylar eklenebilir
        };
        try {
            await addOrder(orderDetails);
            toast.success('Siparişiniz başarıyla oluşturuldu.');
            setBasket({ basketItems: [] }); // Siparişi verdikten sonra sepeti temizle
            setIsOrderModalOpen(false);
            setOrderAddress('');
            setPaymentMethod('card');
        } catch (error) {
            console.error('Sipariş oluşturulurken hata oluştu:', error);
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
                <div>
                    <Typography>Sepetiniz boş.</Typography>
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
                </div>
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
                                onClick={() => {
                                    console.log('Silinecek Ürün ID:', item.basketItemId); // Debug log
                                    handleRemoveProduct(item.basketItemId);
                                }}
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

            {/* Order Modal */}
            <Modal open={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)}>
                <Box sx={modalStyle}>
                    <form onSubmit={handleOrderSubmit}>
                        <TextField
                            label="Adres"
                            variant="outlined"
                            fullWidth
                            required
                            value={orderAddress}
                            onChange={(e) => setOrderAddress(e.target.value)}
                            margin="normal"
                        />
                        <FormControl variant="outlined" fullWidth margin="normal" required>
                            <InputLabel id="payment-method-label">Ödeme Yöntemi</InputLabel>
                            <Select
                                labelId="payment-method-label"
                                label="Ödeme Yöntemi"
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <MenuItem value="card">Kart ile</MenuItem>
                                <MenuItem value="cash">Kapıda</MenuItem>
                            </Select>
                        </FormControl>
                        {/* Add more fields if necessary */}
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Sipariş Ver
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );

};
export default CartPage;
