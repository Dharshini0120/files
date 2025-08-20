/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AssessmentRecord {
    id: string;
    title: string;
    category: string;
    description: string;
    createdBy: string;
    createdDate: string;
    status: string;
    priority: string;
    completedBy: string;
    lastModified: string;
    sections: any
}

export const mockAssessments: AssessmentRecord[] = [
    {
        id: 'ASS001',
        title: 'Annual Health Check',
        category: 'General Health',
        description: 'Annual health check for all employees',
        createdBy: 'Dr. John Doe',
        createdDate: '2025-06-01',
        status: 'In Progress',
        priority: 'High',
        completedBy: '',
        lastModified: 'Jun 01, 2025',
        sections: []
    },
    {
        id: 'ASS002',
        title: 'Cardiac Evaluation',
        category: 'Cardiac',
        description: 'Comprehensive cardiac evaluation for high-risk patients',
        createdBy: 'Dr. Jane Smith',
        createdDate: '2025-05-15',
        status: 'Completed',
        priority: 'Medium',
        completedBy: 'Dr. Sarah Johnson',
        lastModified: 'May 15, 2025',
        sections: []
    },
    {
        id: 'ASS003',
        title: 'Diabetes Screening',
        category: 'Respiratory',
        description: 'Regular diabetes screening for early detection',
        createdBy: 'Dr. Robert White',
        createdDate: '2025-05-01',
        status: 'Completed',
        priority: 'Medium',
        completedBy: 'Dr. Michael Chen',
        lastModified: 'May 01, 2025',
        sections: []
    },
    {
        id: 'ASS004',
        title: 'Physical Therapy Assessment',
        category: 'Neurological',
        description: 'Initial assessment for physical therapy patients',
        createdBy: 'Dr. Emily Green',
        createdDate: '2025-04-20',
        status: 'In Progress',
        priority: 'Low',
        completedBy: '',
        lastModified: 'Apr 20, 2025',
        sections: []
    },
    {
        id: 'ASS005',
        title: 'Mental Health Evaluation',
        category: 'Orthopedic',
        description: 'Mental health evaluation for new patients',
        createdBy: 'Dr. David Blue',
        createdDate: '2025-04-10',
        status: 'Completed',
        priority: 'High',
        completedBy: 'Dr. Emily White',
        lastModified: 'Apr 10, 2025',
        sections: []
    }
];