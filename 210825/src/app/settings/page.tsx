/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React, { useState } from 'react'
import { Button, Typography, Box } from '@mui/material'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { withPageLoader } from "@frontend/shared-ui"
function Settings() {
    return (
        <DashboardLayout>
            <Box>
                <Typography variant="h6" gutterBottom>
                    Account Settings
                </Typography>
            </Box>
        </DashboardLayout>
    )
}

export default withPageLoader(Settings);
