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
import TemplatePreviewModal from '../../components/templates/TemplatePreviewModal';
import SectionNode from './SectionNode';
import QuestionnaireNode from '../../components/templates/QuestionnaireNode';
import TemplateEditQuestionNode from '../../components/templates/TemplateEditQuestionNode';
import { withPageLoader } from '@frontend/shared-ui';
// import DashboardLayout from '../../components/layout/DashboardLayout';
// Removed Redux imports - using local state instead
import { Button, Typography, Box, IconButton, CircularProgress, Backdrop } from '@mui/material';
import { ArrowBack, Edit as EditIcon } from '@mui/icons-material';
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
import { GET_ALL_FACILITY_TYPES, GET_SERVICE_LINES } from '../../graphql/user.service';

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
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditMetadataDialog, setShowEditMetadataDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
  const [createScenario, { loading: createScenarioLoading }] = useMutation(CREATE_SCENARIO_MUTATION, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all'
  });

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

  // GraphQL queries for facility types and services (to get IDs)
  const { data: facilityTypesData } = useQuery(GET_ALL_FACILITY_TYPES, {
    fetchPolicy: 'cache-first',
  });
  const { data: servicesData } = useQuery(GET_SERVICE_LINES, {
    fetchPolicy: 'cache-first',
  });

  // Helper functions to convert names to IDs
  const getFacilityTypeIds = (facilityTypeNames: string[]): string[] => {
    if (!facilityTypesData?.getAllFacilityTypes?.data) return [];

    // Since data is now a JSON object, we need to handle it as an array
    const facilityTypes = Array.isArray(facilityTypesData.getAllFacilityTypes.data)
      ? facilityTypesData.getAllFacilityTypes.data
      : [];

    return facilityTypeNames
      .map(name => {
        const facilityType = facilityTypes.find((ft: any) => ft.name === name);
        return facilityType?._id;
      })
      .filter(Boolean);
  };

  const getServiceIds = (serviceNames: string[]): string[] => {
    if (!servicesData?.getServiceLines?.data) return [];

    // Since data is now a JSON object, we need to handle it as an array
    const services = Array.isArray(servicesData.getServiceLines.data)
      ? servicesData.getServiceLines.data
      : [];

    return serviceNames
      .map(name => {
        const service = services.find((s: any) => s.name === name);
        return service?._id;
      })
      .filter(Boolean);
  };

  // Helper functions to convert IDs back to names (for editing)
  const getFacilityTypeNames = useCallback((facilityIds: string[]): string[] => {
    if (!facilityTypesData?.getAllFacilityTypes?.data) return [];

    // Since data is now a JSON object, we need to handle it as an array
    const facilityTypes = Array.isArray(facilityTypesData.getAllFacilityTypes.data)
      ? facilityTypesData.getAllFacilityTypes.data
      : [];

    return facilityIds
      .map(id => {
        const facilityType = facilityTypes.find((ft: any) => ft._id === id);
        return facilityType?.name;
      })
      .filter(Boolean);
  }, [facilityTypesData]);

  const getServiceNames = useCallback((serviceIds: string[]): string[] => {
    if (!servicesData?.getServiceLines?.data) return [];

    // Since data is now a JSON object, we need to handle it as an array
    const services = Array.isArray(servicesData.getServiceLines.data)
      ? servicesData.getServiceLines.data
      : [];

    return serviceIds
      .map(id => {
        const service = services.find((s: any) => s._id === id);
        return service?.name;
      })
      .filter(Boolean);
  }, [servicesData]);

  // Get scenarioId and version from URL for edit mode
  const [currentScenarioId, setCurrentScenarioId] = useState<string | null>(null);
  const [currentVersion, setCurrentVersion] = useState<string>('V1');

  // GraphQL query for getting scenario by ID (for edit mode)
  const { data: scenarioByIdData, loading: scenarioByIdLoading } = useQuery<GetScenarioByIdData>(
    GET_SCENARIO_BY_ID_QUERY,
    {
      variables: {
        scenarioId: currentScenarioId
      },
      skip: !currentScenarioId, // Skip query if no scenarioId
      fetchPolicy: 'cache-and-network'
    }
  );

  // Debug: Log metadata changes
  useEffect(() => {
    console.log('📊 Template metadata changed:', templateMetadata);
    console.log('📊 isMetadataSet:', isMetadataSet);
  }, [templateMetadata, isMetadataSet]);

  // Load scenario data for edit mode
  useEffect(() => {
    if (scenarioByIdData?.getScenarioById) {
      const scenario = scenarioByIdData.getScenarioById;
      console.log('📥 Loading scenario for edit:', scenario);

      // Load questionnaire data (nodes and edges)
      if (scenario.questionnaire) {
        if (scenario.questionnaire.nodes) {
          setNodes(scenario.questionnaire.nodes);
        }
        if (scenario.questionnaire.edges) {
          setEdges(scenario.questionnaire.edges);
        }

        // Load template metadata
        // Note: facilities and services are not available in getScenarioById response
        // We'll need to get them from the questionnaire object if they're stored there
        const facilityTypes = scenario.questionnaire?.facilityTypes || [];
        const facilityServices = scenario.questionnaire?.facilityServices || [];

        setTemplateMetadata({
          templateName: scenario.questionnaire.templateName || scenario.scenario.name,
          facilityTypes: facilityTypes,
          facilityServices: facilityServices,
        });

        setIsMetadataSet(true);
        console.log('✅ Loaded scenario data:', {
          name: scenario.scenario.name,
          version: scenario.version,
          facilityTypes: facilityTypes,
          facilityServices: facilityServices,
          nodesCount: scenario.questionnaire.nodes?.length || 0,
          edgesCount: scenario.questionnaire.edges?.length || 0
        });
      }
    }
  }, [scenarioByIdData, getFacilityTypeNames, getServiceNames, setNodes, setEdges]);

  // Auto-show view modal when in view mode and data is loaded
  useEffect(() => {
    if (checkIsViewMode() && scenarioByIdData?.getScenarioById && nodes.length > 0) {
      setShowViewModal(true);
    }
  }, [scenarioByIdData, nodes.length]);

  // Get scenarioId and version from URL parameters
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const scenarioId = urlParams.get('scenarioId');
      const version = urlParams.get('version') || 'V1';

      if (scenarioId) {
        setCurrentScenarioId(scenarioId);
        setCurrentVersion(version);
        console.log('📝 Edit mode - Scenario ID:', scenarioId, 'Version:', version);
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

  // Helper function to find optimal position near existing nodes without overlapping
  const findOptimalPosition = useCallback((existingNodes) => {
    const dialogWidth = 450;
    const dialogHeight = 400;
    const padding = 30;
    const headerHeight = 93;

    // If no existing nodes, place in center-top area
    if (existingNodes.length === 0) {
      return { x: 400, y: headerHeight + 50 };
    }

    // Find the topmost existing node
    const topNode = existingNodes.reduce((top, node) =>
      node.position.y < top.position.y ? node : top
    );

    // Try positions around the topmost node, prioritizing above and to the right
    const candidatePositions = [
      // Above the top node
      { x: topNode.position.x, y: Math.max(headerHeight + 20, topNode.position.y - dialogHeight - padding) },
      // To the right of the top node
      { x: topNode.position.x + 350, y: topNode.position.y },
      // To the left of the top node
      { x: Math.max(20, topNode.position.x - dialogWidth - padding), y: topNode.position.y },
      // Above and to the right
      { x: topNode.position.x + 200, y: Math.max(headerHeight + 20, topNode.position.y - dialogHeight - padding) },
    ];

    // Check each candidate position for overlaps
    for (const position of candidatePositions) {
      const overlaps = existingNodes.some(node => {
        const nodeX = node.position.x;
        const nodeY = node.position.y;
        const nodeW = 300; // Approximate node width
        const nodeH = 200; // Approximate node height

        return !(
          position.x > nodeX + nodeW + padding ||
          position.x + dialogWidth < nodeX - padding ||
          position.y > nodeY + nodeH + padding ||
          position.y + dialogHeight < nodeY - padding
        );
      });

      if (!overlaps && position.x >= 20 && position.y >= headerHeight + 20) {
        return position;
      }
    }

    // Fallback: place to the right of all nodes
    const rightmostNode = existingNodes.reduce((right, node) =>
      node.position.x > right.position.x ? node : right
    );
    return {
      x: rightmostNode.position.x + 350,
      y: Math.max(headerHeight + 50, topNode.position.y)
    };
  }, []);

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

        // Close the start dialog and edit metadata dialog
        setShowStartDialog(false);
        setShowEditMetadataDialog(false);

        // Create temp edit node after a short delay to allow dialog to close
        setTimeout(() => {
          console.log('🎯 Auto-creating question edit node after StartDialog');
          setNodes((currentNodes) => {
            const position = findOptimalPosition(currentNodes);
            const tempNode = {
              id: 'temp-edit-node',
              type: 'editQuestionNode',
              position,
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
            return [...currentNodes, tempNode];
          });
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

    // Position the edit node using smart positioning near existing nodes
    setNodes((currentNodes) => {
      const position = findOptimalPosition(currentNodes);
      const tempNode = {
        id: 'temp-edit-node',
        type: 'editQuestionNode',
        position,
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
      return [...currentNodes, tempNode];
    });
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
      setNodes((currentNodes) => {
        // Use a simpler positioning for regular nodes - place near existing nodes but not overlapping
        const position = findOptimalPosition(currentNodes.filter(n => n.id !== 'temp-edit-node'));
        const newNode = {
          id: `${nodeId}`,
          type: 'questionNode',
          position: {
            x: position.x + 50, // Slight offset from dialog position
            y: position.y + 50,
          },
          data: {
            ...questionData,
            onUpdate: handleUpdateNode,
            onDelete: handleDeleteNode,
            onUpdateEdgeLabels: handleUpdateEdgeLabels,
          },
        };
        return [...currentNodes, newNode];
      });
      setNodeId((prev) => prev + 1);
    },
    [nodeId, findOptimalPosition, setNodes, setEdges, handleUpdateNode, handleDeleteNode, handleUpdateEdgeLabels]
  );

  const addSectionNode = useCallback(() => {
    setNodes((currentNodes) => {
      const position = findOptimalPosition(currentNodes);
      const newNode = {
        id: `section-${nodeId}`,
        type: 'sectionNode',
        position,
        data: {
          sectionName: '',
          weight: 1, // Default weight
          onUpdate: handleUpdateNode,
          onDelete: handleDeleteNode,
        },
      };
      return [...currentNodes, newNode];
    });
    setNodeId((prev) => prev + 1);
  }, [nodeId, findOptimalPosition, setNodes, handleUpdateNode, handleDeleteNode]);

  const handleSaveQuestionnaire = async () => {
    // Prevent multiple API calls
    if (isSaving) {
      console.log('🚫 Save already in progress, ignoring click');
      return;
    }

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
      // Set loading state
      setIsSaving(true);
      console.log('🚀 Starting save process...');

      // Call GraphQL API to create scenario
      console.log('🚀 Calling createScenario API...');

      // Convert facility type and service names to IDs
      const facilityIds = getFacilityTypeIds(templateMetadata.facilityTypes);
      const serviceIds = getServiceIds(templateMetadata.facilityServices);

      const scenarioInput: CreateScenarioVersionInput = {
        name: name.trim(),
        questionnaire: {
          nodes,
          edges,
          templateName: templateMetadata.templateName,
        },
        facilities: facilityIds,
        services: serviceIds
      };

      console.log('📤 Sending scenario input:', JSON.stringify(scenarioInput, null, 2));
      console.log('📊 Input details:');
      console.log(`  - Name: ${scenarioInput.name}`);
      console.log(`  - Nodes count: ${nodes.length}`);
      console.log(`  - Edges count: ${edges.length}`);
      console.log(`  - Template name: ${templateMetadata.templateName}`);
      console.log(`  - Facility types (names): ${templateMetadata.facilityTypes.join(', ')}`);
      console.log(`  - Facility services (names): ${templateMetadata.facilityServices.join(', ')}`);
      console.log(`  - Facility IDs (sent to API): ${facilityIds.join(', ')}`);
      console.log(`  - Service IDs (sent to API): ${serviceIds.join(', ')}`);
      console.log('📋 Note: Facility types/services are NOT included in questionnaire object, only as separate ID arrays');

      console.log('🔍 About to call createScenario with mutation:', CREATE_SCENARIO_MUTATION.loc?.source?.body);

      const result = await createScenario({
        variables: {
          input: scenarioInput
        }
      });

      console.log('✅ CreateScenario API response:', result.data);

      if (result.data?.createScenario) {
        const { code, message, type, data } = result.data.createScenario;
        console.log(`✅ API Response - Code: ${code}, Message: ${message}, Type: ${type}`);
        console.log(`📊 Created scenario data:`, JSON.stringify(data, null, 2));
        console.log(`📊 Full API response:`, JSON.stringify(result.data, null, 2));

        // Refetch scenarios to update the list
        refetchScenarios();

        toast.success(message || `Questionnaire "${name}" saved successfully!`, {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          style: {
            zIndex: 10000, // Higher than loading overlay
          },
        });

        // Clear metadata and navigate to templates on success
        console.log('🧹 Clearing metadata after successful save');
        setTemplateMetadata({
          templateName: '',
          facilityTypes: [],
          facilityServices: [],
        });
        setIsMetadataSet(false);
        localStorage.removeItem('currentTemplateMetadata');

        // Navigate to templates page after toast is displayed (keep loading overlay visible)
        console.log('✅ Template saved successfully, will navigate after toast is shown...');
        setTimeout(() => {
          setIsSaving(false); // Hide loading overlay just before routing
          router.push('/templates');
        }, 3500); // Wait for toast to be visible, then route

      } else {
        console.error('❌ No createScenario response received');
        console.error('📊 Full result:', JSON.stringify(result, null, 2));
        toast.success(`Questionnaire "${name}" saved successfully!`, {
          position: 'top-right',
          autoClose: 3000,
          style: {
            zIndex: 10000, // Higher than loading overlay
          },
        });

        // Navigate to templates even if response format is unexpected (keep loading overlay visible)
        console.log('✅ Template saved (fallback), will navigate after toast is shown...');
        setTimeout(() => {
          setIsSaving(false); // Hide loading overlay just before routing
          router.push('/templates');
        }, 3500);
      }

    } catch (error: any) {
      console.error('❌ Error saving questionnaire:', error);

      // Provide detailed error feedback
      let errorMessage = 'Failed to save questionnaire';
      if (error.networkError) {
        errorMessage = 'Network error - please check your connection and try again';
      } else if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors[0].message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        style: {
          zIndex: 10000, // Higher than loading overlay
        },
      });

      // Stay on the same page on error - user can retry
      console.log('🔄 Staying on current page due to save error');

      // Reset loading state only for errors (success cases handle this in setTimeout)
      setIsSaving(false);
      console.log('🔄 Loading state reset due to error');
    }
    // Note: No finally block - success cases handle loading state reset in setTimeout
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

  const checkIsEditMode = (): boolean => {
    if (typeof window === 'undefined') return false;

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const scenarioId = urlParams.get('scenarioId');
    return Boolean((mode === 'edit' || (!mode && scenarioId)) && scenarioId);
  };

  const checkIsViewMode = () => {
    if (typeof window === 'undefined') return false;

    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    const scenarioId = urlParams.get('scenarioId');
    return mode === 'view' && scenarioId;
  };

  const handleEditMetadata = () => {
    console.log('🔧 Opening metadata editor with current data:', templateMetadata);
    setShowEditMetadataDialog(true);
  };

  const router = useRouter();

  return (
    // <DashboardLayout>
      <div style={{ width: '100%', height: 'calc(100vh - 128px)', position: 'relative' }}>
        {/* Back Button */}
        {!checkIsViewMode() && (
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
              border: '2px solid #3a7de6',
              borderRadius: '8px',
              padding: '8px 16px',
              '&:hover': {
                backgroundColor: '#f0f7ff',
                borderColor: '#2563eb',
              },
            }}
            variant="outlined"
          >
            Back to Templates
          </Button>
        )}

        {/* Template Name Display */}
        {!checkIsViewMode() && templateMetadata.templateName && (
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1001,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '8px',
              padding: '8px 16px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: '#1976d2',
                marginRight: checkIsEditMode() ? 1 : 0,
                fontSize: '16px',
              }}
            >
              {templateMetadata.templateName}
            </Typography>
            {checkIsEditMode() && (
              <IconButton
                onClick={handleEditMetadata}
                size="small"
                sx={{
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.04)',
                  },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        )}

        {!checkIsViewMode() && (
          <Toolbar
            onAddQuestion={handleAddQuestion}
            onAddSection={addSectionNode}
            onSave={handleSaveQuestionnaire}
            onSaveAsDraft={handleSaveAsDraft}
            onClearAll={handleClearAll}
            onPreviewConnections={handlePreviewConnections}
            onImportJSON={handleImportJSON}
            hideIcons={showStartDialog && !checkIsEditMode()}
            position="top-right"
            isEditMode={checkIsEditMode()}
            isSaving={isSaving}
          />
        )}

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

        {showEditMetadataDialog && (
          <StartDialog
            onAddQuestion={handleAddQuestion}
            initialValues={{
              templateName: templateMetadata.templateName,
              facilityTypes: templateMetadata.facilityTypes,
              facilityServices: templateMetadata.facilityServices,
            }}
            onCancel={() => {
              console.log('🧹 Canceling metadata edit');
              setShowEditMetadataDialog(false);
            }}
          />
        )}

        {showConnectionsPreview && (
          <ConnectionsPreviewModal nodes={nodes} edges={edges} onClose={() => setShowConnectionsPreview(false)} />
        )}

        {showViewModal && (
          <TemplatePreviewModal
            template={{
              nodes,
              edges,
              templateName: templateMetadata.templateName,
              facilityTypes: templateMetadata.facilityTypes,
              facilityServices: templateMetadata.facilityServices,
            }}
            onClose={() => {
              setShowViewModal(false);
              // Navigate back to templates when closing view modal
              router.push('/templates');
            }}
          />
        )}

        {/* Loading Overlay - Shows during template save */}
        <Backdrop
          open={isSaving || createScenarioLoading}
          sx={{
            color: '#fff',
            zIndex: 9999,
            backgroundColor: 'rgba(255, 255, 255, 0.98)', // Very high opacity
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <CircularProgress
            size={40} // Small loader
            thickness={4}
            sx={{
              color: '#1976d2',
            }}
          />
        </Backdrop>
      </div>
    // </DashboardLayout>
  );
};

export default withPageLoader(QuestionnaireBuilder);
