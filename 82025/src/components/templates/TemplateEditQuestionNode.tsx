import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Box, TextField, Checkbox, FormControlLabel, Button, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import { Trash2 } from 'lucide-react';

interface EditQuestionNodeData {
    question: string;
    questionType: string;
    options: string[];
    isRequired: boolean;
    isNewQuestion: boolean;
    onSave: (data: any) => void;
    onCancel: () => void;
}

interface EditQuestionNodeProps {
    data: EditQuestionNodeData;
    id: string;
}

const TemplateEditQuestionNode: React.FC<EditQuestionNodeProps> = ({ data, id }) => {
    const [question, setQuestion] = useState(data.question || '');
    const [questionType, setQuestionType] = useState(data.questionType || 'text-input');
    const [options, setOptions] = useState(data.options || ['Option 1', 'Option 2']);
    const [isRequired, setIsRequired] = useState(data.isRequired || false);

    const questionTypes = [
        { value: 'text-input', label: 'Text Input' },
        { value: 'radio', label: 'Radio' },
        { value: 'checkbox', label: 'Checkbox' }
    ];

    // Update options when question type changes
    React.useEffect(() => {
        if (questionType === 'text-input') {
            setOptions([]);
        } else if (options.length === 0) {
            setOptions(['Option 1', 'Option 2']);
        }
    }, [questionType]);

    const handleSave = () => {
        if (!question.trim()) {
            alert('Please enter a question');
            return;
        }

        //console.log('Saving question data:', { question, questionType, options, isRequired });

        // Call the onSave function passed from parent
        if (data.onSave) {
            data.onSave({ question, questionType, options, isRequired });
        }
    };

    const handleCancel = () => {
        //console.log('Canceling question edit');

        // Call the onCancel function passed from parent
        if (data.onCancel) {
            data.onCancel();
        }
    };

    const addOption = () => {
        setOptions([...options, `Option ${options.length + 1}`]);
    };

    const removeOption = (index: number) => {
        if (options.length > 1) {
            setOptions(options.filter((_, i) => i !== index));
        }
    };

    const updateOption = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const showOptions = ['radio', 'checkbox'].includes(questionType);

    return (
        <Box sx={{
            background: 'white',
            border: '2px solid #4baaf4',
            borderRadius: '12px',
            minWidth: '400px',
            maxWidth: '450px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
            overflow: 'visible',
            position: 'relative',
            zIndex: 1000
        }}>
            <Handle type="target" position={Position.Top} style={{ background: '#4baaf4' }} />

            {/* Header */}
            <Box sx={{
                background: '#4baaf4',
                color: 'white',
                padding: '15px 20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderRadius: '10px 10px 0 0'
            }}>
                <Typography sx={{
                    fontSize: '18px',
                    fontWeight: '700'
                }}>
                    {data.isNewQuestion ? ' Add Question' : ' Edit Question'}
                </Typography>
                <IconButton
                    onClick={handleCancel}
                    sx={{
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Content */}
            <Box sx={{ padding: '20px' }}>
                {/* Question Type */}
                <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: 500, mb: 1, color: '#374151' }}>
                        Question Type:
                    </Typography>
                    <select
                        value={questionType}
                        onChange={(e) => setQuestionType(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '14px',
                            backgroundColor: 'white',
                            cursor: 'pointer',
                            outline: 'none'
                        }}
                    >
                        {questionTypes.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </Box>

                {/* Question */}
                <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontSize: '12px', fontWeight: 500, mb: 1, color: '#374151' }}>
                        Question:
                    </Typography>
                    <TextField
                        fullWidth
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Enter your question here..."
                        multiline
                        rows={2}
                        size="small"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: '6px',
                                backgroundColor: 'white',
                                fontSize: '14px'
                            }
                        }}
                    />
                </Box>

                {/* Required Question */}
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={isRequired}
                            onChange={(e) => setIsRequired(e.target.checked)}
                            size="small"
                            sx={{ color: '#4baaf4' }}
                        />
                    }
                    label={
                        <Typography sx={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}>
                            Required Question
                        </Typography>
                    }
                    sx={{ mb: 2 }}
                />

                {/* Options */}
                {showOptions && (
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '12px', fontWeight: 500, mb: 1, color: '#374151' }}>
                            Options:
                        </Typography>
                        {options.map((option, index) => (
                            <Box key={index} sx={{
                                display: 'flex',
                                gap: 1,
                                mb: 2,
                                alignItems: 'center'
                            }}>
                                <TextField
                                    fullWidth
                                    value={option}
                                    onChange={(e) => updateOption(index, e.target.value)}
                                    placeholder="Text"
                                    size="small"
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            backgroundColor: 'white',
                                            fontSize: '14px'
                                        }
                                    }}
                                />
                                <IconButton
                                    onClick={() => removeOption(index)}
                                    disabled={options.length <= 1}
                                    size="small"
                                    sx={{
                                        backgroundColor: '#fd5475',
                                        color: 'white',
                                        width: '32px',
                                        height: '32px',
                                        '&:hover': {
                                            backgroundColor: '#e63a5d'
                                        },
                                        '&:disabled': {
                                            backgroundColor: '#e5e7eb'
                                        }
                                    }}
                                >
                                    <Trash2 size={16} />
                                </IconButton>
                            </Box>
                        ))}

                        <Button
                            startIcon={<AddIcon />}
                            onClick={addOption}
                            variant="contained"
                            size="small"
                            sx={{
                                textTransform: 'none',
                                backgroundColor: '#4baaf4',
                                fontSize: '12px',
                                borderRadius: '4px',
                                mt: 1,
                                '&:hover': {
                                    backgroundColor: '#2196c9'
                                }
                            }}
                        >
                            Add Option
                        </Button>
                    </Box>
                )}

                {/* Buttons */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <Button
                        onClick={handleCancel}
                        sx={{
                            backgroundColor: '#fd5475',
                            color: 'white',
                            px: 4,
                            py: 1,
                            borderRadius: '6px',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: '#e63a5d'
                            }
                        }}
                    >
                        Cancel
                    </Button>
                     <Button
                        onClick={handleSave}
                        sx={{
                            backgroundColor: '#4baaf4',
                            color: 'white',
                            px: 4,
                            py: 1,
                            borderRadius: '6px',
                            textTransform: 'none',
                            fontWeight: 600,
                            '&:hover': {
                                backgroundColor: '#2196c9'
                            }
                        }}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
            <Handle type="source" position={Position.Bottom} style={{ background: '#4baaf4' }} />
        </Box>
    );
};

export default TemplateEditQuestionNode;



