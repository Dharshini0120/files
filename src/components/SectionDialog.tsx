import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box
} from '@mui/material';
import { forwardRef, useImperativeHandle, useState } from 'react';

interface SectionDialogProps {
    onSave: (sectionData: { title: string; description: string }) => void;
}

export interface SectionDialogRef {
    open: () => void;
    close: () => void;
}

export const SectionDialog = forwardRef<SectionDialogRef, SectionDialogProps>((props, ref) => {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: ''
    });
    const [errors, setErrors] = useState({
        title: '',
        description: ''
    });

    useImperativeHandle(ref, () => ({
        open: () => {
            setOpen(true);
            setFormData({ title: '', description: '' });
            setErrors({ title: '', description: '' });
        },
        close: () => setOpen(false)
    }));

    const handleClose = () => {
        setOpen(false);
        setFormData({ title: '', description: '' });
        setErrors({ title: '', description: '' });
    };

    const validateForm = () => {
        const newErrors = {
            title: '',
            description: ''
        };
        let isValid = true;

        if (!formData.title.trim()) {
            newErrors.title = 'Section title is required';
            isValid = false;
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = () => {
        if (validateForm()) {
            props.onSave(formData);
            handleClose();
        }
    };

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle
                sx={{
                    fontWeight: 600,
                    fontFamily: 'var(--font-inter), sans-serif'
                }}
            >
                Add Section
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Section Title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        error={!!errors.title}
                        helperText={errors.title}
                        sx={{
                            mb: 3,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px'
                            }
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        error={!!errors.description}
                        helperText={errors.description}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '8px'
                            }
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2.5, pt: 0 }}>
                <Button
                    onClick={handleClose}
                    sx={{
                        color: '#408bff',
                        borderColor: '#408bff',
                        textTransform: 'none',
                        borderRadius: '4px',
                        fontWeight: 500,
                        fontFamily: 'var(--font-inter), sans-serif'
                    }}
                    variant="outlined"
                    size='large'
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSubmit}
                    sx={{
                        background: 'linear-gradient(90deg, #408bff 0%, #3a7de6 100%)',
                        color: 'white',
                        textTransform: 'none',
                        borderRadius: '4px',
                        fontWeight: 500,
                        fontFamily: 'var(--font-inter), sans-serif',
                        '&:hover': {
                            background: 'linear-gradient(90deg, #3a7de6 0%, #3670cc 100%)',
                        }
                    }}
                    variant="contained"
                    size='large'
                >
                    Create Section
                </Button>
            </DialogActions>
        </Dialog>
    );
});

SectionDialog.displayName = 'SectionDialog';