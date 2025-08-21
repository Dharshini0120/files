import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';

const HomeCTASection: React.FC = () => {
    return (
        <Box
            sx={{
                backgroundColor: '#f8fafc',
                py: { xs: 6, md: 10 },
                position: 'relative',
                overflow: 'hidden',
                backgroundImage: 'url(/DoctorBg.png)',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
            }}
        >
            <Container maxWidth="xl">
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        textAlign: { xs: 'center', md: 'left' },
                        gap: { xs: 6, md: 0 },
                    }}
                >
                    {/* Left Content */}
                    <Box sx={{ flex: 1 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                mb: 3,
                                color: '#0f172a',
                                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '3rem' },
                                lineHeight: 1.3,
                            }}
                        >
                            Ready To <span style={{ color: '#3b82f6' }}>Improve</span> Your
                            Facility’s <br />
                            Assessment Accuracy?
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                backgroundColor: '#3b82f6',
                                textTransform: 'none',
                                borderRadius: '8px',
                                px: { xs: 3, md: 4 },
                                py: 1.5,
                                fontSize: { xs: '1rem', md: '1.1rem' },
                                fontWeight: 600,
                                '&:hover': {
                                    backgroundColor: '#2563eb'
                                }
                            }}
                        >
                            Watch Demo Now
                        </Button>
                    </Box>

                    {/* Right Image */}
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            justifyContent: 'flex-end',
                            width: '100%',
                            maxHeight: { xs: 'auto', md: '360px' },
                            overflow: 'hidden',
                        }}
                    >
                        {/* <img
              src="https://images.pexels.com/photos/3825539/pexels-photo-3825539.jpeg"
              alt="Doctor"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                borderRadius: '0px',
              }}
            /> */}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default HomeCTASection;
