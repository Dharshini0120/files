'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery, useMutation } from '@apollo/client';
import { toast } from 'react-toastify';
import { GET_ALL_FACILITY_TYPES, GET_SERVICE_LINES } from '../../graphql/user.service';
import { GET_SCENARIO_BY_ID_QUERY, UPDATE_TEMPLATE_MUTATION, UpdateTemplateData, UpdateScenarioInput } from '../../graphql/scenario.service';

type StartPayload = {
  templateName: string;
  facilityTypes: string[];
  serviceLines: string[];
};

interface StartDialogProps {
  onAddQuestion: (payload?: StartPayload) => void;
  onCancel: () => void;
  initialValues?: {
    templateName?: string;
    facilityTypes?: string[];
    facilityServices?: string[];
  };
  isEditMode?: boolean;
  scenarioId?: string;
  onUpdate?: (payload: StartPayload) => void;
}

const StartDialog: React.FC<StartDialogProps> = ({
  onAddQuestion,
  onCancel,
  initialValues,
  isEditMode = false,
  scenarioId,
  onUpdate,
}) => {
  const router = useRouter();

  // Local state with initial values
  const [templateName, setTemplateName] = useState(initialValues?.templateName || '');
  const [facilityTypes, setFacilityTypes] = useState<string[]>(initialValues?.facilityTypes || []);
  const [serviceLines, setServiceLines] = useState<string[]>(initialValues?.facilityServices || []);

  // Controlled open states
  const [facOpen, setFacOpen] = useState(false);
  const [srvOpen, setSrvOpen] = useState(false);
  
  // Search states
  const [facilitySearch, setFacilitySearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');

  // API
  const { data: ftData, loading: ftLoading } = useQuery(GET_ALL_FACILITY_TYPES, { fetchPolicy: 'cache-first' });
  const { data: slData, loading: slLoading } = useQuery(GET_SERVICE_LINES, { fetchPolicy: 'cache-first' });

  // Fetch scenario data for edit mode (only if no initial values provided)
  const { data: scenarioData, loading: scenarioLoading } = useQuery(GET_SCENARIO_BY_ID_QUERY, {
    variables: { scenarioId },
    skip: !isEditMode || !scenarioId || !!initialValues, // Skip if initial values are provided
    fetchPolicy: 'cache-and-network',
  });

  // Update mutation for edit mode
  const [updateTemplate, { loading: updateLoading }] = useMutation<UpdateTemplateData>(UPDATE_TEMPLATE_MUTATION);

  const facilityTypeOptions: string[] = useMemo(() => {
    const list = (ftData?.getAllFacilityTypes?.data ?? [])
      .map((f: any) => f?.name ?? f)
      .filter(Boolean);
    const sortedList = list.length ? list.sort() : [];
    
    // Filter based on search
    if (facilitySearch.trim()) {
      return sortedList.filter(option => 
        option.toLowerCase().includes(facilitySearch.toLowerCase())
      );
    }
    return sortedList;
  }, [ftData, facilitySearch]);

  const serviceLineOptions: string[] = useMemo(() => {
    const list = (slData?.getServiceLines?.data ?? [])
      .map((s: any) => s?.name ?? s)
      .filter(Boolean);
    const sortedList = list.length ? list.sort() : [];
    
    // Filter based on search
    if (serviceSearch.trim()) {
      return sortedList.filter(option => 
        option.toLowerCase().includes(serviceSearch.toLowerCase())
      );
    }
    return sortedList;
  }, [slData, serviceSearch]);

  // Helper functions to convert between IDs and names
  const getFacilityTypeNames = (facilityIds: string[]): string[] => {
    if (!ftData?.getAllFacilityTypes?.data) return [];
    return facilityIds.map(id => {
      const facility = ftData.getAllFacilityTypes.data.find((f: any) => f._id === id);
      return facility?.name || id;
    }).filter(Boolean);
  };

  const getServiceLineNames = (serviceIds: string[]): string[] => {
    if (!slData?.getServiceLines?.data) return [];
    return serviceIds.map(id => {
      const service = slData.getServiceLines.data.find((s: any) => s._id === id);
      return service?.name || id;
    }).filter(Boolean);
  };

  const getFacilityTypeIds = (facilityNames: string[]): string[] => {
    if (!ftData?.getAllFacilityTypes?.data) return [];
    return facilityNames.map(name => {
      const facility = ftData.getAllFacilityTypes.data.find((f: any) => f.name === name);
      return facility?._id || name;
    }).filter(Boolean);
  };

  const getServiceLineIds = (serviceNames: string[]): string[] => {
    if (!slData?.getServiceLines?.data) return [];
    return serviceNames.map(name => {
      const service = slData.getServiceLines.data.find((s: any) => s.name === name);
      return service?._id || name;
    }).filter(Boolean);
  };

  // Effect to populate form data when scenario data is loaded (edit mode)
  React.useEffect(() => {
    if (isEditMode && scenarioData?.getScenarioById) {
      const scenario = scenarioData.getScenarioById;

      // Use version-specific name from questionnaire if available, otherwise use base scenario name
      const versionSpecificName = scenario.questionnaire?.templateName || scenario.scenario.name;
      setTemplateName(versionSpecificName);
      console.log('📊 StartDialog using template name:', versionSpecificName);

      // Handle facilities and services - they might be in the main response or in questionnaire
      let facilityIds: string[] = [];
      let serviceIds: string[] = [];

      // First, try to get from the main response
      if (scenario.facilities && Array.isArray(scenario.facilities)) {
        facilityIds = scenario.facilities;
      }
      if (scenario.services && Array.isArray(scenario.services)) {
        serviceIds = scenario.services;
      }

      // If not found in main response, try to get from questionnaire (fallback)
      if (facilityIds.length === 0 && scenario.questionnaire?.facilities) {
        facilityIds = scenario.questionnaire.facilities;
      }
      if (serviceIds.length === 0 && scenario.questionnaire?.services) {
        serviceIds = scenario.questionnaire.services;
      }

      // Convert facility and service IDs to names for display
      if (facilityIds.length > 0) {
        const facilityNames = getFacilityTypeNames(facilityIds);
        setFacilityTypes(facilityNames);
      }

      if (serviceIds.length > 0) {
        const serviceNames = getServiceLineNames(serviceIds);
        setServiceLines(serviceNames);
      }
    }
  }, [scenarioData, isEditMode, ftData, slData]);

  const handleCancel = () => {
    onCancel();
    // Only route to templates if not in edit mode
    if (!isEditMode) {
      router.push('/templates');
    }
  };

  const handleAddClick = async () => {
    if (!templateName.trim()) return alert('Please enter a template name');
    if (!facilityTypes.length) return alert('Please select at least one facility type');
    if (!serviceLines.length) return alert('Please select at least one service line');

    const payload = { templateName: templateName.trim(), facilityTypes, serviceLines };

    if (isEditMode && scenarioId && onUpdate) {
      // In edit mode, just call the parent's update handler
      // The parent will handle the API call to avoid duplicate calls
      console.log('🔄 Edit mode: Calling parent update handler...');
      console.log('📤 Payload data:', payload);

      try {
        // Call the parent's update handler which will make the API call
        await onUpdate(payload);

        // Close the dialog after successful update
        onCancel();
      } catch (error) {
        console.error('❌ Error updating template:', error);
        toast.error('Failed to update template. Please try again.');
      }
    } else if (isEditMode && !scenarioId && onUpdate) {
      // This is create mode metadata editing - call onUpdate instead of onAddQuestion
      console.log('🔄 Updating metadata in create mode via StartDialog');
      onUpdate(payload);
    } else if (onAddQuestion) {
      // This is the initial create template flow
      onAddQuestion(payload);
    }
  };

  const isFormValid = templateName.trim() && facilityTypes.length > 0 && serviceLines.length > 0;
  const isLoading = ftLoading || slLoading || (isEditMode && scenarioLoading) || updateLoading;

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '4px',
      minHeight: 56,
      alignItems: 'flex-start',
      pt: 1,
      pb: 0.5,
    },
  };

  const templateNameFieldSx = {
    '& .MuiOutlinedInput-root': { borderRadius: '4px', minHeight: 56 },
  };



  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        bgcolor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1200,
        p: 2,
      }}
    >
      <Box
        sx={{
          background: 'white',
          borderRadius: '12px',
          p: { xs: 3, sm: 4 },
          width: 'min(820px, 96vw)',
          minHeight: 450,
          maxHeight: 450,
          textAlign: 'left',
          boxShadow: 3,
        }}
      >
        <Typography component="h2" sx={{ fontWeight: 700, fontSize: 22, color: '#333', textAlign: 'center', mb: 2 }}>
          {isEditMode ? 'Edit Template Assessment' : 'Create Template Assessment'}
        </Typography>

        {/* Fields */}
        <Box display="grid" gap={2.2} sx={{ minHeight: 280 }}>
          {/* Template Name */}
          <TextField
            fullWidth
            label="Template Name"
            placeholder="Enter template name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            sx={templateNameFieldSx}
          />

                                                                                       {/* Facility Type */}
             <Box>
               
               <Autocomplete
                 multiple
                 disableCloseOnSelect
                 open={facOpen}
                 onOpen={() => setFacOpen(true)}
                 onClose={(event, reason) => {
                   if (reason === 'blur') {
                     // Don't close on blur
                     return;
                   }
                   setFacOpen(false);
                   // Clear search when closing
                   setFacilitySearch('');
                 }}
                 loading={ftLoading}
                 options={facilityTypeOptions.length ? facilityTypeOptions : ['Hospital', 'Clinic', 'Laboratory', 'Pharmacy']}
                 value={facilityTypes}
                 onChange={(_, v) => {
                   setFacilityTypes(v);
                   // Clear search field after selection
                   setFacilitySearch('');
                   // Close dropdown after selection
                   setTimeout(() => setFacOpen(false), 100);
                 }}
                 noOptionsText="No data found"
                 slotProps={{ 
                   paper: { style: { maxHeight: 350, zIndex: 1300 } }
                 }}
                 renderTags={(value, getTagProps) =>
                   value.map((option, index) => {
                     const { key, ...tagProps } = getTagProps({ index });
                     return <Chip key={key} size="small" label={option} {...tagProps} />;
                   })
                 }
                 renderInput={(params) => (
                   <TextField
                     {...params}
                     label="Select Facility Type"
                     placeholder="Select Facility Type"
                     fullWidth
                     sx={fieldSx}
                     inputProps={{ ...params.inputProps, readOnly: true, style: { cursor: 'pointer' } }}
                     onKeyDown={(e) => e.preventDefault()}
                     onClick={() => setFacOpen(true)}
                   />
                 )}
                 ListboxComponent={(props) => (
                   <Box onClick={(e) => e.stopPropagation()}>
                     <Box sx={{ p: 1, borderBottom: '1px solid #e0e0e0' }}>
                       <TextField
                         fullWidth
                         placeholder="Search facility type"
                         value={facilitySearch}
                         onChange={(e) => setFacilitySearch(e.target.value)}
                         size="small"
                         onClick={(e) => e.stopPropagation()}
                         onMouseDown={(e) => e.stopPropagation()}
                         onFocus={(e) => e.stopPropagation()}
                         onBlur={(e) => e.stopPropagation()}
                         autoFocus={facOpen}
                         InputProps={{
                           startAdornment: (
                             <InputAdornment position="start">
                               <SearchIcon sx={{ color: '#666', fontSize: 20 }} />
                             </InputAdornment>
                           ),
                         }}
                         sx={{
                           '& .MuiOutlinedInput-root': { 
                             borderRadius: '4px', 
                             minHeight: 40,
                             fontSize: '14px',
                             border: '1px solid #000'
                           }
                         }}
                       />
                     </Box>
                     <Box component="ul" {...props} />
                   </Box>
                 )}
               />
             </Box>

                                                                                               {/* Service Lines */}
             <Box>
               
               <Autocomplete
                 multiple
                 disableCloseOnSelect
                 open={srvOpen}
                 onOpen={() => setSrvOpen(true)}
                 onClose={(event, reason) => {
                   if (reason === 'blur') {
                     // Don't close on blur
                     return;
                   }
                   setSrvOpen(false);
                   // Clear search when closing
                   setServiceSearch('');
                 }}
                 loading={slLoading}
                 options={serviceLineOptions.length ? serviceLineOptions : ['Cardiology', 'Surgery', 'Radiology', 'Oncology']}
                 value={serviceLines}
                 onChange={(_, v) => {
                   setServiceLines(v);
                   // Clear search field after selection
                   setServiceSearch('');
                   // Close dropdown after selection
                   setTimeout(() => setSrvOpen(false), 100);
                 }}
                 noOptionsText="No data found"
                 slotProps={{ 
                   paper: { style: { maxHeight: 350, zIndex: 1300 } }
                 }}
                 renderTags={(value, getTagProps) =>
                   value.map((option, index) => {
                     const { key, ...tagProps } = getTagProps({ index });
                     return <Chip key={key} size="small" label={option} {...tagProps} />;
                   })
                 }
                 renderInput={(params) => (
                   <TextField
                     {...params}
                     label="Select Service Lines"
                     placeholder="Select Service Lines"
                     fullWidth
                     sx={fieldSx}
                     inputProps={{ ...params.inputProps, readOnly: true, style: { cursor: 'pointer' } }}
                     onKeyDown={(e) => e.preventDefault()}
                     onClick={() => setSrvOpen(true)}
                   />
                 )}
                 ListboxComponent={(props) => (
                   <Box onClick={(e) => e.stopPropagation()}>
                     <Box sx={{ p: 1, borderBottom: '1px solid #e0e0e0' }}>
                       <TextField
                         fullWidth
                         placeholder="Search service lines"
                         value={serviceSearch}
                         onChange={(e) => setServiceSearch(e.target.value)}
                         size="small"
                         onClick={(e) => e.stopPropagation()}
                         onMouseDown={(e) => e.stopPropagation()}
                         onFocus={(e) => e.stopPropagation()}
                         onBlur={(e) => e.stopPropagation()}
                         autoFocus={srvOpen}
                         InputProps={{
                           startAdornment: (
                             <InputAdornment position="start">
                               <SearchIcon sx={{ color: '#666', fontSize: 20 }} />
                             </InputAdornment>
                           ),
                         }}
                         sx={{
                           '& .MuiOutlinedInput-root': { 
                             borderRadius: '4px', 
                             minHeight: 40,
                             fontSize: '14px',
                             border: '1px solid #000'
                           }
                         }}
                       />
                     </Box>
                     <Box component="ul" {...props} />
                   </Box>
                 )}
               />
             </Box>
        </Box>

        {/* Actions */}
        <Box mt={3} display="flex" gap={1.5} justifyContent="center">
          <Button
            onClick={handleCancel}
            variant="contained"
            sx={{ bgcolor: '#fd5475', '&:hover': { bgcolor: '#e54867' }, borderRadius: '4px', px: 5, minWidth: 140 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddClick}
            variant="contained"
            disabled={!isFormValid || isLoading}
            sx={{ bgcolor: '#4baaf4', '&:hover': { bgcolor: '#309df2' }, borderRadius: '4px', px: 5, minWidth: 140 }}
          >
            {isEditMode ? 'Update' : 'Add'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StartDialog;
