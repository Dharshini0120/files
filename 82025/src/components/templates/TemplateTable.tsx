'use client';

import React from 'react';
import {
  Box,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface TemplateRecord {
  id: string;
  templateName: string;
  version?: string;
  status: 'In Progress' | 'Completed' | 'ACTIVE' | 'DRAFT' | 'INACTIVE';
  createdAt?: string;
}

interface TemplateTableProps {
  templates: TemplateRecord[];
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showHeader?: boolean;
}

const statusStyles: any = {
  'In Progress': {
    backgroundColor: '#fff6d8',
    color: '#de9700',
    fontWeight: 600,
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: '6px',
    textAlign: 'center',
    display: 'inline-block',
    width: '100px',
    margin: '0 auto'
  },
  Completed: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
    fontWeight: 600,
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: '6px',
    textAlign: 'center',
    display: 'inline-block',
    width: '100px',
    margin: '0 auto'
  },
  ACTIVE: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
    fontWeight: 600,
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: '6px',
    textAlign: 'center',
    display: 'inline-block',
    width: '100px',
    margin: '0 auto'
  },
  DRAFT: {
    backgroundColor: '#fff6d8',
    color: '#de9700',
    fontWeight: 600,
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: '6px',
    textAlign: 'center',
    display: 'inline-block',
    width: '100px',
    margin: '0 auto'
  },
  INACTIVE: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    fontWeight: 600,
    fontSize: '12px',
    padding: '4px 10px',
    borderRadius: '6px',
    textAlign: 'center',
    display: 'inline-block',
    width: '100px',
    margin: '0 auto'
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const TemplateTable: React.FC<TemplateTableProps> = ({
  templates,
  onView,
  onEdit,
  onDelete,
  showHeader = true
}) => {
  return (
    <TableContainer style={{ borderRadius: '12px', overflow: 'hidden' }}>
      <Table>
        {showHeader && (
          <TableHead sx={{ backgroundColor: '#f5f9ff' }}>
            <TableRow>
              <TableCell><strong>Template Name</strong></TableCell>
              <TableCell><strong>Version</strong></TableCell>
              <TableCell ><strong>Status</strong></TableCell>
              <TableCell><strong>Created At</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {templates.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                <Typography variant="h6" color="#6c757d" fontWeight={600}>
                  No Record Found
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            templates.map((template) => (
              <TableRow key={template.id}>
                <TableCell>{template.templateName}</TableCell>
                <TableCell>{template.version || 'V1'}</TableCell>
                <TableCell>
                  <Box sx={statusStyles[template.status]}>
                    {template.status}
                  </Box>
                </TableCell>
                <TableCell>{formatDate(template.createdAt)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => onEdit?.(template.id)}>
                    <EditIcon sx={{ color: '#408bff', fontSize: 22 }} />
                  </IconButton>
                  <IconButton onClick={() => onView?.(template.id)}>
                    <VisibilityIcon sx={{ color: '#408bff', fontSize: 22 }} />
                  </IconButton>
                  <IconButton onClick={() => onDelete?.(template.id)}>
                    <DeleteIcon sx={{ color: '#e53935', fontSize: 22 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TemplateTable;
