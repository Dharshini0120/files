/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import Toolbar from './Toolbar';
import StartDialog from './StartDialog';
import ConnectionsPreviewModal from './ConnectionsPreviewModal';
import SectionNode from './SectionNode';
import QuestionnaireNode from '../../components/templates/QuestionnaireNode';
import TemplateEditQuestionNode from '../../components/templates/TemplateEditQuestionNode';
import { withPageLoader } from '@frontend/shared-ui';
// import DashboardLayout from '../../components/layout/DashboardLayout';
// Removed Redux imports - using local state instead
import { Button } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import hardcodedTemplateData from '../../data/hardcodedTemplate.json';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@apollo/client';
import {
  CREATE_SCENARIO_MUTATION,
  CreateScenarioVersionInput,
  GET_ALL_SCENARIOS_QUERY,
  GetAllScenariosData,
  ScenarioVersion,
  GET_SCENARIO_BY_ID_QUERY,
  GetScenarioByIdData
} from '../../graphql/scenario.service';

const QuestionnaireBuilder: React.FC<any> = ({
  isEditMode = false,
  questionnaireId,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [nodeId, setNodeId] = useState(1);
  // Show StartDialog only for new templates (not edit mode)
  const getInitialShowStartDialog = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      const templateId = urlParams.get('templateId');
      // Show StartDialog only for new templates (not edit mode)
      return mode !== 'edit' && !templateId;
    }
    return true; // Default to showing for new templates
  };

  const [showStartDialog, setShowStartDialog] = useState(getInitialShowStartDialog);
  const [showConnectionsPreview, setShowConnectionsPreview] = useState(false);

  // Initialize based on URL parameters
  const getInitialShowCreateAssessment = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');
      return mode !== 'edit';
    }
    return true;
  };

  const [showCreateAssessment, setShowCreateAssessment] = useState(getInitialShowCreateAssessment);

  const nodeTypes = useMemo(
    () => ({
      questionNode: QuestionnaireNode,
      sectionNode: SectionNode,
      editQuestionNode: TemplateEditQuestionNode,
    }),
    []
  );

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);

      if (sourceNode && targetNode) {
        // Get the option text based on the source handle
        let optionText = 'Default';

        if (params.sourceHandle && params.sourceHandle.startsWith('option-')) {
          const optionIndex = parseInt(params.sourceHandle.split('-')[1]);
          optionText = sourceNode.data.options?.[optionIndex] || 'Default';
        } else if (params.sourceHandle === 'multi-all') {
          optionText = 'All Selected';
        } else if (params.sourceHandle === 'yes') {
          optionText = 'Yes';
        } else if (params.sourceHandle === 'no') {
          optionText = 'No';
        } else if (params.sourceHandle === 'text-output') {
          optionText = 'Any Text';
        }

        const newEdge: any = {
          ...params,
          id: `${params.source}-${params.target}-${params.sourceHandle || 'default'}-${Date.now()}`,
          type: 'smoothstep',
          animated: true,
          style: {
            stroke: '#2196f3',
            strokeWidth: 2,
            strokeDasharray: '5,5',
          },
          data: {
            optionText,
            sourceHandle: params.sourceHandle,
            condition: sourceNode.data.questionType,
          },
          label: optionText,
          labelStyle: {
            fill: '#2196f3',
            fontWeight: 600,
            fontSize: '12px',
          },
          labelBgStyle: {
            fill: 'white',
            fillOpacity: 0.9,
            rx: 4,
            stroke: '#2196f3',
            strokeWidth: 1,
          },
          labelBgPadding: [4, 8],
          labelShowBg: true,
        };

        setEdges((eds) => addEdge(newEdge, eds));
      }
    },
    [nodes, setEdges]
  );

  // Local state for template metadata instead of Redux
  const [templateMetadata, setTemplateMetadata] = useState({
    templateName: '',
    facilityTypes: [] as string[],
    facilityServices: [] as string[],
  });
  const [isMetadataSet, setIsMetadataSet] = useState(false);
  const [hasCompletedStartDialog, setHasCompletedStartDialog] = useState(false);

  // GraphQL mutation for creating scenario
  const [createScenario, { loading: createScenarioLoading }] = useMutation(CREATE_SCENARIO_MUTATION);

  // GraphQL query for getting all scenarios
  const { data: scenariosData, loading: scenariosLoading, refetch: refetchScenarios } = useQuery<GetAllScenariosData>(
    GET_ALL_SCENARIOS_QUERY,
    {
      variables: {
        page: 1,
        limit: 10,
        sortBy: "version",
        sortOrder: "desc"
      },
      fetchPolicy: 'cache-and-network'
    }
  );

  // Get scenarioId from URL for edit mode
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);

  // GraphQL query for getting scenario by ID (for edit mode)
  const { data: scenarioByIdData, loading: scenarioByIdLoading } = useQuery<GetScenarioByIdData>(
    GET_SCENARIO_BY_ID_QUERY,
    {
      variables: { scenarioId: currentScenarioId },
      skip: !currentScenarioId, // Skip query if no scenarioId
      fetchPolicy: 'cache-and-network'
    }
  );

  // Debug: Log metadata changes
  useEffect(() => {
    console.log('📊 Template metadata changed:', templateMetadata);
    console.log('📊 isMetadataSet:', isMetadataSet);
  }, [templateMetadata, isMetadataSet]);

  // Get scenarioId from URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const scenarioId = urlParams.get('scenarioId');
      if (scenarioId) {
        setCurrentScenarioId(scenarioId);
        console.log('📝 Edit mode - Scenario ID:', scenarioId);
      }
    }
  }, []);

  // Load scenario data when scenarioByIdData is available
  useEffect(() => {
    if (scenarioByIdData?.getScenarioById) {
      const scenario = scenarioByIdData.getScenarioById;
      console.log('📊 Loading scenario data for editing:', scenario);

      // Set template metadata
      setTemplateMetadata({
        templateName: scenario.scenario.name,
        facilityTypes: scenario.questionnaire?.facilityTypes || [],
        facilityServices: scenario.questionnaire?.facilityServices || [],
      });
      setIsMetadataSet(true);
      setHasCompletedStartDialog(true);

      // Load nodes and edges
      if (scenario.questionnaire?.nodes) {
        setNodes(scenario.questionnaire.nodes);
      }
      if (scenario.questionnaire?.edges) {
        setEdges(scenario.questionnaire.edges);
      }

      // Update node ID counter
      if (scenario.questionnaire?.nodes?.length > 0) {
        const maxId = Math.max(...scenario.questionnaire.nodes.map((n: any) => parseInt(n.id) || 0));
        setNodeId(maxId + 1);
      }
    }
  }, [scenarioByIdData, setNodes, setEdges]);

  const handleAddQuestion = (metaData?: any) => {
    // Check if metaData is actually metadata and not a click event
    const isValidMetadata = metaData &&
      typeof metaData === 'object' &&
      !metaData.nativeEvent && // Click events have nativeEvent
      !metaData._reactName && // Click events have _reactName
      (metaData.templateName !== undefined || metaData.facilityTypes !== undefined || metaData.serviceLines !== undefined);

    console.log('🔍 handleAddQuestion called');
    console.log('🔍 isValidMetadata:', isValidMetadata);
    console.log('🔍 isMetadataSet:', isMetadataSet);

    // If this is metadata from StartDialog, store it and close dialog
    if (isValidMetadata) {
      console.log('✅ Processing metadata from StartDialog:', metaData);

      const metadata = {
        templateName: metaData.templateName,
        facilityTypes: metaData.facilityTypes,
        facilityServices: metaData.serviceLines, // mapping serviceLines to facilityServices
      };

      console.log('✅ Final metadata object:', metadata);

      // Validate metadata before setting
      if (metadata.templateName && metadata.templateName.trim() !== '') {
        // Store metadata in local state
        setTemplateMetadata(metadata);
        setIsMetadataSet(true);
        setHasCompletedStartDialog(true); // Mark that StartDialog has been completed

        // Also store in localStorage as backup
        localStorage.setItem('currentTemplateMetadata', JSON.stringify(metadata));
        console.log('✅ Metadata successfully set - ready for question creation');

        // Close the start dialog and immediately show question creation modal
        setShowStartDialog(false);

        // Create temp edit node after a short delay to allow dialog to close
        setTimeout(() => {
          console.log('🎯 Auto-creating question edit node after StartDialog');
          const tempNode = {
            id: 'temp-edit-node',
            type: 'editQuestionNode',
            position: {
              x: 400,
              y: 250,
            },
            data: {
              question: '',
              questionType: 'text-input',
              options: ['Option 1', 'Option 2'],
              isRequired: false,
              isNewQuestion: true,
              onSave: handleSaveNewQuestion,
              onCancel: handleCancelNewQuestion,
            },
          };
          setNodes((nds) => [...nds, tempNode]);
        }, 100);
        return;
      } else {
        console.error('❌ Invalid metadata - templateName is missing or empty:', metadata);
        toast.error('Please fill in the template name before proceeding.');
        return;
      }
    }

    // If this is a regular + button click (no metadata), create question node
    console.log('🎯 Creating new question node');

    // Check if we have metadata set (should be set from StartDialog)
    if (!isMetadataSet && !checkIsEditMode()) {
      console.log('❌ No metadata available - cannot create question');
      toast.error('Please start by creating a new template first.');
      return;
    }

    // Position the edit node in the center-right area of the canvas
    const tempNode = {
      id: 'temp-edit-node',
      type: 'editQuestionNode',
      position: {
        x: 400,
        y: 250,
      },
      data: {
        question: '',
        questionType: 'text-input',
        options: ['Option 1', 'Option 2'],
        isRequired: false,
        isNewQuestion: true,
        onSave: handleSaveNewQuestion,
        onCancel: handleCancelNewQuestion,
      },
    };

    setNodes((nds) => [...nds, tempNode]);
  };

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((node) => node.id !== nodeId));
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    },
    [setNodes, setEdges]
  );

  const handleUpdateNode = useCallback(
    (nodeId: string, newData: any) => {
      setNodes((nds) =>
        nds.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node))
      );

      // Update connected edge labels when options change
      if (newData.options) {
        setEdges((eds) =>
          eds.map((edge) => {
            if (edge.source === nodeId && edge.sourceHandle?.startsWith('option-')) {
              const optionIndex = parseInt(edge.sourceHandle.split('-')[1]);
              const newOptionText = newData.options[optionIndex];

              if (newOptionText) {
                return {
                  ...edge,
                  label: newOptionText,
                  data: {
                    ...edge.data,
                    optionText: newOptionText,
                  },
                };
              }
            }
            return edge;
          })
        );
      }
    },
    [setNodes, setEdges]
  );

  const handleUpdateEdgeLabels = useCallback(
    (nodeId: string, newOptions: string[]) => {
      setEdges((eds) =>
        eds.map((edge) => {
          if (edge.source === nodeId && edge.sourceHandle?.startsWith('option-')) {
            const optionIndex = parseInt(edge.sourceHandle.split('-')[1]);
            const newOptionText = newOptions[optionIndex];

            if (newOptionText) {
              return {
                ...edge,
                label: newOptionText,
                data: {
                  ...edge.data,
                  optionText: newOptionText,
                },
              };
            }
          }
          return edge;
        })
      );
    },
    [setEdges]
  );

  const addQuestionNode = useCallback(
    (questionData) => {
      const headerHeight = 93;
      const newNode = {
        id: `${nodeId}`,
        type: 'questionNode',
        position: {
          x: Math.random() * 400 + 100,
          y: Math.random() * 300 + (headerHeight + 50),
        },
        data: {
          ...questionData,
          onUpdate: handleUpdateNode,
          onDelete: handleDeleteNode,
          onUpdateEdgeLabels: handleUpdateEdgeLabels,
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setNodeId((prev) => prev + 1);
    },
    [nodeId, setNodes, setEdges, handleUpdateNode, handleDeleteNode, handleUpdateEdgeLabels]
  );

  const addSectionNode = useCallback(() => {
    const headerHeight = 93;
    const newNode = {
      id: `section-${nodeId}`,
      type: 'sectionNode',
      position: {
        x: Math.random() * 400 + 100,
        y: Math.random() * 300 + (headerHeight + 50),
      },
      data: {
        sectionName: '',
        weight: 1, // Default weight
        onUpdate: handleUpdateNode,
        onDelete: handleDeleteNode,
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setNodeId((prev) => prev + 1);
  }, [nodeId, setNodes, handleUpdateNode, handleDeleteNode]);

  const handleSaveQuestionnaire = async () => {
    console.log('🔍 Save triggered - Current metadata:', templateMetadata);
    console.log('🔍 Save triggered - isMetadataSet:', isMetadataSet);

    if (nodes.length === 0) {
      toast.error('Please add at least one question before saving.');
      return;
    }

    // Check if we're in edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const isEditMode = mode === 'edit';

    // For edit mode, check if we have metadata from the existing template
    const hasValidMetadata = isMetadataSet &&
      templateMetadata.templateName &&
      templateMetadata.templateName.trim() !== '' &&
      templateMetadata.facilityTypes &&
      templateMetadata.facilityServices;

    const hasMetadata = hasValidMetadata ||
      (isEditMode && (templateMetadata.templateName || templateMetadata.facilityTypes?.length > 0 || templateMetadata.facilityServices?.length > 0));

    console.log('🔍 Save validation - hasValidMetadata:', hasValidMetadata, 'hasMetadata:', hasMetadata, 'isEditMode:', isEditMode);

    if (!hasMetadata && !isEditMode) {
      toast.error('Please set template metadata first by clicking Add Question.');
      return;
    }

    if (!hasValidMetadata && !isEditMode) {
      toast.error('Please fill out all required fields in the start dialog (Template Name, Facility Types, Service Lines).');
      setShowStartDialog(true);
      return;
    }

    // Use template name from metadata (works for both new and edit modes)
    const name = templateMetadata.templateName;

    console.log('🔍 Template name validation - name:', name, 'templateMetadata.templateName:', templateMetadata.templateName);

    if (!name || !name.trim()) {
      console.log('❌ Template name validation failed - name is empty');
      toast.error('Template name is required! Please set it in the start dialog.');
      // Show start dialog to allow user to set metadata
      setShowStartDialog(true);
      return;
    }

    try {
      // Call GraphQL API to create scenario
      console.log('🚀 Calling createScenario API...');

      const scenarioInput: CreateScenarioVersionInput = {
        name: name.trim(),
        questionnaire: {
          nodes,
          edges,
          templateName: templateMetadata.templateName,
          facilityTypes: templateMetadata.facilityTypes,
          facilityServices: templateMetadata.facilityServices,
        }
      };

      console.log('📤 Sending scenario input:', JSON.stringify(scenarioInput, null, 2));
      console.log('📊 Input details:');
      console.log(`  - Name: ${scenarioInput.name}`);
      console.log(`  - Nodes count: ${nodes.length}`);
      console.log(`  - Edges count: ${edges.length}`);
      console.log(`  - Template name: ${templateMetadata.templateName}`);
      console.log(`  - Facility types: ${templateMetadata.facilityTypes.join(', ')}`);
      console.log(`  - Facility services: ${templateMetadata.facilityServices.join(', ')}`);

      const result = await createScenario({
        variables: {
          input: scenarioInput
        }
      });

      console.log('✅ CreateScenario API response:', result.data);

      if (result.data?.createScenario) {
        const { code, message, type } = result.data.createScenario;
        console.log(`✅ API Response - Code: ${code}, Message: ${message}, Type: ${type}`);
        console.log(`📊 Full API response:`, JSON.stringify(result.data, null, 2));

        // Refetch scenarios to update the list
        refetchScenarios();

        toast.success(message || `Questionnaire "${name}" saved successfully!`);
      } else {
        console.error('❌ No createScenario response received');
        console.error('📊 Full result:', JSON.stringify(result, null, 2));
        toast.success(` Questionnaire "${name}" saved successfully!`);
      }

      // Don't clear metadata after save - keep it for continued editing
      // Metadata will be cleared when user navigates away or starts a new template
    } catch (error: any) {
      console.error('❌ Error saving questionnaire:', error);
      toast.error('Failed to save questionnaire: ' + error.message);
    }
  };

  const handleExportJSON = () => {
    const questionnaire = { nodes, edges };
    const blob = new Blob([JSON.stringify(questionnaire, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'questionnaire.json';
    a.click();
  }; 

  const handleClearAll = () => {
    // Clear all question nodes and their connections
    console.log('🧹 Clearing all question nodes and their connections');

    // Get all question node IDs
    const questionNodeIds = nodes
      .filter(node => node.type === 'questionNode' || node.type === 'editQuestionNode')
      .map(node => node.id);

    // Remove all question nodes
    setNodes((nds) =>
      nds.filter(node =>
        node.type !== 'questionNode' && node.type !== 'editQuestionNode'
      )
    );

    // Remove all edges connected to question nodes
    setEdges((eds) =>
      eds.filter(edge =>
        !questionNodeIds.includes(edge.source) && !questionNodeIds.includes(edge.target)
      )
    );

    console.log('✅ Cleared question nodes and connections:', questionNodeIds);
  };

  const handleSaveNewQuestion = (newQuestionData: any) => {
    // Remove temp edit node
    setNodes((nds) => nds.filter((node) => node.id !== 'temp-edit-node'));

    // Add actual question node
    addQuestionNode(newQuestionData);
  };

  const handleCancelNewQuestion = () => {
    // Remove temp edit node
    setNodes((nds) => nds.filter((node) => node.id !== 'temp-edit-node'));
  };

  const handlePreviewConnections = () => {
    setShowConnectionsPreview(true);
  };

  // IMPORTANT: this expects a parsed object (Toolbar already parses file)
  const handleImportJSON = (jsonData: any) => {
    try {
      if (jsonData?.nodes && jsonData?.edges) {
        // Clear existing nodes and edges
        setNodes([]);
        setEdges([]);

        // Import nodes with proper data structure (re-attach handlers)
        const importedNodes = jsonData.nodes.map((node: any) => ({
          ...node,
          data: {
            ...node.data,
            onUpdate: handleUpdateNode,
            onDelete: handleDeleteNode,
            onUpdateEdgeLabels: handleUpdateEdgeLabels,
          },
        }));

        setNodes(importedNodes);
        setEdges(jsonData.edges);

        // Update node ID counter
        const maxId = Math.max(...jsonData.nodes.map((n: any) => parseInt(n.id) || 0), 0);
        setNodeId(maxId + 1);

        alert('✅ JSON imported successfully.');
      } else {
        alert('Invalid JSON format. Expected nodes and edges properties.');
      }
    } catch (error) {
      console.error('❌ Error importing JSON:', error);
      alert('Failed to import JSON file');
    }
  };

  const handleSaveAsDraft = async () => {
    if (nodes.length === 0) {
      toast.error('Please add at least one question before saving as draft.');
      return;
    }

    if (typeof window === 'undefined') return;
    const urlParams = new URLSearchParams(window.location.search);
    const templateId = urlParams.get('templateId');

    let name, description;

    if (templateId) {
      // If editing, get existing template data
      if (typeof window === 'undefined') return;
      const existingDrafts = JSON.parse(localStorage.getItem('templateDrafts') || '[]');
      const existingTemplate = existingDrafts.find((d: any) => d.id === templateId);

      if (existingTemplate) {
        name = existingTemplate.name;
        description = existingTemplate.description;
      } else {
        name = prompt('Enter template name:');
        description = prompt('Enter template description (optional):') || '';
      }
    } else {
      // If new template, prompt for name
      name = prompt('Enter template name:');
      description = prompt('Enter template description (optional):') || '';
    }

    if (!name || !name.trim()) {
      toast.error('Template name is required!');
      return;
    }

    try {
      const draft: any = {
        id: templateId || Date.now().toString(),
        name: name.trim(),
        description: description.trim(),
        nodes,
        edges,
        status: 'In Progress',
        createdAt: templateId ? undefined : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDraft: true,
      };

      // Save draft to localStorage
      if (typeof window === 'undefined') return;
      const existingDrafts = JSON.parse(localStorage.getItem('templateDrafts') || '[]');
      const existingIndex = existingDrafts.findIndex((d: any) => d.id === draft.id);

      if (existingIndex >= 0) {
        // Update existing draft, preserve createdAt
        existingDrafts[existingIndex] = {
          ...existingDrafts[existingIndex],
          ...draft,
          createdAt: existingDrafts[existingIndex].createdAt,
        };
      } else {
        // Add new draft
        draft.createdAt = new Date().toISOString();
        existingDrafts.push(draft);
      }

      localStorage.setItem('templateDrafts', JSON.stringify(existingDrafts));
      toast.success(`📄 Template "${name}" saved as draft successfully!`);
    } catch (error: any) {
      console.error('❌ Error saving draft:', error);
      toast.error('Failed to save draft: ' + error.message);
    }
  };

  // Update node data with handlers
  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          onUpdate: handleUpdateNode,
          onDelete: handleDeleteNode,
          onUpdateEdgeLabels: handleUpdateEdgeLabels,
        },
      }))
    );
  }, [handleUpdateNode, handleDeleteNode, handleUpdateEdgeLabels]);

  // Load draft when editing
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const templateId = urlParams.get('templateId');

    if (mode === 'edit' && templateId) {
      // Skip the popup for edit mode
      setShowCreateAssessment(false);
      setShowStartDialog(false);

      let template = null;

      // Check if it's the hardcoded template
      if (templateId === '1755178644364') {
        template = hardcodedTemplateData;
      } else if (templateId === hardcodedTemplateData.id) {
        template = hardcodedTemplateData;
      } else {
        // Load from localStorage for other templates
        const drafts = JSON.parse(localStorage.getItem('templateDrafts') || '[]');
        template = drafts.find((d: any) => d.id === templateId);
      }

      if (template) {
        // Load metadata if it exists
        const metadata = {
          templateName: template.templateName || template.name || '',
          facilityTypes: template.facilityTypes || [],
          facilityServices: template.facilityServices || [],
        };
        setTemplateMetadata(metadata);
        setIsMetadataSet(true);

        // Load nodes with proper function references
        const loadedNodes = template.nodes.map((node: any) => ({
          ...node,
          data: {
            ...node.data,
            onUpdate: handleUpdateNode,
            onDelete: handleDeleteNode,
            onUpdateEdgeLabels: handleUpdateEdgeLabels,
          },
        }));

        setNodes(loadedNodes);
        setEdges(template.edges || []);

        // Update nodeId to continue from the highest existing ID
        const maxId = Math.max(...template.nodes.map((node: any) => parseInt(node.id) || 0), 0);
        setNodeId(maxId + 1);
      }
    } else {
      // Show popup only for new questionnaires
      setShowCreateAssessment(true);
    }
  }, [handleUpdateNode, handleDeleteNode, handleUpdateEdgeLabels]);

  // Restore metadata from localStorage if local state is empty
  useEffect(() => {
    if (!isMetadataSet && !templateMetadata.templateName) {
      try {
        const backupMetadata = JSON.parse(localStorage.getItem('currentTemplateMetadata') || '{}');
        if (backupMetadata.templateName) {
          console.log('🔄 Restoring metadata from localStorage on mount:', backupMetadata);
          setTemplateMetadata(backupMetadata);
          setIsMetadataSet(true);
        }
      } catch (e) {
        console.error('Error restoring backup metadata:', e);
      }
    }
  }, [isMetadataSet, templateMetadata.templateName]);

  // Note: Removed cleanup useEffect as it was causing premature metadata clearing
  // Metadata is now only cleared explicitly when user navigates away or cancels

  const checkIsEditMode = () => {
    if (typeof window === 'undefined') return false;

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const scenarioId = urlParams.get('scenarioId');
    return mode === 'edit' && scenarioId;
  };

  const router = useRouter();

  return (
    // <DashboardLayout>
      <div style={{ width: '100%', height: 'calc(100vh - 128px)', position: 'relative' }}>
        {/* Back Button */}
        <Button
          onClick={() => {
            // Clear metadata when navigating away
            console.log('🧹 Clearing metadata - Back button');
            setTemplateMetadata({
              templateName: '',
              facilityTypes: [],
              facilityServices: [],
            });
            setIsMetadataSet(false);
            localStorage.removeItem('currentTemplateMetadata');
            router.push('/templates');
          }}
          startIcon={<ArrowBack />}
          sx={{
            position: 'absolute',
            top: '10px',
            left: '20px',
            color: '#3a7de6',
            textTransform: 'none',
            fontWeight: 500,
            fontFamily: 'var(--font-inter), sans-serif',
            zIndex: 1001,
            backgroundColor: 'white',
            border: '1px solid #eff0f1ff',
            borderRadius: '8px',
            padding: '8px 16px',
            '&:hover': {
              backgroundColor: '#f8f9fa',
            },
          }}
          variant="outlined"
        >
          Back to Templates
        </Button>

        <Toolbar
          onAddQuestion={handleAddQuestion}
          onAddSection={addSectionNode}
          onSave={handleSaveQuestionnaire}
          onSaveAsDraft={handleSaveAsDraft}
          onClearAll={handleClearAll}
          onPreviewConnections={handlePreviewConnections}
          hideIcons={showStartDialog && !checkIsEditMode()}
          position="top-right"
        />

        <div style={{ height: 'calc(100vh - 80px)', position: 'relative' }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{
              padding: 0.1,
              minZoom: 0.1,
              maxZoom: 2,
            }}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: {
                stroke: '#2196f3',
                strokeWidth: 2,
                strokeDasharray: '5,5',
              },
            }}
            connectionLineStyle={{
              stroke: '#2196f3',
              strokeWidth: 2,
              strokeDasharray: '5,5',
            }}
          >
            <Controls />
            <MiniMap />
            <Background variant={'dot' as any} gap={12} size={1} />
          </ReactFlow>
        </div>

        {showStartDialog && !checkIsEditMode() && !hasCompletedStartDialog && (
          <StartDialog
            onAddQuestion={handleAddQuestion}
            onCancel={() => {
              // Clear metadata when canceling start dialog
              console.log('🧹 Clearing metadata - Start dialog cancel');
              setTemplateMetadata({
                templateName: '',
                facilityTypes: [],
                facilityServices: [],
              });
              setIsMetadataSet(false);
              setHasCompletedStartDialog(false); // Reset completion flag
              localStorage.removeItem('currentTemplateMetadata');
              setShowStartDialog(false);
              // Navigate back to templates list
              router.push('/templates');
            }}
          />
        )}

        {showConnectionsPreview && (
          <ConnectionsPreviewModal nodes={nodes} edges={edges} onClose={() => setShowConnectionsPreview(false)} />
        )}
      </div>
    // </DashboardLayout>
  );
};

export default withPageLoader(QuestionnaireBuilder);
