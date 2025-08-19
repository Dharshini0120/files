/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Tabs,
  Tab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Divider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { AddOutlined, Edit, Delete as DeleteIcon } from "@mui/icons-material";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useMutation, useQuery } from "@apollo/client";
import {
  GET_ALL_ROLES,
  CREATE_ROLE_MUTATION,
  UPDATE_ROLE_MUTATION,
  DELETE_ROLE_MUTATION,
  GET_ALL_MODULES
} from "../../graphql/role.service";
// import { GET_ALL_MODULES } from "../../graphql/module.service";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { withPageLoader } from "@frontend/shared-ui";

type Role = { id: string; name: string; description?: string };
type PermissionKey = "create" | "read" | "update" | "delete";
type ModuleDef = { key: string; label: string };

const gradientButtonSx = {
  background: "linear-gradient(90deg, #408bff 0%, #3a7de6 100%)",
  textTransform: "none",
  letterSpacing: "0.5px",
  fontWeight: 500,
  fontFamily: "var(--font-inter), sans-serif",
  borderRadius: "4px",
  padding: "8px 24px",
  boxShadow: "0 2px 8px rgba(64, 139, 255, 0.25)",
  "&:hover": {
    background: "linear-gradient(90deg, #3a7de6 0%, #3670cc 100%)",
    boxShadow: "0 4px 12px rgba(64, 139, 255, 0.3)",
  },
};

const headerCellSx = {
  backgroundColor: "#f3f7ff",
  color: "#1f2937",
  fontWeight: 700,
  borderBottom: "1px solid #e6ecf5",
};

function BorderedCheckbox(props: React.ComponentProps<typeof Checkbox>) {
  const Unchecked = (
    <span
      style={{
        width: 18,
        height: 18,
        border: "1.5px solid #000",
        borderRadius: 3,
        display: "inline-block",
        background: "#fff",
      }}
    />
  );
  const Checked = (
    <span
      style={{
        width: 18,
        height: 18,
        borderRadius: 3,
        display: "inline-block",
        background: "#3a7de6",
        position: "relative",
        boxShadow: "inset 0 0 0 1.5px #3a7de6",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        style={{
          position: "absolute",
          inset: 0,
          margin: "auto",
          width: 18,
          height: 18,
          fill: "none",
          stroke: "white",
          strokeWidth: 3,
        }}
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </span>
  );
  return <Checkbox disableRipple color="default" icon={Unchecked} checkedIcon={Checked} {...props} sx={{ p: 0.5 }} />;
}

const RolesAccessPage: React.FC = () => {
  const [tab, setTab] = useState(0);

  // roles from API only
  const [roles, setRoles] = useState<Role[]>([]);
  const { data, error, loading, refetch } = useQuery(GET_ALL_ROLES, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  useEffect(() => {
    const payload = (data as any)?.getAllRoles;
    if (payload?.status === "success" && Array.isArray(payload?.data)) {
      const mapped: Role[] = payload.data.map((r: any) => ({
        id: r?._id ?? "",
        name: r?.roleName ?? "",
        description: r?.description ?? "",
      }));
      setRoles(mapped);
    }
  }, [data]);

  useEffect(() => {
    if (error) console.error("Failed to fetch roles:", error);
  }, [error]);

  // modules from API (exact query; safe fallback)
  const {
    data: modulesData,
    error: modulesError,
  } = useQuery(GET_ALL_MODULES, {
    fetchPolicy: "cache-and-network",
    errorPolicy: "all",
  });

  const modules: ModuleDef[] = useMemo(() => {
    const payload = (modulesData as any)?.getAllModules;
    if (payload?.status === "success" && Array.isArray(payload?.data)) {
      const mapped: ModuleDef[] = payload.data.map((m: any) => {
        const base = String(m?.name ?? "").trim();
        const key =
          base.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "") ||
          (m?._id ?? "");
        return { key, label: base || "Unnamed Module" };
      });

      const seen = new Set<string>();
      return mapped.filter((x) => {
        if (!x.key || seen.has(x.key)) return false;
        seen.add(x.key);
        return true;
      });
    }

    // fallback preserves previous behavior
    return [
      { key: "dashboard", label: "Dashboard" },
      { key: "user_mgmt", label: "Admin Management" },
      { key: "audit_logs", label: "Audit Logs" },
      { key: "templates", label: "Templates" },
      { key: "assessment_records", label: "Assessment Records" },
      { key: "roles_access", label: "Role & Access" },
      { key: "settings", label: "Settings" },
      { key: "security", label: "Security" },
      { key: "help", label: "Help" },
    ];
  }, [modulesData]);

  useEffect(() => {
    if (modulesError) {
      // keep UI unchanged; just log
      // eslint-disable-next-line no-console
      console.error("Failed to fetch modules:", modulesError);
    }
  }, [modulesError]);

  // dialog + form
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const [createRole, { loading: createLoading }] = useMutation(CREATE_ROLE_MUTATION);
  const [updateRole, { loading: updateLoading }] = useMutation(UPDATE_ROLE_MUTATION);
  const [deleteRole, { loading: deleteLoading }] = useMutation(DELETE_ROLE_MUTATION);

  // delete dialog
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const openAdd = () => {
    setEditingRole(null);
    setFormName("");
    setFormDesc("");
    setDialogOpen(true);
  };
  const openEdit = (role: Role) => {
    setEditingRole(role);
    setFormName(role.name);
    setFormDesc(role.description || "");
    setDialogOpen(true);
  };

  const saveRole = async () => {
    if (!formName.trim()) {
      toast.error("Role name is required");
      return;
    }

    if (editingRole) {
      try {
        const { data } = await updateRole({
          variables: {
            id: editingRole.id,
            input: { roleName: formName.trim(), description: formDesc.trim() },
          },
          context: { operationName: "UpdateRole" },
        });

        const result = (data as any)?.updateRole;
        if (!result) throw new Error("No response from server");
        if (result.status === "success") {
          toast.success(result.message || "Role updated successfully");
          setDialogOpen(false);
          await refetch();
        } else {
          throw new Error(result.error || "Failed to update role");
        }
      } catch (e: any) {
        console.error(e);
        toast.error(e?.message ?? "Something went wrong");
      }
      return;
    }

    try {
      const { data } = await createRole({
        variables: { input: { roleName: formName.trim(), description: formDesc.trim() } },
        context: { operationName: "CreateRole" },
      });

      const result = (data as any)?.createRole;
      if (!result) throw new Error("No response from server");

      if (result.status === "success") {
        toast.success(result.message || "Role created successfully");
        setDialogOpen(false);
        await refetch();
      } else {
        throw new Error(result.error || "Failed to create role");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Something went wrong");
    }
  };

  const openDelete = (role: Role) => {
    setRoleToDelete(role);
    setDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!roleToDelete) return;
    try {
      const { data } = await deleteRole({
        variables: { id: roleToDelete.id },
        context: { operationName: "DeleteRole" },
      });

      const result = (data as any)?.deleteRole;
      if (!result) throw new Error("No response from server");
      if (result.status === "success") {
        toast.success(result.message || "Role deleted successfully");
        setDeleteOpen(false);
        setRoleToDelete(null);
        await refetch();
      } else {
        throw new Error(result.error || "Failed to delete role");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? "Something went wrong");
    }
  };

  // access rights
  // ▼ default active role: super_admin if present, else first
  const [activeRoleId, setActiveRoleId] = useState<string>("");
  useEffect(() => {
    if (!roles.length) return;
    const currentExists = activeRoleId && roles.some((r) => r.id === activeRoleId);
    if (!currentExists) {
      const superAdmin = roles.find((r) => r.name?.trim().toLowerCase() === "super_admin");
      if (superAdmin) setActiveRoleId(superAdmin.id);
      else setActiveRoleId(roles[0].id);
    }
  }, [roles, activeRoleId]);

  const [permissions, setPermissions] = useState<Record<string, Record<string, Record<PermissionKey, boolean>>>>({});

  useEffect(() => {
    setPermissions((prev) => {
      const next = { ...prev };
      for (const role of roles) {
        next[role.id] ??= {};
        for (const m of modules) {
          next[role.id][m.key] ??= { create: false, read: false, update: false, delete: false };
        }
      }
      Object.keys(next).forEach((rid) => {
        if (!roles.some((r) => r.id === rid)) delete next[rid];
      });
      Object.values(next).forEach((byModule) => {
        Object.keys(byModule).forEach((mk) => {
          if (!modules.some((m) => m.key === mk)) delete (byModule as any)[mk];
        });
      });
      return next;
    });
  }, [roles, modules]);

  const togglePerm = (roleId: string, moduleKey: string, key: PermissionKey) =>
    setPermissions((p) => ({
      ...p,
      [roleId]: {
        ...p[roleId],
        [moduleKey]: { ...p[roleId][moduleKey], [key]: !p[roleId][moduleKey][key] },
      },
    }));

  const saveAccess = () => {
    // hook your API here (permissions[activeRoleId])
    alert("Save permissions API here");
  };

  return (
    <DashboardLayout>
      <Box>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, px: { xs: 0.5, md: 1 } }}>
          <Box>
            <Typography variant="h5" fontWeight={700} sx={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Roles & Access
            </Typography>
            <Typography variant="subtitle1" color="#6c757d" sx={{ fontFamily: "var(--font-inter), sans-serif" }}>
              Manage roles and set access permissions
            </Typography>
          </Box>
          {tab === 0 && (
            <Button onClick={openAdd} variant="contained" size="large" sx={gradientButtonSx}>
              <AddOutlined sx={{ mr: 1 }} />
              Add New Role
            </Button>
          )}
        </Box>

        <Paper sx={{ borderRadius: "12px", p: { xs: 1.5, md: 2 }, pt: 2 }}>
          {/* Tabs */}
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            sx={{
              px: 1,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                mr: 2,
                color: "#6b6b6b",
                "&.Mui-selected": { color: "#000", backgroundColor: "#f5f9ff", borderRadius: "8px 8px 0 0", fontWeight: 700 },
              },
              "& .MuiTabs-indicator": { height: 3, borderRadius: 2, backgroundColor: "#3a7de6" },
            }}
          >
            <Tab label="Roles" />
            <Tab label="Access Rights" />
          </Tabs>

          <Divider sx={{ mt: 1, mb: 2 }} />

          {/* ROLES */}
          {tab === 0 && (
            <Box sx={{ overflowX: "auto", px: { xs: 0.5, md: 1 } }}>
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table sx={{ width: "100%" }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={headerCellSx} width={80}>
                        S.No
                      </TableCell>
                      <TableCell sx={headerCellSx}>Role Name</TableCell>
                      <TableCell sx={headerCellSx}>Description</TableCell>
                      <TableCell sx={{ ...headerCellSx, textAlign: "right" }} width={160}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                          <Typography variant="h6" color="#6c757d" fontWeight={600}>
                            No Record Found
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ) : (
                      roles.map((role, idx) => (
                        <TableRow key={role.id} sx={{ backgroundColor: idx % 2 ? "#f5f5f5" : "#fff", "& td": { borderBottom: "1px solid #eef2f7" } }}>
                          <TableCell>{idx + 1}</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{role.name}</TableCell>
                          <TableCell sx={{ color: "#6b7280" }}>{role.description || "No description"}</TableCell>
                          <TableCell sx={{ textAlign: "right" }}>
                            <Tooltip title="Edit">
                              <IconButton onClick={() => openEdit(role)}>
                                <Edit style={{ fontSize: 25, color: "#408bff" }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton onClick={() => openDelete(role)} disabled={deleteLoading}>
                                <DeleteIcon style={{ fontSize: 25, color: "#e53935" }} />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </Box>
          )}

          {/* ACCESS RIGHTS */}
          {tab === 1 && (
            <Box sx={{ px: { xs: 0.5, md: 1 } }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
                <FormControl sx={{ minWidth: 260 }}>
                  <InputLabel>Select Role</InputLabel>
                  <Select
                    label="Select Role"
                    value={activeRoleId || ""}
                    onChange={(e) => setActiveRoleId(String(e.target.value))}
                    // size="small"
                    disabled={loading || roles.length === 0}
                    sx={{
                      // height: 45,
                      backgroundColor: "#fff",
                      boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
                      "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e6ecf5" },
                      "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#cfd7e6" },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#408bff" },
                    }}
                  >
                    {roles.map((r) => (
                      <MenuItem key={r.id} value={r.id}>
                        {r.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Table sx={{ width: "100%" }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ ...headerCellSx, width: 320 }}>Module</TableCell>
                    <TableCell sx={headerCellSx} align="center">
                      View
                    </TableCell>
                    <TableCell sx={headerCellSx} align="center">
                      Create
                    </TableCell>
                    <TableCell sx={headerCellSx} align="center">
                      Update
                    </TableCell>
                    <TableCell sx={headerCellSx} align="center">
                      Delete
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {modules.map((m, i) => (
                    <TableRow key={m.key} sx={{ backgroundColor: i % 2 ? "#f5f5f5" : "#fff", "& td": { borderBottom: "1px solid #eef2f7" } }}>
                      <TableCell sx={{ fontWeight: 600 }}>{m.label}</TableCell>
                      {(["read", "create", "update", "delete"] as PermissionKey[]).map((k) => (
                        <TableCell key={`${m.key}-${k}`} align="center">
                          <FormControlLabel
                            sx={{ m: 0 }}
                            control={
                              <BorderedCheckbox
                                checked={Boolean(permissions[activeRoleId]?.[m.key]?.[k])}
                                onChange={() => togglePerm(activeRoleId, m.key, k)}
                              />
                            }
                            label=""
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 5, pb: 2 }}>
                <Button variant="contained" sx={gradientButtonSx} onClick={saveAccess}>
                  Save For Changes
                </Button>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Add/Edit Role Dialog */}
        <Dialog open={dialogOpen} onClose={() => !(createLoading || updateLoading) && setDialogOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 700 }}>{editingRole ? "Edit Role" : "Add New Role"}</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Role Name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              sx={{ mt: 1.5 }}
              disabled={createLoading || updateLoading}
            />
            <TextField
              fullWidth
              label="Description"
              value={formDesc}
              onChange={(e) => setFormDesc(e.target.value)}
              sx={{ mt: 2 }}
              multiline
              minRows={2}
              disabled={createLoading || updateLoading}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setDialogOpen(false)}
              disabled={createLoading || updateLoading}
              sx={{
                textTransform: "uppercase",
                fontWeight: 500,
                color: "#408bff",
                borderColor: "#408bff",
                px: 3,
                "&:hover": { backgroundColor: "rgba(64, 139, 255, 0.04)", borderColor: "#408bff" },
              }}
            >
              Cancel
            </Button>
            <Button onClick={saveRole} variant="contained" sx={gradientButtonSx} disabled={createLoading || updateLoading}>
              {createLoading || updateLoading ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CircularProgress size={18} />
                  {editingRole ? "Saving" : "Creating"}
                </Box>
              ) : editingRole ? "Save" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Role Dialog */}
        <Dialog open={deleteOpen} onClose={() => !deleteLoading && setDeleteOpen(false)} fullWidth maxWidth="sm">
          <DialogTitle sx={{ fontWeight: 700 }}>Delete Role</DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            <Typography>
              Are you sure you want to delete the role <strong>{roleToDelete?.name}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button
              variant="outlined"
              onClick={() => setDeleteOpen(false)}
              disabled={deleteLoading}
              sx={{
                textTransform: "uppercase",
                fontWeight: 500,
                color: "#408bff",
                borderColor: "#408bff",
                px: 3,
                "&:hover": { backgroundColor: "rgba(64, 139, 255, 0.04)", borderColor: "#408bff" },
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" color="error" onClick={confirmDelete} disabled={deleteLoading}>
              {deleteLoading ? <CircularProgress size={18} /> : "Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default withPageLoader(RolesAccessPage);
