import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';

// Import the node components used in your questionnaire builder
import TemplateQuestionNode from './TemplateQuestionNode';
import TemplateEditQuestionNode from './TemplateEditQuestionNode';

const nodeTypes = {
    questionNode: TemplateQuestionNode,
    editQuestionNode: TemplateEditQuestionNode
};

interface TemplatePreviewModalProps {
    template: any;
    onClose: () => void;
}

const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
    template,
    onClose
}) => {
    //console.log('🔍 Preview Modal - Template data:', template);
    //console.log('🔍 Preview Modal - Nodes:', template?.nodes);
    //console.log('🔍 Preview Modal - Edges:', template?.edges);

    // Prepare nodes for preview (remove interactive handlers)
    const previewNodes = (template?.nodes || []).map(node => ({
        ...node,
        data: {
            ...node.data,
            // Remove interactive handlers for preview
            onUpdate: undefined,
            onDelete: undefined,
            onUpdateEdgeLabels: undefined
        }
    }));

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2000
            }}
        >
            <Box
                sx={{
                    background: 'white',
                    borderRadius: '12px',
                    width: '90vw',
                    height: '80vh',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 3,
                        py: 2.5,
                        backgroundColor: '#4baaf4',
                        borderRadius: '12px 12px 0 0'
                    }}
                >
                    <Typography sx={{
                        fontWeight: 600,
                        color: 'white',
                        fontSize: '18px'
                    }}>
                        {template?.name || 'Template Preview'}
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: 'white',
                            '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Flow Chart */}
                <Box sx={{
                    height: 'calc(80vh - 80px)',
                    width: '100%'
                }}>
                    <ReactFlow
                        nodes={previewNodes}
                        edges={template?.edges || []}
                        nodeTypes={nodeTypes}
                        fitView
                        nodesDraggable={false}
                        nodesConnectable={false}
                        elementsSelectable={false}
                        fitViewOptions={{
                            padding: 0.1,
                            minZoom: 0.1,
                            maxZoom: 2
                        }}
                    >
                        <Controls />
                        <MiniMap />
                        <Background variant={"dot" as any} gap={12} size={1} />
                    </ReactFlow>
                </Box>
            </Box>
        </Box>
    );
};

export default TemplatePreviewModal;

