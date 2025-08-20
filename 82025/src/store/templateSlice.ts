import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TemplateMetadata {
  templateName: string;
  facilityTypes: string[];
  facilityServices: string[];
}

interface TemplateState {
  metadata: TemplateMetadata;
  isMetadataSet: boolean;
}

const initialState: TemplateState = {
  metadata: {
    templateName: '',
    facilityTypes: [],
    facilityServices: [],
  },
  isMetadataSet: false,
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    setTemplateMetadata: (state, action: PayloadAction<TemplateMetadata>) => {
      state.metadata = action.payload;
      state.isMetadataSet = true;
    },
    clearTemplateMetadata: (state) => {
      state.metadata = initialState.metadata;
      state.isMetadataSet = false;
    },
  },
});

export const { setTemplateMetadata, clearTemplateMetadata } = templateSlice.actions;
export default templateSlice.reducer;