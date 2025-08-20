'use client';

import React from 'react';
import { Box, Button, Typography, IconButton, Tooltip, Select, MenuItem, FormControl } from '@mui/material';
import ArrowBack from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import ClearIcon from '@mui/icons-material/Clear';

interface HeaderBarProps {
  templateName: string;
  isEditMode: boolean;
  isViewMode: boolean;
  onBackToTemplates: () => void;
  onEditMetadata: () => void;
  // Toolbar props
  onAddQuestion: () => void;
  onSave: () => void;
  onClearAll: () => void;
  hideToolbar?: boolean;
  hideBackButton?: boolean;
  isSaving?: boolean;
  // Version props for edit mode
  availableVersions?: string[];
  selectedVersion?: string;
  onVersionChange?: (version: string) => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  templateName,
  isEditMode,
  isViewMode,
  onBackToTemplates,
  onEditMetadata,
  onAddQuestion,
  onSave,
  onClearAll,
  hideToolbar = false,
  hideBackButton = false,
  isSaving = false,
  availableVersions = [],
  selectedVersion = 'V1',
  onVersionChange,
}) => {

  // Debug: Log template name changes
  React.useEffect(() => {
    console.log('🏷️ HeaderBar received template name:', templateName);
  }, [templateName]);


  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '70px',
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      {/* Left Section - Back Button */}
      {!isViewMode && !hideBackButton && (
        <Button
          onClick={onBackToTemplates}
          startIcon={<ArrowBack />}
          sx={{
            color: '#3a7de6',
            textTransform: 'none',
            fontWeight: 500,
            fontFamily: 'var(--font-inter), sans-serif',
            backgroundColor: 'white',
            border: '2px solid #3a7de6',
            borderRadius: '8px',
            padding: '8px 16px',
            '&:hover': {
              backgroundColor: '#f0f7ff',
              borderColor: '#2563eb',
            },
          }}
          variant="outlined"
        >
          Back to Templates
        </Button>
      )}

      {/* Center Section - Template Name (Centered) */}
      {templateName && (
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            padding: '8px 16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            maxWidth: { xs: '250px', sm: '350px', md: '450px' },
            minWidth: '200px',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              color: '#1976d2',
              marginRight: templateName ? 1 : 0,
              fontSize: { xs: '14px', sm: '16px' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              textAlign: 'center',
              flex: 1,
            }}
          >
            {templateName}
          </Typography>
          {templateName && (
            <Tooltip title="Edit Template Details">
              <IconButton
                onClick={onEditMetadata}
                size="small"
                sx={{
                  color: '#1976d2',
                  border: '1px solid #e0e0e0',
                  borderRadius: '4px',
                  padding: '2px',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      )}

      {/* Right Section - Version Dropdown and Toolbar */}
      {!isViewMode && !hideToolbar && (
        <Box sx={{
          display: 'flex',
          gap: { xs: 0.5, sm: 1 },
          alignItems: 'center',
        }}>
          {/* Version Dropdown for Edit Mode */}
          {isEditMode && availableVersions.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 80, marginRight: 1 }}>
              <Select
                value={selectedVersion}
                onChange={(e) => onVersionChange?.(e.target.value)}
                sx={{
                  fontSize: '14px',
                  '& .MuiSelect-select': {
                    padding: '4px 8px',
                  },
                }}
              >
                {availableVersions.map((version) => (
                  <MenuItem key={version} value={version} sx={{ fontSize: '14px' }}>
                    {version}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Add Question - Blue color */}
          <Tooltip title="Add Question">
            <IconButton
              onClick={onAddQuestion}
              sx={{
                backgroundColor: '#2196f3',
                color: 'white',
                '&:hover': { backgroundColor: '#1976d2' },
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>

          {/* Save/Update - Green for save, Light violet for update */}
          <Tooltip title={isEditMode ? "Update Template" : "Save Template"}>
            <IconButton
              onClick={onSave}
              disabled={isSaving}
              sx={{
                backgroundColor: isEditMode ? '#9c27b0' : '#4caf50',
                color: 'white',
                '&:hover': {
                  backgroundColor: isEditMode ? '#7b1fa2' : '#45a049'
                },
                '&:disabled': {
                  backgroundColor: '#cccccc',
                  color: '#666666',
                },
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
              }}
            >
              {/* Use SaveIcon for both create and edit modes */}
              <SaveIcon />
            </IconButton>
          </Tooltip>

          {/* Clear All - Red color */}
          <Tooltip title="Clear All">
            <IconButton
              onClick={onClearAll}
              sx={{
                backgroundColor: '#f44336',
                color: 'white',
                '&:hover': { backgroundColor: '#d32f2f' },
                width: { xs: 36, sm: 40 },
                height: { xs: 36, sm: 40 },
              }}
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default HeaderBar;
