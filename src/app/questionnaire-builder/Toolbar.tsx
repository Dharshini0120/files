/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useRef } from 'react';
import { TextField, Box, IconButton, Tooltip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import DraftsIcon from '@mui/icons-material/Drafts';
import FolderIcon from '@mui/icons-material/Folder';

interface ToolbarProps {
  onAddQuestion: () => void;
  onAddSection: () => void;
  onSave: () => void;
  onSaveAsDraft: () => void;
  onClearAll: () => void;
  onPreviewConnections: () => void;
  hideIcons: boolean;
  position?: 'top-right' | 'right-center';
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddQuestion,
  onAddSection,
  onSave,
  onSaveAsDraft,
  onClearAll,
  onPreviewConnections,
  hideIcons,
  position = 'right-center',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      event.target.value = '';
      return;
    }

    // Accept .json even if some browsers give empty/other mime types
    const isJson =
      file.type === 'application/json' ||
      file.name.toLowerCase().endsWith('.json');

    if (!isJson) {
      alert('Please select a valid JSON file');
      event.target.value = '';
      return;
    }

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      onImportJSON(jsonData); // pass parsed object to parent
    } catch (err: any) {
      alert('Invalid JSON file format');
    } finally {
      // allow choosing the same file again
      event.target.value = '';
    }
  };

  // Update the Add Question button click handler
  const handleAddQuestionClick = () => {
    // Check if we need to show start dialog for metadata
    onAddQuestion();
  };

  const getPositionStyles = () => {
    if (position === 'top-right') {
      return {
        position: 'fixed',
        right: '20px',
        top: '20px',
        display: 'flex',
        flexDirection: 'row',
        gap: '12px',
        zIndex: 1000,
      };
    }
    
    return {
      position: 'fixed',
      right: '20px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      zIndex: 1000,
    };
  };

  return (
    <Box sx={{}}>
      {/* Hidden file input for Import JSON */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".json,application/json"
        style={{ display: 'none' }}
      />

      {!hideIcons && (
        <Box sx={getPositionStyles()}>
          <Tooltip title="Add Question" placement="bottom">
            <IconButton
              onClick={onAddQuestion}
              sx={{
                backgroundColor: '#4FC3F7',
                color: 'white',
                '&:hover': { backgroundColor: '#29B6F6' },
                width: '48px',
                height: '48px',
                borderRadius: '50%',
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Save" placement="bottom">
            <IconButton
              onClick={onSave}
              sx={{
                backgroundColor: '#66BB6A',
                color: 'white',
                '&:hover': { backgroundColor: '#4CAF50' },
                width: '48px',
                height: '48px',
                borderRadius: '50%',
              }}
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Clear All Questions" placement="bottom">
            <IconButton
              onClick={onClearAll}
              sx={{
                backgroundColor: '#EF5350',
                color: 'white',
                '&:hover': { backgroundColor: '#F44336' },
                width: '48px',
                height: '48px',
                borderRadius: '50%',
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

export default Toolbar;
