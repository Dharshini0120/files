import React from 'react';
import HomeLayout from '../../components/layout/HomeLayout';
import { Typography, Container, Box, TextField, Button, Divider } from '@mui/material';
import client from '@frontend/apollo-client';

function Contact() {
    return (
        <HomeLayout>
            <Container maxWidth="sm" sx={{ py: 8 ,mt:5}}>
                <Box textAlign="center" mb={4}>
                    <Typography variant="h3" fontWeight={800} gutterBottom color='#3b82f6'>
                        Contact Us
                    </Typography>
                    <Typography variant="h6" color="text.primary">
                        Have questions or need support? We&apos;re here to help.
                    </Typography>
                </Box>
                <Divider sx={{ mb: 4 }} />
                <Box mb={4}>
                    <Typography variant="body1" fontSize={18} mb={2}>
                        Reach out to our team for any inquiries, feedback, or assistance. Fill out the form below or use the contact details provided.
                    </Typography>
                </Box>
                <Box component="form" noValidate autoComplete="off" mb={4}>
                    <TextField
                        fullWidth
                        label="Your Name"
                        margin="normal"
                        variant="outlined"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Your Email"
                        margin="normal"
                        variant="outlined"
                        type="email"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Message"
                        margin="normal"
                        variant="outlined"
                        multiline
                        rows={4}
                        required
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{ mt: 2, borderRadius: 2 }}

                    >
                        Send Message
                    </Button>
                </Box>
                <Divider sx={{ mb: 4 }} />
                <Box textAlign="center">
                    <Typography variant="body2" color="text.primary" style={{ padding: '5px 0px' }}>
                        Email: <a href="mailto:support@facilityassess.com">info@gmail.com</a>
                    </Typography>
                    <Typography variant="body2" color="text.primary">
                        Phone: <a href="tel:+1234567890">+1 (234) 567-890</a>
                    </Typography>
                </Box>
            </Container>
        </HomeLayout>
    );
}

export default Contact;