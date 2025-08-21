import React, { useState } from 'react';
import { Box, Typography, Container, Card, CardContent } from '@mui/material';
import Image from 'next/image';
import doctorImg from '../../assets/doctor.png';
import cardImg1 from '../../assets/card-img1.png';
import cardImg2 from '../../assets/card-img2.png';
import cardImg3 from '../../assets/card-img3.png';
import styles from './home.module.css';

type Feature = {
  img: string | { src: string };
  title: string;
  description: string;
};

const FEATURES: Feature[] = [
  {
    img: cardImg1,
    title: 'Comprehensive Assessments',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
  },
  {
    img: cardImg2,
    title: 'Benchmarking',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
  },
  {
    img: cardImg3,
    title: 'Detailed Reports',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat.',
  },
];

const HomeAssessmentSection: React.FC = () => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const activeIndex = hoverIndex ?? 0;

  return (
    <Box sx={{ pt: { xs: 2, md: 2 }, pb: { xs: 6, md: 10 }, mt: { xs: 0, md: 10 }, backgroundColor: '#ffffff' }}>
      <Container maxWidth="xl">
        {/* Section Heading */}
        <Typography
          variant="h3"
          sx={{
            textAlign: 'center',
            fontWeight: 800,
            mb: { xs: 4, md: 8 },
            color: '#1f2937',
            fontSize: { xs: '2.2rem', sm: '2.8rem', md: '2.8rem' },
            lineHeight: 1.15,
          }}
        >
          Our Digital <span style={{ color: '#3b82f6', fontWeight: 800 }}>Assessment</span>
          <br />
          Solves All These
        </Typography>

        {/* Image + Cards Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 3, md: 4, lg: 0 },
            alignItems: 'stretch',
            justifyContent: { md: 'flex-start', lg: 'center' },
            width: '100%',
            maxWidth: { xs: '100%', md: '90%', xl: '100%' },
            mx: 'auto',
          }}
        >
          {/* Doctor Image */}
          <Box
            sx={{
              flex: 1.5,
              order: { xs: 2, md: 1 },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: { xs: 3, md: 4, lg: 12 },
            }}
          >
            <Image
              src={typeof doctorImg === 'string' ? doctorImg : doctorImg.src}
              alt="Doctor with tablet"
              width={800}
              height={650}
              style={{
                width: '100%',
                height: '100%',
                maxWidth: 800,
                maxHeight: 650,
                borderRadius: '24px',
                objectFit: 'cover',
                boxShadow: '0 16px 40px rgba(0,0,0,0.15)',
              }}
              priority
            />
          </Box>

          {/* Cards */}
          <Box
            sx={{
              flex: 1.5,
              order: { xs: 1, md: 2 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 4,
              maxWidth: { xs: '100%', md: 1100 },
              width: '100%',
            }}
          >
            {FEATURES.map((feature, index) => {
              const isActive = activeIndex === index;
              const imageSrc = typeof feature.img === 'string' ? feature.img : feature.img.src;

              return (
                <Card
                  key={index}
                  onMouseEnter={() => setHoverIndex(index)}
                  onMouseLeave={() => setHoverIndex(null)}
                  sx={{
                    border: '2.5px solid',
                    borderColor: isActive ? '#3b82f6' : '#e5e7eb',
                    borderRadius: '16px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
                    width: '100%',
                    maxWidth: 600,
                    mx: 'auto',
                    background: isActive ? 'rgba(59, 130, 246, 0.06)' : '#fff',
                    transition: 'border-color 120ms ease, background 120ms ease',
                    position: 'relative',
                    overflow: 'visible',
                    cursor: 'default',
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 2, md: 2.5 },
                      position: 'relative',
                      pr: { xs: 2, md: 10 },
                      pb: { xs: 2, md: 4 },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        gap: 0.5,
                        position: 'relative',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          alignItems: 'center',
                          width: '100%',
                          mb: { xs: 1, md: 0 },
                          minWidth: 0,
                        }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: 700,
                            color: '#1f2937',
                            fontSize: { xs: '1.1rem', md: '1.4rem' },
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          {feature.title}
                        </Typography>

                        {/* Small image on mobile */}
                        <Box sx={{ display: { xs: 'block', md: 'none' }, ml: 1 }}>
                          <Image
                            src={imageSrc}
                            alt={feature.title}
                            width={32}
                            height={32}
                            style={{ objectFit: 'contain', display: 'block' }}
                          />
                        </Box>
                      </Box>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#6b7280',
                          lineHeight: 1.6,
                          fontWeight: 500,
                          fontSize: { xs: '15px', md: '18px' },
                          wordBreak: 'break-word',
                          mt: { xs: 1, md: 0 },
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        {feature.description}
                      </Typography>

                      {/* Large image on desktop */}
                      <Box
                        sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute' }}
                        className={styles.cardImageAbsolute}
                      >
                        <Image
                          src={imageSrc}
                          alt={feature.title}
                          width={48}
                          height={48}
                          style={{ objectFit: 'contain', display: 'block' }}
                        />
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomeAssessmentSection;
