/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState, useEffect } from 'react'
import {
    Button,
    Typography,
    Box,
    TextField,
    Grid,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    Chip,
    Switch,
    FormControlLabel,
    Divider,
    IconButton,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Autocomplete
} from '@mui/material'
import { Visibility, VisibilityOff, Person, Lock, Notifications, ExpandMore } from '@mui/icons-material'
import { useQuery } from '@apollo/client'
import { GET_SERVICE_LINES } from '../../graphql/user.service'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { useSelector } from 'react-redux'
import { withPageLoader } from "@frontend/shared-ui"

function Settings() {
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
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const [showPasswords, setShowPasswords] = useState({
        current: true,
        new: true,
        confirm: true
    })

    const [notifications, setNotifications] = useState({
        assessmentReminders: true
    })

    const [expanded, setExpanded] = useState({
        profile: true,
        password: true,
        notifications: true
    })

    const [enableEdit, setEnableEdit] = useState(false)
    const authSlice = useSelector((state: any) => state.auth?.user)

    const [errors, setErrors] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        facilityName: '',
        facilityType: '',
        state: '',
        county: '',
        numberOfLicensedBeds: '',
        serviceLines: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    const facilityTypes = [
        'Academic Hospital',
        'Community Hospital',
        'Veterans Hospital',
        'County/State Hospital',
        'Critical Access Hospital',
        'Integrated Healthcare System'
    ]

    const [states, setStates] = useState<string[]>([])
    const [counties, setCounties] = useState<string[]>([])
    const [stateCountyData, setStateCountyData] = useState<{ [stateName: string]: string[] }>({})

    // Dynamic service lines from API
    const { data: slData } = useQuery(GET_SERVICE_LINES, {
        fetchPolicy: 'cache-first',
    })

    const serviceLinesList = [...new Set((slData?.getServiceLines?.data ?? [])
        .map((s: any) => typeof s === 'string' ? s : s?.name || String(s))
        .filter(Boolean))]
        .sort()

    // Fetch US states and counties data
    useEffect(() => {
        const fetchStatesAndCounties = async () => {
            try {
                const response = await fetch('https://api.census.gov/data/2019/pep/charagegroups?get=NAME&for=county:*')
                const data = await response.json()

                if (data && data.length > 1) {
                    const stateCountyMap: { [stateName: string]: string[] } = {}
                    const uniqueStates = new Set<string>()

                    data.slice(1).forEach((item: any) => {
                        if (item[0] && item[0].includes(',')) {
                            const parts = item[0].split(',')
                            if (parts.length >= 2) {
                                const county = parts[0].trim().replace(' County', '')
                                const state = parts[1].trim()

                                uniqueStates.add(state)
                                if (!stateCountyMap[state]) {
                                    stateCountyMap[state] = []
                                }
                                if (!stateCountyMap[state].includes(county)) {
                                    stateCountyMap[state].push(county)
                                }
                            }
                        }
                    })

                    Object.keys(stateCountyMap).forEach(state => {
                        stateCountyMap[state].sort()
                    })

                    const sortedStates = Array.from(uniqueStates).sort()
                    setStates(sortedStates)
                    setStateCountyData(stateCountyMap)
                } else {
                    throw new Error('Invalid data format')
                }
            } catch (error) {
                console.error('Error fetching states and counties:', error)
                const staticData = {
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
                }

                setStates(Object.keys(staticData).sort())
                setStateCountyData(staticData)
            }
        }

        fetchStatesAndCounties()
    }, [])

    // Update counties when state changes
    useEffect(() => {
        if (formData.state && stateCountyData[formData.state]) {
            setCounties(stateCountyData[formData.state])
        } else {
            setCounties([])
        }
    }, [formData.state, stateCountyData])

    // Populate form with authSlice data
    useEffect(() => {
        if (authSlice) {
            setFormData({
                fullName: authSlice.fullName || '',
                email: authSlice.email || '',
                phoneNumber: authSlice.phoneNumber || '',
                facilityName: authSlice.facilityName || '',
                facilityType: authSlice.facilityType || '',
                state: authSlice.state || '',
                county: authSlice.county || '',
                numberOfLicensedBeds: authSlice.numberOfLicensedBeds?.toString() || '',
                serviceLines: (authSlice.serviceLines || []).map((sl: any) =>
                    typeof sl === 'string' ? sl : sl?.name || String(sl)
                ),
            })
        }
    }, [authSlice])

    const validateForm = () => {
        let isValid = true
        const newErrors = { ...errors }

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required'
            isValid = false
        }

        if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Valid email is required'
            isValid = false
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleChange = (e: any) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }

        // Reset county when state changes
        if (name === 'state') {
            setFormData(prev => ({ ...prev, state: value, county: '' }))
            setErrors(prev => ({ ...prev, county: '' }))
        }
    }

    const handleMultiSelect = (e: any) => {
        const { target: { value } } = e
        setFormData(prev => ({
            ...prev,
            serviceLines: typeof value === 'string' ? value.split(',') : value,
        }))
    }

    const handlePasswordChange = (e: any) => {
        const { name, value } = e.target
        setPasswordData(prev => ({ ...prev, [name]: value }))
        if (errors[name as keyof typeof errors]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleNotificationChange = (name: string) => {
        setNotifications(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }))
    }

    const validatePassword = () => {
        let isValid = true
        const newErrors = { ...errors }

        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Current password is required'
            isValid = false
        }

        if (!passwordData.newPassword || passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'New password must be at least 6 characters'
            isValid = false
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
            isValid = false
        }

        setErrors(newErrors)
        return isValid
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validateForm()) {
            console.log('Profile updated:', formData)
        }
    }

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (validatePassword()) {
            console.log('Password updated:', passwordData)
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
        }
    }

    const handleAccordionChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(prev => ({ ...prev, [panel]: isExpanded }))
    }

    return (
        <DashboardLayout>
            <Box>
                <Box sx={{ pb: 3 }}>
                    <Typography variant="h5" fontWeight={600} fontFamily={'var(--font-inter), sans-serif'}>
                        Account Settings
                    </Typography>
                    <Typography variant="subtitle1" color="#6c757d" fontFamily={'var(--font-inter), sans-serif'}>
                        Edit Your Profile
                    </Typography>
                </Box>
                {/*  */}
                {/* Profile Section */}
                <Accordion
                    expanded={expanded.profile}
                    onChange={handleAccordionChange('profile')}
                    sx={{ borderRadius: '5px', border: '1px solid #e4e5e7', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: '0px' }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{ py: 2 }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Person sx={{ color: '#1976d2', mr: 2, fontSize: 28 }} />
                                <Typography variant="h6" fontWeight={600} color="#1a1a1a">
                                    Profile Information
                                </Typography>
                            </Box>
                            <Chip
                                label={enableEdit ? 'Disable Edit' : 'Enable Edit'}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setEnableEdit(!enableEdit)
                                }}
                                variant={enableEdit ? "filled" : "outlined"}
                                sx={{
                                    mr: 2,
                                    backgroundColor: enableEdit ? '#1976d2' : 'transparent',
                                    color: enableEdit ? '#fff' : '#1976d2',
                                    borderColor: '#1976d2',
                                    '&:hover': {
                                        backgroundColor: enableEdit ? '#1565c0' : 'rgba(25, 118, 210, 0.04)'
                                    },
                                    cursor: 'pointer',
                                    p: 2
                                }}
                            />
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 4, pt: 0 }}>
                        <Box component="form" onSubmit={handleSubmit}>
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
                                        disabled={!enableEdit}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
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
                                        disabled={!enableEdit}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
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
                                        disabled={!enableEdit}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <TextField
                                        fullWidth
                                        label="Facility Name"
                                        name="facilityName"
                                        value={formData.facilityName}
                                        onChange={handleChange}
                                        disabled={!enableEdit}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
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
                                        disabled={!enableEdit}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    >
                                        {facilityTypes.map((type) => (
                                            <MenuItem key={type} value={type}>{type}</MenuItem>
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
                                        disabled={!enableEdit}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    >
                                        {states.map((state) => (
                                            <MenuItem key={state} value={state}>{state}</MenuItem>
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
                                        disabled={!enableEdit || !formData.state}
                                        placeholder={!formData.state ? 'Select State first' : 'Select County'}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    >
                                        {counties.map((county) => (
                                            <MenuItem key={county} value={county}>{county}</MenuItem>
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
                                        type="text"
                                        disabled={!enableEdit}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <Autocomplete
                                        multiple
                                        freeSolo
                                        disabled={!enableEdit}
                                        options={serviceLinesList}
                                        value={formData.serviceLines}
                                        onChange={(event, newValue) => {
                                            setFormData(prev => ({ ...prev, serviceLines: newValue as string[] }))
                                        }}
                                        noOptionsText="No data found"
                                        renderTags={(value, getTagProps) =>
                                            value.map((option, index) => {
                                                const { key, ...tagProps } = getTagProps({ index })
                                                return (
                                                    <Chip
                                                        key={key}
                                                        label={option as string}
                                                        size="small"
                                                        {...tagProps}
                                                    />
                                                )
                                            })
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label="Service Lines"
                                                placeholder="Type to add new service line"
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={!enableEdit}
                                    sx={{
                                        background: enableEdit ? 'linear-gradient(90deg, #1976d2 0%, #3a7de6 100%)' : '#ccc',
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 4,
                                        py: 1.2,
                                        fontWeight: 500,
                                        boxShadow: enableEdit ? '0 2px 8px rgba(64, 139, 255, 0.25)' : 'none'
                                    }}
                                >
                                    Update Profile
                                </Button>
                                <Button
                                    variant="outlined"
                                    sx={{
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 4,
                                        py: 1.2,
                                        borderColor: '#d1d5db',
                                        color: '#6b7280'
                                    }}
                                    onClick={() => setEnableEdit(false)}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                {/* Password Change Section */}
                <Accordion
                    expanded={expanded.password}
                    onChange={handleAccordionChange('password')}
                    sx={{ borderRadius: '5px', border: '1px solid #e4e5e7', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: '0px', my: 3 }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{ py: 2 }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Lock sx={{ color: '#1976d2', mr: 2, fontSize: 28 }} />
                            <Typography variant="h6" fontWeight={600} color="#1a1a1a">
                                Change Password
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 4, pt: 0 }}>
                        <Box component="form" onSubmit={handlePasswordSubmit}>
                            <Grid container spacing={3}>
                                <Grid size={4}>
                                    <TextField
                                        fullWidth
                                        label="Current Password"
                                        name="currentPassword"
                                        type={!showPasswords.current ? 'text' : 'password'}
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        error={!!errors.currentPassword}
                                        helperText={errors.currentPassword}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                                                        edge="end"
                                                    >
                                                        {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <TextField
                                        fullWidth
                                        label="New Password"
                                        name="newPassword"
                                        type={!showPasswords.new ? 'text' : 'password'}
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        error={!!errors.newPassword}
                                        helperText={errors.newPassword}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                                        edge="end"
                                                    >
                                                        {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <TextField
                                        fullWidth
                                        label="Confirm New Password"
                                        name="confirmPassword"
                                        type={!showPasswords.confirm ? 'text' : 'password'}
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        error={!!errors.confirmPassword}
                                        helperText={errors.confirmPassword}
                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                                        edge="end"
                                                    >
                                                        {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 4 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        background: 'linear-gradient(90deg, #1976d2 0%, #3a7de6 100%)',
                                        textTransform: 'none',
                                        borderRadius: '8px',
                                        px: 4,
                                        py: 1.2,
                                        fontWeight: 500,
                                        boxShadow: '0 2px 8px rgba(64, 139, 255, 0.25)'
                                    }}
                                >
                                    Update Password
                                </Button>
                            </Box>
                        </Box>
                    </AccordionDetails>
                </Accordion>

                {/* Notification Settings Section */}
                <Accordion
                    expanded={expanded.notifications}
                    onChange={handleAccordionChange('notifications')}
                    sx={{ borderRadius: '5px', border: '1px solid #e4e5e7', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', borderTop: '0px' }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{ py: 2 }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Notifications sx={{ color: '#1976d2', mr: 2, fontSize: 28 }} />
                            <Typography variant="h6" fontWeight={600} color="#1a1a1a">
                                Notification Settings
                            </Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 4, pt: 0 }}>
                        <Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notifications.assessmentReminders}
                                        onChange={() => handleNotificationChange('assessmentReminders')}
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#1976d2',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#1976d2',
                                            },
                                        }}
                                    />
                                }
                                label={
                                    <Box>
                                        <Typography variant="body1" fontWeight={500} color="#1a1a1a">
                                            Assessment Reminders
                                        </Typography>
                                        <Typography variant="body2" color="#6b7280" sx={{ mt: 0.5 }}>
                                            Receive notifications for upcoming assessments and deadlines
                                        </Typography>
                                    </Box>
                                }
                                sx={{ alignItems: 'flex-start', mb: 2 }}
                            />


                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </DashboardLayout>
    )
}

export default withPageLoader(Settings);