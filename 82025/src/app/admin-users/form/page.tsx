/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState, useMemo, Suspense } from 'react';
import {
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Chip,
  OutlinedInput,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  Grid,
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '../../../components/PageHeader';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import { AddOutlined } from '@mui/icons-material';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_ALL_FACILITY_TYPES,
  GET_SERVICE_LINES,
  GET_USER_BY_ID,
  CREATE_USER_MUTATION,
  UPDATE_USER_MUTATION,
} from '../../../graphql/user.service';
import { GetUserByIdResponse } from '@shared-types/auth/auth.types';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { withPageLoader } from '@frontend/shared-ui';

interface CountyData {
  [stateName: string]: string[];
}

const CreateUserForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('id');
  const isEditMode = !!userId;

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

  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    facilityName: '',
    facilityType: '',
    state: '',
    county: '',
    numberOfLicensedBeds: '',
    serviceLines: ''
  });

  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState<string[]>([]);
  const [counties, setCounties] = useState<string[]>([]);
  const [stateCountyData, setStateCountyData] = useState<CountyData>({});

  // Fetch US states and counties data
  useEffect(() => {
    const fetchStatesAndCounties = async () => {
      try {
        const response = await fetch('https://api.census.gov/data/2019/pep/charagegroups?get=NAME&for=county:*');
        const data = await response.json();

        if (data && data.length > 1) {
          const stateCountyMap: CountyData = {};
          const uniqueStates = new Set<string>();

          // Skip header row
          data.slice(1).forEach((item: any) => {
            if (item[0] && item[0].includes(',')) {
              const parts = item[0].split(',');
              if (parts.length >= 2) {
                const county = parts[0].trim().replace(' County', '');
                const state = parts[1].trim();

                uniqueStates.add(state);
                if (!stateCountyMap[state]) {
                  stateCountyMap[state] = [];
                }
                if (!stateCountyMap[state].includes(county)) {
                  stateCountyMap[state].push(county);
                }
              }
            }
          });

          // Sort counties for each state
          Object.keys(stateCountyMap).forEach(state => {
            stateCountyMap[state].sort();
          });

          const sortedStates = Array.from(uniqueStates).sort();
          setStates(sortedStates);
          setStateCountyData(stateCountyMap);
        } else {
          throw new Error('Invalid data format');
        }
      } catch (error) {
        console.error('Error fetching states and counties:', error);
        // Fallback to static data
        const staticData: CountyData = {
          'Alabama': ['Autauga', 'Baldwin', 'Barbour', 'Bibb', 'Blount'],
          'Alaska': ['Aleutians East', 'Aleutians West', 'Anchorage', 'Bethel', 'Bristol Bay'],
          'Arizona': ['Apache', 'Cochise', 'Coconino', 'Gila', 'Graham'],
          'Arkansas': ['Arkansas', 'Ashley', 'Baxter', 'Benton', 'Boone'],
          'California': ['Alameda', 'Alpine', 'Amador', 'Butte', 'Calaveras'],
          'Colorado': ['Adams', 'Alamosa', 'Arapahoe', 'Archuleta', 'Baca'],
          'Connecticut': ['Fairfield', 'Hartford', 'Litchfield', 'Middlesex', 'New Haven'],
          'Delaware': ['Kent', 'New Castle', 'Sussex'],
          'Florida': ['Alachua', 'Baker', 'Bay', 'Bradford', 'Brevard'],
          'Georgia': ['Appling', 'Atkinson', 'Bacon', 'Baker', 'Baldwin'],
          'Texas': ['Anderson', 'Andrews', 'Angelina', 'Aransas', 'Archer'],
          'New York': ['Albany', 'Allegany', 'Bronx', 'Broome', 'Cattaraugus']
        };

        setStates(Object.keys(staticData).sort());
        setStateCountyData(staticData);
      }
    };

    fetchStatesAndCounties();
  }, []);

  // Update counties when state changes
  useEffect(() => {
    if (formData.state && stateCountyData[formData.state]) {
      setCounties(stateCountyData[formData.state]);
    } else {
      setCounties([]);
    }
  }, [formData.state, stateCountyData]);

  const { data: userData, loading: userLoading } = useQuery<{ getUserById: GetUserByIdResponse }>(
    GET_USER_BY_ID,
    {
      skip: !userId,
      variables: { userId },
      fetchPolicy: 'network-only',
    }
  );

  const [createUser] = useMutation(CREATE_USER_MUTATION);
  const [updateUser] = useMutation(UPDATE_USER_MUTATION);

  // 🔹 Dynamic facility types & service lines (from API) — integrated like in SignUp page
  const { data: ftData } = useQuery(GET_ALL_FACILITY_TYPES, {
    fetchPolicy: 'cache-first',
  });
  const { data: slData } = useQuery(GET_SERVICE_LINES, {
    fetchPolicy: 'cache-first',
  });

  const facilityTypes: string[] = useMemo(() => {
    const list = (ftData?.getFacilityTypes?.data ?? [])
      .map((f: any) => f?.name ?? f)
      .filter(Boolean);
    return list.length ? list.sort() : [];
  }, [ftData]);

  const serviceLinesList: string[] = useMemo(() => {
    const list = (slData?.getServiceLines?.data ?? [])
      .map((s: any) => s?.name ?? s)
      .filter(Boolean);
    return list.length ? list.sort() : [];
  }, [slData]);

  useEffect(() => {
    if (isEditMode && userData?.getUserById?.data?.user) {
      const user = userData.getUserById.data.user;
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        facilityName: user.facilityName || '',
        facilityType: user.facilityType?.name || '',
        state: user.state || '',
        county: user.county || '',
        numberOfLicensedBeds: String(user.numberOfLicensedBeds || ''),
        serviceLines: Array.isArray(user.serviceLines) ? user.serviceLines : [],
      });
    }
  }, [isEditMode, userData]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      email: '',
      phoneNumber: '',
      facilityName: '',
      facilityType: '',
      state: '',
      county: '',
      numberOfLicensedBeds: '',
      serviceLines: ''
    };

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
      isValid = false;
    }

    if (!isEditMode && !formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!isEditMode && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
      isValid = false;
    }

    if (!formData.facilityName.trim()) {
      newErrors.facilityName = 'Facility name is required';
      isValid = false;
    }

    if (!formData.facilityType) {
      newErrors.facilityType = 'Facility type is required';
      isValid = false;
    }

    if (!formData.state) {
      newErrors.state = 'State is required';
      isValid = false;
    }

    if (!formData.county) {
      newErrors.county = 'County is required';
      isValid = false;
    }

    if (!formData.numberOfLicensedBeds.trim()) {
      newErrors.numberOfLicensedBeds = 'Number of licensed beds is required';
      isValid = false;
    } else if (isNaN(Number(formData.numberOfLicensedBeds)) || Number(formData.numberOfLicensedBeds) < 1) {
      newErrors.numberOfLicensedBeds = 'Please enter a valid number greater than 0';
      isValid = false;
    }

    if (formData.serviceLines.length === 0) {
      newErrors.serviceLines = 'At least one service line is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Reset county when state changes
    if (name === 'state') {
      setFormData(prev => ({ ...prev, state: value, county: '' }));
      setErrors(prev => ({ ...prev, county: '' }));
    }
  };

  const handleMultiSelect = (e: any) => {
    const {
      target: { value },
    } = e;
    setFormData((prev) => ({
      ...prev,
      serviceLines: typeof value === 'string' ? value.split(',') : value,
    }));
    
    // Clear error when user selects service lines
    if (errors.serviceLines) {
      setErrors(prev => ({ ...prev, serviceLines: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {

      const {
        fullName,
        email,
        phoneNumber,
        facilityName,
        facilityType,
        state,
        county,
        numberOfLicensedBeds,
        serviceLines,
      } = formData;

      // Ensure serviceLines are strings, not IDs
      const validServiceLines = serviceLines.filter(line =>
        typeof line === 'string' && serviceLinesList.includes(line)
      );

      const input = isEditMode ? {
        fullName,
        phoneNumber,
        facilityName,
        facilityType,
        state,
        county,
        numberOfLicensedBeds: Number(numberOfLicensedBeds),
        serviceLines: validServiceLines,
      } : {
        fullName,
        email,
        phoneNumber,
        facilityName,
        facilityType,
        state,
        county,
        numberOfLicensedBeds: Number(numberOfLicensedBeds),
        serviceLines: validServiceLines,
      };

      const response = isEditMode
        ? await updateUser({ variables: { userId, input } })
        : await createUser({ variables: { input } });

      const result = isEditMode ? response.data.updateUser : response.data.createUser;

      if (result?.status) {
        toast.success(result.message || (isEditMode ? 'User updated successfully' : 'User created successfully'));
        router.push('/admin-users');
      } else {
        throw new Error(result?.error || 'Operation failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (isEditMode && userLoading) {
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
          title={isEditMode ? 'Edit User' : 'Create New Admin-User'}
          subtitle={isEditMode ? 'Update the Admin-User details' : 'Enter the details to create a new Admin-User'}
          showBackButton={true}
          showActionButton={true}
          actionButtonText={isEditMode ? 'Update Admin User' : 'Create Admin User'}
          onActionClick={() => handleSubmit(new Event('submit') as unknown as React.FormEvent)}
        />

        <Paper sx={{
          p: 3,
          borderRadius: '10px',
          border: '1px solid #eff0f1ff',
          boxShadow: 'none',
        }}>
          <Box component="form" onSubmit={handleSubmit}>
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
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  placeholder="Enter full name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />
              </Grid>
              <Grid size={4}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  placeholder="Enter email address"
                  disabled={isEditMode}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />
              </Grid>
              <Grid size={4}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber}
                  placeholder="Enter phone number"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />
              </Grid>

              <Grid size={4}>
                <TextField
                  fullWidth
                  label="Facility Name"
                  name="facilityName"
                  value={formData.facilityName}
                  onChange={handleChange}
                  error={!!errors.facilityName}
                  helperText={errors.facilityName}
                  placeholder="Enter facility name"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />
              </Grid>
              <Grid size={4}>
                <TextField
                  select
                  fullWidth
                  label="Facility Type"
                  name="facilityType"
                  value={formData.facilityType}
                  onChange={handleChange}
                  error={!!errors.facilityType}
                  helperText={errors.facilityType}
                  placeholder="Select facility type"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                >
                  {facilityTypes.map((type: string) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={4}>
                <TextField
                  select
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  error={!!errors.state}
                  helperText={errors.state}
                  placeholder="Select state"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                >
                  {states.map((state) => (
                    <MenuItem key={state} value={state}>
                      {state}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid size={4}>
                <TextField
                  select
                  fullWidth
                  label="County"
                  name="county"
                  value={formData.county}
                  onChange={handleChange}
                  error={!!errors.county}
                  helperText={errors.county}
                  disabled={!formData.state}
                  placeholder={!formData.state ? 'Select State first' : 'Select County'}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                >
                  {counties.map((county) => (
                    <MenuItem key={county} value={county}>
                      {county}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid size={4}>
                <TextField
                  fullWidth
                  label="Number of Licensed Beds"
                  name="numberOfLicensedBeds"
                  value={formData.numberOfLicensedBeds}
                  onChange={handleChange}
                  error={!!errors.numberOfLicensedBeds}
                  helperText={errors.numberOfLicensedBeds}
                  placeholder="Enter number of beds"
                  type="number"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }}
                />
              </Grid>
              <Grid size={4}>
                <FormControl fullWidth error={!!errors.serviceLines}>
                  <InputLabel id="service-lines-label">Service Lines</InputLabel>
                  <Select
                    labelId="service-lines-label"
                    multiple
                    value={formData.serviceLines}
                    onChange={handleMultiSelect}
                    input={<OutlinedInput label="Service Lines" sx={{ borderRadius: '8px' }} />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {(selected as string[]).map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                  >
                    {serviceLinesList.map((line: string) => (
                      <MenuItem key={line} value={line}>
                        {line}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.serviceLines && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {errors.serviceLines}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </DashboardLayout >
  );
};

const CreateUserPage = () => {
  return (
    <Suspense fallback={<CircularProgress />}>
      <CreateUserForm />
    </Suspense>
  );
};

export default withPageLoader(CreateUserPage);
