import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ConnectionsPreviewModalProps {
    nodes: any[];
    edges: any[];
    onClose: () => void;
}

const ConnectionsPreviewModal: React.FC<ConnectionsPreviewModalProps> = ({
    nodes,
    edges,
    onClose
}) => {
    const getConnectionsByNode = () => {
        const connections = {};

        edges.forEach(edge => {
            const sourceNode = nodes.find(n => n.id === edge.source);
            if (sourceNode) {
                if (!connections[edge.source]) {
                    connections[edge.source] = {
                        question: sourceNode.data.question,
                        options: {}
                    };
                }

                const optionText = edge.data?.optionText || 'Default';
                if (!connections[edge.source].options[optionText]) {
                    connections[edge.source].options[optionText] = [];
                }

                const targetNode = nodes.find(n => n.id === edge.target);
                connections[edge.source].options[optionText].push({
                    id: edge.target,
                    question: targetNode?.data?.question || 'Unknown'
                });
            }
        });

        return connections;
    };

    const connections = getConnectionsByNode();

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
                    width: '600px',
                    maxHeight: '80vh',
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
                        Question Connections
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

                {/* Content */}
                <Box sx={{
                    p: 3,
                    maxHeight: 'calc(80vh - 80px)',
                    overflow: 'auto'
                }}>
                    {Object.keys(connections).length === 0 ? (
                        <Box sx={{
                            textAlign: 'center',
                            color: '#666',
                            py: 4
                        }}>
                            <Typography sx={{ fontSize: '16px', mb: 1 }}>
                                No connections yet
                            </Typography>
                            <Typography sx={{ fontSize: '14px' }}>
                                Connect question options to create flow between questions
                            </Typography>
                        </Box>
                    ) : (
                        Object.entries(connections).map(([nodeId, data]: any) => (
                            <Box key={nodeId} sx={{
                                mb: 3,
                                p: 2,
                                background: '#f8f9fa',
                                borderRadius: '8px',
                                border: '1px solid #e9ecef'
                            }}>
                                <Typography sx={{
                                    fontWeight: '600',
                                    mb: 2,
                                    color: '#1976d2',
                                    fontSize: '16px'
                                }}>
                                    {data.question}
                                </Typography>

                                {Object.entries(data.options).map(([option, targets]: any) => (
                                    <Box key={option} sx={{
                                        mb: 1,
                                        pl: 2,
                                        borderLeft: '3px solid #e3f2fd'
                                    }}>
                                        <Typography sx={{
                                            fontSize: '14px',
                                            mb: 0.5
                                        }}>
                                            <span style={{
                                                color: '#2196f3',
                                                fontWeight: '500'
                                            }}>
                                                "{option}"
                                            </span>
                                            <span style={{ color: '#666' }}> → </span>
                                            {targets.map((target: any, idx) => (
                                                <span key={target.id} style={{
                                                    color: '#333',
                                                    fontWeight: '500'
                                                }}>
                                                    {target.question}
                                                    {idx < targets.length - 1 ? ', ' : ''}
                                                </span>
                                            ))}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        ))
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default ConnectionsPreviewModal;