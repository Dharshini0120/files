/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Grid,
  InputLabel,
  FormControl,
  Pagination,
  Switch,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS, UPDATE_USER_STATUS_MUTATION, DELETE_USER_MUTATION } from '../../graphql/user.service';
import { toast } from 'react-toastify';
import { withPageLoader } from "@frontend/shared-ui";

const statusStyles: any = {
  active: {
    backgroundColor: '#e8f5e8',
    color: '#2e7d32',
    fontWeight: 500,
    borderRadius: '4px',
    padding: '4px 8px',
    width: '80px',
    textAlign: 'center',
    fontSize: '12px',
    margin: '0 auto',
    display: 'inline-block'
  },
  inactive: {
    backgroundColor: '#ffebee',
    color: '#d32f2f',
    fontWeight: 500,
    borderRadius: '4px',
    padding: '4px 8px',
    width: '80px',
    textAlign: 'center',
    fontSize: '12px',
    margin: '0 auto',
    display: 'inline-block'
  }
};

const HospitalUserManagement = () => {
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: userListData, loading, refetch } = useQuery<any>(GET_ALL_USERS, { fetchPolicy: 'network-only' });
  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER_MUTATION);
  const theme = useTheme();

  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const userList = userListData?.listUsers?.data?.users || [];
  const userpagination = userListData?.listUsers?.data?.pagination || {
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0
  };

  const router = useRouter();

  // View route: /hospital-users/view?id=<id>
  const handleView = (id: string) => router.push(`/hospital-users/view?id=${id}`);
  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      const { data } = await deleteUser({ variables: { userId: userToDelete } });
      toast.success(data?.deleteUser?.message || 'User deleted successfully');
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => setCurrentPage(value);

  const formatStatus = (s: string) => (s === 'active' ? 'Active' : 'Inactive');

  const formatRole = (r: string) => {
    switch (r) {
      case 'admin': return 'Admin';
      case 'super_admin': return 'Super Admin';
      case 'user': return 'User';
      default: return r;
    }
  };

  const handleToggle = async (user: any) => {
    const userId = user._id || user.id;
    const newStatus = user.status !== 'active';

    setLoadingUserId(userId);

    try {
      const { data } = await updateUserStatus({
        variables: { input: { userId, isActive: newStatus } }
      });
      toast.success(data?.UpdateUserStatus?.message || `User ${newStatus ? 'Activated' : 'Deactivated'}`);
      refetch();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user status');
    } finally {
      setLoadingUserId(null);
    }
  };

  return (
    <DashboardLayout>
      <Box>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h5" fontWeight={600} fontFamily={'var(--font-inter), sans-serif'}>
              Hospital User Management
            </Typography>
            <Typography variant="subtitle1" color="#6c757d" fontFamily={'var(--font-inter), sans-serif'}>
              View and manage all Hospital-Users for City General Hospital
            </Typography>
          </Box>
          {/* New User button removed as requested */}
        </Box>

        <Box sx={{ border: '1px solid #e4e5e7', borderRadius: '10px', padding: 3, backgroundColor: '#fff' }}>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid>
              <FormControl sx={{ minWidth: 230 }}>
                <InputLabel>Role</InputLabel>
                <Select value={role} label="Role" style={{ borderRadius: '12px', height: '50px' }} onChange={(e) => setRole(e.target.value)}>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="super-admin">Super Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <FormControl sx={{ minWidth: 230 }}>
                <InputLabel>Status</InputLabel>
                <Select value={status} label="Status" style={{ borderRadius: '12px', height: '50px' }} onChange={(e) => setStatus(e.target.value)}>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid>
              <FormControl sx={{ minWidth: 230 }}>
                <InputLabel>Most Recent</InputLabel>
                <Select value={sortOrder} label="Most Recent" style={{ borderRadius: '12px', height: '50px' }} onChange={(e) => setSortOrder(e.target.value)}>
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
                  <TableCell><strong>Name</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Mobile Number</strong></TableCell>
                  <TableCell><strong>Role</strong></TableCell>
                  <TableCell align="center"><strong>User Status</strong></TableCell>
                  <TableCell><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                      <Typography variant="h6" color="#6c757d" fontWeight={600}>
                        No Record Found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  userList.map((user: any) => {
                    const userId = user._id || user.id;
                    return (
                      <TableRow key={userId}>
                        <TableCell>{user.fullName}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phoneNumber}</TableCell>
                        <TableCell>{formatRole(user.role)}</TableCell>
                        <TableCell align="center">
                          <Box sx={statusStyles[user.status]}>{formatStatus(user.status)}</Box>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleView(userId)} aria-label="View user">
                            <VisibilityIcon style={{ fontSize: '25px', color: '#408bff' }} />
                          </IconButton>
                          <IconButton onClick={() => handleDelete(userId)} aria-label="Delete user">
                            <Delete style={{ fontSize: '25px', color: '#e53935' }} />
                          </IconButton>
                          <Switch
                            checked={user.status === 'active'}
                            color="primary"
                            disabled={loadingUserId === userId}
                            onChange={() => handleToggle(user)}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Typography variant="body2" color="#6c757d">
              Showing {userList.length} of {userpagination.totalUsers} users
            </Typography>
            <Pagination
              count={userpagination.totalPages}
              page={userpagination.currentPage}
              onChange={handlePageChange}
              color="primary"
              shape="rounded"
              sx={{ '& .MuiPaginationItem-root': { borderRadius: '8px' } }}
            />
          </Box>
        </Box>

        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          PaperProps={{
            sx: {
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderRadius: 2,
              minWidth: 400
            }
          }}
        >
          <DialogTitle sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
            Confirm Delete
          </DialogTitle>
          <DialogContent sx={{ color: theme.palette.text.primary, paddingY: 3 }}>
            Are you sure you want to delete this user?
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', paddingY: 2 }}>
            <Button
              onClick={() => setDeleteDialogOpen(false)}
              sx={{ mr: 1 }}
              variant="outlined"
            >
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default withPageLoader(HospitalUserManagement);
