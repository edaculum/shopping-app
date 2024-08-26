//rfce
import React from 'react';
import Container from '@mui/material/Container';

function PageContainer({ children }) {
    return (
        <Container maxWidth="lg" style={{ padding: '20px' }}>
            {children}
        </Container>
    );
}

export default PageContainer;
