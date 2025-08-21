import React from 'react';
import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import { Activity, Shield, AlertTriangle, BarChart3 } from 'lucide-react';
import bgOverlayTool from '../../assets/bg-overlay-tool.png';
import toolImg1 from '../../assets/tool_img2.png';
import toolImg2 from '../../assets/tool_img2.png';
import toolImg3 from '../../assets/tool_img3.png';
import toolImg4 from '../../assets/tool_img4.png';

const HomePowerfulSection: React.FC = () => {
    const tools = [
        {
            img: toolImg1,
            title: 'Real-time Data Collection',
            description: 'Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam nonumy eirmod'
        },
        {
            img: toolImg2,
            title: 'Compliance Monitoring',
            description: 'Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam nonumy eirmod'
        },
        {
            img: toolImg3,
            title: 'Risk & Incident Tracking',
            description: 'Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam nonumy eirmod'
        },
        {
            img: toolImg4,
            title: 'Analytics Dashboard',
            description: 'Lorem ipsum dolor sit amet, consectetur sadipscing elitr, sed diam nonumy eirmod'
        }
    ];

    return (
        <Box
            sx={{
                position: 'relative',
                py: { xs: 6, md: 12 },
                backgroundImage: `url(${bgOverlayTool.src})`,
                backgroundRepeat: 'repeat',
                backgroundSize: 'auto',
                backgroundPosition: 'center',
                backgroundColor: '#fff',
                overflow: 'hidden',
                width: '100%',
            }}
        >
            {/* Faded overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    zIndex: 1,
                    pointerEvents: 'none',
                }}
            />
            <Box
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '1600px',
                    mx: 'auto',
                    px: { xs: 2, sm: 3, md: 5, lg: 6 },
                    width: '100%'
                }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        textAlign: 'center',
                        fontWeight: 800,
                        mb: { xs: 6, md: 10 },
                        color: '#1a1a1a',
                        fontSize: { xs: '32px', sm: '40px', md: '44.8px' },
                        lineHeight: 1.1,
                        fontFamily: '"Inter", sans-serif',
                    }}
                >
                    <span style={{ color: '#4285f4' }}>Powerful Tools</span>{' '}
                    Tailored For <br />
                    <span style={{ color: '#1a1a1a' }}>Healthcare Settings</span>
                </Typography>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: '1fr 1fr',
                            md: 'repeat(4, 1fr)'
                        },
                        gap: { xs: 4, sm: 5, md: 8 },
                        width: '100%',
                    }}
                >
                    {tools.map((tool, index) => {
                        return (
                            <Card
                                key={index}
                                elevation={0}
                                sx={{
                                    backgroundColor: 'transparent',
                                    boxShadow: 'none',
                                    borderRadius: '16px',
                                    border: 'none',
                                    p: { xs: 4, md: 5 },
                                    textAlign: 'center',
                                    minHeight: { xs: '240px', md: '280px' },
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    transition: 'all 0.3s ease',
                                    width: '100%',
                                    '&:hover': {
                                        transform: 'translateY(-6px)',
                                    },
                                }}
                            >
                                <CardContent sx={{ p: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <Box
                                        sx={{
                                            mb: { xs: 3, md: 5 },
                                            lineHeight: 1,
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <img
                                            src={typeof tool.img === 'string' ? tool.img : tool.img.src}
                                            alt={tool.title}
                                            style={{
                                                width: 56,
                                                height: 56,
                                                objectFit: 'contain',
                                                display: 'block',
                                            }}
                                        />
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        sx={{
                                            fontWeight: 700,
                                            fontSize: { xs: '20px', md: '26px' },
                                            color: '#1a1a1a',
                                            mb: { xs: 2, md: 4 },
                                            lineHeight: 1.2,
                                            fontFamily: '"Inter", sans-serif',
                                        }}
                                    >
                                        {tool.title}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: '#6b7280',
                                            fontSize: { xs: '18px', md: '20px' },
                                            lineHeight: 1.6,
                                            fontFamily: '"Inter", sans-serif',
                                            fontWeight: 500,
                                        }}
                                    >
                                        {tool.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        );
                    })}
                </Box>
            </Box>
        </Box>
    );
};

export default HomePowerfulSection;
