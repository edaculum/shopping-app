import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Typography, List, ListItem, ListItemText } from '@mui/material';

const CartPage = ({ customerId, addOrder }) => {
    const [basket, setBasket] = useState({ basketItems: [] });

    useEffect(() => {
        if (!customerId) return;

        axios.get(`/shopping/sepet/${customerId}`)
            .then(response => {
                setBasket(response.data);
            })
            .catch(error => {
                console.error('Sepet yüklenirken bir hata oluştu:', error);
            });
    }, [customerId]);

    const handleRemoveProduct = (itemId) => {
        axios.delete(`/shopping/sepet/ürünüSil/${itemId}`)
            .then(() => {
                setBasket(prevBasket => ({
                    ...prevBasket,
                    basketItems: prevBasket.basketItems.filter(item => item.id !== itemId)
                }));
            })
            .catch(error => {
                console.error('Ürün silinirken bir hata oluştu:', error);
            });
    };

    const handleClearBasket = () => {
        axios.delete(`/shopping/sepet/sepetiTemizle/${customerId}`)
            .then(() => {
                setBasket({ basketItems: [] });
            })
            .catch(error => {
                console.error('Sepet temizlenirken bir hata oluştu:', error);
            });
    };

    const handleCreateOrder = () => {
        if (!basket.basketItems.length) {
            alert('Sepetiniz boş. Sipariş veremezsiniz.');
            return;
        }
        // `addOrder` fonksiyonunu çağırarak sipariş işlemini başlatıyoruz
        addOrder();
    };

    return (
        <div>
            <Typography variant="h4">Sepetiniz</Typography>
            <List>
                {basket.basketItems.map(item => (
                    <ListItem key={item.id}>
                        <ListItemText primary={item.product.name} secondary={`Adet: ${item.count}, Toplam Fiyat: ${item.price}`} />
                        <Button onClick={() => handleRemoveProduct(item.id)}>Sil</Button>
                    </ListItem>
                ))}
            </List>
            <Button onClick={handleCreateOrder} variant="contained">Sipariş Oluştur</Button>
            <Button onClick={handleClearBasket} variant="outlined">Sepeti Temizle</Button>
        </div>
    );
};

export default CartPage;

