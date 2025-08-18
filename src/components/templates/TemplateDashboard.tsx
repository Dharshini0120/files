'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Pagination,
  CircularProgress
} from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import TemplateTable from './TemplateTable';
import TemplatePreviewModal from './TemplatePreviewModal';
import {
  GET_ALL_SCENARIOS_QUERY,
  GetAllScenariosData,
  ScenarioVersion,
  GET_SCENARIO_BY_ID_QUERY,
  GetScenarioByIdData,
  DELETE_SCENARIO_MUTATION,
  DeleteScenarioData
} from '../../graphql/scenario.service';
import { toast } from 'react-toastify';

interface TemplateRecord {
  id: string;
  templateName: string;
  templateDescription?: string;
  status: 'In Progress' | 'Completed' | 'ACTIVE';
  version?: string;
  createdAt?: string;
  questionnaire?: any;
}

const ITEMS_PER_PAGE = 5;

const TemplateDashboard: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [sortFilter, setSortFilter] = useState('Most Recent');
  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [previewTemplate, setPreviewTemplate] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  // GraphQL query for getting all scenarios
  const { data: scenariosData, loading: scenariosLoading, refetch: refetchScenarios } = useQuery<GetAllScenariosData>(
    GET_ALL_SCENARIOS_QUERY,
    {
      variables: {
        page: 1,
        limit: 100, // Get more records to show all
        sortBy: "version",
        sortOrder: "desc"
      },
      fetchPolicy: 'cache-and-network'
    }
  );

  // GraphQL mutation for deleting scenario
  const [deleteScenario, { loading: deleteLoading }] = useMutation<DeleteScenarioData>(DELETE_SCENARIO_MUTATION);

  const loadTemplates = () => {
    if (scenariosData?.getAllScenarios?.scenarioVersions) {
      // Convert API data to template format - ONLY API data
      const apiTemplates: TemplateRecord[] = scenariosData.getAllScenarios.scenarioVersions.map((scenario: ScenarioVersion) => ({
        id: scenario._id,
        templateName: scenario.scenario.name,
        templateDescription: '', // API doesn't provide description
        status: scenario.status === 'ACTIVE' ? 'Completed' : 'In Progress',
        version: scenario.version,
        createdAt: scenario.createdAt,
        questionnaire: scenario.questionnaire
      }));

      // Set only API templates - no local storage, no hardcoded data
      setTemplates(apiTemplates);
    } else {
      // If no API data, show empty list
      setTemplates([]);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, [scenariosData]); // Trigger when API data changes

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleFocus = () => {
      refetchScenarios(); // Refetch from API on focus
      loadTemplates();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetchScenarios]);

  const handleEdit = (id: string) => {
    // Use the scenario version ID for editing
    router.push(`/questionnaire-builder?mode=edit&scenarioId=${id}`);
  };

  const handleNewTemplate = () => {
    router.push('/questionnaire-builder?mode=new');
  };

  const handleDelete = async (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (!template) return;

    if (!confirm(`Are you sure you want to delete "${template.templateName}"?`)) return;

    try {
      console.log('🗑️ Deleting scenario with ID:', id);

      const result = await deleteScenario({
        variables: { id }
      });

      if (result.data?.deleteScenario) {
        console.log('✅ Scenario deleted successfully');
        toast.success(`Template "${template.templateName}" deleted successfully!`);

        // Refetch scenarios to update the list
        refetchScenarios();
      } else {
        toast.error('Failed to delete template');
      }
    } catch (error: any) {
      console.error('❌ Error deleting scenario:', error);
      toast.error(`Failed to delete template: ${error.message}`);
    }
  };

  const handleView = (id: string) => {
    const template = templates.find((t) => t.id === id);
    if (!template) {
      toast.error('Template not found!');
      return;
    }

    // Use the template data directly from API
    setPreviewTemplate({
      ...template,
      nodes: template.questionnaire?.nodes || [],
      edges: template.questionnaire?.edges || [],
      name: template.templateName,
      description: template.templateDescription || ''
    });
  };

  const filteredTemplates = templates.filter((template) => {
    return statusFilter === 'All Statuses' || template.status === statusFilter;
  });

  const totalPages = Math.ceil(filteredTemplates.length / ITEMS_PER_PAGE);
  const paginatedTemplates = filteredTemplates.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={600} fontFamily={'var(--font-inter), sans-serif'}>
            Templates
          </Typography>
          <Typography variant="subtitle1" color="#6c757d" fontFamily={'var(--font-inter), sans-serif'}>
            View and manage all templates for City General Hospital
          </Typography>
        </Box>
        <Button
          onClick={handleNewTemplate}
          variant="contained"
          size="large"
          sx={{
            background: 'linear-gradient(90deg, #408bff 0%, #3a7de6 100%)',
            textTransform: 'none',
            letterSpacing: '0.5px',
            fontWeight: 500,
            fontFamily: 'var(--font-inter), sans-serif',
            borderRadius: '4px',
            padding: '8px 24px',
            boxShadow: '0 2px 8px rgba(64, 139, 255, 0.25)',
            '&:hover': {
              background: 'linear-gradient(90deg, #3a7de6 0%, #3670cc 100%)',
              boxShadow: '0 4px 12px rgba(64, 139, 255, 0.3)'
            }
          }}
        >
          <AddOutlined /> &nbsp; New Template
        </Button>
      </Box>

      {/* Filter + Table Section */}
      <Paper sx={{ borderRadius: '10px', padding: 3, backgroundColor: '#fff' }}>
        {/* Filters */}
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item>
            <FormControl sx={{ minWidth: 230 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <MenuItem value="All Statuses">All Statuses</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Sort by</InputLabel>
              <Select
                value={sortFilter}
                label="Sort by"
                onChange={(e) => setSortFilter(e.target.value)}
              >
                <MenuItem value="Most Recent">Most Recent</MenuItem>
                <MenuItem value="Oldest">Oldest</MenuItem>
                <MenuItem value="A-Z">A-Z</MenuItem>
                <MenuItem value="Z-A">Z-A</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Table */}
        {scenariosLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <TemplateTable
            templates={paginatedTemplates}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
            showHeader
          />
        )}

        {/* Pagination */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
          <Typography variant="body2" color="#6c757d">
            Showing {paginatedTemplates.length} of {filteredTemplates.length} templates
          </Typography>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(event, value) => setCurrentPage(value)}
            color="primary"
            shape="rounded"
            sx={{ '& .MuiPaginationItem-root': { borderRadius: '8px' } }}
          />
        </Box>
      </Paper>

      {/* Preview Modal */}
      {previewTemplate && (
        <TemplatePreviewModal template={previewTemplate} onClose={() => setPreviewTemplate(null)} />
      )}
    </Box>
  );
};

export default TemplateDashboard;
