/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Chip, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Visibility, Assessment, Business, Assignment, MoreHoriz, RemoveRedEyeOutlined } from '@mui/icons-material';
import { Edit } from 'lucide-react';
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useSelector } from "react-redux";
import { PageLoader, withPageLoader } from "@frontend/shared-ui";

const statusStyles: any = {
  'In Progress': {
    backgroundColor: '#fff3cd',
    color: '#d8a714ff',
    fontWeight: 600,
    borderRadius: '4px',
    padding: '4px 8px',
    width: '120px',
    textAlign: 'center',
  },
  "Completed": {
    backgroundColor: '#d4edda',
    fontWeight: 600,
    borderRadius: '4px',
    padding: '4px 8px',
    width: '120px',
    textAlign: 'center',
    color: '#18cf43ff',
  },
};

const Dashboard = () => {
  const authSlice = useSelector((state: any) => state.auth?.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <PageLoader loading={loading}>
      <DashboardLayout>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h5" fontWeight={600}>
            Welcome back, {authSlice?.fullName}
          </Typography>
          <Chip label="Last Assessment: August 07, 2025" variant="filled" style={{ borderRadius: '8px', border: '0px', padding: '5px' }} />
        </Box>
        <Typography variant="subtitle2" color="grey" mb={3}>
          {authSlice?.facilityName} Dashboard
        </Typography>

        <Grid container spacing={3} mb={3}>
          <Grid size={4}>
            <Card style={{ boxShadow: 'rgba(141, 136, 136, 0.02) 0px 1px 3px 0px, rgba(97, 106, 116, 0.15) 0px 0px 0px 1px', borderRadius: '8px' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, padding: '20px', position: 'relative' }}>
                <Assessment sx={{ fontSize: 60, color: 'warning.main', backgroundColor: '#fff8e1', padding: '10px', borderRadius: '8px' }} />
                <Box>
                  <Typography color="text.primary" style={{ fontWeight: 600 }}>
                    Current Assessment Status
                  </Typography>
                  <Typography variant="h6" color="warning" sx={{ fontWeight: 600 }} >In Progress</Typography>
                </Box>
                <IconButton sx={{ position: 'absolute', top: 13, right: 13, border: '1px solid #cfcdcdff', borderRadius: '20px', padding: '3px' }}>
                  <MoreHoriz style={{ fontSize: '16px', color: '#cfcdcdff' }} />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={4}>
            <Card style={{ boxShadow: 'rgba(141, 136, 136, 0.02) 0px 1px 3px 0px, rgba(97, 106, 116, 0.15) 0px 0px 0px 1px', borderRadius: '8px' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, padding: '20px', position: 'relative' }}>
                <Assignment sx={{ fontSize: 60, color: 'success.main', backgroundColor: '#e8f5e8', padding: '10px', borderRadius: '8px' }} />
                <Box>
                  <Typography color="text.primary" style={{ fontWeight: 600 }}>
                    Completed Assessments
                  </Typography>
                  <Typography variant="h6" color="success.main" sx={{ fontWeight: 600 }} >12</Typography>
                </Box>
                <IconButton sx={{ position: 'absolute', top: 13, right: 13, border: '1px solid #cfcdcdff', borderRadius: '20px', padding: '3px' }}>
                  <MoreHoriz style={{ fontSize: '16px', color: '#cfcdcdff' }} />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
          <Grid size={4}>
            <Card style={{ boxShadow: 'rgba(141, 136, 136, 0.02) 0px 1px 3px 0px, rgba(97, 106, 116, 0.15) 0px 0px 0px 1px', borderRadius: '8px' }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, padding: '20px', position: 'relative' }}>
                <Business sx={{ fontSize: 60, color: 'primary.main', backgroundColor: '#e3f2fd', padding: '10px', borderRadius: '8px' }} />
                <Box>
                  <Typography color="text.primary" style={{ fontWeight: 600 }}>
                    Facility Information
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }} >City General Hospital</Typography>
                </Box>
                <IconButton sx={{ position: 'absolute', top: 13, right: 13, border: '1px solid #cfcdcdff', borderRadius: '20px', padding: '3px' }}>
                  <MoreHoriz style={{ fontSize: '16px', color: '#cfcdcdff' }} />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>

        </Grid>





        <Box sx={{ border: '1px solid #e4e5e7', borderRadius: '10px', padding: 2, backgroundColor: '#fff', minHeight: 600 }}>
          <Typography variant="subtitle1" mb={2} style={{ fontWeight: 600 }}>
            Previous Assessments
          </Typography>
          <TableContainer style={{ borderRadius: '12px', overflow: 'hidden' }} >
            <Table >
              <TableHead sx={{ backgroundColor: '#f5f9ff' }}>
                <TableRow>
                  <TableCell><strong>Assessment Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Completed By</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow >
                  <TableCell>August 7, 2025</TableCell>
                  <TableCell>
                    <Box sx={statusStyles['In Progress']}>In Progress</Box>
                  </TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <IconButton  ><Edit style={{ fontSize: '25px', color: '#408bff' }} /></IconButton>
                  </TableCell>
                </TableRow>
                <TableRow >
                  <TableCell>August 2, 2025</TableCell>
                  <TableCell>
                    <Box sx={statusStyles['Completed']}>Completed</Box>
                  </TableCell>
                  <TableCell>Dr. Sarah Johnson</TableCell>
                  <TableCell>
                    <IconButton><RemoveRedEyeOutlined style={{ fontSize: '25px', color: '#408bff' }} /></IconButton>
                    <IconButton><PictureAsPdfIcon style={{ fontSize: '25px', color: '#18cf43ff' }} /></IconButton>
                  </TableCell>
                </TableRow>

              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      </DashboardLayout>
    </PageLoader>
  );
};

export default withPageLoader(Dashboard);