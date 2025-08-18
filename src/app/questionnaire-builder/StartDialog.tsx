'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
  Autocomplete,
} from '@mui/material';
import { useQuery } from '@apollo/client';
import { GET_ALL_FACILITY_TYPES, GET_SERVICE_LINES } from '../../graphql/user.service';

type StartPayload = {
  templateName: string;
  facilityTypes: string[];
  serviceLines: string[];
};

interface StartDialogProps {
  onAddQuestion: (payload?: StartPayload) => void;
  onCancel: () => void;
}

const StartDialog: React.FC<StartDialogProps> = ({
  onAddQuestion,
  onCancel,
}) => {
  const router = useRouter();

  // Local state
  const [templateName, setTemplateName] = useState('');
  const [facilityTypes, setFacilityTypes] = useState<string[]>([]);
  const [serviceLines, setServiceLines] = useState<string[]>([]);

  // Debug: Log state changes
  useEffect(() => {
    console.log('📝 StartDialog state changed:');
    console.log('  - templateName:', templateName);
    console.log('  - facilityTypes:', facilityTypes);
    console.log('  - serviceLines:', serviceLines);
  }, [templateName, facilityTypes, serviceLines]);

  // Dynamic facility types & service lines from API
  const { data: ftData, loading: ftLoading } = useQuery(GET_ALL_FACILITY_TYPES, {
    fetchPolicy: 'cache-first',
  });
  const { data: slData, loading: slLoading } = useQuery(GET_SERVICE_LINES, {
    fetchPolicy: 'cache-first',
  });

  const facilityTypeOptions: string[] = useMemo(() => {
    const list = (ftData?.getAllFacilityTypes?.data ?? [])
      .map((f: any) => f?.name ?? f)
      .filter(Boolean);
    return list.length ? list.sort() : [];
  }, [ftData]);

  const serviceLineOptions: string[] = useMemo(() => {
    const list = (slData?.getServiceLines?.data ?? [])
      .map((s: any) => s?.name ?? s)
      .filter(Boolean);
    return list.length ? list.sort() : [];
  }, [slData]);

  const handleCancel = () => {
    onCancel();
    router.push('/templates');
  };

  const handleAddClick = () => {
    console.log('🚀 StartDialog handleAddClick called');
    console.log('🚀 Current state - templateName:', templateName);
    console.log('🚀 Current state - facilityTypes:', facilityTypes);
    console.log('🚀 Current state - serviceLines:', serviceLines);
    console.log('🚀 Form validation - isFormValid:', isFormValid);

    // Additional validation before sending
    if (!templateName || !templateName.trim()) {
      console.error('❌ Template name is empty!');
      alert('Please enter a template name');
      return;
    }

    if (!facilityTypes || facilityTypes.length === 0) {
      console.error('❌ Facility types not selected!');
      alert('Please select at least one facility type');
      return;
    }

    if (!serviceLines || serviceLines.length === 0) {
      console.error('❌ Service lines not selected!');
      alert('Please select at least one service line');
      return;
    }

    const payload = {
      templateName: templateName.trim(),
      facilityTypes,
      serviceLines,
    };
    console.log('🚀 StartDialog sending payload:', payload);
    onAddQuestion(payload);
  };

  // Check if all fields are filled
  const isFormValid = templateName.trim() && facilityTypes.length > 0 && serviceLines.length > 0;

  // Debug: Log form validation state
  useEffect(() => {
    console.log('🔍 Form validation state:');
    console.log('  - templateName.trim():', templateName.trim());
    console.log('  - facilityTypes.length:', facilityTypes.length);
    console.log('  - serviceLines.length:', serviceLines.length);
    console.log('  - isFormValid:', isFormValid);
  }, [templateName, facilityTypes, serviceLines, isFormValid]);

  // Fallback options while loading
  const fallbackFacilities = ['Hospital', 'Clinic', 'Laboratory', 'Pharmacy'];
  const fallbackServices = ['Cardiology', 'Surgery', 'Radiology', 'Oncology'];

  const fieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '4px',
      minHeight: 56,
      alignItems: 'flex-start',
      pt: 1,
      pb: 0.5,
    },
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
          minHeight: 420,
          textAlign: 'left',
          boxShadow: 3,
        }}
      >
        <Typography
          component="h2"
          sx={{ fontWeight: 700, fontSize: 22, color: '#333', textAlign: 'center', mb: 2 }}
        >
          Create Template Assessment
        </Typography>

        {/* Fields */}
        <Box display="grid" gap={2.2}>
          {/* Template Name */}
          <TextField
            fullWidth
            label="Template Name"
            placeholder="Enter template name"
            value={templateName}
            onChange={(e) => {
              console.log('📝 Template name changed:', e.target.value);
              setTemplateName(e.target.value);
            }}
            sx={fieldSx}
          />

          {/* Facility Type */}
          <Autocomplete
            multiple
            disableCloseOnSelect
            loading={ftLoading}
            options={facilityTypeOptions.length ? facilityTypeOptions : fallbackFacilities}
            value={facilityTypes}
            onChange={(_, v) => {
              console.log('📝 Facility types changed:', v);
              setFacilityTypes(v);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return <Chip key={key} size="small" label={option} {...tagProps} />;
              })
            }
            ListboxProps={{ style: { maxHeight: 300 } }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Facility Type"
                placeholder="Select one or more"
                fullWidth
                sx={fieldSx}
              />
            )}
          />

          {/* Service Lines */}
          <Autocomplete
            multiple
            disableCloseOnSelect
            loading={slLoading}
            options={serviceLineOptions.length ? serviceLineOptions : fallbackServices}
            value={serviceLines}
            onChange={(_, v) => {
              console.log('📝 Service lines changed:', v);
              setServiceLines(v);
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return <Chip key={key} size="small" label={option} {...tagProps} />;
              })
            }
            ListboxProps={{ style: { maxHeight: 300 } }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Service Lines"
                placeholder="Select one or more"
                fullWidth
                sx={fieldSx}
              />
            )}
          />
        </Box>

        {/* Actions */}
        <Box mt={3} display="flex" gap={1.5} justifyContent="center">
          <Button
            onClick={handleCancel}
            variant="contained"
            sx={{
              bgcolor: '#fd5475',
              '&:hover': { bgcolor: '#e54867' },
              borderRadius: '4px',
              px: 5,
              minWidth: 140,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddClick}
            variant="contained"
            disabled={!isFormValid || ftLoading || slLoading}
            sx={{
              bgcolor: '#4baaf4',
              '&:hover': { bgcolor: '#309df2' },
              borderRadius: '4px',
              px: 5,
              minWidth: 140,
            }}
          >
            Add
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default StartDialog;
