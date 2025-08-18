import React from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { withPageLoader } from '@frontend/shared-ui'

function Security() {
    return (
        <DashboardLayout>
            Security
        </DashboardLayout>
    )
}

export default withPageLoader(Security);