/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Box,
    Paper,
    Typography,
    Button,
    Grid,
    IconButton,
    TextField,
    Snackbar,
    Alert
} from '@mui/material';
import { PageHeader } from '../../../../../components/PageHeader';
import { ArrowUpward, ArrowDownward, Edit, Delete, AddOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { currentAssessment } from '../../../../../store/assessmentSlice';
import DashboardLayout from '../../../../../components/layout/DashboardLayout';

interface Question {
    id: number;
    title: string;
    type: string;
    order: number;
}

export default function QuestionsPage() {
    const params = useParams();
    const router = useRouter();
    const [sectionTitle, setSectionTitle] = useState('Section');
    const [errors, setErrors] = useState({
        title: '',
        category: '',
        description: ''
    });
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: ''
    });
    const [questions, setQuestions] = useState<Question[]>([]);
    const [questionCounter, setQuestionCounter] = useState(1);
    const sectionId = params.id;
    const currentAssessmentSelector = useSelector((state: any) => state.assessment.currentAssessment);
    const storeSelector = useSelector((state) => state)
    const dispatch = useDispatch();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    //console.log('########', storeSelector)

    useEffect(() => {
        if (currentAssessmentSelector?.sections) {
            const currentSection = currentAssessmentSelector.sections.find((section: any) => section.id === Number(sectionId));
            if (currentSection) {
                setSectionTitle(currentSection.title);
                setQuestions(currentSection.questions);
            }
        }

    }, [currentAssessmentSelector?.sections, sectionId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            // Handle form submission
            //console.log('Form submitted:', formData);
        }
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            title: '',
            category: '',
            description: ''
        };

        if (!formData.title.trim()) {
            newErrors.title = 'Assessment title is required';
            isValid = false;
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        } else if (formData.description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleAddQuestion = () => {
        router.push(`/assessment/form/section/${sectionId}/question`);
    };

    const handleMoveQuestion = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) ||
            (direction === 'down' && index === questions.length - 1)) {
            return;
        }

        const newQuestions = [...questions];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        [newQuestions[index], newQuestions[swapIndex]] =
            [newQuestions[swapIndex], newQuestions[index]];

        // Update order properties
        newQuestions[index].order = index;
        newQuestions[swapIndex].order = swapIndex;

        setQuestions(newQuestions);
    };

    const handleEditQuestion = (questionId: number) => {
        router.push(`/assessment/form/section/${sectionId}/question`);
    };

    const handleDeleteQuestion = (questionId: number) => {
        const updatedQuestions = questions.filter(question => question.id !== questionId);
        setQuestions(updatedQuestions);
        localStorage.setItem(`section_${sectionId}_questions`, JSON.stringify(updatedQuestions));
    };

    // Move section handlers
    const handleMoveQuestions = (index: number, direction: 'up' | 'down') => {
        if ((direction === 'up' && index === 0) ||
            (direction === 'down' && index === questions.length - 1)) {
            return;
        }

        const newQuestions = [...questions];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap order values
        const tempOrder = newQuestions[index].order;
        newQuestions[index].order = newQuestions[swapIndex].order;
        newQuestions[swapIndex].order = tempOrder;

        // Swap positions in array
        [newQuestions[index], newQuestions[swapIndex]] =
            [newQuestions[swapIndex], newQuestions[index]];

        setQuestions(newQuestions);
    };

    const handleSaveSection = () => {

        // Find the current section
        const currentSection = currentAssessmentSelector.sections.find(
            (section: any) => section.id === Number(sectionId)
        );
        // Create updated section object
        const updatedSection = {
            ...currentSection
        };

        // Create updated sections array
        const updatedSections = currentAssessmentSelector.sections.map((section: any) =>
            section.id === Number(sectionId) ? updatedSection : section
        );

        // Create updated assessment object
        const updatedAssessment = {
            ...currentAssessmentSelector,
            sections: updatedSections,
        };

        // Dispatch to update Redux store
        dispatch(currentAssessment(updatedAssessment));
        setSnackbarMessage('Section saved successfully!');
        setSnackbarOpen(true);
        router.push(`/assessment/form`);
    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    return (
        <DashboardLayout>
            <Box>
                <PageHeader
                    title={`${sectionTitle} - Questions`}
                    subtitle="Add and manage questions for this section"
                    showBackButton={true}
                    showActionButton={true}
                    actionButtonText="Save Section"
                    onActionClick={handleSaveSection}
                />

                <Paper sx={{
                    p: 3,
                    borderRadius: '10px',
                    border: '1px solid #eff0f1ff',
                    boxShadow: 'none',
                    marginTop: 3
                }}>
                    <Grid container alignItems="center">
                        <Grid size={10}>
                            <Typography
                                variant="h6"
                                fontWeight={800}
                                fontFamily={'var(--font-inter), sans-serif'}
                            >
                                Questions ({questions.length})
                            </Typography>
                            <Typography
                                variant="subtitle2"
                                color="#6c757d"
                                fontFamily={'var(--font-inter), sans-serif'}
                            >
                                Manage the questions for this section. You can add, edit, move, or delete questions as needed.
                            </Typography>
                        </Grid>
                        <Grid size={2} textAlign={'right'}>
                            <Button
                                onClick={handleAddQuestion}
                                variant="outlined"
                                sx={{
                                    // background: 'linear-gradient(90deg, #408bff 0%, #3a7de6 100%)',
                                    textTransform: 'none',
                                    letterSpacing: '0.5px',
                                    fontWeight: 500,
                                    fontFamily: 'var(--font-inter), sans-serif',
                                    borderRadius: '4px',
                                    padding: '8px 24px',
                                    // boxShadow: '0 2px 8px rgba(64, 139, 255, 0.25)',
                                    // border: 'none',
                                    // '&:hover': {
                                    //     background: 'linear-gradient(90deg, #3a7de6 0%, #3670cc 100%)',
                                    //     boxShadow: '0 4px 12px rgba(64, 139, 255, 0.3)',
                                    // }
                                }}
                            >
                                <AddOutlined /> &nbsp; New Question
                            </Button>

                        </Grid>
                    </Grid>

                    {questions.length === 0 ? (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                py: 12,
                                px: 5,
                                border: '1px dashed #eff0f1ff',
                                borderRadius: '8px',
                                mt: 3,
                                backgroundColor: '#fafafa'
                            }}
                        >
                            <Typography variant="body1">{`No questions added yet. Click "Add Question" to get started.`}</Typography>
                        </Box>
                    ) : (

                        questions.map((question: any, index) => (
                            <Box
                                key={question.id}
                                style={{
                                    border: '1px solid #eff0f1ff',
                                    borderRadius: '8px',
                                    padding: '15px',
                                    marginTop: '20px'
                                }}
                            >
                                <Grid container alignItems="center" justifyContent="space-between">
                                    <Grid size={9}>
                                        <Typography variant="subtitle2">
                                            <span style={{
                                                borderRadius: '90px',
                                                background: '#f5f5f5ff',
                                                width: '30px',
                                                height: '30px',
                                                display: 'inline-block',
                                                textAlign: 'center',
                                                lineHeight: '30px',
                                                fontWeight: 600
                                            }}>
                                                {index + 1}
                                            </span>
                                            <span style={{ fontWeight: 600, marginLeft: '20px' }}>
                                                {question.title}
                                            </span>
                                            {/* &nbsp;({section.questionCount} questions) */}
                                        </Typography>
                                    </Grid>
                                    <Grid size={3}>
                                        <Box display="flex" gap={1} justifyContent={'flex-end'}>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleMoveQuestions(index, 'up')}
                                                disabled={index === 0}
                                                style={{
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '6px',
                                                    padding: '8px',
                                                    margin: '4px'
                                                }}
                                            >
                                                <ArrowUpward fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleMoveQuestions(index, 'down')}
                                                disabled={index === questions.length - 1}
                                                style={{
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '6px',
                                                    padding: '8px',
                                                    margin: '4px'
                                                }}
                                            >
                                                <ArrowDownward fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleEditQuestion(question.id)}
                                                style={{
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '6px',
                                                    padding: '8px',
                                                    margin: '4px'
                                                }}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteQuestion(question.id)}
                                                style={{
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: '6px',
                                                    padding: '8px',
                                                    margin: '4px'
                                                }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Box>
                        ))


                    )}
                </Paper>

                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={5000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%', fontWeight: 600 }}>
                        {snackbarMessage}
                    </Alert>
                </Snackbar>

            </Box>
        </DashboardLayout>
    );
}