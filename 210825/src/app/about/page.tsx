
import React from 'react';
import HomeLayout from '../../components/layout/HomeLayout';
import { Typography, Container, Divider, Box } from '@mui/material';


function About() {
  return (
    <HomeLayout>
      <Container sx={{ py: 8,mt:5 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" fontWeight={800} gutterBottom color='#3b82f6'>
            Future of Facility Assessments
          </Typography>
          <Typography variant="h6" color="text.primary">

            Transforming compliance, safety, and performance for hospitals and care homes.
          </Typography>
        </Box>
        <Divider sx={{ mb: 4 }} />
        <Box mb={5}>
          <Typography variant="body1" fontSize={20} mb={2}>
            Our journey began with a simple vision: to empower healthcare organizations with the tools they need to deliver safer, more efficient care. We recognized the challenges faced by hospitals and care homes in maintaining compliance and operational excellence, and set out to build a platform that makes assessments effortless, insightful, and actionable.
          </Typography>
        </Box>
        <Box mb={5}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            Why Choose Us?
          </Typography>
          <ul style={{ fontSize: 18, color: '#374151', marginLeft: 24, marginBottom: 0 }}>
            <li>All-in-one digital assessments for healthcare facilities</li>
            <li>Instant compliance and safety monitoring</li>
            <li>Benchmarking and performance analytics</li>
            <li>Automated, easy-to-read reports</li>
            <li>Intuitive design for every user</li>
          </ul>
        </Box>
        <Box mb={5}>
          <Typography variant="h5" fontWeight={700} mb={2}>
            Our Commitment
          </Typography>
          <Typography variant="body1" fontSize={20}>
            We are dedicated to supporting healthcare teams in their mission to provide outstanding care. By simplifying facility assessments, we help you focus on what truly matters—your patients and residents.
          </Typography>
        </Box>

      </Container>
    </HomeLayout>
  );
}

export default About;