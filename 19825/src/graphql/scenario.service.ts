import { gql } from '@apollo/client';

export const CREATE_SCENARIO_MUTATION = gql`
  mutation CreateScenarioV2($input: CreateScenarioVersionInput!) {
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
  query GetScenarioById($scenarioId: ID!) {
    getScenarioById(scenarioId: $scenarioId) {
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

export const DELETE_SCENARIO_MUTATION = gql`
  mutation DeleteScenario($id: ID!) {
    deleteScenario(id: $id)
  }
`;

// TypeScript interfaces for the mutation
export interface CreateScenarioVersionInput {
  name: string;
  questionnaire: Record<string, any>;
  facilities?: string[];
  services?: string[];
}

export interface CreateScenarioResponse {
  code: number;
  message: string;
  type: string;
  data: any; // JSONObject type - contains the full scenario data
}

export interface CreateScenarioData {
  createScenario: CreateScenarioResponse;
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
