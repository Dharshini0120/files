/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, Suspense } from 'react';
import {
  Box,
  Paper,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  MenuItem,
  Grid,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { PageHeader } from '../../../components/PageHeader';
import { useQuery } from '@apollo/client';
import { GET_USER_BY_ID } from '../../../graphql/user.service';
import { GetUserByIdResponse } from '@shared-types/auth/auth.types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withPageLoader } from '@frontend/shared-ui';

const ViewHospitalUserForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');

  const { data, loading, error } = useQuery<{ getUserById: GetUserByIdResponse }>(
    GET_USER_BY_ID,
    {
      skip: !userId,
      variables: { userId },
      fetchPolicy: 'network-only',
    }
  );

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    facilityName: '',
    facilityType: '',
    state: '',
    county: '',
    numberOfLicensedBeds: '',
    serviceLines: [] as string[],
  });

  useEffect(() => {
    if (!userId) {
      toast.error('Missing user id');
      router.back();
    }
  }, [userId, router]);

  useEffect(() => {
    if (error) {
      toast.error('Unable to load user details');
    }
  }, [error]);

  useEffect(() => {
    const user = data?.getUserById?.data?.user;
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        facilityName: user.facilityName || '',
        facilityType: user.facilityType?.name || user.facilityType || '',
        state: user.state || '',
        county: user.county || '',
        numberOfLicensedBeds: String(user.numberOfLicensedBeds ?? ''),
        serviceLines: Array.isArray(user.serviceLines) ? user.serviceLines : [],
      });
    }
  }, [data]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box>
        <PageHeader
          title="Hospital User"
          subtitle="View all the details of Hospital User"
          showBackButton={true}
          showActionButton={false} // hide Create/Update button
        />

        <Paper
          sx={{
            p: 3,
            borderRadius: '10px',
            border: '1px solid #eff0f1ff',
            boxShadow: 'none',
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            mb={3}
            fontFamily={'var(--font-inter), sans-serif'}
          >
            User Details
          </Typography>

          <Grid container spacing={3}>
            <Grid size={4}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.fullName}
                disabled
                placeholder="Full Name"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid size={4}>
              <TextField
                fullWidth
                label="Email"
                value={formData.email}
                disabled
                placeholder="Email"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid size={4}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.phoneNumber}
                disabled
                placeholder="Phone Number"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid size={4}>
              <TextField
                fullWidth
                label="Facility Name"
                value={formData.facilityName}
                disabled
                placeholder="Facility Name"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid size={4}>
              <TextField
                fullWidth
                label="Facility Type"
                value={formData.facilityType}
                disabled
                placeholder="Facility Type"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid size={4}>
              <TextField
                fullWidth
                label="State"
                value={formData.state}
                disabled
                placeholder="State"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid size={4}>
              <TextField
                fullWidth
                label="County"
                value={formData.county}
                disabled
                placeholder="County"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

            <Grid size={4}>
              <TextField
                fullWidth
                type="number"
                label="Number of Licensed Beds"
                value={formData.numberOfLicensedBeds}
                disabled
                placeholder="Number of Licensed Beds"
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Grid>

<Grid size={4}>
  <FormControl
    fullWidth
    disabled
    sx={{
      '& .MuiInputLabel-root': { color: 'text.disabled' },
      '& .MuiInputLabel-root.Mui-focused': { color: 'text.disabled' },
      '& .MuiSelect-icon': { color: 'action.disabled' },
    }}
  >
    <InputLabel id="service-lines-view-label">Service Lines</InputLabel>
    <Select
      labelId="service-lines-view-label"
      multiple
      value={formData.serviceLines}
      input={<OutlinedInput label="Service Lines" sx={{ borderRadius: '8px' }} />}
      renderValue={(selected) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {(selected as string[]).map((value) => (
            <Chip
              key={value}
              label={value}
              size="small"
              variant="outlined"
              sx={{ bgcolor: 'transparent', color: 'text.secondary', borderColor: 'divider' }}
            />
          ))}
        </Box>
      )}
    >
      {formData.serviceLines.map((line) => (
        <MenuItem key={line} value={line}>
          {line}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

          </Grid>
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

const ViewHospitalUserPage: React.FC = () => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <ViewHospitalUserForm />
    </Suspense>
  );
};

export default withPageLoader(ViewHospitalUserPage);