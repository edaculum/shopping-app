import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText } from '@mui/material';

const OrderPage = ({ customerId }) => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        if (!customerId) return;

        axios.get(`/shopping/siparis/${customerId}`)
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => {
                console.error('Siparişler yüklenirken bir hata oluştu:', error);
            });
    }, [customerId]);

    return (
        <div>
            <Typography variant="h4">Siparişleriniz</Typography>
            <List>
                {orders.map(order => (
                    <ListItem key={order.id}>
                        <ListItemText primary={`Sipariş ID: ${order.id}`} secondary={`Tarih: ${order.date}`} />
                        {/* Sipariş detaylarını göstermek için bir detay sayfasına yönlendirme yapılabilir */}
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default OrderPage;
