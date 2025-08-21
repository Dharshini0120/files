import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Container,
    Card,
    CardContent,
    Avatar
} from '@mui/material';
import profileImg from '../../assets/profile.png';

const HomeTestimonialSection: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const testimonials = [
        {
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
            name: "Vermillion D. White",
            position: "CEO, Planet X",
            image: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 10)}.jpg`
        },
        {
            text: "Sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.",
            name: "Hayden Smith",
            position: "CTO, HealthCorp",
            image: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 10)}.jpg`
        },
        {
            text: "At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
            name: "Scarlett Johnson",
            position: "Director, MedTech",
            image: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 10)}.jpg`
        },
        {
            text: "Consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.",
            name: "Jennifer Brown",
            position: "VP, Healthcare",
            image: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 10)}.jpg`
        }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleDotClick = (index: number) => {
        setActiveIndex(index);
    };

    return (
        <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#fff' }}>
            <Container maxWidth={false} sx={{ px: { xs: 2, sm: 4, md: 8, lg: 10, xl: 16 } }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontSize: { xs: '2rem', md: '2.75rem' },
                        fontWeight: 800,
                        textAlign: 'center',
                        mb: 6,
                        lineHeight: 1.3,
                    }}
                >
                    <Box component="span" sx={{ color: '#3b82f6' }}>Trusted</Box> By Leading Healthcare
                    <br />
                    Providers
                </Typography>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        px: { xs: 0, sm: 0 },
                    }}
                >
                    <Card
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'center', sm: 'flex-start' },
                            maxWidth: { xs: '100%', md: '1200px' },
                            width: '100%',
                            borderRadius: { xs: '10px', md: '12px' },
                            border: '1px solid #e5e7eb',
                            px: { xs: 1, sm: 3, md: 6 },
                            py: { xs: 2, sm: 4, md: 6 },
                            boxShadow: 'none',
                            position: 'relative',
                            minHeight: { xs: 260, sm: 200, md: 240 },
                            overflow: 'visible',
                        }}
                    >
                        {/* Quote marks decoration */}
                        <Box
                            sx={{
                                position: 'absolute',
                                top: { xs: 'auto', md: '50%' },
                                bottom: { xs: 8, md: 'auto' },
                                right: { xs: 8, md: 32 },
                                transform: {
                                    xs: 'translateY(0) !important',
                                    md: 'translateY(-50%) !important'
                                },

                                width: { xs: 80, sm: 120, md: 210 },
                                height: { xs: 55, sm: 90, md: 210 },
                                opacity: 0.13,
                                userSelect: 'none',
                                pointerEvents: 'none',
                                zIndex: 1,
                            }}
                        >
                            <svg
                                width="100%"
                                height="100%"
                                viewBox="0 0 512 512"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ display: 'block' }}
                            >
                                <defs>
                                    <linearGradient id="quoteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#c9e6ff" />
                                        <stop offset="100%" stopColor="#e0d4ff" />
                                    </linearGradient>
                                </defs>
                                <g>
                                    <path fill="url(#quoteGradient)" d="M119.472,66.59C53.489,66.59,0,120.094,0,186.1c0,65.983,53.489,119.487,119.472,119.487 
      c0,0-0.578,44.392-36.642,108.284c-4.006,12.802,3.135,26.435,15.945,30.418c9.089,2.859,18.653,0.08,24.829-6.389 
      c82.925-90.7,115.385-197.448,115.385-251.8C238.989,120.094,185.501,66.59,119.472,66.59z"/>
                                    <path fill="url(#quoteGradient)" d="M392.482,66.59c-65.983,0-119.472,53.505-119.472,119.51c0,65.983,53.489,119.487,119.472,119.487 
      c0,0-0.578,44.392-36.642,108.284c-4.006,12.802,3.136,26.435,15.945,30.418c9.089,2.859,18.653,0.08,24.828-6.389 
      C479.539,347.2,512,240.452,512,186.1C512,120.094,458.511,66.59,392.482,66.59z"/>
                                </g>
                            </svg>
                        </Box>

                        {/* Left Side: Avatar Image */}
                        <Box
                            sx={{
                                flexShrink: 0,
                                width: { xs: 100, sm: 140, md: 180, lg: 200 },
                                height: { xs: 100, sm: 140, md: 180, lg: 200 },
                                borderRadius: '8px',
                                overflow: 'hidden',
                                mr: { xs: 0, sm: 3, md: 4 },
                                mb: { xs: 2, sm: 0 },
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Avatar
                                src={testimonials[activeIndex].image}
                                variant="rounded"
                                sx={{
                                    width: '100%',
                                    height: '100%',
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '2.8rem' },
                                    fontWeight: 700,
                                    bgcolor: testimonials[activeIndex].image ? 'transparent' : '#3b82f6',
                                    color: '#fff',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {!testimonials[activeIndex].image && testimonials[activeIndex].name.charAt(0)}
                            </Avatar>
                        </Box>

                        {/* Right Side: Text */}
                        <CardContent sx={{ p: 0, flex: 1, pt: { xs: 1, sm: 2 }, pl: { xs: 0, sm: 2, md: 3 }, minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.15rem' },
                                    color: '#374151',
                                    mb: { xs: 2, sm: 3 },
                                    lineHeight: 1.6,
                                    fontWeight: 400,
                                    wordBreak: 'break-word',
                                }}
                            >
                                {testimonials[activeIndex].text}
                            </Typography>

                            <Typography
                                sx={{
                                    fontWeight: 700,
                                    color: '#111827',
                                    fontSize: { xs: '1rem', sm: '1.05rem', md: '1.1rem' },
                                    mb: 0.5,
                                }}
                            >
                                - {testimonials[activeIndex].name}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: { xs: '0.9rem', sm: '0.95rem', md: '1rem' },
                                    color: '#6b7280',
                                    fontWeight: 400,
                                }}
                            >
                                {testimonials[activeIndex].position}
                            </Typography>
                        </CardContent>
                    </Card>
                </Box>

                {/* Navigation Dots */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: 5,
                        gap: 1,
                    }}
                >
                    {testimonials.map((_, idx) => (
                        <Box
                            key={idx}
                            onClick={() => handleDotClick(idx)}
                            sx={{
                                width: 20,
                                height: 20,
                                borderRadius: '50%',
                                backgroundColor: activeIndex === idx ? '#3b82f6' : '#d1d5db',
                                cursor: 'pointer',
                            }}
                        />
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default HomeTestimonialSection;
