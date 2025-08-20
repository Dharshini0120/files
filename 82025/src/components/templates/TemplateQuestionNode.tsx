import React, { useState, useEffect, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TemplateEditQuestionModal from './TemplateEditQuestionModal';

interface QuestionNodeData {
    question: string;
    questionType: 'text-input' | 'multiple-choice' | 'radio' | 'checkbox' | 'yes-no' | 'select';
    options: string[];
    isRequired: boolean;
    onUpdate: (id: string, newData: any) => void;
    onDelete: (id: string) => void;
    onUpdateEdgeLabels?: (nodeId: string, newOptions: string[]) => void;
    isPreview?: boolean; // Add flag to indicate preview mode
}

interface QuestionNodeProps {
    data: QuestionNodeData;
    id: string;
}

const TemplateQuestionNode: React.FC<QuestionNodeProps> = ({ data, id }) => {
    const [showEditModal, setShowEditModal] = useState(!data.question);
    const [nodePosition, setNodePosition] = useState({ x: 0, y: 0 });
    const nodeRef = useRef<HTMLDivElement>(null);
    const { question, questionType, options, isRequired, isPreview } = data;

    // Get node position for modal placement
    useEffect(() => {
        if (nodeRef.current && showEditModal) {
            const rect = nodeRef.current.getBoundingClientRect();
            const reactFlowBounds = document.querySelector('.react-flow')?.getBoundingClientRect();

            if (reactFlowBounds) {
                setNodePosition({
                    x: rect.right - reactFlowBounds.left + 30, // Consistent 30px gap from right edge
                    y: rect.top - reactFlowBounds.top - 10 // Consistent 10px above the node
                });
            }
        }
    }, [showEditModal]);

    const getQuestionTypeLabel = () => {
        switch (questionType) {
            case 'text-input': return 'TEXT INPUT';
            case 'multiple-choice': return 'MULTIPLE CHOICE';
            case 'radio': return 'RADIO';
            case 'checkbox': return 'CHECKBOX';
            case 'yes-no': return 'YES/NO';
            case 'select': return 'SELECT';
            default: return 'QUESTION';
        }
    };

    const handleSave = (newData: any) => {
        // Update the node data first
        data.onUpdate(id, newData);

        // Update connected edge labels if options changed
        if (newData.options && data.onUpdateEdgeLabels) {
            data.onUpdateEdgeLabels(id, newData.options);
        }

        setShowEditModal(false);
    };

    const handleDelete = () => {
        data.onDelete(id);
    };

    const handleEdit = () => {
        setShowEditModal(true);
    };

    const updateConnectedEdgeLabels = (nodeId: string, newOptions: string[]) => {
        // This function should be passed from the parent component
        if (data.onUpdateEdgeLabels) {
            data.onUpdateEdgeLabels(nodeId, newOptions);
        }
    };

    return (
        <>
            <Box
                ref={nodeRef}
                sx={{
                    background: '#f0f2f3',
                    border: '2px solid #4baaf4',
                    borderRadius: '12px',
                    minWidth: '280px',
                    maxWidth: '350px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    overflow: 'visible',
                    position: 'relative'
                }}
            >
                {/* Input Handle */}
                <Handle
                    type="target"
                    position={Position.Top}
                    style={{
                        background: '#4baaf4',
                        width: '12px',
                        height: '12px',
                        border: '2px solid white',
                        borderRadius: '50%',
                        top: '-18px',
                        zIndex: 100,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                    }}
                />

                {/* Header */}
                <Box sx={{
                    background: '#4baaf4',
                    color: 'white',
                    padding: '12px 15px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: '10px 10px 0 0'
                }}>
                    <Box sx={{
                        fontSize: '12px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                    }}>
                        {getQuestionTypeLabel()}
                        {isRequired && <span style={{ color: '#ff4444', marginLeft: '4px', fontWeight: 'bold' }}>*</span>}
                    </Box>
                    {/* Only show edit/delete buttons when not in preview mode */}
                    {!isPreview && (
                        <Box sx={{ display: 'flex', gap: '4px' }}>
                            <IconButton
                                size="small"
                                onClick={handleEdit}
                                sx={{
                                    color: 'white',
                                    background: 'rgba(255,255,255,0.2)',
                                    width: '24px',
                                    height: '24px',
                                    '&:hover': { background: 'rgba(255,255,255,0.3)' }
                                }}
                            >
                                <EditIcon sx={{ fontSize: '14px' }} />
                            </IconButton>
                            <IconButton
                                size="small"
                                onClick={handleDelete}
                                sx={{
                                    color: 'white',
                                    background: 'rgba(255,255,255,0.2)',
                                    width: '24px',
                                    height: '24px',
                                    '&:hover': { background: 'rgba(255,255,255,0.3)' }
                                }}
                            >
                                <DeleteIcon sx={{ fontSize: '14px' }} />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                {/* Content */}
                <Box sx={{ padding: '15px' }}>
                    <Box sx={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#4baaf4',
                        marginBottom: '8px',
                        lineHeight: '1.3'
                    }}>
                        {question || 'Untitled Question'}
                    </Box>

                    {/* Show options for applicable question types */}
                    {['multiple-choice', 'checkbox', 'radio', 'select'].includes(questionType) && options && (
                        <Box sx={{ fontSize: '13px', color: '#666' }}>
                            <Box sx={{ fontWeight: '600', marginBottom: '4px' }}>Options:</Box>
                            <Box component="ul" sx={{ margin: '0', paddingLeft: '15px' }}>
                                {options.map((option, index) => (
                                    <Box component="li" key={index} sx={{ marginBottom: '2px', fontWeight: '500' }}>
                                        {option}
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {questionType === 'yes-no' && (
                        <Box sx={{ fontSize: '13px', color: '#666' }}>
                            <Box sx={{ fontWeight: '600' }}>Yes / No options</Box>
                        </Box>
                    )}

                    {questionType === 'text-input' && (
                        <Box sx={{ fontSize: '13px', color: '#666' }}>
                            <Box sx={{ fontWeight: '600' }}>Text input field</Box>
                        </Box>
                    )}
                </Box>

                {/* Output Handles */}
                {questionType === 'text-input' && (
                    <Handle
                        type="source"
                        position={Position.Right}
                        id="text-output"
                        style={{
                            background: '#4baaf4',
                            width: '12px',
                            height: '12px',
                            border: '2px solid white',
                            borderRadius: '50%',
                            right: '-6px',
                            top: '85px',
                            zIndex: 100,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                    />
                )}

                {questionType === 'yes-no' && (
                    <>
                        <Handle
                            type="source"
                            position={Position.Right}
                            id="yes"
                            style={{
                                background: '#4baaf4',
                                width: '12px',
                                height: '12px',
                                border: '2px solid white',
                                borderRadius: '50%',
                                right: '-6px',
                                top: '85px',
                                zIndex: 100,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                        />
                        <Handle
                            type="source"
                            position={Position.Right}
                            id="no"
                            style={{
                                background: '#4baaf4',
                                width: '12px',
                                height: '12px',
                                border: '2px solid white',
                                borderRadius: '50%',
                                right: '-6px',
                                top: '105px',
                                zIndex: 100,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                        />
                    </>
                )}

                {/* Individual option handles for multiple-choice, radio, and select */}
                {['multiple-choice', 'radio', 'select'].includes(questionType) && options &&
                    options.map((option, index) => (
                        <Handle
                            key={`option-${index}`}
                            type="source"
                            position={Position.Right}
                            id={`option-${index}`}
                            style={{
                                background: '#4baaf4',
                                width: '12px',
                                height: '12px',
                                border: '2px solid white',
                                borderRadius: '50%',
                                right: '-6px',
                                top: `${85 + (index * 20)}px`,
                                zIndex: 100,
                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }}
                        />
                    ))
                }

                {/* Checkbox handles - individual options + All Selected */}
                {questionType === 'checkbox' && options && (
                    <>
                        {/* Individual option handles */}
                        {options.map((option, index) => (
                            <Handle
                                key={`option-${index}`}
                                type="source"
                                position={Position.Right}
                                id={`option-${index}`}
                                style={{
                                    background: '#4baaf4',
                                    width: '12px',
                                    height: '12px',
                                    border: '2px solid white',
                                    borderRadius: '50%',
                                    right: '-6px',
                                    top: `${85 + (index * 18)}px`,
                                    zIndex: 100,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}
                            />
                        ))}

                        {/* All Selected handle */}
                        {options.length >= 2 && (
                            <Handle
                                type="source"
                                position={Position.Right}
                                id="multi-all"
                                style={{
                                    background: '#4caf50',
                                    width: '14px',
                                    height: '14px',
                                    border: '2px solid white',
                                    borderRadius: '50%',
                                    right: '-7px',
                                    top: `${85 + options.length * 18 + 10}px`,
                                    zIndex: 100,
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}
                            />
                        )}
                    </>
                )}
            </Box>

            {/* Edit Modal positioned relative to node */}
            {showEditModal && (
                <TemplateEditQuestionModal
                    questionData={{ question, questionType, options, isRequired }}
                    onSave={handleSave}
                    onCancel={() => setShowEditModal(false)}
                    isNewQuestion={false}
                    nodePosition={nodePosition}
                />
            )}
        </>
    );
};

export default TemplateQuestionNode;
















