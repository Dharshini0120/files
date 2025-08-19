import React, { useState, useEffect, useRef } from 'react';
import {
    TextField,
    Checkbox,
    FormControlLabel,
    Button,
    Box,
    Typography,
    IconButton
} from '@mui/material';
import { Trash2 } from 'lucide-react';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

interface EditQuestionModalProps {
    questionData: {
        question: string;
        questionType: string;
        options: string[];
        isRequired: boolean;
    };
    onSave: (data: any) => void;
    onCancel: () => void;
    isNewQuestion?: boolean;
    nodePosition?: { x: number; y: number };
}

const TemplateEditQuestionModal: React.FC<EditQuestionModalProps> = ({
    questionData,
    onSave,
    onCancel,
    isNewQuestion = false,
    nodePosition
}) => {
    const [question, setQuestion] = useState(questionData.question || '');
    const [questionType, setQuestionType] = useState(questionData.questionType || 'text-input');
    const [options, setOptions] = useState(questionData.options || ['Option 1', 'Option 2']);
    const [isRequired, setIsRequired] = useState(questionData.isRequired || false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const modalRef = useRef<HTMLDivElement>(null);
    // Position modal in canvas coordinates
    const getInitialPosition = () => {
        if (nodePosition) {
            return {
                x: nodePosition.x,
                y: nodePosition.y
            };
        }
        return {
            x: 300,
            y: 200
        };
    };

    const [position, setPosition] = useState(getInitialPosition());

    // Update position when nodePosition changes
    useEffect(() => {
        if (nodePosition) {
            // Use the exact position provided, with minimal constraint checking
            const constrainedPosition = {
                x: Math.max(10, Math.min(nodePosition.x, window.innerWidth - 420)), // Keep within bounds
                y: Math.max(10, Math.min(nodePosition.y, window.innerHeight - 600))
            };
            setPosition(constrainedPosition);
        }
    }, [nodePosition]);

    // Constrain position to canvas bounds
    const constrainPosition = (newPosition: { x: number; y: number }) => {
        const modalWidth = 400;
        const modalHeight = modalRef.current?.offsetHeight || 600;

        return {
            x: Math.max(10, Math.min(newPosition.x, window.innerWidth - modalWidth - 10)),
            y: Math.max(10, Math.min(newPosition.y, window.innerHeight - modalHeight - 10))
        };
    };

    const questionTypes = [
        { value: 'text-input', label: 'Text Input' },
        { value: 'radio', label: 'Radio' },
        { value: 'checkbox', label: 'Checkbox' }
    ];

    // Update options when question type changes
    useEffect(() => {
        if (questionType === 'text-input') {
            setOptions([]);
        } else if (options.length === 0) {
            setOptions(['Option 1', 'Option 2']);
        }
    }, [questionType]);

    const handleHeaderMouseDown = (e: React.MouseEvent) => {
        // Only start dragging from header
        setIsDragging(true);
        setDragStart({
            x: e.clientX - position.x,
            y: e.clientY - position.y
        });
        e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const newPosition = {
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            };
            setPosition(constrainPosition(newPosition));
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, dragStart]);

    const handleSave = () => {
        if (!question.trim()) {
            alert('Please enter a question');
            return;
        }

        const savedData = { question, questionType, options, isRequired };
        onSave(savedData);
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
        <div
            ref={modalRef}
            style={{
                position: 'fixed',
                left: '207px',
                top: '102px',
                width: '500px',
                // maxHeight: '90vh',
                background: 'white',
                border: '1px solid rgb(224, 224, 224)',
                borderRadius: '12px',
                boxShadow: 'rgba(0, 0, 0, 0.15) 0px 10px 25px',
                zIndex: 9999,
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header - Draggable area */}
            <Box
                onMouseDown={handleHeaderMouseDown}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    px: 3,
                    py: 2.5,
                    backgroundColor: '#4baaf4',
                    borderRadius: '12px 12px 0 0',
                    cursor: isDragging ? 'grabbing' : 'grab',
                    userSelect: 'none',
                    flexShrink: 0
                }}
            >
                <Typography sx={{
                    fontWeight: 600,
                    color: 'white',
                    fontSize: '18px',
                    pointerEvents: 'none'
                }}>
                    {isNewQuestion ? 'Add Question' : 'Edit Question'}
                </Typography>
                <IconButton
                    onClick={onCancel}
                    onMouseDown={(e) => e.stopPropagation()}
                    sx={{
                        color: 'white',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            {/* Content - No scroll, full height */}
            <Box sx={{
                p: 3
            }}>

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
                                            fontSize: '14px',
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: '#d1d5db'
                                            }
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

                {/* Option Connections Summary */}
                {showOptions && options.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography sx={{ fontSize: '14px', fontWeight: 600, mb: 1, color: '#374151' }}>
                            Option Connections:
                        </Typography>
                        <Box sx={{
                            border: '1px solid #e5e7eb',
                            borderRadius: '6px',
                            backgroundColor: '#f9fafb',
                            p: 1
                        }}>
                            {options.map((option, index) => (
                                <Box key={index} sx={{
                                    mb: 1,
                                    p: 1.5,
                                    backgroundColor: 'white',
                                    borderRadius: '4px',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    <Typography sx={{ fontSize: '13px', fontWeight: 500, color: '#1f2937' }}>
                                        "{option}" connects to:
                                    </Typography>
                                    <Typography sx={{ fontSize: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                                        Drag from the handle on the right to connect this option to next question.
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* All Selected Dependencies for Checkbox removed as requested */}

                {/* Buttons */}
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid #e5e7eb'
                }}>
                    <Button
                        onClick={onCancel}
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
        </div>
    );
};

export default TemplateEditQuestionModal;
















