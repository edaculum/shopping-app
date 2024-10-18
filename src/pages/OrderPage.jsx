import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Typography, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, Table, TableBody, TableCell, TableHead, TableRow, Button, Box } from '@mui/material';

const OrderPage = ({ customerId }) => {
    const [orders, setOrders] = useState([]);
    const [orderDetails, setOrderDetails] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedOrderTotalPrice, setSelectedOrderTotalPrice] = useState(0); 

    useEffect(() => {
        if (!customerId) return;

        axios.get(`/shopping/siparis/customer/${customerId}/orders`)
            .then(response => {
                // Siparişlerin detaylarını almak için istek yapalım
                const fetchOrderDetails = response.data.map(order => {
                    return axios.get(`/shopping/siparis/orderDetail/${order.id}`).then(detailResponse => {
                        // Sipariş detaylarından toplam fiyatı hesapla
                        const totalPrice = detailResponse.data.reduce((total, item) => total + (item.price * item.count || 0), 0);
                        return { ...order, totalPrice }; // Sipariş nesnesini güncelle
                    });
                });

                // Tüm istekler tamamlandıktan sonra siparişleri set et
                Promise.all(fetchOrderDetails).then(ordersWithDetails => {
                    setOrders(ordersWithDetails);
                });
            })
            .catch(error => {
                console.error('Siparişler yüklenirken bir hata oluştu:', error);
            });
    }, [customerId]);

    const handleOrderClick = (orderId) => {
        axios.get(`/shopping/siparis/orderDetail/${orderId}`)
            .then(response => {
                setOrderDetails(response.data);
                const totalPrice = response.data.reduce((total, item) => total + (item.price * item.count || 0), 0);
                setSelectedOrderTotalPrice(totalPrice);
                setOpen(true);
            })
            .catch(error => {
                console.error('Sipariş detayları yüklenirken bir hata oluştu:', error);
            });
    };

    const handleClose = () => {
        setOpen(false);
        setOrderDetails([]);
        setSelectedOrderTotalPrice(0);
    };

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>Siparişleriniz</Typography>
            <List>
                {orders.map(order => (
                    <ListItem 
                        button 
                        key={order.id} 
                        onClick={() => handleOrderClick(order.id)}
                        sx={{ 
                            backgroundColor: '#f9f9f9', 
                            borderRadius: '8px', 
                            mb: 1,
                            '&:hover': { backgroundColor: '#e0e0e0' }
                        }}
                    >
                        <ListItemText 
                            primary={`Sipariş Tarihi: ${new Date(order.date).toLocaleDateString()}`} 
                            secondary={`Toplam Fiyat: ${order.totalPrice !== undefined ? order.totalPrice : 'Hesaplanamadı'} TL`} 
                        />
                    </ListItem>
                ))}
            </List>

            {/* Sipariş detaylarını gösterecek Modal */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ backgroundColor: '#2e4e71', color: '#fff', textAlign: 'center' }}>Sipariş Detayları</DialogTitle>
                <DialogContent sx={{ padding: '16px', backgroundColor: '#f5f5f5' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>Ürün Adı</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>Adet</TableCell>
                                <TableCell sx={{ fontWeight: 'bold', color: '#555' }}>Adres</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orderDetails.map(item => (
                                <TableRow key={item.productId}>
                                    <TableCell>{item.productName}</TableCell>
                                    <TableCell>{item.count}</TableCell>
                                    <TableCell>{item.address}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    
                    <Typography variant="h6" sx={{ marginTop: '20px', textAlign: 'right', color: 'gray' }}>
                        Toplam Fiyat: {selectedOrderTotalPrice} TL 
                    </Typography>

                    <Box display="flex" justifyContent="flex-end" mt={2}>
                        <Button onClick={handleClose} variant="contained" color="primary">Kapat</Button>
                    </Box>
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default OrderPage;
