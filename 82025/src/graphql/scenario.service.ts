import { gql } from '@apollo/client';

export const CREATE_SCENARIO_MUTATION = gql`
  mutation CreateScenario($input: CreateScenarioVersionInput!) {
    createScenario(input: $input) {
      code
      message
      type
      data
    }
  }
`;

export const GET_ALL_SCENARIOS_QUERY = gql`
  query GetAllScenarios($page: Int!, $limit: Int!, $sortBy: String, $sortOrder: String) {
    getAllScenarios(page: $page, limit: $limit, sortBy: $sortBy, sortOrder: $sortOrder) {
      scenarioVersions {
        _id
        scenario {
          _id
          name
        }
        version
        status
        isLatest
        facilities
        services
        questionnaire
        createdAt
      }
      pagination {
        page
        limit
        total
        totalPages
        hasNext
        hasPrev
      }
    }
  }
`;

export const GET_SCENARIO_BY_ID_QUERY = gql`
  query GetScenarioById($scenarioId: ID!, $version: String) {
    getScenarioById(scenarioId: $scenarioId, version: $version) {
      _id
      scenario {
        _id
        name
      }
      version
      status
      isLatest
      facilities
      services
      questionnaire
      versions
    }
  }
`;

export const UPDATE_SCENARIO_MUTATION = gql`
  mutation UpdateScenario($input: UpdateScenarioVersionWithVersioningInput!) {
    updateScenario(input: $input) {
      code
      message
      type
      data
    }
  }
`;

export const UPDATE_TEMPLATE_MUTATION = gql`
  mutation UpdateTemplate($input: UpdateScenarioInput!) {
    updateTemplate(input: $input) {
      scenario {
        _id
        name
        questionnaire
        facilities
        services
        updatedAt
      }
      newVersionCreated
      message
    }
  }
`;

export const DELETE_SCENARIO_MUTATION = gql`
  mutation DeleteScenario($id: ID!) {
    deleteScenario(id: $id)
  }
`;

// TypeScript interfaces for the create mutation
export interface CreateScenarioVersionInput {
  name: string;
  questionnaire: Record<string, any>; // Simple object structure like { key: "value" }
  facilities: string[];
  services: string[];
}

export interface CreateScenarioResponse {
  code: number;
  message: string;
  type: string;
  data: any; // JSONObject type - contains the created scenario data
}

export interface CreateScenarioData {
  createScenario: CreateScenarioResponse;
}

// TypeScript interfaces for the update mutation
export interface UpdateScenarioVersionWithVersioningInput {
  scenarioId: string;
  questionnaire?: Record<string, any>;
}

export interface UpdateScenarioInput {
  id: string;
  name?: string;
  facilities?: string[];
  services?: string[];
}

export interface UpdateScenarioResponse {
  code: number;
  message: string;
  type: string;
  data: any; // JSONObject type - contains the updated scenario data
}

export interface UpdateScenarioData {
  updateScenario: UpdateScenarioResponse;
}

export interface UpdateTemplateResponse {
  scenario: {
    _id: string;
    name: string;
    questionnaire: Record<string, any>;
    facilities: string[];
    services: string[];
    updatedAt: string;
  };
  newVersionCreated: boolean;
  message: string;
}

export interface UpdateTemplateData {
  updateTemplate: UpdateTemplateResponse;
}

// TypeScript interfaces for the query
export interface ScenarioVersion {
  _id: string;
  scenario: {
    _id: string;
    name: string;
  };
  version: string;
  status: string;
  isLatest: boolean;
  questionnaire: Record<string, any>;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface GetAllScenariosResponse {
  scenarioVersions: ScenarioVersion[];
  pagination: Pagination;
}

export interface GetAllScenariosData {
  getAllScenarios: GetAllScenariosResponse;
}

// TypeScript interfaces for getScenarioById
export interface GetScenarioByIdResponse {
  _id: string;
  scenario: {
    _id: string;
    name: string;
  };
  version: string;
  status: string;
  isLatest: boolean;
  facilities?: string[];
  services?: string[];
  questionnaire: Record<string, any>;
  versions: string[];
}

export interface GetScenarioByIdData {
  getScenarioById: GetScenarioByIdResponse;
}

// TypeScript interfaces for deleteScenario
export interface DeleteScenarioData {
  deleteScenario: boolean;
}
