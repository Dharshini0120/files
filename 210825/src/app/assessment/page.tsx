/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from 'react';
import {
  Box, Button, Typography, MenuItem, Select, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Grid, InputLabel, FormControl
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { AddOutlined, Edit, RemoveRedEyeOutlined } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { withPageLoader } from "@frontend/shared-ui";
import { GET_USERS_TEMPLATES_QUERY, FacilityWithServicesInput, GetUsersTemplatesData } from '../../graphql/templates.service';
import { RootState } from '../../store/store';

// ⬇️ NEW: import your template JSON instead of reading localStorage
import templateJson from '../../data/hospitalTemplate.json';

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
  Completed: {
    backgroundColor: '#d4edda',
    fontWeight: 600,
    borderRadius: '4px',
    padding: '4px 8px',
    width: '120px',
    textAlign: 'center',
    color: '#18cf43ff',
  },
};

type Template = {
  id: string;
  name: string;
  description: string;
  nodes: any[];
  edges: any[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
};

const Assessment = () => {
  const [status, setStatus] = React.useState('');
  const [allTime, setAllTime] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState('');
  const router = useRouter();

  // Get user data from Redux store
  const user = useSelector((state: RootState) => state.auth.user);

  // Extract facilities from user data for the API call
  const userFacilities: FacilityWithServicesInput[] = user?.facilities?.map(facility => ({
    facility_id: facility.facility_id,
    services: facility.services
  })) || [];

  // GraphQL query to fetch user templates
  const { data: templatesData, loading: templatesLoading, error: templatesError } = useQuery<GetUsersTemplatesData>(
    GET_USERS_TEMPLATES_QUERY,
    {
      variables: {
        facilities: userFacilities
      },
      fetchPolicy: 'cache-and-network',
      skip: userFacilities.length === 0, // Skip query if no facilities available
      onError: (error) => {
        console.error('Error fetching user templates:', error);
        toast.error('Failed to load templates. Please try again.');
      }
    }
  );

  const handleNewAssessment = () => {
    console.log('New Assessment clicked');
    console.log('User facilities:', userFacilities);
    console.log('Templates data:', templatesData);

    // Check if user has facilities
    if (userFacilities.length === 0) {
      toast.error('No facilities found for your account. Please contact your administrator.');
      return;
    }

    // Check if templates are loading
    if (templatesLoading) {
      toast.info('Loading templates, please wait...');
      return;
    }

    // Check if there was an error loading templates
    if (templatesError) {
      toast.error('Failed to load templates. Please try again.');
      return;
    }

    // Get templates from API response
    const apiTemplates = templatesData?.usersTemplates?.scenarioVersions || [];

    // Filter for active templates with questionnaire data
    const availableTemplates = apiTemplates.filter(
      (template) =>
        template.status === 'ACTIVE' &&
        template.isLatest &&
        template.questionnaire &&
        template.questionnaire.nodes &&
        Array.isArray(template.questionnaire.nodes) &&
        template.questionnaire.nodes.length > 0
    );

    if (availableTemplates.length === 0) {
      // Fallback to local template if no API templates available
      const templates: Template[] = Array.isArray(templateJson)
        ? (templateJson as Template[])
        : [templateJson as Template];

      const completedTemplates = templates.filter(
        (t) =>
          (t.status ?? 'Completed') === 'Completed' &&
          Array.isArray(t.nodes) &&
          Array.isArray(t.edges) &&
          t.nodes.length > 0
      );

      if (completedTemplates.length === 0) {
        toast.error('No templates available for assessment. Please contact your administrator.');
        return;
      }
    }

    // Store the selected template data in sessionStorage for the assessment page
    if (availableTemplates.length > 0) {
      // Use the first available template from API
      const selectedTemplate = availableTemplates[0];
      sessionStorage.setItem('selectedTemplate', JSON.stringify({
        id: selectedTemplate._id,
        name: selectedTemplate.scenario.name,
        questionnaire: selectedTemplate.questionnaire,
        version: selectedTemplate.version,
        facilities: selectedTemplate.facilities,
        services: selectedTemplate.services
      }));
      toast.success(`Selected template: ${selectedTemplate.scenario.name}`);
    }

    // Navigate to assessment page
    router.push('/assessment/new');
  };

  return (
    <DashboardLayout>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={600} fontFamily={'var(--font-inter), sans-serif'}>Assessment Records</Typography>
            <Typography variant="subtitle1" color="#6c757d" fontFamily={'var(--font-inter), sans-serif'}>
              View and manage all assessments for City General Hospital
            </Typography>
            {userFacilities.length === 0 && (
              <Typography variant="caption" color="error" fontFamily={'var(--font-inter), sans-serif'}>
                No facilities found - contact administrator
              </Typography>
            )}
            {templatesLoading && (
              <Typography variant="caption" color="primary" fontFamily={'var(--font-inter), sans-serif'}>
                Loading available templates...
              </Typography>
            )}
            {templatesData && !templatesLoading && (
              <Typography variant="caption" color="success.main" fontFamily={'var(--font-inter), sans-serif'}>
                {templatesData.usersTemplates.scenarioVersions.length} templates available
              </Typography>
            )}
          </Box>
          <Button
            onClick={handleNewAssessment}
            variant="contained"
            size='large'
            disabled={templatesLoading || userFacilities.length === 0}
            sx={{
              background: templatesLoading || userFacilities.length === 0
                ? '#ccc'
                : 'linear-gradient(90deg, #408bff 0%, #3a7de6 100%)',
              textTransform: 'none',
              letterSpacing: '0.5px',
              fontWeight: 500,
              fontFamily: 'var(--font-inter), sans-serif',
              borderRadius: '4px',
              padding: '8px 24px',
              boxShadow: '0 2px 8px rgba(64, 139, 255, 0.25)',
              border: 'none',
              '&:hover': {
                background: templatesLoading || userFacilities.length === 0
                  ? '#ccc'
                  : 'linear-gradient(90deg, #3a7de6 0%, #3670cc 100%)',
                boxShadow: '0 4px 12px rgba(64, 139, 255, 0.3)',
              }
            }}
          >
            <AddOutlined /> &nbsp; {templatesLoading ? 'Loading...' : 'New Assessment'}
          </Button>
        </Box>

        <Box sx={{ border: '1px solid #e4e5e7', borderRadius: '10px', padding: 3, backgroundColor: '#fff' }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid>
              <FormControl sx={{ minWidth: 230 }}>
                <InputLabel>Status</InputLabel>
                <Select
                  value={status}
                  label="Status"
                  style={{ borderRadius: '12px', height: '50px' }}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <FormControl sx={{ minWidth: 230 }}>
                <InputLabel>All Time</InputLabel>
                <Select
                  value={allTime}
                  label="All Time"
                  style={{ borderRadius: '12px', height: '50px' }}
                  onChange={(e) => setAllTime(e.target.value)}
                >
                  <MenuItem value="All Time">All Time</MenuItem>
                  <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <FormControl sx={{ minWidth: 230 }}>
                <InputLabel>Most Recent</InputLabel>
                <Select
                  value={sortOrder}
                  label="Most Recent"
                  style={{ borderRadius: '12px', height: '50px' }}
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <MenuItem value="Most Recent">Most Recent</MenuItem>
                  <MenuItem value="Oldest">Oldest</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <TableContainer style={{ borderRadius: '12px', overflow: 'hidden' }}>
            <Table>
              <TableHead sx={{ backgroundColor: '#f5f9ff' }}>
                <TableRow>
                  <TableCell><strong>Assessment Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Completed By</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>August 7, 2025</TableCell>
                  <TableCell><Box sx={statusStyles['In Progress']}>In Progress</Box></TableCell>
                  <TableCell>-</TableCell>
                  <TableCell>
                    <IconButton><Edit style={{ fontSize: '25px', color: '#408bff' }} /></IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>July 15, 2025</TableCell>
                  <TableCell><Box sx={statusStyles['Completed']}>Completed</Box></TableCell>
                  <TableCell>Dr. Michael Lee</TableCell>
                  <TableCell>
                    <IconButton><RemoveRedEyeOutlined style={{ fontSize: '25px', color: '#408bff' }} /></IconButton>
                    <IconButton><PictureAsPdfIcon style={{ fontSize: '25px', color: '#18cf43ff' }} /></IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>June 28, 2025</TableCell>
                  <TableCell><Box sx={statusStyles['Completed']}>Completed</Box></TableCell>
                  <TableCell>Dr. Priya Patel</TableCell>
                  <TableCell>
                    <IconButton><RemoveRedEyeOutlined style={{ fontSize: '25px', color: '#408bff' }} /></IconButton>
                    <IconButton><PictureAsPdfIcon style={{ fontSize: '25px', color: '#18cf43ff' }} /></IconButton>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>May 10, 2025</TableCell>
                  <TableCell><Box sx={statusStyles['Completed']}>Completed</Box></TableCell>
                  <TableCell>Dr. Emily Chen</TableCell>
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
  );
};

export default withPageLoader(Assessment);
