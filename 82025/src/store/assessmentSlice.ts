/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { mockAssessments } from '../mocks/mockData'; // Import mock data
import { AssessmentRecord } from '../types/types';


const initialState: any = {
    assessmentList: mockAssessments, // Initialize with mock data
};

const assessmentSlice = createSlice({
    name: 'assessment',
    initialState,
    reducers: {
        // You can add reducers here to modify the assessmentList
        // Example:
        addAssessment: (state, action: PayloadAction<AssessmentRecord>) => {
            state.assessmentList.push(action.payload);
        },
        updateAssessment: (state, action: PayloadAction<AssessmentRecord>) => {
            const index = state.assessmentList.findIndex((assessment: any) => assessment.id === action.payload.id);
            if (index !== -1) {
                state.assessmentList[index] = action.payload;
            }
        },
        deleteAssessment: (state, action: PayloadAction<string>) => {
            state.assessmentList = state.assessmentList.filter((assessment: any) => assessment.id !== action.payload);
        },
        setAssessments: (state, action: PayloadAction<AssessmentRecord[]>) => {
            state.assessmentList = action.payload;
        },
        currentAssessment: (state: any, action: PayloadAction<AssessmentRecord>) => {
            state.currentAssessment = action.payload;
        },
        updateSectionQuestions: (state, action: PayloadAction<{ sectionId: string, question: any }>) => {
            if (!state.currentAssessment || !state.currentAssessment.sections) return;
            const sectionIndex = state.currentAssessment.sections.findIndex((section: any) => section.id === action.payload.sectionId);
            if (sectionIndex !== -1) {
                if (!state.currentAssessment.sections[sectionIndex].questions) {
                    state.currentAssessment.sections[sectionIndex].questions = [];
                }
                state.currentAssessment.sections[sectionIndex].questions.push(action.payload.question);
            }
        },
    },
});

export const { addAssessment, updateAssessment, deleteAssessment, setAssessments, currentAssessment, updateSectionQuestions } = assessmentSlice.actions;
export default assessmentSlice.reducer;