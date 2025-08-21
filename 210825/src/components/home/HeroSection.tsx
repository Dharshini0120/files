import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import styles from './home.module.css';

const HomeSection: React.FC = () => {
    return (
        <Box
            className={styles['css-1n4ryha']}
            sx={{
                position: 'relative',
                backgroundImage: `url(/Homepage-Bg.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: { xs: '600px', sm: '650px', md: '500px' },
                display: 'flex',
                alignItems: 'center',
                py: { xs: 4, md: 0 },
                overflow: 'hidden',
            }}
        >
            {/* White Gradient Overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background:
                        'linear-gradient(to right, rgba(236, 236, 236, 0.95) 0%, rgba(255, 255, 255, 0.43) 30%, rgba(255,255,255,0) 90%)',
                    zIndex: 1,
                }}
            />

            <Box
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    maxWidth: '1200px',
                    px: { xs: 2, sm: 3, md: 4 },
                    mx: 'auto',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        minHeight: { xs: '600px', sm: '650px', md: '750px' },
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {/* Text Content */}
                    <Box
                        className={styles.heroTextContainer}
                        sx={{
                            width: { xs: '100%', sm: '90%', md: '95%', lg: '85%', xl: '90%' },
                            maxWidth: { xs: '100%', sm: '450px', md: '900px', lg: '1100px', xl: '1200px' },
                            marginLeft: { xs: 'auto', sm: 'auto', md: '0', lg: '0', xl: '0' },
                            marginRight: { xs: 'auto', sm: 'auto', md: '0', lg: '0', xl: '0' },
                            paddingTop: { xs: '40px', sm: '60px', md: '80px', lg: '100px', xl: '120px' },
                            paddingBottom: { xs: '20px', sm: '0' },
                            paddingLeft: { xs: 0, md: 2, lg: 4, xl: 6 },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            minHeight: { xs: '280px', sm: '350px', md: '450px', lg: '550px', xl: '600px' },
                            textAlign: { xs: 'center', sm: 'left' },
                        }}
                    >
                        <Typography
                            variant="h2"
                            sx={{
                                fontWeight: 900,
                                fontSize: { xs: '2rem', sm: '2.5rem', md: '44.8px' },
                                lineHeight: 1.8,
                                mb: 3,
                                color: '#000000',
                                fontFamily: 'Inter, sans-serif',
                            }}
                        >
                            Streamline Your{' '}
                            <span style={{ color: '#3b82f6', fontWeight: 900 }}>Facility</span>
                            <br />
                            <span style={{ color: '#3b82f6', fontWeight: 900 }}>Assessments</span> with Confidence
                        </Typography>

                        <Typography
                            variant="h6"
                            sx={{
                                color: '#374151',
                                mb: 4,
                                lineHeight: 1.6,
                                fontWeight: 700,
                                fontSize: { xs: '16px', sm: '18px', md: '32px' },
                            }}
                        >
                            Empowering hospitals and care homes with real-time compliance,
                            safety, and performance assessments all in one intuitive platform.
                        </Typography>

                        <Button
                            variant="contained"
                            size="large"
                            sx={{
                                backgroundColor: '#3b82f6',
                                textTransform: 'none',
                                borderRadius: '8px',
                                px: 3,
                                minWidth: 'unset',
                                py: 1.5,
                                fontSize: { xs: '16px', sm: '18px', md: '20px' },
                                fontWeight: 600,
                                alignSelf: { xs: 'center', sm: 'flex-start' },
                                '&:hover': {
                                    backgroundColor: '#2563eb',
                                },
                            }}
                        >
                            Start Your Free Assessment
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default HomeSection;
